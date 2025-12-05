'use client';

// This file is the single source of truth for the `useUser` hook.
// It should be used in client components to access the authenticated user's state.
// Example: import { useUser } from '@/firebase/auth/use-user';

// Re-export `useUser` from the main provider for consistency.
export { useUser } from '@/firebase/provider';
