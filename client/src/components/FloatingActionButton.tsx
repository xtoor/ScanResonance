import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";

export default function FloatingActionButton() {
  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="fixed bottom-6 right-6">
      <Button
        onClick={handleToggleFullscreen}
        className="w-14 h-14 bg-bullish hover:bg-bullish/90 text-white rounded-full shadow-lg transition-colors flex items-center justify-center"
        data-testid="button-toggle-fullscreen"
      >
        <Expand className="text-lg w-5 h-5" />
      </Button>
    </div>
  );
}
