import MainComponent from "./components/visualizer/mainComponent";
import { Route, Routes } from "react-router";
import LandingPage from "./components/pages/landingPage";
import GalleryPage from "./components/pages/galleryPage";
import MarketplacePage from "./components/pages/marketPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="visualizer" element={<MainComponent />} />
      <Route path="gallery" element={<GalleryPage />} />
      <Route path="marketplace" element={<MarketplacePage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
