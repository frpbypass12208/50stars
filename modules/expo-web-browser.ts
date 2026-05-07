// Stub for expo-web-browser to avoid missing package resolution errors
// Full OAuth flows are handled via the OnSpace Cloud auth system

export type WebBrowserAuthSessionResult =
  | { type: 'success'; url: string }
  | { type: 'cancel' }
  | { type: 'dismiss' }
  | { type: 'locked' };

export async function maybeCompleteAuthSession(): Promise<void> {
  // no-op stub
}

export async function openAuthSessionAsync(
  url: string,
  _redirectUrl?: string,
  _options?: object
): Promise<WebBrowserAuthSessionResult> {
  // no-op stub — Google OAuth not configured
  return { type: 'cancel' };
}

export async function dismissBrowser(): Promise<void> {
  // no-op stub
}

export default {
  maybeCompleteAuthSession,
  openAuthSessionAsync,
  dismissBrowser,
};
