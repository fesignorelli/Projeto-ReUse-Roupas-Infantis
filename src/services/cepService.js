import { ONE_DAY_MS, fetchWithCache } from "./cache";

const CEP_CACHE_TTL_MS = 30 * ONE_DAY_MS;

export function normalizeCep(value = "") {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function formatCep(value = "") {
  const digits = normalizeCep(value);

  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}

// Consulta o endereço na API pública ViaCEP. CEPs já consultados ficam
// em cache por 30 dias, pois o endereço de um CEP quase nunca muda.
export async function lookupCep(value) {
  const cep = normalizeCep(value);

  if (cep.length !== 8) {
    throw new Error("O CEP precisa ter 8 dígitos.");
  }

  const { data } = await fetchWithCache(
    `cep:${cep}`,
    CEP_CACHE_TTL_MS,
    async () => {
      const response = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      if (!response.ok) {
        throw new Error("Não foi possível consultar o CEP.");
      }

      const address = await response.json();

      // A ViaCEP responde 200 com { erro: true } para CEP inexistente.
      if (address.erro) {
        throw new Error("CEP não encontrado.");
      }

      return {
        cep: address.cep,
        neighborhood: address.bairro,
        city: address.localidade,
        state: address.uf,
      };
    }
  );

  return data;
}

export function formatLocation({ neighborhood, city, state }) {
  const cityAndState = [city, state].filter(Boolean).join(", ");

  return [neighborhood, cityAndState].filter(Boolean).join(" - ");
}
