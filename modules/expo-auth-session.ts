// Stub for expo-auth-session to avoid missing package resolution errors
// Google OAuth is not enabled in this project

export function makeRedirectUri(_options?: object): string {
  try {
    const { Linking } = require('react-native');
    return Linking.createURL('/');
  } catch {
    return 'exp://localhost/--/';
  }
}

export function useAuthRequest(..._args: any[]): any[] {
  return [null, null, async () => {}];
}

export function startAsync(_options: object): Promise<any> {
  return Promise.resolve({ type: 'cancel' });
}

export const ResponseType = {
  Code: 'code',
  Token: 'token',
};

export default {
  makeRedirectUri,
  useAuthRequest,
  startAsync,
  ResponseType,
};
