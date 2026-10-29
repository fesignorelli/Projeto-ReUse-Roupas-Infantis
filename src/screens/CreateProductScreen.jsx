import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";

import { AlertHost } from "../components/AlertHost";
import { CameraCapture } from "../components/CameraCapture";
import { useImageDrop } from "../hooks/useImageDrop";
import {
  formatCep,
  formatLocation,
  lookupCep,
  normalizeCep,
} from "../services/cepService";
import { showAlert } from "../utils/showAlert";
import { resizeImageForWeb } from "../utils/webImage";

const CATEGORIES = [
  "Camisetas",
  "Vestidos",
  "Casacos",
  "Calças",
  "Macacões",
  "Pijamas",
  "Sapatos",
];

const SIZES = [
  "RN",
  "P",
  "M",
  "G",
  "1-2 anos",
  "3-4 anos",
  "5-7 anos",
  "8-10 anos",
  "11-13 anos",
];

const CONDITIONS = [
  "Novo",
  "Ótimo estado",
  "Bem conservado",
  "Usado com cuidado",
];

export function CreateProductScreen({ onGoBack, onSubmitProduct }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
    const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  async function handleChangeCep(value) {
    const formattedCep = formatCep(value);

    setCep(formattedCep);
    setCepError("");

    if (normalizeCep(formattedCep).length !== 8) {
      return;
    }

    try {
      setCepLoading(true);

      const address = await lookupCep(formattedCep);

      setLocation(formatLocation(address));
    } catch (error) {
      setCepError(
        error.message === "Network request failed"
          ? "Sem conexão para consultar o CEP."
          : error.message
      );
    } finally {
      setCepLoading(false);
    }
  }

  const { dropRef, dragging } = useImageDrop({
    onImage: setPhoto,
    onError: (error) =>
      showAlert("Não foi possível anexar", error.message, undefined, {
        type: "error",
      }),
  });

  function handleConfirmPhoto(capturedPhoto) {
    setPhoto(capturedPhoto);
    setCameraOpen(false);
  }

  async function pickFromGallery() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      const asset = result.assets[0];

      setPhoto(
        Platform.OS === "web"
          ? await resizeImageForWeb(asset.uri)
          : asset
      );
    } catch (error) {
      console.error("Erro ao escolher imagem:", error);

      showAlert(
        "Não foi possível anexar",
        "Tente escolher outra imagem.",
        undefined,
        { type: "error" }
      );
    }
  }

  function validateForm() {
    if (!photo?.uri) {
      showAlert(
        "Foto obrigatória",
        "Adicione uma foto da peça antes de continuar.",
        undefined,
        { type: "warning" }
      );

      return false;
    }

    if (!title.trim()) {
      showAlert(
        "Informe o nome",
        "Digite um nome para identificar a peça.",
        undefined,
        { type: "warning" }
      );

      return false;
    }

    if (!category) {
      showAlert(
        "Escolha uma categoria",
        "Selecione a categoria da peça.",
        undefined,
        { type: "warning" }
      );

      return false;
    }

    if (!size) {
      showAlert(
        "Escolha um tamanho",
        "Selecione o tamanho da peça.",
        undefined,
        { type: "warning" }
      );

      return false;
    }

    if (!condition) {
      showAlert(
        "Informe a conservação",
        "Selecione o estado de conservação.",
        undefined,
        { type: "warning" }
      );

      return false;
    }

    return true;
  }

  async function handleSubmit() {
  if (!validateForm() || saving) {
    return;
  }

  const product = {
    id: String(Date.now()),
    title: title.trim(),
    category,
    size,
    condition,
    description: description.trim(),
    location: location.trim(),
    imageUrl: photo.uri,
    createdAt: new Date().toISOString(),
    tradesCount: 0,
    isNew: true,
    verified: false,
  };

  try {
    setSaving(true);

    await onSubmitProduct?.(product);

    showAlert(
      "Peça cadastrada!",
      "Sua peça foi salva no dispositivo.",
      [
        {
          text: "OK",
          onPress: onGoBack,
        },
      ],
      { type: "success" }
    );
  } catch (error) {
    console.error("Erro ao publicar peça:", error);
  } finally {
    setSaving(false);
  }
}

  return (
    <SafeAreaView
      className="flex-1 bg-cream"
      edges={["top", "bottom"]}
    >
      <StatusBar style={cameraOpen ? "light" : "dark"} />

      <View className="flex-row items-center border-b border-neutralDivider bg-white px-5 py-4">
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onGoBack}
    className="h-11 w-11 items-center justify-center rounded-full bg-pink-dark"
    accessibilityRole="button"
    accessibilityLabel="Voltar para o feed"
  >
    <Ionicons
      name="arrow-back"
      size={22}
      color="#ffffff"
    />
  </TouchableOpacity>

  <View className="ml-3">
    <Text className="font-heading text-xl text-ink-dark">
      Cadastrar peça
    </Text>

    <Text className="font-body text-xs text-ink-light">
      Disponibilize uma roupinha para troca
    </Text>
  </View>
