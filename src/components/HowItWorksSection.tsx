import { Text, View } from "react-native";

type Step = {
  number: string;
  title: string;
  description: string;
  cardClassName: string;
  badgeClassName: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Cadastre suas peças",
    description:
      "Fotografe e publique as roupas que suas crianças não usam mais. É grátis e rápido.",
    cardClassName: "bg-pink-light",
    badgeClassName: "bg-pink-dark",
  },
  {
    number: "02",
    title: "Encontre o que quer",
    description:
      "Navegue por centenas de peças próximas de você, filtradas por tamanho e idade.",
    cardClassName: "bg-blue-light",
    badgeClassName: "bg-blue-dark",
  },
  {
    number: "03",
    title: "Combine a troca",
    description:
      "Converse com a família, combinem um ponto de troca e finalizem sem nenhum pagamento.",
    cardClassName: "bg-mint-light",
    badgeClassName: "bg-mint-dark",
  },
  {
    number: "04",
    title: "Avalie e repita!",
    description:
      "Depois da troca, avaliem a experiência e ajudem a construir uma comunidade de confiança.",
    cardClassName: "border border-softBorder bg-pink-xlight",
    badgeClassName: "bg-pink-dark",
  },
];

export function HowItWorksSection() {
  return (
    <View className="bg-pink-xlight px-6 py-14">
      <Text className="text-center font-body text-sm italic text-pink-dark">
        simples assim
      </Text>
      <Text className="mt-2 text-center font-heading text-2xl text-ink-dark">
        Como funciona a troca?
      </Text>

      <View className="mt-8 gap-5">
        {STEPS.map((step) => (
          <View key={step.number} className={`rounded-3xl p-6 ${step.cardClassName}`}>
            <View
              className={`h-11 w-11 items-center justify-center rounded-2xl ${step.badgeClassName}`}
            >
              <Text className="font-headingMedium text-sm text-white">
                {step.number}
              </Text>
            </View>
            <Text className="mt-4 font-heading text-lg text-ink-dark">
              {step.title}
            </Text>
            <Text className="mt-2 font-body text-sm leading-5 text-ink-mid">
              {step.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}