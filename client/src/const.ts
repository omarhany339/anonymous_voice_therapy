export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Generate login URL safely.
 *
 * - If OAuth portal env vars exist → redirect to OAuth portal
 * - If missing → fallback to local /app-auth (no crash)
 */
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // 🟢 Fallback: local auth (project works immediately)
  if (!oauthPortalUrl || !appId) {
    return "/app-auth";
  }

  // 🟢 OAuth flow
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL("/app-auth", oauthPortalUrl);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
