import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type SeasonCard = {
  id: string;
  title: string;
  imageUrl: string;
  gradientColors: [string, string, string];
  titleClassName: string;
  buttonClassName: string;
};

const SEASONS: SeasonCard[] = [
  {
    id: "verao-colorido",
    title: "Verão Colorido",
    imageUrl:
      "https://images.unsplash.com/photo-1486190204932-5fcd44cb15b4?w=800&h=1000&fit=crop&q=80",
    gradientColors: [
      "rgba(224,85,120,0)",
      "rgba(224,85,120,0.25)",
      "rgba(224,85,120,0.9)",
    ],
    titleClassName: "text-white",
    buttonClassName: "bg-pink-dark",
  },
  {
    id: "primavera-floral",
    title: "Primavera Floral",
    imageUrl:
      "https://images.unsplash.com/photo-1590234089583-5d51cab15bea?w=800&h=1000&fit=crop&q=80",
    gradientColors: [
      "rgba(61,139,66,0)",
      "rgba(61,139,66,0.25)",
      "rgba(61,139,66,0.9)",
    ],
    titleClassName: "text-white",
    buttonClassName: "bg-mint-dark",
  },
  {
    id: "outono-aconchego",
    title: "Outono Aconchego",
    imageUrl:
      "https://images.unsplash.com/photo-1571722335489-7a9760b12571?w=800&h=1000&fit=crop&q=80",
    gradientColors: [
      "rgba(45,130,183,0)",
      "rgba(45,130,183,0.25)",
      "rgba(45,130,183,0.9)",
    ],
    titleClassName: "text-white",
    buttonClassName: "bg-blue-dark",
  },
  {
    id: "inverno-magico",
    title: "Inverno Mágico",
    imageUrl:
      "https://images.unsplash.com/photo-1633107603399-a085b3f38471?w=800&h=1000&fit=crop&q=80",
    gradientColors: [
      "rgba(224,85,120,0)",
      "rgba(224,85,120,0.25)",
      "rgba(224,85,120,0.9)",
    ],
    titleClassName: "text-white",
    buttonClassName: "bg-pink-dark",
  },
];

type SeasonalCollectionsSectionProps = {
  onPressVerTodas?: () => void;
  onExploreSeason?: (id: string) => void;
};

export function SeasonalCollectionsSection({
  onPressVerTodas,
  onExploreSeason,
}: SeasonalCollectionsSectionProps) {
  return (
    <View className="bg-white px-6 py-10">
      <Text className="font-body text-sm italic text-pink-medium">
        descubra
      </Text>

      <View className="mt-1 flex-row items-center justify-between">
        <Text className="font-heading text-xl text-ink-dark">
          Coleções por Estação
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

      <View className="mt-6 gap-6">
        {SEASONS.map((season) => (
          <View
            key={season.id}
            className="overflow-hidden rounded-3xl bg-neutralIcon"
            style={{ aspectRatio: 4 / 5 }}
          >
            <Image
              source={{ uri: season.imageUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <LinearGradient
              colors={season.gradientColors}
              locations={[0, 0.55, 1]}
              style={StyleSheet.absoluteFill}
            />

            <View className="absolute right-4 top-4">
              <Text className="text-lg text-white">{"✦"}</Text>
            </View>

            <View className="absolute bottom-5 left-5 right-5">
              <Text className={`font-heading text-xl ${season.titleClassName}`}>
                {season.title}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onExploreSeason?.(season.id)}
                className={`mt-3 self-start rounded-full px-5 py-2 outline-none ${season.buttonClassName}`}
              >
                <Text className="font-headingMedium text-sm text-white">
                  Explorar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}