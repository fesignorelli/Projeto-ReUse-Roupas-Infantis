import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  confirmTradeFromQr,
  parseQrPayload,
  updateTrade,
} from "../services/tradeStorage";
import { getCo2SavedByCategory } from "../services/co2Service";
import { showAlert } from "../utils/showAlert";

export function ScanQrScreen({ user, onGoBack, onTradeConfirmed }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);

  // O onBarcodeScanned dispara várias vezes por segundo; a ref bloqueia
  // leituras repetidas enquanto a primeira é processada.
  const scanLockRef = useRef(false);

  function unlockScanner() {
    scanLockRef.current = false;
    setProcessing(false);
  }

  async function handleBarcodeScanned({ data }) {
    if (scanLockRef.current) {
      return;
    }

    scanLockRef.current = true;
    setProcessing(true);

    const payload = parseQrPayload(data);

    if (!payload) {
      showAlert(
        "QR Code inválido",
        "Este código não é de uma troca do ReUse.",
        [{ text: "Tentar de novo", onPress: unlockScanner }]
      );
      return;
    }

    try {
      const { trade, alreadyConfirmed } = await confirmTradeFromQr(
        payload,
        user
      );

      let confirmedTrade = trade;

      if (trade.co2SavedKg === null) {
        const co2 = await getCo2SavedByCategory(trade.productCategory);

        confirmedTrade = await updateTrade({
          ...trade,
          co2SavedKg: co2.kgCo2e,
        });
      }

      showAlert(
        alreadyConfirmed ? "Troca já confirmada" : "Troca confirmada!",
        alreadyConfirmed
          ? `A troca de "${trade.productTitle}" já tinha sido confirmada.`
          : `A troca de "${trade.productTitle}" foi registrada. Obrigado por dar uma nova vida a essa peça!`,
        [
          {
            text: "Ver troca",
            onPress: () => onTradeConfirmed?.(confirmedTrade),
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao confirmar troca:", error);

      showAlert(
        "Não foi possível confirmar",
        "Tente escanear o código novamente.",
        [{ text: "OK", onPress: unlockScanner }]
      );
    }
  }

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-dark">
        <ActivityIndicator size="large" color="#e05578" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-cream px-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-pink-light">
          <Ionicons name="qr-code-outline" size={38} color="#e05578" />
        </View>

        <Text className="mt-6 text-center font-heading text-2xl text-ink-dark">
          Precisamos acessar sua câmera
        </Text>

        <Text className="mt-3 text-center font-body text-sm leading-5 text-ink-mid">
          A câmera será usada para ler o QR Code e confirmar a troca.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={requestPermission}
          className="mt-8 w-full items-center rounded-full bg-pink-dark py-4"
          accessibilityRole="button"
          accessibilityLabel="Permitir acesso à câmera"
        >
          <Text className="font-headingMedium text-base text-white">
            Permitir acesso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onGoBack}
          className="mt-4 px-6 py-3"
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text className="font-headingMedium text-sm text-ink-mid">
            Voltar
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={processing ? undefined : handleBarcodeScanned}
      />

      <SafeAreaView className="flex-1 justify-between" edges={["top", "bottom"]}>
        <View className="flex-row items-center px-5 pt-2">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onGoBack}
            className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>

          <Text className="ml-3 font-heading text-lg text-white">
            Escanear QR da troca
          </Text>
        </View>

        <View className="items-center">
          <View className="h-64 w-64 rounded-3xl border-4 border-pink-base" />
        </View>

        <View className="mx-6 mb-6 flex-row items-center justify-center gap-2 rounded-2xl bg-black/60 px-4 py-4">
          {processing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Ionicons name="scan-outline" size={20} color="#ffffff" />
          )}

          <Text className="font-bodyMedium text-sm text-white">
            {processing
              ? "Confirmando troca..."
              : "Aponte a câmera para o QR Code da troca"}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
