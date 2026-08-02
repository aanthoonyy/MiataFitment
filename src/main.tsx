import { Route, Routes } from "react-router";
import { AuthProvider } from "./provider/AuthProvider";

import LandingPage from "@/pages/LandingPage";
import VisualizerPage from "@/pages/VisualizerPage";
import LoginPage from "@/components/LoginPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="visualizer" element={<VisualizerPage />} />
        <Route path="login" element={<LoginPage />} />
        {/* Entered from a Supabase password-reset email, not in-app nav */}
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
