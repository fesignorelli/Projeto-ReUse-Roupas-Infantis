import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

const FILTERS = [
  "Todos",
  "Bebês (0-2 A)",
  "Crianças (3-7A)",
  "Juvenil (8-13A)",
  "Inverno",
  "Verão",
  "Novas Chegadas",
];

export function FiltersBar({ onChangeFilter }) {
  const [activeFilter, setActiveFilter] = useState("Todos");

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="bg-cream"
      contentContainerClassName="gap-2 px-6 py-4"
    >
      {FILTERS.map((filter) => {
        const isActive = filter === activeFilter;

        return (
          <TouchableOpacity
            key={filter}
            activeOpacity={0.85}
            onPress={() => {
              setActiveFilter(filter);
              onChangeFilter?.(filter);
            }}
            className={`items-center justify-center rounded-full px-4 py-2 outline-none ${
              isActive
                ? "bg-pink-dark"
                : "border border-neutralDivider bg-white"
            }`}
          >
            <Text
              className={`text-sm ${
                isActive
                  ? "font-headingMedium text-white"
                  : "font-bodyMedium text-ink-dark"
              }`}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}