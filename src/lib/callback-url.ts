const DEFAULT_CALLBACK_URL = "/dashboard";
const PARSE_BASE = "https://callback.invalid";

// Browsers drop control characters and treat "\" like "/" when parsing URLs, so "/\t/evil.example" becomes "//evil.example".
const UNSAFE = /[\u0000-\u001f\u007f-\u009f\\]|%2f|%5c/i;

/** Only same-site paths are allowed, so a crafted login link can't send users to another site. */
export function safeCallbackURL(value: FormDataEntryValue | string | null | undefined): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || UNSAFE.test(value)) {
    return DEFAULT_CALLBACK_URL;
  }
  const url = new URL(value, PARSE_BASE);
  if (url.origin !== PARSE_BASE) return DEFAULT_CALLBACK_URL;
  return url.pathname + url.search + url.hash;
}

/** Keeps the return path when moving between the login and sign-up pages. */
export function withCallback(path: string, callbackURL: string | undefined): string {
  return callbackURL ? `${path}?${new URLSearchParams({ callbackURL: safeCallbackURL(callbackURL) })}` : path;
}
