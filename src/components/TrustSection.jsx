import { Text, TouchableOpacity, View } from "react-native";

const TRUST_FEATURES = [
  {
    emoji: "🔒",
    title: "Perfis verificados",
    description: "Todas as famílias passam por validação de cadastro.",
  },
  {
    emoji: "⭐",
    title: "Avaliações reais",
    description: "Após cada troca, ambas as partes avaliam a experiência.",
  },
  {
    emoji: "💬",
    title: "Chat seguro",
    description: "Converse dentro do app com histórico preservado.",
  },
  {
    emoji: "♻️",
    title: "Zero pagamento",
    description: "Nunca há dinheiro envolvido — só trocas diretas.",
  },
];

export function TrustSection({ onPressSaibaComoVerificamos }) {
  return (
    <View className="bg-cream">
      <View className="relative overflow-hidden bg-blue-medium p-6">
        <View className="absolute -right-8 -top-15 h-48 w-48 rounded-full bg-blue-dark opacity-30" />

        <View className="absolute -left-12 bottom-8 h-28 w-28 rounded-full bg-blue-dark opacity-20" />

        <Text className="font-body text-sm italic text-white/80">
          confiança é tudo
        </Text>

        <Text className="mt-2 font-heading text-2xl leading-8 text-white">
          Comunidade verificada pelos pais
        </Text>

        <Text className="mt-3 font-body text-sm leading-5 text-white/90">
          Cada família é avaliada após cada troca. Peças verificadas, conversas
          com histórico e trocas confirmadas — tudo para dar tranquilidade aos
          pais.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressSaibaComoVerificamos}
          className="mt-5 self-start rounded-full bg-white px-6 py-3 outline-none"
        >
          <Text className="font-headingMedium text-sm text-blue-dark">
            Saiba como verificamos
          </Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row flex-wrap justify-between gap-y-3">
          {TRUST_FEATURES.map((feature) => (
            <View
              key={feature.title}
              className="w-[48%] rounded-2xl bg-white/10 p-4"
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Text className="text-base">{feature.emoji}</Text>
              </View>

              <Text className="mt-3 font-headingMedium text-sm text-white">
                {feature.title}
              </Text>

              <Text className="mt-1 font-body text-xs leading-4 text-white/80">
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}