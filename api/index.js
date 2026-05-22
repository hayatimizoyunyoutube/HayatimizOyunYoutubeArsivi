import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DATA_MAP = {
  'auto-games': 'games.json',
  'auto-sync': 'auto-sync-log.json',
  'archive-export': 'games.json',
  'smart-search': 'games.json',
  'ai-recommendations': 'recommendations.json',
  'watch-progress': 'watch-progress.json',
  'notification-feed': 'notifications.json',
  'theme-presets': 'theme-presets.json',
  'automation-studio': 'roadmap.json',
  'test-center': 'test-center.json',
  'ui-health': 'qa-checklist.json',
  'error-reports': 'error-reports.json',
  'api-status': 'api-status.json'
};

async function readJsonData(fileName, fallback = null) {
  try {
    const filePath = path.join(ROOT, 'public', 'data', fileName);
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return fallback ?? { ok: false, error: `data_not_found:${fileName}` };
  }
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(payload, null, 2));
}

function normalizeRoute(url = '') {
  const parsed = new URL(url, 'https://hayatimiz-oyun.local');
  let route = parsed.pathname
    .replace(/^\/api\/index(?:\.js)?\/?/, '')
    .replace(/^\/api\/?/, '')
    .replace(/^\//, '')
    .replace(/\/$/, '');

  if (!route) route = parsed.searchParams.get('route') || 'status';
  return { route, searchParams: parsed.searchParams };
}

function filterGames(games, q) {
  if (!q) return games;
  const needle = q.toLocaleLowerCase('tr-TR');
  return games.filter((game) => {
    const haystack = JSON.stringify(game).toLocaleLowerCase('tr-TR');
    return haystack.includes(needle);
  });
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const { route, searchParams } = normalizeRoute(req.url);

  if (route === 'status' || route === 'health') {
    return sendJson(res, 200, {
      ok: true,
      project: 'Hayatımız Oyun',
      version: '2.1.1-full-merged-hobby-function-fix',
      serverlessMode: 'single-function-router',
      functionCount: 1,
      routes: Object.keys(DATA_MAP)
    });
  }

  if (route === 'smart-search') {
    const games = await readJsonData('games.json', []);
    const q = searchParams.get('q') || searchParams.get('search') || '';
    return sendJson(res, 200, {
      ok: true,
      route,
      query: q,
      results: Array.isArray(games) ? filterGames(games, q) : games
    });
  }

  if (route === 'archive-export') {
    const games = await readJsonData('games.json', []);
    const notes = await readJsonData('update-notes.json', []);
    return sendJson(res, 200, {
      ok: true,
      route,
      exportedAt: new Date().toISOString(),
      payload: { games, updateNotes: notes }
    });
  }

  const dataFile = DATA_MAP[route];
  if (!dataFile) {
    return sendJson(res, 404, {
      ok: false,
      error: 'api_route_not_found',
      route,
      availableRoutes: Object.keys(DATA_MAP),
      usage: '/api?route=auto-games veya /api/auto-games'
    });
  }

  const data = await readJsonData(dataFile);
  return sendJson(res, 200, {
    ok: true,
    route,
    source: `public/data/${dataFile}`,
    data
  });
}
