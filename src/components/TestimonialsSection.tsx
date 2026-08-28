import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  location: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "ana-paula-m",
    quote:
      "Incrível! Troquei 6 peças da minha bebê e consegui roupinhas novas sem gastar nada. Recomendo para toda mãe!",
    author: "Ana Paula M.",
    location: "Vila Madalena, SP",
  },
  {
    id: "carlos-souza",
    quote:
      "Fácil de usar e as famílias são super atenciosas. As roupas chegaram limpinhas e exatamente como descrito.",
    author: "Carlos Souza",
    location: "Lapa, SP",
  },
  {
    id: "renata-lima",
    quote:
      "Minha filha cresceu tão rápido que agora uso o ReUse sempre. É sustentável e economiza muito!",
    author: "Renata Lima",
    location: "Pinheiros, SP",
  },
];

export function TestimonialsSection() {
  return (
    <View className="bg-pink-light px-6 py-10">
      <View className="items-center">
        <Text className="font-body text-sm italic text-pink-dark">
          famílias felizes
        </Text>
        <Text className="mt-1 font-heading text-2xl text-ink-dark">
          Amadas pelos pais
        </Text>
      </View>

      <View className="mt-6 gap-4">
        {TESTIMONIALS.map((testimonial) => (
          <View
            key={testimonial.id}
            className="rounded-3xl bg-white p-5 shadow-md"
          >
            <Text className="text-base tracking-widest text-pink-medium">
              ★★★★★
            </Text>
            <Text className="mt-3 font-body text-sm italic leading-5 text-ink-mid">
              "{testimonial.quote}"
            </Text>
            <Text className="mt-4 font-headingMedium text-sm text-ink-dark">
              {testimonial.author}
            </Text>
            <View className="mt-1 flex-row items-center gap-1">
              <Ionicons name="location-outline" size={14} color="#888888" />
              <Text className="font-body text-xs text-ink-light">
                {testimonial.location}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}