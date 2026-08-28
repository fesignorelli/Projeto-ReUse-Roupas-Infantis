import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const NAV_LINKS = ["Início", "Explorar", "Coleções", "Como Funciona"];

type NavBarProps = {
  cartCount?: number;
  onPressLink?: (link: string) => void;
  onChangeSearch?: (value: string) => void;
  onPressUser?: () => void;
  onPressCart?: () => void;
};

export function NavBar({
  cartCount = 2,
  onPressLink,
  onChangeSearch,
  onPressUser,
  onPressCart,
}: NavBarProps) {
  const [activeLink, setActiveLink] = useState("Início");
  const [search, setSearch] = useState("");

  return (
    <View className="border-b border-neutralDivider bg-white">
      <View className="flex-row items-center justify-between px-6 pt-4">
        <View className="flex-row items-center gap-2">
          <Image
            source={require("../../assets/logo.png")}
            style={{ width: 100, height: 50 }}
            resizeMode="contain"
            accessibilityLabel="ReUse Roupas Infantis"
          />
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressUser}
            className="outline-none"
          >
            <Ionicons name="person-outline" size={22} color="#212121" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressCart}
            className="relative outline-none"
          >
            <Ionicons name="cart-outline" size={22} color="#212121" />
            {cartCount > 0 ? (
              <View className="absolute -right-1.5 -top-1.5 h-4 w-4 items-center justify-center rounded-full bg-pink-dark">
                <Text className="font-headingMedium text-[10px] text-white">
                  {cartCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-6 pt-4">
        <View className="flex-row items-center gap-2 rounded-full border border-neutralDivider bg-offwhite px-4 py-3">
          <Ionicons name="search-outline" size={18} color="#888888" />
          <TextInput
            value={search}
            onChangeText={(value) => {
              setSearch(value);
              onChangeSearch?.(value);
            }}
            placeholder="Buscar roupinhas, marcas..."
            placeholderTextColor="#b0b0b0"
            className="flex-1 font-body text-sm text-ink-dark outline-none"
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-6 px-6 pb-3 pt-4"
      >
        {NAV_LINKS.map((link) => {
          const isActive = link === activeLink;

          return (
            <TouchableOpacity
              key={link}
              activeOpacity={0.7}
              onPress={() => {
                setActiveLink(link);
                onPressLink?.(link);
              }}
              className="items-center outline-none"
            >
              <Text
                className={`text-sm ${
                  isActive
                    ? "font-headingMedium text-pink-dark"
                    : "font-bodyMedium text-ink-mid"
                }`}
              >
                {link}
              </Text>
              {isActive ? (
                <View className="mt-1.5 h-0.5 w-full rounded-full bg-pink-dark" />
              ) : (
                <View className="mt-1.5 h-0.5 w-full" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}