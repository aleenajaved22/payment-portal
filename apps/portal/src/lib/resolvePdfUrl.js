export function resolvePdfUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return new URL(path, window.location.origin).href;
}