</View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="px-6 pb-12 pt-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="font-headingMedium text-sm text-ink-dark">
            Foto da peça
          </Text>

          <Text className="mt-1 font-body text-xs text-ink-light">
            Tire uma foto ou anexe uma imagem que mostre bem o estado da
            roupa.
          </Text>

          <View ref={dropRef} className="mt-4">
            {photo?.uri ? (
              <View className="overflow-hidden rounded-3xl bg-neutralIcon">
                <Image
                  source={{ uri: photo.uri }}
                  className="h-72 w-full"
                  resizeMode="cover"
                  accessibilityLabel="Foto da peça cadastrada"
                />

                <View className="absolute bottom-4 left-4 right-4 flex-row gap-3">
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setCameraOpen(true)}
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-black/60 py-3"
                  >
                    <Ionicons
                      name="camera-outline"
                      size={18}
                      color="#ffffff"
                    />

                    <Text className="font-headingMedium text-sm text-white">
                      Câmera
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={pickFromGallery}
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-black/60 py-3"
                    accessibilityRole="button"
                    accessibilityLabel="Trocar pela imagem da galeria"
                  >
                    <Ionicons
                      name="images-outline"
                      size={18}
                      color="#ffffff"
                    />

                    <Text className="font-headingMedium text-sm text-white">
                      Galeria
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setPhoto(null)}
                    className="h-12 w-12 items-center justify-center rounded-full bg-white"
                    accessibilityLabel="Remover foto"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={19}
                      color="#e05578"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="items-center justify-center rounded-3xl border-2 border-dashed border-pink-medium bg-pink-xlight px-6 py-8">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-pink-light">
                  <Ionicons
                    name="image-outline"
                    size={30}
                    color="#e05578"
                  />
                </View>

                <Text className="mt-4 text-center font-body text-xs leading-5 text-ink-light">
                  Posicione a roupa em um local bem iluminado e com fundo
                  neutro.
                </Text>

                <View className="mt-5 w-full flex-row gap-3">
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setCameraOpen(true)}
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-pink-dark py-3"
                    accessibilityRole="button"
                    accessibilityLabel="Tirar foto da peça"
                  >
                    <Ionicons
                      name="camera-outline"
                      size={18}
                      color="#ffffff"
                    />

                    <Text className="font-headingMedium text-sm text-white">
                      Tirar foto
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={pickFromGallery}
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-pink-dark bg-white py-3"
                    accessibilityRole="button"
                    accessibilityLabel="Anexar imagem da galeria"
                  >
                    <Ionicons
                      name="images-outline"
                      size={18}
                      color="#e05578"
                    />

                    <Text className="font-headingMedium text-sm text-pink-dark">
                      Galeria
                    </Text>
                  </TouchableOpacity>
                </View>

                {Platform.OS === "web" ? (
                  <Text className="mt-4 text-center font-body text-xs text-ink-light">
                    ou arraste uma imagem até aqui
                  </Text>
                ) : null}
              </View>
            )}

            {dragging ? (
              <View
                pointerEvents="none"
                className="absolute inset-0 items-center justify-center rounded-3xl border-2 border-dashed border-pink-dark bg-pink-light/90"
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={36}
                  color="#e05578"
                />

                <Text className="mt-2 font-headingMedium text-base text-pink-dark">
                  Solte a imagem para anexar
                </Text>
              </View>
            ) : null}
          </View>

          <View className="mt-7">
            <Text className="font-headingMedium text-sm text-ink-dark">
              Nome da peça
            </Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ex.: Vestido floral infantil"
              placeholderTextColor="#b0b0b0"
              maxLength={60}
              className="mt-2 rounded-2xl border border-neutralDivider bg-white px-4 py-4 font-body text-sm text-ink-dark outline-none"
            />

            <Text className="mt-1 text-right font-body text-xs text-ink-light">
              {title.length}/60
            </Text>
          </View>

          <View className="mt-5">
            <Text className="font-headingMedium text-sm text-ink-dark">
              Categoria
            </Text>

            <View className="mt-3 flex-row flex-wrap gap-2">
              {CATEGORIES.map((item) => {
                const selected = category === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.8}
                    onPress={() => setCategory(item)}
                    className={`rounded-full border px-4 py-2 ${
                      selected
                        ? "border-pink-dark bg-pink-dark"
                        : "border-neutralDivider bg-white"
                    }`}
                  >
                    <Text
                      className={`font-bodyMedium text-sm ${
                        selected ? "text-white" : "text-ink-mid"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="mt-6">
            <Text className="font-headingMedium text-sm text-ink-dark">
              Tamanho
            </Text>

            <View className="mt-3 flex-row flex-wrap gap-2">
              {SIZES.map((item) => {
                const selected = size === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.8}
                    onPress={() => setSize(item)}
                    className={`rounded-full border px-4 py-2 ${
                      selected
                        ? "border-blue-dark bg-blue-dark"
                        : "border-neutralDivider bg-white"
                    }`}
                  >
                    <Text
                      className={`font-bodyMedium text-sm ${
                        selected ? "text-white" : "text-ink-mid"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="mt-6">
            <Text className="font-headingMedium text-sm text-ink-dark">
              Estado de conservação
            </Text>

            <View className="mt-3 gap-2">
              {CONDITIONS.map((item) => {
                const selected = condition === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.8}
                    onPress={() => setCondition(item)}
                    className={`flex-row items-center rounded-2xl border px-4 py-3 ${
                      selected
                        ? "border-mint-dark bg-mint-light"
                        : "border-neutralDivider bg-white"
                    }`}
                  >
                    <View
                      className={`h-5 w-5 items-center justify-center rounded-full border ${
                        selected
                          ? "border-mint-dark bg-mint-dark"
                          : "border-ink-light"
                      }`}
                    >
                      {selected ? (
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color="#ffffff"
                        />
                      ) : null}
                    </View>

                    <Text
                      className={`ml-3 font-bodyMedium text-sm ${
                        selected ? "text-mint-dark" : "text-ink-mid"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="mt-6">
            <Text className="font-headingMedium text-sm text-ink-dark">
              CEP
            </Text>

            <View className="mt-2 flex-row items-center rounded-2xl border border-neutralDivider bg-white pr-3">
              <TextInput
                value={cep}
                onChangeText={handleChangeCep}
                placeholder="00000-000"
                placeholderTextColor="#b0b0b0"
                keyboardType="number-pad"
                maxLength={9}
                className="flex-1 px-4 py-4 font-body text-sm text-ink-dark outline-none"
                accessibilityLabel="CEP"
              />

              {cepLoading ? (
                <ActivityIndicator color="#e05578" />
              ) : (
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#888888"
                />
              )}
            </View>

            <Text
              className={`mt-1 font-body text-xs ${
                cepError ? "text-pink-dark" : "text-ink-light"
              }`}
            >
              {cepError ||
                "Digite o CEP para preencher o bairro automaticamente."}
            </Text>
          </View>

          <View className="mt-6">
            <Text className="font-headingMedium text-sm text-ink-dark">
              Bairro ou localização
            </Text>

            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Ex.: Vila Madalena, SP"
              placeholderTextColor="#b0b0b0"
              className="mt-2 rounded-2xl border border-neutralDivider bg-white px-4 py-4 font-body text-sm text-ink-dark outline-none"
            />
          </View>

          <View className="mt-6">
            <Text className="font-headingMedium text-sm text-ink-dark">
              Descrição
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Conte mais sobre a peça, detalhes e possíveis marcas de uso."
              placeholderTextColor="#b0b0b0"
              multiline
              textAlignVertical="top"
              maxLength={300}
              className="mt-2 min-h-32 rounded-2xl border border-neutralDivider bg-white px-4 py-4 font-body text-sm leading-5 text-ink-dark outline-none"
            />

            <Text className="mt-1 text-right font-body text-xs text-ink-light">
              {description.length}/300
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit}
            className="mt-8 flex-row items-center justify-center gap-2 rounded-full bg-pink-dark py-4"
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#ffffff"
            />

            <Text className="font-headingMedium text-base text-white">
              Publicar peça
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={cameraOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setCameraOpen(false)}
      >
        <CameraCapture
          onCancel={() => setCameraOpen(false)}
          onConfirmPhoto={handleConfirmPhoto}
        />

        <AlertHost />
      </Modal>
    </SafeAreaView>
  );
}