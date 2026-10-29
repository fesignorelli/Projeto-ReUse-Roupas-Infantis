import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

import { resolveCategory } from "./co2Service";

const TRADES_KEY = "@reuse:trades";
const QR_PREFIX = "reuse-troca:";

const QR_IMAGES_DIRECTORY =
  FileSystem.documentDirectory !== null
    ? `${FileSystem.documentDirectory}qr-codes/`
    : null;

export async function getStoredTrades() {
  try {
    const storedTrades = await AsyncStorage.getItem(TRADES_KEY);

    if (!storedTrades) {
      return [];
    }

    const parsedTrades = JSON.parse(storedTrades);

    return Array.isArray(parsedTrades) ? parsedTrades : [];
  } catch (error) {
    console.error("Erro ao carregar trocas:", error);
    return [];
  }
}

async function saveTrade(trade) {
  const currentTrades = await getStoredTrades();

  const updatedTrades = [
    trade,
    ...currentTrades.filter(
      (currentTrade) => currentTrade.id !== trade.id
    ),
  ];

  await AsyncStorage.setItem(TRADES_KEY, JSON.stringify(updatedTrades));

  return trade;
}

export async function getStoredTrade(tradeId) {
  const trades = await getStoredTrades();

  return trades.find((trade) => trade.id === tradeId) ?? null;
}

// O QR leva os dados essenciais da troca, assim o aparelho de quem
// escaneia consegue confirmar mesmo sem ter a troca salva.
function buildQrPayload(trade) {
  return `${QR_PREFIX}${JSON.stringify({
    id: trade.id,
    productId: trade.productId,
    title: trade.productTitle,
    category: trade.productCategory,
  })}`;
}

export function getQrCodeUrl(trade) {
  return (
    "https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=10" +
    `&data=${encodeURIComponent(buildQrPayload(trade))}`
  );
}

// Baixa a imagem do QR Server para o armazenamento do app. Depois disso
// o QR aparece mesmo sem internet e sem uma nova chamada à API.
async function downloadQrImage(trade) {
  if (!QR_IMAGES_DIRECTORY || Platform.OS === "web") {
    return null;
  }

  const directoryInfo = await FileSystem.getInfoAsync(QR_IMAGES_DIRECTORY);

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(QR_IMAGES_DIRECTORY, {
      intermediates: true,
    });
  }

  const result = await FileSystem.downloadAsync(
    getQrCodeUrl(trade),
    `${QR_IMAGES_DIRECTORY}${trade.id}.png`
  );

  return result.status === 200 ? result.uri : null;
}

// Devolve a troca com o QR em cache, baixando-o se ainda não existir.
export async function ensureQrCached(trade) {
  if (trade.qrImageUri) {
    const fileInfo = await FileSystem.getInfoAsync(trade.qrImageUri);

    if (fileInfo.exists) {
      return { trade, fromCache: true };
    }
  }

  try {
    const qrImageUri = await downloadQrImage(trade);

    if (!qrImageUri) {
      return { trade, fromCache: false };
    }

    const updatedTrade = await saveTrade({ ...trade, qrImageUri });

    return { trade: updatedTrade, fromCache: false };
  } catch (error) {
    console.error("Erro ao salvar QR Code:", error);
    return { trade, fromCache: false };
  }
}

export async function createTrade(product, user) {
  const trades = await getStoredTrades();

  const existingTrade = trades.find(
    (trade) =>
      trade.productId === product.id &&
      trade.requesterId === user.id &&
      trade.status === "pendente"
  );

  if (existingTrade) {
    return existingTrade;
  }

  const trade = {
    id: `${Date.now()}`,
    productId: product.id,
    productTitle: product.title,
    productCategory: resolveCategory(product),
    productImageUrl: product.imageUrl,
    productSize: product.size,
    productLocation: product.location,
    ownerName: product.ownerName ?? null,
    requesterId: user.id,
    requesterName: user.name,
    status: "pendente",
    createdAt: new Date().toISOString(),
    confirmedAt: null,
    co2SavedKg: null,
    qrImageUri: null,
  };

  return saveTrade(trade);
}

export async function updateTrade(trade) {
  return saveTrade(trade);
}

export function parseQrPayload(data = "") {
  if (!data.startsWith(QR_PREFIX)) {
    return null;
  }

  try {
    const payload = JSON.parse(data.slice(QR_PREFIX.length));

    return payload?.id ? payload : null;
  } catch {
    return null;
  }
}

// Confirma a troca lida no QR. Se ela não existir neste aparelho
// (QR de outro usuário), é criada a partir dos dados do próprio QR.
export async function confirmTradeFromQr(payload, user) {
  const storedTrade = await getStoredTrade(payload.id);

  if (storedTrade?.status === "confirmada") {
    return { trade: storedTrade, alreadyConfirmed: true };
  }

  const trade = storedTrade ?? {
    id: payload.id,
    productId: payload.productId,
    productTitle: payload.title,
    productCategory: payload.category,
    productImageUrl: null,
    productSize: null,
    productLocation: null,
    ownerName: user.name,
    requesterId: null,
    requesterName: null,
    createdAt: new Date().toISOString(),
    co2SavedKg: null,
    qrImageUri: null,
  };

  const confirmedTrade = await saveTrade({
    ...trade,
    status: "confirmada",
    confirmedAt: new Date().toISOString(),
    confirmedByName: user.name,
  });

  return { trade: confirmedTrade, alreadyConfirmed: false };
}
