import { MAX_LIVES } from "@/lib/game/config";

const HEART = ["01100110", "11111111", "11111111", "11111111", "01111110", "00111100", "00011000"];

function PixelHeart({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 8 7" width="22" height="19" shapeRendering="crispEdges" aria-hidden="true"
      className={on ? "" : "anim-break"} style={{ transition: "opacity .3s" }}>
      {HEART.flatMap((row, y) =>
        [...row].map((c, x) => c === "1" ? (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1"
            fill={on ? "var(--error)" : "none"} stroke={on ? "none" : "var(--border-strong)"} strokeWidth=".18" />
        ) : null),
      )}
    </svg>
  );
}

export default function LifeMeter({ lives }: { lives: number }) {
  return (
    <div role="img" aria-label={`${lives} of ${MAX_LIVES} lives left`} className="flex items-center gap-1.5">
      {Array.from({ length: MAX_LIVES }, (_, i) => <PixelHeart key={i} on={i < lives} />)}
      <span className="font-mono ml-1 text-xs text-muted-foreground" aria-hidden="true">{lives}/{MAX_LIVES}</span>
    </div>
  );
}
