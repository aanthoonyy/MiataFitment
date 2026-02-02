import { Route, Routes } from "react-router";
import { AuthProvider } from "./provider/AuthProvider";

import LandingPage from "@/pages/LandingPage";
import VisualizerPage from "@/pages/VisualizerPage";
import GalleryPage from "@/pages/GalleryPage";
import MarketPage from "@/pages/MarketPage";
import LoginPage from "@/components/LoginPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="visualizer" element={<VisualizerPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="marketplace" element={<MarketPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
