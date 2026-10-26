/**
 * Returns the value only if it's a path on this site, otherwise "/".
 * Stops redirect parameters like ?next=//evil.com sending users elsewhere.
 */
export function safeNextPath(value: FormDataEntryValue | string | null) {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\") ? path : "/";
}
