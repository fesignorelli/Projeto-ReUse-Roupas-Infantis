import "./global.css";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  useFonts,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import {
  HindMadurai_400Regular,
  HindMadurai_500Medium,
  HindMadurai_600SemiBold,
} from "@expo-google-fonts/hind-madurai";

import { HomeScreen } from "./src/screens/HomeScreen";
import { CreateProductScreen } from "./src/screens/CreateProductScreen";
import { ProductsFeedScreen } from "./src/screens/ProductsFeedScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { TradeDetailScreen } from "./src/screens/TradeDetailScreen";
import { ScanQrScreen } from "./src/screens/ScanQrScreen";

import {
  addStoredProduct,
  getStoredProducts,
} from "./src/services/productStorage.js";

import {
  logout,
  restoreSession,
} from "./src/services/authService.js";

import { createTrade } from "./src/services/tradeStorage.js";
import { showAlert } from "./src/utils/showAlert.js";
import { AlertHost } from "./src/components/AlertHost";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState("home");

  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [user, setUser] = useState(null);

  const [restoringSession, setRestoringSession] =
    useState(true);

  // Para onde ir depois do login e por que ele foi pedido.
  const [loginRequest, setLoginRequest] =
    useState(null);

  const [selectedTradeId, setSelectedTradeId] =
    useState(null);

  // Tela para onde o "voltar" do detalhe da troca leva.
  const [tradeReturnTo, setTradeReturnTo] =
    useState("products-feed");

  const [fontsLoaded, fontError] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    HindMadurai_400Regular,
    HindMadurai_500Medium,
    HindMadurai_600SemiBold,
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        const storedProducts =
          await getStoredProducts();

        setProducts(storedProducts);
      } catch (error) {
        console.error(
          "Erro ao carregar peças:",
          error
        );

        showAlert(
          "Não foi possível carregar as peças",
          "Tente fechar e abrir o aplicativo novamente.",
          undefined,
          { type: "error" }
        );
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadSession() {
      try {
        const sessionUser = await restoreSession();

        setUser(sessionUser);
      } finally {
        setRestoringSession(false);
      }
    }

    loadSession();
  }, []);

  const onLayoutRootView =
    useCallback(async () => {
      if ((fontsLoaded || fontError) && !restoringSession) {
        await SplashScreen.hideAsync();
      }
    }, [fontsLoaded, fontError, restoringSession]);

  function goHome() {
    setCurrentScreen("home");
  }

  // Telas que precisam de login passam por aqui.
  function openProtectedScreen(screen, reason, returnTo = screen) {
    if (user) {
      setCurrentScreen(screen);
      return;
    }

    setLoginRequest({ reason, returnTo });
    setCurrentScreen("login");
  }

  function openCreateProduct() {
    openProtectedScreen(
      "create-product",
      "Entre na sua conta para cadastrar uma peça."
    );
  }

  function openProfile() {
    openProtectedScreen("profile");
  }

  function handleLoginSuccess(loggedUser) {
    setUser(loggedUser);
    setCurrentScreen(loginRequest?.returnTo ?? "home");
    setLoginRequest(null);
  }

  function handleCancelLogin() {
    setLoginRequest(null);
    goHome();
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    } finally {
      setUser(null);
      goHome();
    }
  }

  function handleSessionExpired() {
    setUser(null);
    setLoginRequest({
      reason: "Sua sessão expirou. Entre novamente.",
      returnTo: currentScreen,
    });
    setCurrentScreen("login");
  }

  function openProductsFeed() {
    setCurrentScreen("products-feed");
  }

  async function addProduct(product) {
    try {
      const result =
        await addStoredProduct({
          ...product,
          ownerId: user?.id,
          ownerName: user?.name,
        });

      setProducts(result.products);

      return result.product;
    } catch (error) {
      showAlert(
        "Não foi possível salvar",
        "Ocorreu um erro ao salvar a peça. Tente novamente.",
        undefined,
        { type: "error" }
      );

      throw error;
    }
  }

  function handleFavorite(productId) {
    console.log(
      "Favoritar peça:",
      productId
    );
  }

  function openTradeDetail(tradeId, returnTo) {
    setSelectedTradeId(tradeId);
    setTradeReturnTo(returnTo);
    setCurrentScreen("trade-detail");
  }

  async function handleRequestTrade(productId, product) {
    if (!user) {
      setLoginRequest({
        reason: "Entre na sua conta para solicitar uma troca.",
        returnTo: currentScreen,
      });
      setCurrentScreen("login");
      return;
    }

    const tradeProduct =
      product ??
      products.find((item) => item.id === productId);

    if (!tradeProduct) {
      return;
    }

    try {
      const trade = await createTrade(tradeProduct, user);

      openTradeDetail(trade.id, currentScreen);
    } catch (error) {
      console.error("Erro ao solicitar troca:", error);

      showAlert(
        "Não foi possível solicitar a troca",
        "Tente novamente em alguns instantes.",
        undefined,
        { type: "error" }
      );
    }
  }

  function renderCurrentScreen() {
    if (currentScreen === "trade-detail" && user) {
      return (
        <TradeDetailScreen
          key={selectedTradeId}
          tradeId={selectedTradeId}
          onGoBack={() => setCurrentScreen(tradeReturnTo)}
          onScanQr={() => setCurrentScreen("scan-qr")}
        />
      );
    }

    if (currentScreen === "scan-qr" && user) {
      return (
        <ScanQrScreen
          user={user}
          onGoBack={() => setCurrentScreen("trade-detail")}
          onTradeConfirmed={(trade) =>
            openTradeDetail(trade.id, "profile")
          }
        />
      );
    }

    if (currentScreen === "login") {
      return (
        <LoginScreen
          reason={loginRequest?.reason}
          onGoBack={handleCancelLogin}
          onLoginSuccess={handleLoginSuccess}
          onCreateAccount={() => setCurrentScreen("register")}
        />
      );
    }

    if (currentScreen === "register") {
      return (
        <RegisterScreen
          onGoBack={() => setCurrentScreen("login")}
          onRegisterSuccess={handleLoginSuccess}
        />
      );
    }

    if (currentScreen === "profile" && user) {
      return (
        <ProfileScreen
          user={user}
          onGoBack={goHome}
          onLogout={handleLogout}
          onSessionExpired={handleSessionExpired}
          onOpenTrade={(tradeId) =>
            openTradeDetail(tradeId, "profile")
          }
        />
      );
    }

    if (currentScreen === "create-product") {
      return (
        <CreateProductScreen
          onGoBack={openProductsFeed}
          onSubmitProduct={addProduct}
        />
      );
    }

    if (currentScreen === "products-feed") {
      return (
        <ProductsFeedScreen
          products={products}
          loading={loadingProducts}
          onGoBack={goHome}
          onCreateProduct={openCreateProduct}
          onPressFavorite={handleFavorite}
          onPressSolicitarTroca={
            handleRequestTrade
          }
        />
      );
    }

    return (
      <HomeScreen
        products={products}
        onExplorarTrocas={openProductsFeed}
        onCadastrarPeca={openCreateProduct}
        onAbrirPerfil={openProfile}
        onSolicitarTroca={handleRequestTrade}
      />
    );
  }

  if ((!fontsLoaded && !fontError) || restoringSession) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View
        className="flex-1 bg-cream"
        onLayout={onLayoutRootView}
      >
        <StatusBar style="dark" />

        {renderCurrentScreen()}

        <AlertHost />
      </View>
    </SafeAreaProvider>
  );
}