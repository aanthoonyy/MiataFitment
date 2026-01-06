import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

export const CarModelContext = createContext<{
  model: string;
  setModel: (model: string) => void;
}>({
  model: "na",
  setModel: () => {},
});

export const SettingsContext = createContext<{
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}>({
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
});

export const useCarModel = () => useContext(CarModelContext);
export const useSettings = () => useContext(SettingsContext);

const Header = () => {
  const navigate = useNavigate();
  const { isSettingsOpen, setIsSettingsOpen } = useSettings();

  return (
    <>
      {/* Back button (top-left) */}
      <div className="fixed left-4 top-4 z-50">
        <Button
          variant="secondary"
          size="icon"
          className="
            h-10 w-10 rounded-full
            bg-zinc-100 shadow-md
            hover:bg-zinc-200
          "
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Settings button (top-right) */}
      <div className="fixed right-4 top-4 z-50">
        <Button
          variant="secondary"
          size="icon"
          className="
            h-10 w-10 rounded-full
            bg-zinc-100 shadow-md
            hover:bg-zinc-200
          "
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};

export default Header;
