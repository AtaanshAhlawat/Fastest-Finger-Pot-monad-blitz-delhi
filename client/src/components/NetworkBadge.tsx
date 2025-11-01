import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

interface NetworkBadgeProps {
  network: string;
  connected: boolean;
}

export default function NetworkBadge({ network, connected }: NetworkBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1.5" data-testid="badge-network">
      <Circle className={`h-2 w-2 fill-current ${connected ? 'text-green-500' : 'text-gray-400'}`} />
      {network}
    </Badge>
  );
}
