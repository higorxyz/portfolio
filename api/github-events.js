// Vercel Serverless Function — proxy + cache dos eventos públicos do GitHub.
//
// Usado só pelo fallback do ContributionGraph quando a API terceira
// (jogruber.de) falha: antes disso caía pra bater direto em
// api.github.com/users/{user}/events/public do navegador do visitante, sem
// autenticação — mesmo problema de rate limit dos outros dois proxies.

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'higorxyz';

export default async function handler(req, res) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = { Accept: 'application/vnd.github+json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API respondeu ${response.status}`);
    }

    const events = await response.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.status(200).json({ events });
  } catch (error) {
    console.error('Erro no proxy de eventos do GitHub:', error);
    res.status(502).json({ error: 'Não foi possível buscar eventos do GitHub agora.' });
  }
}
