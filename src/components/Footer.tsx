import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

const SOCIALS: { name: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: "Instagram", icon: "logo-instagram" },
  { name: "Facebook", icon: "logo-facebook" },
  { name: "Pinterest", icon: "logo-pinterest" },
];

const EXPLORE_LINKS = [
  "Todas as peças",
  "Bebês",
  "Crianças",
  "Novas chegadas",
  "Verificados",
];

type FooterProps = {
  onPressSocial?: (social: string) => void;
  onPressLink?: (link: string) => void;
};

export function Footer({ onPressSocial, onPressLink }: FooterProps) {
  return (
    <View className="relative items-center overflow-hidden bg-ink-dark px-6 py-12">
      <View className="absolute -left-16 -top-10 h-40 w-40 rounded-full bg-pink-dark opacity-10" />
      <View className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-blue-dark opacity-10" />

      <Image
        source={require("../../assets/logo.png")}
        style={{ width: 72, height: 72 }}
        resizeMode="contain"
        accessibilityLabel="ReUse Roupas Infantis"
      />

      <Text className="mt-4 text-center font-heading text-2xl text-pink-medium">
        ReUse
      </Text>
      <Text className="mt-1 text-center font-body text-sm italic text-pink-light">
        Roupas Infantis
      </Text>

      <Text className="mt-4 max-w-xs text-center font-body text-sm leading-5 text-white/70">
        Plataforma de troca de roupas infantis entre famílias. Sustentável,
        segura e sem nenhum pagamento.
      </Text>

      <View className="mt-6 flex-row gap-3">
        {SOCIALS.map((social) => (
          <TouchableOpacity
            key={social.name}
            activeOpacity={0.7}
            onPress={() => onPressSocial?.(social.name)}
            className="h-11 w-11 items-center justify-center rounded-full bg-white/10 outline-none"
          >
            <Ionicons name={social.icon} size={18} color="#ffffff" />
          </TouchableOpacity>
        ))}
      </View>

      <View className="mt-8 w-full border-t border-white/10 pt-8">
        <Text className="text-center font-headingMedium text-sm tracking-widest text-white">
          EXPLORAR
        </Text>
        <View className="mt-4 flex-row flex-wrap justify-center gap-x-6 gap-y-3">
          {EXPLORE_LINKS.map((link) => (
            <TouchableOpacity
              key={link}
              activeOpacity={0.7}
              onPress={() => onPressLink?.(link)}
              className="outline-none"
            >
              <Text className="font-body text-sm text-white/70">{link}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mt-8 w-full border-t border-white/10 pt-6">
        <Text className="text-center font-body text-xs text-white/40">
          © 2026 ReUse. Feito com 💚 para famílias sustentáveis.
        </Text>
      </View>
    </View>
  );
}