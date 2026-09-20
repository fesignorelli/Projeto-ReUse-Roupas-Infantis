import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProductCard } from "../components/ProductCard";

const FILTERS = [
  "Todos",
  "Novas",
  "Verificados",
  "Bebês",
  "Crianças",
];

function normalizeText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesFilter(product, filter) {
  if (filter === "Todos") {
    return true;
  }

  if (filter === "Novas") {
    return product.isNew === true;
  }

  if (filter === "Verificados") {
    return product.verified === true;
  }

  if (filter === "Bebês") {
    const size = normalizeText(product.size);

    return (
      size === "rn" ||
      size === "p" ||
      size === "m" ||
      size === "g" ||
      size.includes("bebe") ||
      size.includes("0-") ||
      size.includes("1-2")
    );
  }

  if (filter === "Crianças") {
    const size = normalizeText(product.size);

    return (
      size.includes("3-4") ||
      size.includes("5-7") ||
      size.includes("8-10") ||
      size.includes("11-13")
    );
  }

  return true;
}

export function ProductsFeedScreen({
  products = [],
  onGoBack,
  onCreateProduct,
  onPressFavorite,
  onPressSolicitarTroca,
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return products.filter((product) => {
      const searchableContent = normalizeText(
        [
          product.title,
          product.category,
          product.size,
          product.condition,
          product.location,
          product.description,
        ]
          .filter(Boolean)
          .join(" ")
      );

      const matchesSearch =
        !normalizedSearch ||
        searchableContent.includes(normalizedSearch);

      return (
        matchesSearch &&
        matchesFilter(product, activeFilter)
      );
    });
  }, [products, search, activeFilter]);

  return (
    <SafeAreaView
      className="flex-1 bg-cream"
      edges={["top", "bottom"]}
    >
      <FlatList
        data={filteredProducts}
        keyExtractor={(product) => product.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-6 pb-28"
        ListHeaderComponent={
          <>
            <View className="mb-6 flex-row items-center justify-between pt-4">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onGoBack}
                className="h-11 w-11 items-center justify-center rounded-full bg-pink-dark"
                accessibilityRole="button"
                accessibilityLabel="Voltar para a página inicial"
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color="#ffffff"
                />
              </TouchableOpacity>

              <View className="flex-1 px-4">
                <Text className="font-heading text-xl text-ink-dark">
                  Explorar peças
                </Text>

                <Text className="font-body text-xs text-ink-light">
                  Encontre a próxima roupinha
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onCreateProduct}
                className="h-11 w-11 items-center justify-center rounded-full bg-pink-dark"
                accessibilityRole="button"
                accessibilityLabel="Cadastrar uma nova peça"
              >
                <Ionicons
                  name="add"
                  size={25}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>

            <View className="mb-5 flex-row items-center rounded-full border border-neutralDivider bg-white px-4 py-3">
              <Ionicons
                name="search-outline"
                size={19}
                color="#888888"
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar por peça, tamanho ou bairro"
                placeholderTextColor="#b0b0b0"
                returnKeyType="search"
                className="ml-2 flex-1 font-body text-sm text-ink-dark outline-none"
              />

              {search ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSearch("")}
                  accessibilityLabel="Limpar pesquisa"
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="#b0b0b0"
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <View className="mb-6 flex-row flex-wrap gap-2">
              {FILTERS.map((filter) => {
                const selected = activeFilter === filter;

                return (
                  <TouchableOpacity
                    key={filter}
                    activeOpacity={0.8}
                    onPress={() => setActiveFilter(filter)}
                    className={`rounded-full border px-4 py-2 ${
                      selected
                        ? "border-pink-dark bg-pink-dark"
                        : "border-neutralDivider bg-white"
                    }`}
                  >
                    <Text
                      className={`font-bodyMedium text-sm ${
                        selected
                          ? "text-white"
                          : "text-ink-mid"
                      }`}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="mb-5 flex-row items-end justify-between">
              <View>
                <Text className="font-body text-sm italic text-pink-medium">
                  disponíveis para troca
                </Text>

                <Text className="mt-1 font-heading text-xl text-ink-dark">
                  Feed de peças
                </Text>
              </View>

              <Text className="font-bodyMedium text-xs text-ink-light">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "resultado"
                  : "resultados"}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPressFavorite={onPressFavorite}
            onPressSolicitarTroca={onPressSolicitarTroca}
          />
        )}
        ListEmptyComponent={
          <View className="mt-8 items-center rounded-3xl bg-white px-6 py-12">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-pink-light">
              <Ionicons
                name="shirt-outline"
                size={36}
                color="#e05578"
              />
            </View>

            <Text className="mt-5 text-center font-heading text-xl text-ink-dark">
              Nenhuma peça encontrada
            </Text>

            <Text className="mt-2 text-center font-body text-sm leading-5 text-ink-mid">
              Cadastre a primeira peça ou altere os filtros da pesquisa.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onCreateProduct}
              className="mt-6 flex-row items-center gap-2 rounded-full bg-pink-dark px-6 py-4"
            >
              <Ionicons
                name="camera-outline"
                size={19}
                color="#ffffff"
              />

              <Text className="font-headingMedium text-sm text-white">
                Cadastrar peça
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onCreateProduct}
        className="absolute bottom-7 right-6 h-16 w-16 items-center justify-center rounded-full bg-pink-dark shadow-lg"
        accessibilityRole="button"
        accessibilityLabel="Cadastrar uma nova peça"
      >
        <Ionicons name="add" size={30} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}