import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function LogoutConfirmModal({
  visible,
  userName,
  loading = false,
  onCancel,
  onConfirm,
}) {
  const firstName = userName?.split(" ")[0];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={loading ? undefined : onCancel}
    >
      <Pressable
        onPress={loading ? undefined : onCancel}
        className="flex-1 items-center justify-center bg-black/40 px-6"
        accessibilityLabel="Fechar"
      >
        {/* Pressable interno impede que toques no cartão fechem o modal. */}
        <Pressable
          className="w-full max-w-sm items-center rounded-3xl bg-white px-6 pb-6 pt-8"
          accessibilityViewIsModal
        >
          <View className="h-16 w-16 items-center justify-center rounded-full bg-pink-xlight">
            <Ionicons
              name="log-out-outline"
              size={30}
              color="#e05578"
            />
          </View>

          <Text className="mt-4 text-center font-heading text-lg text-ink-dark">
            {firstName ? `Já vai, ${firstName}?` : "Já vai?"}
          </Text>

          <Text className="mt-2 text-center font-body text-sm leading-5 text-ink-mid">
            Deseja encerrar sua sessão? Você precisará entrar novamente
            para cadastrar peças e solicitar trocas.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onConfirm}
            disabled={loading}
            className={`mt-6 w-full flex-row items-center justify-center gap-2 rounded-full py-4 ${
              loading ? "bg-pink-medium" : "bg-pink-dark"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
            accessibilityState={{ disabled: loading, busy: loading }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : null}

            <Text className="font-headingMedium text-base text-white">
              {loading ? "Saindo..." : "Sair da conta"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onCancel}
            disabled={loading}
            className="mt-3 w-full items-center rounded-full bg-offwhite py-4"
            accessibilityRole="button"
            accessibilityLabel="Continuar conectado"
          >
            <Text className="font-headingMedium text-base text-ink-mid">
              Continuar conectado
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
