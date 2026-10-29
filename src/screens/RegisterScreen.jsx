import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { register } from "../services/authService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A API aceita apenas letras e números na senha.
const PASSWORD_PATTERN = /^[a-zA-Z0-9]+$/;
const PASSWORD_MIN_LENGTH = 6;

const INPUT_CLASS =
  "mt-2 rounded-2xl border border-neutralDivider bg-white px-4 py-4 font-body text-sm text-ink-dark outline-none";

function validateForm({ name, email, password, confirmPassword }) {
  if (name.trim().length < 2) {
    return "Informe seu nome.";
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Informe um e-mail válido.";
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return "A senha deve conter apenas letras e números.";
  }

  if (password !== confirmPassword) {
    return "As senhas não coincidem.";
  }

  return null;
}

export function RegisterScreen({ onGoBack, onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister() {
    if (loading) {
      return;
    }

    const validationError = validateForm({
      name,
      email,
      password,
      confirmPassword,
    });

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const user = await register({ name, email, password });

      onRegisterSuccess?.(user);
    } catch (error) {
      setErrorMessage(
        error.message === "Network request failed"
          ? "Sem conexão com a internet. Tente novamente."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      className="flex-1 bg-cream"
      edges={["top", "bottom"]}
    >
      <View className="flex-row items-center border-b border-neutralDivider bg-white px-5 py-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onGoBack}
          className="h-11 w-11 items-center justify-center rounded-full bg-pink-dark"
          accessibilityRole="button"
          accessibilityLabel="Voltar para o login"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#ffffff"
          />
        </TouchableOpacity>

        <View className="ml-3">
          <Text className="font-heading text-xl text-ink-dark">
            Criar conta
          </Text>

          <Text className="font-body text-xs text-ink-light">
            Participe da comunidade ReUse
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="px-6 pb-12 pt-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text className="font-headingMedium text-sm text-ink-dark">
              Nome
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor="#b0b0b0"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              maxLength={60}
              className={INPUT_CLASS}
              accessibilityLabel="Nome"
            />
          </View>

          <View className="mt-5">
            <Text className="font-headingMedium text-sm text-ink-dark">
              E-mail
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#b0b0b0"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              className={INPUT_CLASS}
              accessibilityLabel="E-mail"
            />
          </View>

          <View className="mt-5">
            <Text className="font-headingMedium text-sm text-ink-dark">
              Senha
            </Text>

            <View className="mt-2 flex-row items-center rounded-2xl border border-neutralDivider bg-white pr-2">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo de 6 letras ou números"
                placeholderTextColor="#b0b0b0"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                className="flex-1 px-4 py-4 font-body text-sm text-ink-dark outline-none"
                accessibilityLabel="Senha"
              />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPassword((value) => !value)}
                className="h-10 w-10 items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Ocultar senha" : "Mostrar senha"
                }
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-5">
            <Text className="font-headingMedium text-sm text-ink-dark">
              Confirmar senha
            </Text>

            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Digite a senha novamente"
              placeholderTextColor="#b0b0b0"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={handleRegister}
              className={INPUT_CLASS}
              accessibilityLabel="Confirmar senha"
            />
          </View>

          {errorMessage ? (
            <Text
              className="mt-4 font-bodyMedium text-sm text-pink-dark"
              accessibilityLiveRegion="polite"
            >
              {errorMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleRegister}
            disabled={loading}
            className={`mt-8 flex-row items-center justify-center gap-2 rounded-full py-4 ${
              loading ? "bg-pink-medium" : "bg-pink-dark"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Criar conta"
            accessibilityState={{ disabled: loading, busy: loading }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Ionicons
                name="person-add-outline"
                size={20}
                color="#ffffff"
              />
            )}

            <Text className="font-headingMedium text-base text-white">
              {loading ? "Criando conta..." : "Criar conta"}
            </Text>
          </TouchableOpacity>

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="font-body text-sm text-ink-mid">
              Já tem conta?{" "}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onGoBack}
              accessibilityRole="button"
              accessibilityLabel="Entrar"
            >
              <Text className="font-bodySemibold text-sm text-pink-dark">
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
