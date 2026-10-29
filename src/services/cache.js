import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "@reuse:cache:";

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function getCached(key) {
  try {
    const stored = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);

    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Erro ao ler cache:", key, error);
    return null;
  }
}

export async function setCached(key, data) {
  try {
    await AsyncStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify({ data, savedAt: Date.now() })
    );
  } catch (error) {
    console.error("Erro ao salvar cache:", key, error);
  }
}

// Devolve o dado do cache enquanto ele estiver dentro da validade.
// Fora dela, busca de novo; se a busca falhar, usa o cache vencido.
export async function fetchWithCache(key, ttlMs, fetcher) {
  const cached = await getCached(key);

  if (cached && Date.now() - cached.savedAt < ttlMs) {
    return { data: cached.data, fromCache: true };
  }

  try {
    const data = await fetcher();

    await setCached(key, data);

    return { data, fromCache: false };
  } catch (error) {
    if (cached) {
      return { data: cached.data, fromCache: true };
    }

    throw error;
  }
}
