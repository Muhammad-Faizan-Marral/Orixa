"use client";

import { Component, type ReactNode } from "react";

/**
 * R3F's <Canvas> re-throws WebGL context-creation failures to the nearest React boundary.
 * With no boundary above it (the old tree), one failing GPU/driver unmounts the whole page.
 * Here the scene simply drops out; <main> already paints the film's background colour and the
 * HTML acts + film overlay keep working.
 */
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[cinematic] 3D scene disabled:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
