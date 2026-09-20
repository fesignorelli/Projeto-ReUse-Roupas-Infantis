import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export function NewsletterSection({ onSubmitEmail }) {
  const [email, setEmail] = useState("");

  return (
    <View className="relative items-center overflow-hidden bg-cream px-6 py-12">
      <View className="absolute bottom-6 right-8 h-36 w-36 rounded-full bg-neutralIcon" />

      <Text
        style={{ transform: [{ rotate: "90deg" }] }}
        className="absolute left-1 top-28 text-4xl text-pink-light"
      >
        {"〰"}
      </Text>

      <Text className="absolute right-10 top-6 text-2xl text-mint-medium">
        {"✦"}
      </Text>

      <Text className="font-body text-sm italic text-pink-medium">
        fique por dentro
      </Text>

      <Text className="mt-2 text-center font-heading text-2xl leading-8 text-ink-dark">
        Novas peças chegam todo dia!
      </Text>

      <Text className="mt-4 px-2 text-center font-body text-sm leading-5 text-ink-mid">
        Cadastre-se e receba avisos de novas roupinhas no seu bairro, além de
        dicas de moda infantil sustentável.
      </Text>

      <View className="mt-6 w-full flex-row items-center gap-2">
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Seu e-mail"
          placeholderTextColor="#b0b0b0"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          className="flex-1 rounded-full border border-pink-medium bg-white px-5 py-3 font-body text-sm text-ink-dark outline-none"
        />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSubmitEmail?.(email)}
          className="rounded-full bg-pink-dark px-6 py-3 outline-none"
        >
          <Text className="font-headingMedium text-sm text-white">
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}