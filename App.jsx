import "./global.css";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Alert, View } from "react-native";
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

import {
  addStoredProduct,
  getStoredProducts,
} from "./src/services/productStorage.js";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState("home");

  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

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

        Alert.alert(
          "Não foi possível carregar as peças",
          "Tente fechar e abrir o aplicativo novamente."
        );
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  const onLayoutRootView =
    useCallback(async () => {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
      }
    }, [fontsLoaded, fontError]);

  function goHome() {
    setCurrentScreen("home");
  }

  function openCreateProduct() {
    setCurrentScreen("create-product");
  }

  function openProductsFeed() {
    setCurrentScreen("products-feed");
  }

  async function addProduct(product) {
    try {
      const result =
        await addStoredProduct(product);

      setProducts(result.products);

      return result.product;
    } catch (error) {
      Alert.alert(
        "Não foi possível salvar",
        "Ocorreu um erro ao salvar a peça. Tente novamente."
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

  function handleRequestTrade(productId) {
    console.log(
      "Solicitar troca:",
      productId
    );

    // Alert.alert(
    //   "Solicitação de troca",
    //   "A funcionalidade de solicitação será adicionada em seguida."
    // );
  }

  function renderCurrentScreen() {
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
      />
    );
  }

  if (!fontsLoaded && !fontError) {
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
      </View>
    </SafeAreaProvider>
  );
}