import sanitize from "mongo-sanitize";

/**
 * Recursively sanitizes an object to prevent NoSQL injection
 * by removing any keys that start with '$'.
 */
export function sanitizeInput<T>(input: T): T {
  if (!input) return input;
  // If it's a string/number/boolean, it's safe
  if (typeof input !== "object") return input;

  // mongo-sanitize mutates the object, so we deep clone it first
  const cloned = JSON.parse(JSON.stringify(input));
  return sanitize(cloned) as T;
}
