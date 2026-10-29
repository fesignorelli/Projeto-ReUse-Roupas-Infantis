import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  SessionExpiredError,
  getProfile,
} from "../services/authService";
import { LogoutConfirmModal } from "../components/LogoutConfirmModal";
import { getStoredTrades } from "../services/tradeStorage";
import { formatKgCo2e } from "../services/co2Service";
import { showAlert } from "../utils/showAlert";

function formatSavedAt(timestamp) {
  if (!timestamp) {
    return "";
  }

  return new Date(timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({ icon, label, value }) {
  if (!value) {
    return null;
  }

  return (
    <View className="flex-row items-center gap-3 border-b border-softBorder py-3">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-mint-xlight">
        <Ionicons name={icon} size={18} color="#3d8b42" />
      </View>

      <View className="flex-1">
        <Text className="font-body text-xs text-ink-light">
          {label}
        </Text>

        <Text className="font-bodyMedium text-sm text-ink-dark">
          {value}
        </Text>
      </View>
    </View>
  );
}

export function ProfileScreen({
  user: initialUser,
  onGoBack,
  onLogout,
  onSessionExpired,
  onOpenTrade,
}) {
  const [user, setUser] = useState(initialUser);
  const [fromCache, setFromCache] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [loading, setLoading] = useState(!initialUser);
  const [refreshing, setRefreshing] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [trades, setTrades] = useState([]);

  async function loadProfile({ forceRefresh = false } = {}) {
    try {
      const result = await getProfile({ forceRefresh });

      setUser(result.user);
      setFromCache(result.fromCache);
      setSavedAt(result.savedAt);
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        onSessionExpired?.();
        return;
      }

      showAlert(
        "Não foi possível atualizar",
        "Verifique sua conexão e tente novamente."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadProfile();
    getStoredTrades().then(setTrades);
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    loadProfile({ forceRefresh: true });
  }

  async function handleConfirmLogout() {
    try {
      setLoggingOut(true);
      await onLogout?.();
    } finally {
      setLoggingOut(false);
      setLogoutModalVisible(false);
    }
  }

  const confirmedTrades = trades.filter(
    (trade) => trade.status === "confirmada"
  );

  const totalCo2SavedKg = confirmedTrades.reduce(
    (total, trade) => total + (trade.co2SavedKg ?? 0),
    0
  );

  const memberSince = user?.creationAt
    ? new Date(user.creationAt).toLocaleDateString("pt-BR")
    : "";

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
          accessibilityLabel="Voltar para o início"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#ffffff"
          />
        </TouchableOpacity>

        <View className="ml-3">
          <Text className="font-heading text-xl text-ink-dark">
            Meu perfil
          </Text>

          <Text className="font-body text-xs text-ink-light">
            Dados da sua conta
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#e05578" />
        </View>
      ) : (
        <ScrollView
          contentContainerClassName="px-6 pb-12 pt-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#e05578"
              colors={["#e05578"]}
            />
          }
        >
          <View className="items-center rounded-3xl bg-white px-6 py-6">
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={{ width: 88, height: 88 }}
                className="rounded-full bg-pink-xlight"
                accessibilityLabel={`Foto de ${user.name}`}
              />
            ) : (
              <View className="h-[88px] w-[88px] items-center justify-center rounded-full bg-pink-xlight">
                <Ionicons
                  name="person-outline"
                  size={40}
                  color="#e05578"
                />
              </View>
            )}

            <Text className="mt-3 font-heading text-lg text-ink-dark">
              {user?.name}
            </Text>

            <Text className="font-body text-sm text-ink-light">
              {user?.email}
            </Text>
          </View>

          <View
            className={`mt-4 flex-row items-center gap-2 rounded-2xl px-4 py-3 ${
              fromCache ? "bg-blue-xlight" : "bg-mint-xlight"
            }`}
          >
            <Ionicons
              name={fromCache ? "save-outline" : "cloud-done-outline"}
              size={18}
              color={fromCache ? "#2d82b7" : "#3d8b42"}
            />

            <Text
              className={`flex-1 font-body text-xs ${
                fromCache ? "text-blue-dark" : "text-mint-dark"
              }`}
            >
              {fromCache
                ? `Dados do cache local (salvos em ${formatSavedAt(savedAt)}). Puxe para atualizar.`
                : "Dados atualizados agora pela API."}
            </Text>
          </View>

          <View className="mt-4 rounded-3xl bg-white px-5 py-2">
            <InfoRow
              icon="mail-outline"
              label="E-mail"
              value={user?.email}
            />

            <InfoRow
              icon="calendar-outline"
              label="Membro desde"
              value={memberSince}
            />
          </View>

          <View className="mt-4 flex-row gap-3">
            <View className="flex-1 rounded-3xl bg-mint-xlight px-4 py-4">
              <Ionicons name="leaf-outline" size={20} color="#3d8b42" />

              <Text className="mt-2 font-heading text-lg text-mint-dark">
                {formatKgCo2e(totalCo2SavedKg)}
              </Text>

              <Text className="font-body text-xs text-mint-dark">
                de CO₂e evitados
              </Text>
            </View>

            <View className="flex-1 rounded-3xl bg-pink-xlight px-4 py-4">
              <Ionicons
                name="swap-horizontal-outline"
                size={20}
                color="#e05578"
              />

              <Text className="mt-2 font-heading text-lg text-pink-dark">
                {confirmedTrades.length}
              </Text>

              <Text className="font-body text-xs text-pink-dark">
                {confirmedTrades.length === 1
                  ? "troca confirmada"
                  : "trocas confirmadas"}
              </Text>
            </View>
          </View>

          <Text className="mt-6 font-heading text-base text-ink-dark">
            Minhas trocas
          </Text>

          {trades.length === 0 ? (
            <Text className="mt-2 font-body text-sm text-ink-light">
              Você ainda não solicitou nenhuma troca.
            </Text>
          ) : (
            <View className="mt-2 rounded-3xl bg-white px-5 py-1">
              {trades.map((trade) => {
                const confirmed = trade.status === "confirmada";

                return (
                  <TouchableOpacity
                    key={trade.id}
                    activeOpacity={0.7}
                    onPress={() => onOpenTrade?.(trade.id)}
                    className="flex-row items-center gap-3 border-b border-softBorder py-3"
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir troca de ${trade.productTitle}`}
                  >
                    <Ionicons
                      name={confirmed ? "checkmark-circle" : "time-outline"}
                      size={22}
                      color={confirmed ? "#3d8b42" : "#e05578"}
                    />

                    <View className="flex-1">
                      <Text className="font-bodyMedium text-sm text-ink-dark">
                        {trade.productTitle}
                      </Text>

                      <Text className="font-body text-xs text-ink-light">
                        {confirmed ? "Confirmada" : "Aguardando encontro"}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#888888"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLogoutModalVisible(true)}
            className="mt-8 flex-row items-center justify-center gap-2 rounded-full border border-pink-dark bg-white py-4"
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#e05578"
            />

            <Text className="font-headingMedium text-base text-pink-dark">
              Sair da conta
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <LogoutConfirmModal
        visible={logoutModalVisible}
        userName={user?.name}
        loading={loggingOut}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={handleConfirmLogout}
      />
    </SafeAreaView>
  );
}
