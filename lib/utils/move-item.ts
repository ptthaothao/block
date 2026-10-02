/** `items` with `from` moved to where `to` is; unchanged if either is missing. */
export function moveItem<T>(items: readonly T[], from: T, to: T): T[] {
  const fromIndex = items.indexOf(from);
  const toIndex = items.indexOf(to);
  if (fromIndex === -1 || toIndex === -1) return [...items];
  const next = [...items];
  next.splice(fromIndex, 1);
  next.splice(toIndex, 0, from);
  return next;
}
