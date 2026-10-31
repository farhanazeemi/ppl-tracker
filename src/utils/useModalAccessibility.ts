'use client';

import { useEffect } from 'react';

/**
 * Accessible modal helper hook:
 * 1. Listens for the 'Escape' key to close the modal.
 * 2. Locks document.body overflow to prevent background scrolling behind the modal backdrop.
 */
export function useModalAccessibility(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);
}
