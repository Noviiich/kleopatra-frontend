/** Resolve public assets relative to the deployment path, including GitHub project Pages. */
export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
