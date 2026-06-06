import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;
Element.prototype.hasPointerCapture = function hasPointerCapture() {
  return false;
};
Element.prototype.releasePointerCapture = function releasePointerCapture() {};
Element.prototype.scrollIntoView = function scrollIntoView() {};

afterEach(() => {
  cleanup();
});
