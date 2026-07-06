"use client";

import { useEffect } from "react";

let lockCount = 0;
let previousBodyOverflow = "";
let previousDocumentOverflow = "";

export default function useLockBodyScroll(isLocked: boolean) {
    useEffect(() => {
        if (!isLocked) return;

        if (lockCount === 0) {
            previousBodyOverflow = document.body.style.overflow;
            previousDocumentOverflow = document.documentElement.style.overflow;

            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        }

        lockCount += 1;

        return () => {
            lockCount = Math.max(0, lockCount - 1);

            if (lockCount === 0) {
                document.body.style.overflow = previousBodyOverflow;
                document.documentElement.style.overflow = previousDocumentOverflow;
            }
        };
    }, [isLocked]);
}
