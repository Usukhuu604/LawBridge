import FooterPage from "@/components/landing-page/FooterPage";
import HeroSection from "../../components/landing-page/HeroSection";
import RecommendLawyers from "../../components/landing-page/RecommendLawyers";
import ShowArticleFromLawyers from "../../components/landing-page/ShowArticleFromLawyers";

const MainPage = () => {
  return (
    <div className="min-h-screen flex flex-col border w-screen">
      <HeroSection />

      <main className="flex-grow">
        <RecommendLawyers />
        <ShowArticleFromLawyers />
      </main>

      <FooterPage />

      
    </div>
  );
};

export default MainPage;