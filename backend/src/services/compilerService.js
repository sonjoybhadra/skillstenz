const axios = require('axios');

const DEFAULT_PISTON_BASE_URL = 'https://emkc.org/api/v2/piston';
const PISTON_BASE_URL = process.env.PISTON_API_BASE_URL || DEFAULT_PISTON_BASE_URL;
const RUNTIME_CACHE_TTL = parseInt(process.env.PISTON_RUNTIME_CACHE_TTL || '3600000', 10); // 1 hour
const EXECUTION_TIMEOUT = parseInt(process.env.COMPILER_RUN_TIMEOUT || '15000', 10);

const LANGUAGE_ALIASES = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  nodejs: 'javascript',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  go: 'go',
  rust: 'rust',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  sql: null,
  mongodb: null,
  html: null,
  react: null,
  nextjs: null,
};

const FILE_EXTENSIONS = {
  python: '.py',
  javascript: '.js',
  typescript: '.ts',
  nodejs: '.js',
  java: '.java',
  cpp: '.cpp',
  c: '.c',
  go: '.go',
  rust: '.rs',
  php: '.php',
  ruby: '.rb',
  swift: '.swift',
  kotlin: '.kt',
};

let runtimeCache = null;
let runtimeCacheTimestamp = 0;

const buildRuntimeIndex = (runtimes = []) =>
  runtimes.reduce((acc, runtime) => {
    if (!acc[runtime.language]) {
      acc[runtime.language] = [];
    }
    acc[runtime.language].push(runtime);
    return acc;
  }, {});

const fetchRuntimes = async () => {
  const response = await axios.get(`${PISTON_BASE_URL}/runtimes`, { timeout: 5000 });
  runtimeCache = buildRuntimeIndex(response.data || []);
  runtimeCacheTimestamp = Date.now();
};

const ensureRuntimes = async () => {
  const isCacheStale = !runtimeCache || Date.now() - runtimeCacheTimestamp > RUNTIME_CACHE_TTL;
  if (isCacheStale) {
    await fetchRuntimes();
  }
};

const resolveRuntime = async (languageKey) => {
  const alias = LANGUAGE_ALIASES[languageKey] ?? languageKey;
  if (!alias) {
    return null;
  }

  await ensureRuntimes();
  const available = runtimeCache?.[alias];
  if (!available || !available.length) {
    return null;
  }

  // Prefer the newest runtime (last in the array after reduce order)
  return available[available.length - 1];
};

const executeCode = async ({ languageKey, code, stdin }) => {
  const runtime = await resolveRuntime(languageKey);
  if (!runtime) {
    const error = new Error(`Execution runtime for ${languageKey} is not available yet.`);
    error.status = 400;
    throw error;
  }

  const payload = {
    language: runtime.language,
    version: runtime.version,
    files: [
      {
        name: `main${FILE_EXTENSIONS[languageKey] || '.txt'}`,
        content: code,
      },
    ],
  };

  if (stdin) {
    payload.stdin = stdin;
  }

  try {
    const response = await axios.post(`${PISTON_BASE_URL}/execute`, payload, {
      timeout: EXECUTION_TIMEOUT,
    });

    const { run } = response.data || {};
    return {
      stdout: run?.stdout || '',
      stderr: run?.stderr || '',
      exitCode: typeof run?.code === 'number' ? run.code : null,
      executionTime: typeof run?.time === 'number' ? run.time : null,
      memory: typeof run?.memory === 'number' ? run.memory : null,
    };
  } catch (error) {
    const execError = new Error('Execution service is unavailable right now. Please try again shortly.');
    execError.status = error.response?.status === 400 ? 400 : 503;
    throw execError;
  }
};

module.exports = {
  executeCode,
};
