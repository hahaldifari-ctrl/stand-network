interface NeedStatsProps {
  prayers: number;
  responses: number;
}

export function NeedStats({
  prayers,
  responses,
}: NeedStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stand-earth">
      <span className="inline-flex items-center gap-2">
        <span className="text-base">♡</span>
        {prayers} {prayers === 1 ? "prayer" : "prayers"}
      </span>

      <span className="inline-flex items-center gap-2">
        <span className="text-base">↗</span>
        {responses} {responses === 1 ? "response" : "responses"}
      </span>
    </div>
  );
}