"use client";
import { Component, type ReactNode } from "react";

/** If the WebGL scene throws (context lost, driver bug), show the CSS fallback instead of a blank hero. */
export default class CanvasBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
