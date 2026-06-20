import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DonorBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn("border-amber-200 bg-amber-50 text-amber-900", className)}
      variant="outline"
    >
      <Heart className="fill-amber-500 text-amber-500" />
      Donor
    </Badge>
  );
}
