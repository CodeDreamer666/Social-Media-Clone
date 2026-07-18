"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function useDialogFocus<Element extends HTMLElement>(
  onEscape?: () => void,
) {
  const dialogRef = useRef<Element | null>(null);
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialog = dialogRef.current;

    if (!dialog) return;

    const getFocusableElements = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const focusableElements = getFocusableElements();
    const initialFocus =
      dialog.querySelector<HTMLElement>("[autofocus]") ??
      focusableElements[0] ??
      dialog;
    initialFocus.focus();

    function handleKeyDown(event: KeyboardEvent) {
      const currentOnEscape = onEscapeRef.current;

      if (event.key === "Escape" && currentOnEscape) {
        event.preventDefault();
        currentOnEscape();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const currentFocusableElements = getFocusableElements();

      if (currentFocusableElements.length === 0) {
        return;
      }

      const firstElement = currentFocusableElements[0];
      const lastElement = currentFocusableElements.at(-1);

      if (
        event.shiftKey &&
        document.activeElement === firstElement &&
        lastElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement &&
        firstElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, []);

  return dialogRef;
}
