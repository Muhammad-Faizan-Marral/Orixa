"use client";

import Relic from "./game/Relic";

export default function CartridgeRelic() {
  return (
    <Relic
      id="lights"
      label="A half-buried cartridge"
      className="absolute -bottom-5 right-5 z-10 flex h-12 w-12 items-center justify-center"
    >
      {({ solved }) => (
        <svg
          viewBox="0 0 12 14"
          width="26"
          height="30"
          shapeRendering="crispEdges"
          aria-hidden="true"
          className={solved ? "" : "anim-beacon"}
        >
          <path d="M1 1h10v12H1z" fill={solved ? "var(--accent)" : "var(--border-strong)"} />
          <path d="M3 3h6v4H3z" fill="var(--background)" />
          <path d="M4 10h4v3H4z" fill="var(--background)" />
        </svg>
      )}
    </Relic>
  );
}