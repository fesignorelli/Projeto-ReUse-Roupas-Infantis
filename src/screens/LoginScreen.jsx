import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { login } from "../services/authService";

// Conta pública de testes da Platzi Fake Store API.
const DEMO_EMAIL = "john@mail.com";
const DEMO_PASSWORD = "changeme";

export function LoginScreen({
  reason,
  onGoBack,
  onLoginSuccess,
  onCreateAccount,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function fillDemoAccount() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setErrorMessage("");
  }

  async function handleLogin() {
    if (loading) {
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage("Informe o e-mail e a senha.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const user = await login(email, password);

      onLoginSuccess?.(user);
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
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#ffffff"
          />
        </TouchableOpacity>

        <View className="ml-3">
          <Text className="font-heading text-xl text-ink-dark">
            Entrar
          </Text>

          <Text className="font-body text-xs text-ink-light">
            Acesse sua conta ReUse
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="px-6 pb-12 pt-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center">
            <Image
              source={require("../../assets/logo.png")}
              style={{ width: 160, height: 80 }}
              resizeMode="contain"
              accessibilityLabel="ReUse Roupas Infantis"
            />
          </View>

          {reason ? (
            <View className="mt-6 flex-row items-center gap-2 rounded-2xl bg-pink-xlight px-4 py-3">
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#e05578"
              />

              <Text className="flex-1 font-bodyMedium text-sm text-pink-dark">
                {reason}
              </Text>
            </View>
          ) : null}

          <View className="mt-6">
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
              returnKeyType="next"
              className="mt-2 rounded-2xl border border-neutralDivider bg-white px-4 py-4 font-body text-sm text-ink-dark outline-none"
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
                placeholder="Sua senha"
                placeholderTextColor="#b0b0b0"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handleLogin}
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
            onPress={handleLogin}
            disabled={loading}
            className={`mt-8 flex-row items-center justify-center gap-2 rounded-full py-4 ${
              loading ? "bg-pink-medium" : "bg-pink-dark"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Entrar"
            accessibilityState={{ disabled: loading, busy: loading }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Ionicons
                name="log-in-outline"
                size={20}
                color="#ffffff"
              />
            )}

            <Text className="font-headingMedium text-base text-white">
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="font-body text-sm text-ink-mid">
              Ainda não tem conta?{" "}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCreateAccount}
              accessibilityRole="button"
              accessibilityLabel="Criar conta"
            >
              <Text className="font-bodySemibold text-sm text-pink-dark">
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 rounded-2xl border border-softBorder bg-white px-4 py-4">
            <Text className="font-headingMedium text-sm text-ink-dark">
              Conta de demonstração
            </Text>

            <Text className="mt-1 font-body text-xs leading-5 text-ink-mid">
              O login usa a API pública Platzi Fake Store. E-mail:{" "}
              {DEMO_EMAIL} · Senha: {DEMO_PASSWORD}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={fillDemoAccount}
              className="mt-3 self-start rounded-full bg-blue-xlight px-4 py-2"
              accessibilityRole="button"
              accessibilityLabel="Preencher com a conta de demonstração"
            >
              <Text className="font-bodySemibold text-xs text-blue-dark">
                Usar conta de demonstração
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
