import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// API pública de testes com cadastro real e autenticação por JWT.
const API_URL = "https://api.escuelajs.co/api/v1";

const ACCESS_TOKEN_KEY = "reuse.accessToken";
const REFRESH_TOKEN_KEY = "reuse.refreshToken";
const PROFILE_CACHE_KEY = "@reuse:session-profile";

const PROFILE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export class SessionExpiredError extends Error {
  constructor() {
    super("Sua sessão expirou. Entre novamente.");
    this.name = "SessionExpiredError";
  }
}

// O SecureStore não existe na web, então lá os tokens ficam no AsyncStorage.
const tokenStorage = {
  getItem(key) {
    return Platform.OS === "web"
      ? AsyncStorage.getItem(key)
      : SecureStore.getItemAsync(key);
  },

  setItem(key, value) {
    return Platform.OS === "web"
      ? AsyncStorage.setItem(key, value)
      : SecureStore.setItemAsync(key, value);
  },

  removeItem(key) {
    return Platform.OS === "web"
      ? AsyncStorage.removeItem(key)
      : SecureStore.deleteItemAsync(key);
  },
};

async function saveTokens({ access_token, refresh_token }) {
  await tokenStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  await tokenStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

// A API devolve a senha junto com o perfil; ela nunca deve ir para o cache.
function sanitizeUser({ password, ...user }) {
  return user;
}

async function saveCachedProfile(user) {
  await AsyncStorage.setItem(
    PROFILE_CACHE_KEY,
    JSON.stringify({
      data: user,
      savedAt: Date.now(),
    })
  );
}

async function getCachedProfile() {
  try {
    const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);

    if (!cached) {
      return null;
    }

    const { data, savedAt } = JSON.parse(cached);

    return {
      user: data,
      savedAt,
      isFresh: Date.now() - savedAt < PROFILE_CACHE_TTL_MS,
    };
  } catch (error) {
    console.error("Erro ao ler perfil em cache:", error);
    return null;
  }
}

export async function clearSession() {
  await tokenStorage.removeItem(ACCESS_TOKEN_KEY);
  await tokenStorage.removeItem(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem(PROFILE_CACHE_KEY);
}

async function refreshSession() {
  const refreshToken = await tokenStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new SessionExpiredError();
  }

  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await clearSession();
    throw new SessionExpiredError();
  }

  const tokens = await response.json();

  await saveTokens(tokens);

  return tokens.access_token;
}

// Faz uma requisição autenticada. Se o access token tiver expirado (401),
// renova a sessão com o refresh token e tenta mais uma vez.
export async function authorizedFetch(path, options = {}) {
  let accessToken = await tokenStorage.getItem(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    throw new SessionExpiredError();
  }

  function request(token) {
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let response = await request(accessToken);

  if (response.status === 401) {
    accessToken = await refreshSession();
    response = await request(accessToken);
  }

  return response;
}

async function fetchCurrentUser() {
  const response = await authorizedFetch("/auth/profile");

  if (!response.ok) {
    throw new Error("Não foi possível carregar o perfil.");
  }

  const user = sanitizeUser(await response.json());

  await saveCachedProfile(user);

  return user;
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "E-mail ou senha incorretos."
        : "Não foi possível entrar agora. Tente novamente."
    );
  }

  await saveTokens(await response.json());

  return fetchCurrentUser();
}

export async function register({ name, email, password }) {
  const trimmedName = name.trim();

  // A API exige uma URL de avatar; geramos uma com as iniciais do nome.
  const avatar =
    "https://ui-avatars.com/api/?size=256&background=ffdae9&color=e05578" +
    `&name=${encodeURIComponent(trimmedName)}`;

  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: trimmedName,
      email: email.trim().toLowerCase(),
      password,
      avatar,
    }),
  });

  if (!response.ok) {
    throw new Error(
      response.status === 400
        ? "Não foi possível criar a conta. Confira os dados informados."
        : "Não foi possível criar a conta agora. Tente novamente."
    );
  }

  // Cadastro concluído: já entra com a conta nova.
  return login(email, password);
}

export async function logout() {
  await clearSession();
}

// Busca o perfil do usuário logado. Usa o cache enquanto ele estiver
// válido e, se a rede falhar, devolve o último perfil salvo.
export async function getProfile({ forceRefresh = false } = {}) {
  const cached = await getCachedProfile();

  if (cached?.isFresh && !forceRefresh) {
    return {
      user: cached.user,
      fromCache: true,
      savedAt: cached.savedAt,
    };
  }

  try {
    const user = await fetchCurrentUser();

    return {
      user,
      fromCache: false,
      savedAt: Date.now(),
    };
  } catch (error) {
    if (error instanceof SessionExpiredError || !cached) {
      throw error;
    }

    return {
      user: cached.user,
      fromCache: true,
      savedAt: cached.savedAt,
    };
  }
}

// Chamado ao abrir o app: se houver tokens salvos, retoma a sessão
// sem pedir login de novo.
export async function restoreSession() {
  const accessToken = await tokenStorage.getItem(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return null;
  }

  try {
    const { user } = await getProfile();

    return user;
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      await clearSession();
    } else {
      console.error("Erro ao restaurar sessão:", error);
    }

    return null;
  }
}
