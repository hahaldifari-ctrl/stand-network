import { Badge } from "../ui/Badge";

interface NeedUrgencyProps {
  urgency: string;
  verified?: boolean;
}

const labels: Record<string, string> = {
  LOW: "Lower need",
  MEDIUM: "Medium need",
  HIGH: "High need",
  CRITICAL: "Critical need",
};

export function NeedUrgency({
  urgency,
  verified = false,
}: NeedUrgencyProps) {
  const normalized = urgency.toUpperCase();

  const tone =
    normalized === "CRITICAL"
      ? "red"
      : normalized === "HIGH"
        ? "gold"
        : normalized === "MEDIUM"
          ? "blue"
          : "green";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone={tone}>
        {normalized === "CRITICAL" && "● "}
        {labels[normalized] ?? urgency}
      </Badge>

      {verified && <Badge tone="green">✓ Verified</Badge>}
    </div>
  );
}