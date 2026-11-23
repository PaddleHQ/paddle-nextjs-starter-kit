const DEFAULT_CALLBACK_URL = "/dashboard";

/** Only same-site paths are allowed, so a crafted login link can't send users to another site. */
export function safeCallbackURL(value: FormDataEntryValue | string | null | undefined): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return DEFAULT_CALLBACK_URL;
  }
  return value;
}
