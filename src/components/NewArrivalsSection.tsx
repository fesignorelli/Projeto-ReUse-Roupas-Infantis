import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Product, ProductCard } from "./ProductCard";

const FILTERS = [
  "Todos",
  "Bebês",
  "2-4 anos",
  "5-8 anos",
  "9-13 anos",
  "Verificados",
  "Novas",
];

const PRODUCTS: Product[] = [
  {
    id: "body-listrado-branco",
    title: "Body Listrado Branco",
    location: "Vila Madalena, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1771098124556-0d22d2ab3881?w=500&h=375&fit=crop&q=80",
    size: "Tam: P (0-3m)",
    condition: "Ótimo estado",
    tradesCount: 0,
    isNew: true,
    verified: true,
  },
  {
    id: "macacao-rosa-floral",
    title: "Macacão Rosa Floral",
    location: "Lapa, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=500&h=375&fit=crop&q=80",
    size: "Tam: M (3-6m)",
    condition: "Bem conservado",
    tradesCount: 2,
    verified: true,
  },
  {
    id: "vestido-verao-lilas",
    title: "Vestido Verão Lilás",
    location: "Pinheiros, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1486190204932-5fcd44cb15b4?w=500&h=375&fit=crop&q=80",
    size: "Tam: 4-5 anos",
    condition: "Ótimo estado",
    tradesCount: 1,
    isNew: true,
  },
  {
    id: "camiseta-tie-dye",
    title: "Camiseta Tie-Dye",
    location: "Moema, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1590234089583-5d51cab15bea?w=500&h=375&fit=crop&q=80",
    size: "Tam: 6-7 anos",
    condition: "Bem conservado",
    tradesCount: 5,
    verified: true,
  },
  {
    id: "conjunto-jeans",
    title: "Conjunto Jeans",
    location: "Ipiranga, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=500&h=375&fit=crop&q=80",
    size: "Tam: 8-9 anos",
    condition: "Usado com cuidado",
    tradesCount: 3,
    verified: true,
  },
  {
    id: "pijama-ursinho",
    title: "Pijama Ursinho",
    location: "Santana, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1713952852616-1827a2f0cf51?w=500&h=375&fit=crop&q=80",
    size: "Tam: 2-3 anos",
    condition: "Ótimo estado",
    tradesCount: 0,
    isNew: true,
  },
];

type NewArrivalsSectionProps = {
  onPressVerTodas?: () => void;
  onPressFavorite?: (id: string) => void;
  onPressSolicitarTroca?: (id: string) => void;
};

export function NewArrivalsSection({
  onPressVerTodas,
  onPressFavorite,
  onPressSolicitarTroca,
}: NewArrivalsSectionProps) {
  const [activeFilter, setActiveFilter] = useState("Todos");

  return (
    <View className="bg-cream py-10">
      <View className="px-6">
        <Text className="font-body text-sm italic text-pink-medium">
          recém adicionadas
        </Text>

        <View className="mt-1 flex-row items-center justify-between">
          <Text className="font-heading text-xl text-ink-dark">
            Novas Chegadas
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressVerTodas}
            className="flex-row items-center gap-1 outline-none"
          >
            <Text className="font-headingMedium text-sm text-pink-dark">
              Ver todas
            </Text>
            <Text className="font-headingMedium text-sm text-pink-dark">
              {"›"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-6 py-4"
      >
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter;

          return (
            <TouchableOpacity
              key={filter}
              activeOpacity={0.85}
              onPress={() => setActiveFilter(filter)}
              className={`items-center justify-center rounded-full px-4 py-2 outline-none ${
                isActive
                  ? "bg-pink-dark"
                  : "border border-neutralDivider bg-white"
              }`}
            >
              <Text
                className={`text-sm ${
                  isActive
                    ? "font-headingMedium text-white"
                    : "font-bodyMedium text-ink-dark"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View className="px-6">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPressFavorite={onPressFavorite}
            onPressSolicitarTroca={onPressSolicitarTroca}
          />
        ))}

        <View className="relative">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPressVerTodas}
            className="items-center rounded-full border-2 border-pink-dark py-4 outline-none"
          >
            <Text className="font-headingMedium text-base text-pink-dark">
              Ver todas as peças disponíveis
            </Text>
          </TouchableOpacity>
          <Text className="absolute -bottom-4 left-2 text-lg text-mint-medium">
            {"✦"}
          </Text>
        </View>
      </View>
    </View>
  );
}