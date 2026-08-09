"use client";

export type UserSession = {
  name: string;
  email: string;
  onboardingComplete: boolean;
};

const SESSION_KEY = "careerforge-session";

export function saveSession(user: UserSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated() {
  return Boolean(getSession());
}
