export type CricApiPayload<TData = unknown> = {
  apikey?: string;
  status?: string;
  reason?: string;
  data?: TData;
  [key: string]: unknown;
};

type CachePolicy = {
  ttlMs: number;
  staleTtlMs: number;
  failureCooldownMs: number;
  timeoutMs: number;
};

type CacheEntry = {
  payload: CricApiPayload | null;
  updatedAt: number;
  expiresAt: number;
  staleUntil: number;
  retryAfter: number;
  lastError: string | null;
  inFlight?: Promise<CricApiPayload | null>;
};

type PersistedCacheEntry = {
  payload: CricApiPayload | null;
  updatedAt: number;
  expiresAt: number;
  staleUntil: number;
  retryAfter: number;
  lastError: string | null;
};

type PersistedCacheShape = Record<string, PersistedCacheEntry>;

type KeyState = {
  blockedUntil: number;
  lastReason: string | null;
};

type CricApiClientState = {
  responseCache: Map<string, CacheEntry>;
  keyState: Map<number, KeyState>;
  apiKeyCursor: number;
  cacheLoaded: boolean;
  cacheLoadPromise: Promise<void> | null;
  persistPromise: Promise<void>;
};

declare global {
  // eslint-disable-next-line no-var
  var __iplCricApiClientState__: CricApiClientState | undefined;
}

const globalState =
  globalThis.__iplCricApiClientState__ ??
  (globalThis.__iplCricApiClientState__ = {
    responseCache: new Map<string, CacheEntry>(),
    keyState: new Map<number, KeyState>(),
    apiKeyCursor: 0,
    cacheLoaded: false,
    cacheLoadPromise: null,
    persistPromise: Promise.resolve(),
  });

const PERSISTED_STALE_FALLBACK_MS = 7 * 24 * 60 * 60 * 1000;

async function getCacheFileAccess() {
  const [{ mkdir, readFile, writeFile }, pathModule] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
  ]);
  const path = pathModule.default ?? pathModule;

  return {
    mkdir,
    readFile,
    writeFile,
    cacheFilePath: path.join(process.cwd(), ".cache", "cricapi-response-cache.json"),
    dirname: path.dirname,
  };
}

