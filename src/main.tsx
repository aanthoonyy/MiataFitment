import MainComponent from "./mainComponent";
import { Route, Routes } from "react-router";
import LandingPage from "./landingPage";
import GalleryPage from "./galleryPage";
import MarketplacePage from "./marketPage";
import LoginPage from "./components/LoginPage";
import { AuthProvider } from "./provider/AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="visualizer" element={<MainComponent />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
