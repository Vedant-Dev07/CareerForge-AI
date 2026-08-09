"use client";

export type UserSession = {
  name: string;
  email: string;
  onboardingComplete: boolean;
};

export async function getSession(): Promise<UserSession | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { user?: UserSession };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function clearSession() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Keep logout navigation responsive even if the cleanup request fails.
  }
}

export async function isAuthenticated() {
  return Boolean(await getSession());
}
