/** Normalize legacy dates without depending on the machine's timezone. */
export function normalizeDate(value: unknown): string {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString().slice(0, 10);
  const match = String(value ?? "").trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) throw new Error("无效的文章日期：" + String(value) + "，请使用 YYYY-MM-DD");
  const [, year, month, day] = match;
  const normalized = year + "-" + month.padStart(2, "0") + "-" + day.padStart(2, "0");
  const parsed = new Date(normalized + "T00:00:00Z");
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== normalized) throw new Error("无效的文章日期：" + normalized);
  return normalized;
}
export function formatDate(value: string): string {
  const [year, month, day] = normalizeDate(value).split("-");
  return year + "年" + Number(month) + "月" + Number(day) + "日";
}
export function getAssetPath(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pathname = path.startsWith("/") ? path : "/" + path;
  if (basePath && (pathname === basePath || pathname.startsWith(basePath + "/"))) return pathname;
  return basePath + pathname;
}
