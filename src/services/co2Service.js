import { ONE_DAY_MS, fetchWithCache } from "./cache";

const CLIMATIQ_URL = "https://api.climatiq.io/data/v1/estimate";
const CLIMATIQ_KEY = process.env.EXPO_PUBLIC_CLIMATIQ_KEY;

// Fator do Climatiq para a produção de roupas (dados Defra/BEIS, Reino
// Unido). Trocar uma roupa em vez de comprar uma nova evita essa emissão.
const CLOTHING_ACTIVITY_ID =
  "consumer_goods-type_clothing_primary_material_production";
const CLIMATIQ_DATA_VERSION = "^38";

// Valor do mesmo fator (22.310 kg CO2e por tonelada), usado quando não
// há chave do Climatiq configurada ou a API não responde.
const FALLBACK_KG_CO2E_PER_KG = 22.31;

const CO2_CACHE_TTL_MS = 30 * ONE_DAY_MS;

// Peso médio estimado de uma peça infantil de cada categoria, em kg.
const AVERAGE_WEIGHT_KG = {
  Camisetas: 0.12,
  Vestidos: 0.2,
  Casacos: 0.45,
  Calças: 0.3,
  Macacões: 0.25,
  Pijamas: 0.2,
  Sapatos: 0.4,
};

const DEFAULT_WEIGHT_KG = 0.25;

// Palavras do título usadas quando a peça não tem categoria
// (por exemplo, as peças de exemplo da Home).
const CATEGORY_KEYWORDS = [
  ["Macacões", ["macacão", "macacao", "body", "jardineira"]],
  ["Vestidos", ["vestido", "saia"]],
  ["Casacos", ["casaco", "jaqueta", "moletom", "blusão"]],
  ["Calças", ["calça", "calca", "jeans", "bermuda", "short"]],
  ["Pijamas", ["pijama"]],
  ["Sapatos", ["sapato", "tênis", "tenis", "sandália", "bota"]],
  ["Camisetas", ["camiseta", "camisa", "blusa", "regata"]],
];

export function resolveCategory(product) {
  if (product.category) {
    return product.category;
  }

  const title = (product.title ?? "").toLowerCase();

  const match = CATEGORY_KEYWORDS.find(([, keywords]) =>
    keywords.some((keyword) => title.includes(keyword))
  );

  return match ? match[0] : "Outros";
}

export function getAverageWeightKg(category) {
  return AVERAGE_WEIGHT_KG[category] ?? DEFAULT_WEIGHT_KG;
}

async function estimateWithClimatiq(weightKg) {
  const response = await fetch(CLIMATIQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLIMATIQ_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emission_factor: {
        activity_id: CLOTHING_ACTIVITY_ID,
        data_version: CLIMATIQ_DATA_VERSION,
      },
      parameters: {
        weight: weightKg,
        weight_unit: "kg",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Climatiq respondeu ${response.status}: ${body}`);
  }

  const data = await response.json();

  return data.co2e;
}

// Estima o CO2 que deixa de ser emitido ao trocar uma peça da categoria.
// O resultado fica em cache por categoria durante 30 dias, para poupar a
// cota gratuita do Climatiq.
export async function getCo2SavedByCategory(category) {
  const weightKg = getAverageWeightKg(category);

  if (!CLIMATIQ_KEY) {
    return {
      kgCo2e: weightKg * FALLBACK_KG_CO2E_PER_KG,
      weightKg,
      source: "estimate",
      fromCache: false,
    };
  }

  try {
    const { data, fromCache } = await fetchWithCache(
      `co2:${category}`,
      CO2_CACHE_TTL_MS,
      () => estimateWithClimatiq(weightKg)
    );

    return {
      kgCo2e: data,
      weightKg,
      source: "climatiq",
      fromCache,
    };
  } catch (error) {
    console.error("Erro ao consultar o Climatiq:", error);

    return {
      kgCo2e: weightKg * FALLBACK_KG_CO2E_PER_KG,
      weightKg,
      source: "estimate",
      fromCache: false,
    };
  }
}

export function formatKgCo2e(value) {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} kg`;
}
