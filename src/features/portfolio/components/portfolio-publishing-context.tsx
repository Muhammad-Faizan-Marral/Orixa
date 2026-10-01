"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type PortfolioPublishingContextValue = {
  isPublishing: boolean;
  setIsPublishing: Dispatch<SetStateAction<boolean>>;
  publishedOverride: boolean | null;
  setPublishedOverride: Dispatch<SetStateAction<boolean | null>>;
};

const PortfolioPublishingContext =
  createContext<PortfolioPublishingContextValue | null>(null);

export function PortfolioPublishingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedOverride, setPublishedOverride] = useState<boolean | null>(null);

  return (
    <PortfolioPublishingContext.Provider
      value={{
        isPublishing,
        setIsPublishing,
        publishedOverride,
        setPublishedOverride,
      }}
    >
      {children}
    </PortfolioPublishingContext.Provider>
  );
}

export function usePortfolioPublishing() {
  const context = useContext(PortfolioPublishingContext);
  if (!context) {
    throw new Error(
      "Portfolio publishing controls must be inside PortfolioPublishingProvider.",
    );
  }
  return context;
}