import { Button } from "@/components/ui/button";
import { MousePointerClick } from "lucide-react";

interface ClickButtonProps {
  disabled: boolean;
  clicks: number;
  onClick: () => void;
}

export default function ClickButton({ disabled, clicks, onClick }: ClickButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        size="lg"
        disabled={disabled}
        onClick={onClick}
        className="h-48 w-48 rounded-full text-xl font-bold hover:scale-105 transition-transform active:scale-95"
        data-testid="button-click"
      >
        <MousePointerClick className="h-12 w-12" />
      </Button>
      <div className="text-center">
        <div className="text-sm text-muted-foreground">Your Clicks</div>
        <div className="text-3xl font-bold font-mono" data-testid="text-click-count">
          {clicks}
        </div>
      </div>
    </div>
  );
}
