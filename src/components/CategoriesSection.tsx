import { Image, Text, TouchableOpacity, View } from "react-native";

type Category = {
    id: string;
    label: string;
    imageUrl: string;
};

const CATEGORIES: Category[] = [
    {
        id: "camisetas",
        label: "Camisetas",
        imageUrl:
            "https://images.unsplash.com/photo-1552873816-636e43209957?w=160&h=160&fit=crop&q=80",
    },
    {
        id: "vestidos",
        label: "Vestidos",
        imageUrl:
            "https://images.unsplash.com/photo-1656337869317-2b906ee2b84d?w=160&h=160&fit=crop&q=80",
    },
    {
        id: "casacos",
        label: "Casacos",
        imageUrl:
            "https://images.unsplash.com/photo-1549847136-a17b5f4abbb2?w=160&h=160&fit=crop&q=80",
    },
    {
        id: "calcas",
        label: "Calças",
        imageUrl:
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=160&h=160&fit=crop&q=80",
    },
    {
        id: "macacoes",
        label: "Macacões",
        imageUrl:
            "https://images.unsplash.com/photo-1617331140180-e8262094733a?w=160&h=160&fit=crop&q=80",
    },
    {
        id: "bebes",
        label: "Bebês",
        imageUrl:
            "https://images.unsplash.com/photo-1526137847469-9ffd50fa0fa0?w=160&h=160&fit=crop&q=80",
    },
    {
        id: "inverno",
        label: "Inverno",
        imageUrl:
            "https://images.unsplash.com/photo-1520891601894-dedf729f78f8?w=160&h=160&fit=crop&q=80",
    },
    {
        id: "verao",
        label: "Verão",
        imageUrl:
            "https://images.unsplash.com/photo-1472586662442-3eec04b9dbda?w=160&h=160&fit=crop&q=80",
    },
    {
        id: "sapatos",
        label: "Sapatos",
        imageUrl:
            "https://images.unsplash.com/photo-1624958797025-b119e2fa2b53?w=160&h=160&fit=crop&q=80",
    },
];

type CategoriesSectionProps = {
    selectedId?: string;
    onSelectCategory?: (id: string) => void;
    onPressVerTodas?: () => void;
};

export function CategoriesSection({
    selectedId = "verao",
    onSelectCategory,
    onPressVerTodas,
}: CategoriesSectionProps) {
    return (
        <View className="bg-white px-6 py-10">
            <Text className="font-body text-sm italic text-pink-medium">
                navegue por
            </Text>

            <View className="mt-1 flex-row items-center justify-between">
                <Text className="font-heading text-xl text-ink-dark">
                    Comprar por Categoria
                </Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onPressVerTodas}
                    className="flex-row items-center gap-1"
                >
                    <Text className="font-headingMedium text-sm text-pink-dark">
                        Ver todas
                    </Text>
                    <Text className="font-headingMedium text-sm text-pink-dark">
                        {"›"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="mt-6 flex-row flex-wrap justify-between">
                {CATEGORIES.map((category) => {
                    const isSelected = category.id === selectedId;

                    return (
                        <TouchableOpacity
                            key={category.id}
                            activeOpacity={0.8}
                            onPress={() => onSelectCategory?.(category.id)}
                            className={`mb-5 w-[31%] items-center rounded-2xl border-2 p-2 outline-none ${isSelected
                                ? "border-pink-dark bg-pink-light"
                                : "border-transparent bg-neutralIcon"
                                }`}
                        >
                            <Image
                                source={{ uri: category.imageUrl }}
                                style={{ width: 56, height: 56, borderRadius: 28 }}
                            />
                            <Text
                                className={`mt-2 text-center text-xs ${isSelected
                                    ? "font-headingMedium text-pink-dark"
                                    : "font-bodyMedium text-ink-dark"
                                    }`}
                            >
                                {category.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}