function logClient(message: string, ...args: unknown[]) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[CricAPI] ${message}`, ...args);
  }
}

function getApiKeys() {
  return [
    process.env.CRIC_API_KEY_1,
    process.env.CRIC_API_KEY_2,
    process.env.CRIC_API_KEY_3,
    process.env.CRIC_API_KEY_4,
    process.env.CRIC_API_KEY_5,
    process.env.CRIC_API_KEY_6,
  ].filter(Boolean) as string[];
}

function getCachePolicy(requestPath: string): CachePolicy {
  if (requestPath.startsWith("currentMatches")) {
    return {
      ttlMs: 60_000,
      staleTtlMs: 15 * 60_000,
      failureCooldownMs: 5 * 60_000,
      timeoutMs: 10_000,
    };
  }

  if (requestPath.startsWith("series_info")) {
    return {
      ttlMs: 30 * 60_000,
      staleTtlMs: 12 * 60 * 60_000,
      failureCooldownMs: 15 * 60_000,
      timeoutMs: 10_000,
    };
  }

  if (requestPath.startsWith("series?search=")) {
    return {
      ttlMs: 30 * 60_000,
      staleTtlMs: 24 * 60 * 60_000,
      failureCooldownMs: 15 * 60_000,
      timeoutMs: 10_000,
    };
  }

  if (requestPath.startsWith("match_scorecard")) {
    return {
      ttlMs: 60_000,
      staleTtlMs: 24 * 60 * 60_000,
      failureCooldownMs: 10 * 60_000,
      timeoutMs: 10_000,
    };
  }

  return {
    ttlMs: 60_000,
    staleTtlMs: 30 * 60_000,
    failureCooldownMs: 5 * 60_000,
    timeoutMs: 10_000,
  };
}

function toPersistedEntry(entry: CacheEntry): PersistedCacheEntry | null {
  if (!entry.payload) {
    return null;
  }

  return {
    payload: entry.payload,
    updatedAt: entry.updatedAt,
    expiresAt: entry.expiresAt,
    staleUntil: entry.staleUntil,
    retryAfter: entry.retryAfter,
    lastError: entry.lastError,
  };
}

async function ensurePersistentCacheLoaded() {
  if (globalState.cacheLoaded) {
    return;
  }

  if (!globalState.cacheLoadPromise) {
    globalState.cacheLoadPromise = (async () => {
      try {
        const { readFile, cacheFilePath } = await getCacheFileAccess();
        const raw = await readFile(cacheFilePath, "utf8");
        const parsed = JSON.parse(raw) as PersistedCacheShape;
        const now = Date.now();

        for (const [requestPath, entry] of Object.entries(parsed || {})) {
          globalState.responseCache.set(requestPath, {
            payload: entry.payload,
            updatedAt: entry.updatedAt,
            expiresAt: entry.expiresAt,
            staleUntil: Math.max(entry.staleUntil, now + PERSISTED_STALE_FALLBACK_MS),
            retryAfter: entry.retryAfter,
            lastError: entry.lastError,
          });
        }

        logClient("Loaded persisted cache", { entries: Object.keys(parsed || {}).length });
      } catch {
        // Ignore missing or invalid cache files. We'll rebuild them from fresh responses.
      } finally {
        globalState.cacheLoaded = true;
        globalState.cacheLoadPromise = null;
      }
    })();
  }

  await globalState.cacheLoadPromise;
}

function persistResponseCache() {
  const serializableCache = [...globalState.responseCache.entries()].reduce<PersistedCacheShape>(
    (accumulator, [requestPath, entry]) => {
      const persistedEntry = toPersistedEntry(entry);
      if (persistedEntry) {
        accumulator[requestPath] = persistedEntry;
      }
      return accumulator;
    },
    {},
  );

  globalState.persistPromise = globalState.persistPromise
    .catch(() => undefined)
    .then(async () => {
      const { mkdir, writeFile, cacheFilePath, dirname } = await getCacheFileAccess();
      await mkdir(dirname(cacheFilePath), { recursive: true });
      await writeFile(cacheFilePath, JSON.stringify(serializableCache, null, 2), "utf8");
    });
}

function getOrCreateEntry(requestPath: string) {
  const existingEntry = globalState.responseCache.get(requestPath);

  if (existingEntry) {
    return existingEntry;
  }

  const nextEntry: CacheEntry = {
    payload: null,
    updatedAt: 0,
    expiresAt: 0,
    staleUntil: 0,
    retryAfter: 0,
    lastError: null,
  };

  globalState.responseCache.set(requestPath, nextEntry);
  return nextEntry;
}

function getKeyState(index: number) {
  return (
    globalState.keyState.get(index) ?? {
      blockedUntil: 0,
      lastReason: null,
    }
  );
}

function setKeyState(index: number, nextState: KeyState) {
  globalState.keyState.set(index, nextState);
}

function getNextMidnightTimestamp() {
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0);
  return nextMidnight.getTime();
}

function classifyBlockedUntil(reason: string, now: number) {
  const normalizedReason = reason.toLowerCase();

  if (normalizedReason.includes("blocked for 15 minutes")) {
    return now + 15 * 60_000;
  }

  if (normalizedReason.includes("hits today exceeded")) {
    return getNextMidnightTimestamp();
  }

  if (normalizedReason.includes("blocked")) {
    return now + 15 * 60_000;
  }

  return now + 60_000;
}

function markKeyUnavailable(index: number, reason: string, now: number) {
  setKeyState(index, {
    blockedUntil: classifyBlockedUntil(reason, now),
    lastReason: reason,
  });
}

function getAvailableKeyIndexes(keys: string[], now: number) {
  return keys
    .map((_, index) => index)
    .filter((index) => getKeyState(index).blockedUntil <= now);
}

function getRotatedKeyIndexes(keys: string[], now: number) {
  const availableIndexes = getAvailableKeyIndexes(keys, now);

  if (!availableIndexes.length) {
    return [];
  }

  const orderedIndexes: number[] = [];

  for (let offset = 0; offset < keys.length; offset += 1) {
    const index = (globalState.apiKeyCursor + offset) % keys.length;
    if (availableIndexes.includes(index)) {
      orderedIndexes.push(index);
    }
  }

  return orderedIndexes;
}

function getNextRetryAfter(keys: string[], policy: CachePolicy, now: number) {
  const blockedUntilValues = keys.map((_, index) => getKeyState(index).blockedUntil).filter(Boolean);
  const earliestKeyRecovery = blockedUntilValues.length ? Math.min(...blockedUntilValues) : 0;

  if (earliestKeyRecovery > now) {
    return earliestKeyRecovery;
  }

  return now + policy.failureCooldownMs;
}

async function requestWithRotation(
  requestPath: string,
  policy: CachePolicy,
  entry: CacheEntry,
): Promise<CricApiPayload | null> {
  const apiKeys = getApiKeys();
  const now = Date.now();

  if (!apiKeys.length) {
    entry.retryAfter = now + policy.failureCooldownMs;
    entry.lastError = "No CricAPI keys configured";
    return entry.payload;
  }

  const keyIndexes = getRotatedKeyIndexes(apiKeys, now);

  if (!keyIndexes.length) {
    entry.retryAfter = getNextRetryAfter(apiKeys, policy, now);
    entry.lastError = "All CricAPI keys are cooling down";

    if (entry.payload && now < entry.staleUntil) {
      logClient("Serving stale cache while keys cool down", requestPath);
      return entry.payload;
    }

    return null;
  }

  for (const keyIndex of keyIndexes) {
    const apiKey = apiKeys[keyIndex];

    try {
      logClient("Using API key slot", { keySlot: keyIndex + 1, requestPath });

      const response = await fetch(
        `https://api.cricapi.com/v1/${requestPath}${requestPath.includes("?") ? "&" : "?"}apikey=${apiKey}`,
        {
          cache: "no-store",
          signal: AbortSignal.timeout(policy.timeoutMs),
        },
      );

      if (!response.ok) {
        markKeyUnavailable(keyIndex, `HTTP ${response.status}`, now);
        continue;
      }

      const payload = (await response.json()) as CricApiPayload;
      if (payload?.status === "failure") {
        const reason = String(payload.reason || "Unknown failure");
        markKeyUnavailable(keyIndex, reason, now);
        entry.lastError = reason;
        continue;
      }

      globalState.apiKeyCursor = (keyIndex + 1) % apiKeys.length;
      entry.payload = payload;
      entry.updatedAt = now;
      entry.expiresAt = now + policy.ttlMs;
      entry.staleUntil = now + policy.staleTtlMs;
      entry.retryAfter = 0;
      entry.lastError = null;
      persistResponseCache();
      logClient("Cache MISS -> network success", requestPath);
      return payload;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown request error";
      markKeyUnavailable(keyIndex, errorMessage, now);
      entry.lastError = errorMessage;
    }
  }

  entry.retryAfter = getNextRetryAfter(apiKeys, policy, now);

  if (entry.payload && now < entry.staleUntil) {
    logClient("Serving stale cache after request failures", requestPath);
    return entry.payload;
  }

  return null;
}

export async function fetchCricApiJson(requestPath: string) {
  await ensurePersistentCacheLoaded();

  const policy = getCachePolicy(requestPath);
  const entry = getOrCreateEntry(requestPath);
  const now = Date.now();

  if (entry.payload && now < entry.expiresAt) {
    logClient("Cache HIT", requestPath);
    return entry.payload;
  }

  if (entry.inFlight) {
    logClient("Request deduped", requestPath);
    return entry.inFlight;
  }

  if (entry.retryAfter > now && !entry.payload) {
    logClient("Skipping request during cooldown", {
      requestPath,
      retryAfter: new Date(entry.retryAfter).toISOString(),
      lastError: entry.lastError,
    });
    return null;
  }

  if (entry.payload && entry.retryAfter > now) {
    logClient("Cache STALE-HIT during cooldown", requestPath);
    return entry.payload;
  }

  entry.inFlight = requestWithRotation(requestPath, policy, entry)
    .catch(() => {
      if (entry.payload && now < entry.staleUntil) {
        return entry.payload;
      }

      return null;
    })
    .finally(() => {
      delete entry.inFlight;
    });

  return entry.inFlight;
}
