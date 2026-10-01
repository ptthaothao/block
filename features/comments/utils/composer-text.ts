/** "@username " to start a reply, unless the text already mentions them. */
export function mentionPrefix(username: string, current: string): string {
  const mention = `@${username} `;
  return current.startsWith(mention) ? current : mention + current;
}
