const base = import.meta.env.BASE_URL || "/";

export function sitePath(path = "") {
  return `${base}${String(path).replace(/^\/+/, "")}`;
}
