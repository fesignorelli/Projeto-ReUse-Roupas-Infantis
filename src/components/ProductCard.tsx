import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type Product = {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  size: string;
  condition: string;
  tradesCount: number;
  isNew?: boolean;
  verified?: boolean;
};

type ProductCardProps = {
  product: Product;
  onPressFavorite?: (id: string) => void;
  onPressSolicitarTroca?: (id: string) => void;
};

export function ProductCard({
  product,
  onPressFavorite,
  onPressSolicitarTroca,
}: ProductCardProps) {
  return (
    <View className="mb-6 overflow-hidden rounded-3xl bg-white shadow-md">
      <View className="relative" style={{ aspectRatio: 4 / 3 }}>
        <Image
          source={{ uri: product.imageUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {product.isNew ? (
          <View className="absolute left-3 top-3 rounded-full bg-pink-dark px-3 py-1">
            <Text className="font-headingMedium text-xs text-white">Novo</Text>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressFavorite?.(product.id)}
          className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-white outline-none"
        >
          <Ionicons name="heart-outline" size={18} color="#e05578" />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <Text className="font-heading text-base text-ink-dark">
          {product.title}
        </Text>

        <View className="mt-1 flex-row items-center gap-1">
          <Ionicons name="location-outline" size={14} color="#888888" />
          <Text className="font-body text-xs text-ink-light">
            {product.location}
          </Text>
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          <View className="rounded-full bg-mint-light px-3 py-1">
            <Text className="font-bodyMedium text-xs text-mint-dark">
              {product.size}
            </Text>
          </View>
          <View className="rounded-full bg-blue-light px-3 py-1">
            <Text className="font-bodyMedium text-xs text-blue-dark">
              {product.condition}
            </Text>
          </View>
          {product.verified ? (
            <View className="flex-row items-center gap-1 rounded-full bg-mint-light px-3 py-1">
              <Ionicons name="checkmark-circle" size={12} color="#3d8b42" />
              <Text className="font-bodyMedium text-xs text-mint-dark">
                Verificado
              </Text>
            </View>
          ) : null}
        </View>

        <Text className="mt-2 font-body text-xs text-ink-light">
          {product.tradesCount} trocas realizadas
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onPressSolicitarTroca?.(product.id)}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-full bg-pink-dark py-3 outline-none"
        >
          <Ionicons name="swap-horizontal-outline" size={16} color="#ffffff" />
          <Text className="font-headingMedium text-sm text-white">
            Solicitar Troca
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}