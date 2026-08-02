import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores";

const Header = () => {
  const navigate = useNavigate();
  const toggleSettings = useUIStore((s) => s.toggleSettings);

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
          onClick={toggleSettings}
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};

export default Header;
