import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import { showAlert } from "../utils/showAlert";

export function CameraCapture({ onConfirmPhoto, onCancel }) {
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);

  function toggleCameraFacing() {
    setFacing((currentFacing) =>
      currentFacing === "back" ? "front" : "back"
    );
  }

  async function takePicture() {
    if (!cameraRef.current || !cameraReady || capturing) {
      return;
    }

    try {
      setCapturing(true);

      const capturedPhoto = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (capturedPhoto?.uri) {
        setPhoto(capturedPhoto);
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);

      showAlert(
        "Não foi possível tirar a foto",
        "Tente novamente em alguns instantes.",
        undefined,
        { type: "error" }
      );
    } finally {
      setCapturing(false);
    }
  }

  function retakePicture() {
    setPhoto(null);
    setCameraReady(false);
  }

  function confirmPicture() {
    if (!photo?.uri) {
      return;
    }

    onConfirmPhoto?.(photo);
  }

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-dark px-6">
        <ActivityIndicator size="large" color="#e05578" />

        <Text className="mt-4 text-center font-body text-sm text-white">
          Verificando permissão da câmera...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-cream px-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-pink-light">
          <Ionicons name="camera-outline" size={38} color="#e05578" />
        </View>

        <Text className="mt-6 text-center font-heading text-2xl text-ink-dark">
          Precisamos acessar sua câmera
        </Text>

        <Text className="mt-3 text-center font-body text-sm leading-5 text-ink-mid">
          A câmera será usada para fotografar as peças que você deseja
          disponibilizar para troca.
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
          onPress={onCancel}
          className="mt-4 px-6 py-3"
          accessibilityRole="button"
          accessibilityLabel="Cancelar uso da câmera"
        >
          <Text className="font-headingMedium text-sm text-ink-mid">
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (photo?.uri) {
    return (
      <View className="flex-1 bg-black">
        <Image
          source={{ uri: photo.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityLabel="Foto capturada da peça"
        />

        <View className="absolute left-0 right-0 top-0 flex-row items-center px-5 pt-12">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={retakePicture}
            className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
            accessibilityRole="button"
            accessibilityLabel="Voltar para a câmera"
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 pb-10 pt-6">
          <Text className="mb-5 text-center font-heading text-lg text-white">
            Gostou da foto?
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={retakePicture}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-white py-4"
              accessibilityRole="button"
              accessibilityLabel="Tirar outra foto"
            >
              <Ionicons
                name="refresh-outline"
                size={19}
                color="#ffffff"
              />

              <Text className="font-headingMedium text-sm text-white">
                Refazer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={confirmPicture}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-pink-dark py-4"
              accessibilityRole="button"
              accessibilityLabel="Usar foto capturada"
            >
              <Ionicons
                name="checkmark-outline"
                size={20}
                color="#ffffff"
              />

              <Text className="font-headingMedium text-sm text-white">
                Usar foto
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        onCameraReady={() => setCameraReady(true)}
      />

      <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-5 pt-12">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCancel}
          className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
          accessibilityRole="button"
          accessibilityLabel="Fechar câmera"
        >
          <Ionicons name="close" size={26} color="#ffffff" />
        </TouchableOpacity>

        <Text className="font-headingMedium text-base text-white">
          Fotografar peça
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleCameraFacing}
          className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
          accessibilityRole="button"
          accessibilityLabel="Alternar câmera"
        >
          <Ionicons
            name="camera-reverse-outline"
            size={25}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      <View className="absolute bottom-0 left-0 right-0 items-center bg-black/40 pb-10 pt-7">
        <Text className="mb-5 font-body text-sm text-white">
          Posicione a peça no centro da imagem
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={takePicture}
          disabled={!cameraReady || capturing}
          className="h-20 w-20 items-center justify-center rounded-full border-4 border-white"
          accessibilityRole="button"
          accessibilityLabel="Tirar foto"
        >
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
            {capturing ? (
              <ActivityIndicator color="#e05578" />
            ) : (
              <View className="h-14 w-14 rounded-full bg-pink-dark" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}