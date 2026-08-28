import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavBar } from "../components/NavBar";
import { FiltersBar } from "../components/FiltersBar";
import { HeroSection } from "../components/HeroSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { SeasonalCollectionsSection } from "../components/SeasonalCollectionsSection";
import { NewArrivalsSection } from "../components/NewArrivalsSection";
import { TrustSection } from "../components/TrustSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { NewsletterSection } from "../components/NewsletterSection";
import { Footer } from "../components/Footer";

type HomeScreenProps = {
  onExplorarTrocas?: () => void;
  onCadastrarPeca?: () => void;
};

export function HomeScreen({ onExplorarTrocas, onCadastrarPeca }: HomeScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
      <NavBar />
      <ScrollView contentContainerClassName="flex-grow" showsVerticalScrollIndicator={false}>
        <FiltersBar />
        <HeroSection
          onExplorarTrocas={onExplorarTrocas}
          onCadastrarPeca={onCadastrarPeca}
        />
        <HowItWorksSection />
        <CategoriesSection />
        <SeasonalCollectionsSection />
        <NewArrivalsSection />
        <TrustSection />
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}