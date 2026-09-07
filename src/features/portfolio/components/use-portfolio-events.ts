"use client";

import { recordPortfolioEvent } from "../../../actions/portfolio/record-portfolio-event";

export function trackProjectClick(portfolioId: string, projectTitle: string) {
  void recordPortfolioEvent({
    portfolioId,
    eventType: "project_click",
    label: projectTitle,
  });
}

export function trackContactClick(portfolioId: string) {
  void recordPortfolioEvent({
    portfolioId,    
    eventType: "contact_click",
  });
}
