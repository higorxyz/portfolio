// Vercel Serverless Function — proxy + cache pra API do GitHub.
//
// Por quê: o hook useGitHubData batia direto em api.github.com a partir do
// navegador do visitante, sem autenticação. Isso esbarra no limite de 60
// requisições/hora POR IP do GitHub — em rede compartilhada (faculdade,
// empresa) a seção de projetos quebra pra todo mundo daquela rede.
//
// Esta função roda no servidor da Vercel: usa um token (se configurado) que
// nunca é exposto no bundle do client, e cacheia a resposta na CDN da Vercel
// por alguns minutos, então N visitantes = 1 chamada real ao GitHub.
//
// Local: `npm run dev` (Vite puro) NÃO serve /api — use `vercel dev` pra
// testar essa função localmente, ou apenas confie no ambiente de preview/prod
// da Vercel.
//
// Env var necessária (opcional, mas recomendada): GITHUB_TOKEN
// Configurar em vercel.com → Project → Settings → Environment Variables.
// NUNCA prefixar com VITE_ — isso exporia o token no client.

const GITHUB_USERNAME = 'higorxyz';

export default async function handler(req, res) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = { Accept: 'application/vnd.github+json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        { headers }
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      const status = !userRes.ok ? userRes.status : reposRes.status;
      throw new Error(`GitHub API respondeu ${status}`);
    }

    const [user, repos] = await Promise.all([userRes.json(), reposRes.json()]);

    // Cache na CDN da Vercel: serve a mesma resposta por 5 min pra todo mundo,
    // e por mais 1 min "stale" enquanto revalida em background.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.status(200).json({ user, repos });
  } catch (error) {
    console.error('Erro no proxy do GitHub:', error);
    res.status(502).json({ error: 'Não foi possível buscar dados do GitHub agora.' });
  }
}
