// Vercel Serverless Function — proxy + cache do README de um repo específico.
// Mesma lógica do github-stats.js: o ReadmeViewer batia direto em
// api.github.com/repos/{user}/{repo}/readme a partir do navegador. Aqui o
// servidor busca com o token (se houver) e cacheia por repo.
//
// Uso: GET /api/github-readme?repo=nome-do-repositorio

const GITHUB_USERNAME = 'higorxyz';

export default async function handler(req, res) {
  const { repo } = req.query;

  if (!repo || typeof repo !== 'string') {
    res.status(400).json({ error: 'Parâmetro "repo" é obrigatório.' });
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = { Accept: 'application/vnd.github.v3.html' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/readme`,
      { headers }
    );

    if (!response.ok) {
      res.status(response.status).json({ error: 'README não encontrado.' });
      return;
    }

    const html = await response.text();

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=120');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('Erro no proxy do README:', error);
    res.status(502).json({ error: 'Não foi possível buscar o README agora.' });
  }
}
