import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const PRODUCTS_KEY = "@reuse:products";

const PRODUCT_IMAGES_DIRECTORY =
  FileSystem.documentDirectory !== null
    ? `${FileSystem.documentDirectory}product-images/`
    : null;

async function ensureImagesDirectoryExists() {
  if (!PRODUCT_IMAGES_DIRECTORY || Platform.OS === "web") {
    return;
  }

  const directoryInfo = await FileSystem.getInfoAsync(
    PRODUCT_IMAGES_DIRECTORY
  );

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      PRODUCT_IMAGES_DIRECTORY,
      {
        intermediates: true,
      }
    );
  }
}

function getImageExtension(uri) {
  const uriWithoutQuery = uri.split("?")[0];

  const extension = uriWithoutQuery
    .split(".")
    .pop()
    ?.toLowerCase();

  const allowedExtensions = [
    "png",
    "webp",
    "heic",
    "jpeg",
    "jpg",
  ];

  if (allowedExtensions.includes(extension)) {
    return extension;
  }

  return "jpg";
}

async function persistProductImage(imageUri, productId) {
  if (
    !imageUri ||
    !PRODUCT_IMAGES_DIRECTORY ||
    Platform.OS === "web"
  ) {
    return imageUri;
  }

  await ensureImagesDirectoryExists();

  const extension = getImageExtension(imageUri);

  const destination =
    `${PRODUCT_IMAGES_DIRECTORY}${productId}.${extension}`;

  const existingImage =
    await FileSystem.getInfoAsync(destination);

  if (existingImage.exists) {
    await FileSystem.deleteAsync(destination, {
      idempotent: true,
    });
  }

  await FileSystem.copyAsync({
    from: imageUri,
    to: destination,
  });

  return destination;
}

export async function getStoredProducts() {
  try {
    const storedProducts =
      await AsyncStorage.getItem(PRODUCTS_KEY);

    if (!storedProducts) {
      return [];
    }

    const parsedProducts = JSON.parse(storedProducts);

    return Array.isArray(parsedProducts)
      ? parsedProducts
      : [];
  } catch (error) {
    console.error("Erro ao carregar peças:", error);
    return [];
  }
}

export async function addStoredProduct(product) {
  try {
    const currentProducts = await getStoredProducts();

    const permanentImageUri = await persistProductImage(
      product.imageUrl,
      product.id
    );

    const storedProduct = {
      ...product,
      imageUrl: permanentImageUri,
    };

    const updatedProducts = [
      storedProduct,
      ...currentProducts.filter(
        (currentProduct) =>
          currentProduct.id !== product.id
      ),
    ];

    await AsyncStorage.setItem(
      PRODUCTS_KEY,
      JSON.stringify(updatedProducts)
    );

    return {
      product: storedProduct,
      products: updatedProducts,
    };
  } catch (error) {
    console.error("Erro ao salvar peça:", error);
    throw error;
  }
}

export async function removeStoredProduct(productId) {
  try {
    const currentProducts = await getStoredProducts();

    const productToRemove = currentProducts.find(
      (product) => product.id === productId
    );

    const updatedProducts = currentProducts.filter(
      (product) => product.id !== productId
    );

    await AsyncStorage.setItem(
      PRODUCTS_KEY,
      JSON.stringify(updatedProducts)
    );

    if (
      productToRemove?.imageUrl &&
      PRODUCT_IMAGES_DIRECTORY &&
      productToRemove.imageUrl.startsWith(
        PRODUCT_IMAGES_DIRECTORY
      )
    ) {
      await FileSystem.deleteAsync(
        productToRemove.imageUrl,
        {
          idempotent: true,
        }
      );
    }

    return updatedProducts;
  } catch (error) {
    console.error("Erro ao excluir peça:", error);
    throw error;
  }
}

export async function clearStoredProducts() {
  try {
    const currentProducts = await getStoredProducts();

    for (const product of currentProducts) {
      if (
        product.imageUrl &&
        PRODUCT_IMAGES_DIRECTORY &&
        product.imageUrl.startsWith(
          PRODUCT_IMAGES_DIRECTORY
        )
      ) {
        await FileSystem.deleteAsync(product.imageUrl, {
          idempotent: true,
        });
      }
    }

    await AsyncStorage.removeItem(PRODUCTS_KEY);
  } catch (error) {
    console.error("Erro ao limpar peças:", error);
    throw error;
  }
}