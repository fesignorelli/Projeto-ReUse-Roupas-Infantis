import { Image, Text, TouchableOpacity, View } from "react-native";

type HeroSectionProps = {
  onExplorarTrocas?: () => void;
  onCadastrarPeca?: () => void;
};

export function HeroSection({ onExplorarTrocas, onCadastrarPeca }: HeroSectionProps) {
  return (
    <View className="overflow-hidden bg-cream px-8 py-12">
      <View className="absolute -left-16 -top-8 h-48 w-48 rounded-full bg-blue-light opacity-40" />
      <View className="absolute -right-20 top-24 h-40 w-40 rounded-full bg-mint-light opacity-50" />
      <View className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-pink-light opacity-40" />

      <View className="items-center">
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 220, height: 147 }}
          resizeMode="contain"
          accessibilityLabel="ReUse Roupas Infantis"
        />

        <Text className="mt-6 text-center font-heading text-[30px] leading-[38px] text-ink-dark">
          {"Dê uma nova vida\nàs roupinhas\nque não servem mais."}
        </Text>

        <Text className="mt-5 max-w-xs text-center font-body text-base leading-6 text-ink-mid">
          Conectamos famílias para trocar roupas infantis de 0 a 13 anos.
          Sem pagamento — apenas troca direta, sustentável e com confiança.
        </Text>

        <View className="mt-10 w-full items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onExplorarTrocas}
            className="w-full max-w-xs items-center rounded-full bg-pink-dark py-4 shadow-md"
          >
            <Text className="font-headingMedium text-base text-white">
              Explorar trocas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onCadastrarPeca}
            className="w-full max-w-xs items-center rounded-full border-2 border-blue-dark bg-white py-4"
          >
            <Text className="font-headingMedium text-base text-blue-dark">
              Cadastrar peça
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}