import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ensureQrCached,
  getQrCodeUrl,
  getStoredTrade,
  updateTrade,
} from "../services/tradeStorage";
import {
  formatKgCo2e,
  getCo2SavedByCategory,
} from "../services/co2Service";

function formatDateTime(isoDate) {
  return new Date(isoDate).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function describeCo2Source(co2) {
  if (co2.source === "climatiq") {
    return co2.fromCache
      ? "Calculado pela API Climatiq (resultado em cache)."
      : "Calculado agora pela API Climatiq.";
  }

  return "Estimativa local com o fator de emissão da Defra (Climatiq indisponível).";
}

export function TradeDetailScreen({ tradeId, onGoBack, onScanQr }) {
  const [trade, setTrade] = useState(null);
  const [qrFromCache, setQrFromCache] = useState(false);
  const [co2, setCo2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(true);

  useEffect(() => {
    async function loadTrade() {
      try {
        const storedTrade = await getStoredTrade(tradeId);

        if (!storedTrade) {
          return;
        }

        setTrade(storedTrade);
        setLoading(false);

        const [qrResult, co2Result] = await Promise.all([
          ensureQrCached(storedTrade),
          getCo2SavedByCategory(storedTrade.productCategory),
        ]);

        let updatedTrade = qrResult.trade;

        // Troca confirmada guarda o CO2 para somar no perfil.
        if (
          updatedTrade.status === "confirmada" &&
          updatedTrade.co2SavedKg === null
        ) {
          updatedTrade = await updateTrade({
            ...updatedTrade,
            co2SavedKg: co2Result.kgCo2e,
          });
        }

        setTrade(updatedTrade);
        setQrFromCache(qrResult.fromCache);
        setCo2(co2Result);
      } catch (error) {
        console.error("Erro ao carregar a troca:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTrade();
  }, [tradeId]);

  const confirmed = trade?.status === "confirmada";

  return (
    <SafeAreaView
      className="flex-1 bg-cream"
      edges={["top", "bottom"]}
    >
      <View className="flex-row items-center border-b border-neutralDivider bg-white px-5 py-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onGoBack}
          className="h-11 w-11 items-center justify-center rounded-full bg-pink-dark"
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#ffffff"
          />
        </TouchableOpacity>

        <View className="ml-3">
          <Text className="font-heading text-xl text-ink-dark">
            Detalhe da troca
          </Text>

          <Text className="font-body text-xs text-ink-light">
            Confirme a troca no encontro
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#e05578" />
        </View>
      ) : !trade ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center font-heading text-lg text-ink-dark">
            Troca não encontrada
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerClassName="px-6 pb-12 pt-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center gap-4 rounded-3xl bg-white p-4">
            {trade.productImageUrl ? (
              <Image
                source={{ uri: trade.productImageUrl }}
                style={{ width: 72, height: 72 }}
                className="rounded-2xl bg-pink-xlight"
                accessibilityLabel={trade.productTitle}
              />
            ) : (
              <View className="h-[72px] w-[72px] items-center justify-center rounded-2xl bg-pink-xlight">
                <Ionicons
                  name="shirt-outline"
                  size={30}
                  color="#e05578"
                />
              </View>
            )}

            <View className="flex-1">
              <Text className="font-heading text-base text-ink-dark">
                {trade.productTitle}
              </Text>

              {trade.productSize ? (
                <Text className="mt-0.5 font-body text-xs text-ink-light">
                  {trade.productSize}
                </Text>
              ) : null}

              {trade.productLocation ? (
                <Text className="font-body text-xs text-ink-light">
                  {trade.productLocation}
                </Text>
              ) : null}

              <View
                className={`mt-2 self-start rounded-full px-3 py-1 ${
                  confirmed ? "bg-mint-light" : "bg-pink-light"
                }`}
              >
                <Text
                  className={`font-bodySemibold text-xs ${
                    confirmed ? "text-mint-dark" : "text-pink-dark"
                  }`}
                >
                  {confirmed ? "Troca confirmada" : "Aguardando encontro"}
                </Text>
              </View>
            </View>
          </View>

          {confirmed ? (
            <View className="mt-4 flex-row items-center gap-3 rounded-3xl bg-mint-xlight px-5 py-4">
              <Ionicons
                name="checkmark-circle"
                size={28}
                color="#3d8b42"
              />

              <Text className="flex-1 font-body text-sm leading-5 text-mint-dark">
                Troca confirmada em {formatDateTime(trade.confirmedAt)}
                {trade.confirmedByName
                  ? ` por ${trade.confirmedByName}`
                  : ""}
                .
              </Text>
            </View>
          ) : (
            <View className="mt-4 items-center rounded-3xl bg-white px-6 py-6">
              <Text className="text-center font-heading text-base text-ink-dark">
                QR Code da troca
              </Text>

              <Text className="mt-1 text-center font-body text-xs leading-5 text-ink-mid">
                No encontro, peça para a outra família escanear este código
                para confirmar a entrega da peça.
              </Text>

              <View className="mt-5 h-60 w-60 items-center justify-center rounded-2xl border border-softBorder bg-white">
                {qrLoading ? (
                  <ActivityIndicator
                    color="#e05578"
                    style={{ position: "absolute" }}
                  />
                ) : null}

                <Image
                  source={{ uri: trade.qrImageUri ?? getQrCodeUrl(trade) }}
                  style={{ width: 224, height: 224 }}
                  resizeMode="contain"
                  onLoadEnd={() => setQrLoading(false)}
                  accessibilityLabel="QR Code para confirmar a troca"
                />
              </View>

              <View className="mt-3 flex-row items-center gap-1">
                <Ionicons
                  name={qrFromCache ? "save-outline" : "cloud-download-outline"}
                  size={14}
                  color="#888888"
                />

                <Text className="font-body text-xs text-ink-light">
                  {trade.qrImageUri
                    ? "QR salvo no aparelho (funciona sem internet)"
                    : "QR gerado pela API QR Server"}
                </Text>
              </View>

              <Text className="mt-1 font-body text-xs text-ink-light">
                Código da troca: #{trade.id.slice(-6)}
              </Text>
            </View>
          )}

          <View className="mt-4 rounded-3xl bg-white px-5 py-5">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-mint-light">
                <Ionicons name="leaf-outline" size={22} color="#3d8b42" />
              </View>

              <View className="flex-1">
                <Text className="font-body text-xs text-ink-light">
                  {confirmed ? "CO₂ evitado com esta troca" : "CO₂ que esta troca evita"}
                </Text>

                {co2 ? (
                  <Text className="font-heading text-xl text-mint-dark">
                    {formatKgCo2e(co2.kgCo2e)} de CO₂e
                  </Text>
                ) : (
                  <ActivityIndicator
                    color="#3d8b42"
                    style={{ alignSelf: "flex-start" }}
                  />
                )}
              </View>
            </View>

            {co2 ? (
              <Text className="mt-3 font-body text-xs leading-5 text-ink-mid">
                Reaproveitar a peça evita produzir uma nova. Peso médio
                considerado para {trade.productCategory.toLowerCase()}:{" "}
                {co2.weightKg.toLocaleString("pt-BR")} kg.{" "}
                {describeCo2Source(co2)}
              </Text>
            ) : null}
          </View>

          {!confirmed ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onScanQr}
              className="mt-8 flex-row items-center justify-center gap-2 rounded-full bg-pink-dark py-4"
              accessibilityRole="button"
              accessibilityLabel="Escanear QR Code para confirmar uma troca"
            >
              <Ionicons
                name="qr-code-outline"
                size={20}
                color="#ffffff"
              />

              <Text className="font-headingMedium text-base text-white">
                Escanear QR para confirmar
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
