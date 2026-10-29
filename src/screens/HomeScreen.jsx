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

export function HomeScreen({
  products = [],
  onExplorarTrocas,
  onCadastrarPeca,
  onAbrirPerfil,
  onSolicitarTroca,
}) {
  function handleNavLink(link) {
    if (link === "Explorar") {
      onExplorarTrocas?.();
    }
  }

  return (
    <SafeAreaView
      className="flex-1 bg-cream"
      edges={["top", "bottom"]}
    >
      <NavBar
        onPressLink={handleNavLink}
        onPressUser={onAbrirPerfil}
      />

      <ScrollView
        contentContainerClassName="flex-grow"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FiltersBar />

        <HeroSection
          onExplorarTrocas={onExplorarTrocas}
          onCadastrarPeca={onCadastrarPeca}
        />

        <HowItWorksSection />

        <CategoriesSection
          onPressVerTodas={onExplorarTrocas}
          onSelectCategory={(categoryId) => {
            console.log("Categoria selecionada:", categoryId);
          }}
        />

        <SeasonalCollectionsSection
          onPressVerTodas={onExplorarTrocas}
          onExploreSeason={(seasonId) => {
            console.log("Estação selecionada:", seasonId);
            onExplorarTrocas?.();
          }}
        />

        <NewArrivalsSection
          products={products}
          onPressVerTodas={onExplorarTrocas}
          onPressFavorite={(productId) => {
            console.log("Favoritar peça:", productId);
          }}
          onPressSolicitarTroca={onSolicitarTroca}
        />

        <TrustSection />

        <TestimonialsSection />

        <NewsletterSection />

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}