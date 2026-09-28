import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { renderCommentMarkdown } = await import("./render-comment");

describe("renderCommentMarkdown", () => {
  it("keeps basic formatting and code", async () => {
    const html = await renderCommentMarkdown("**đậm** _nghiêng_ `code`\n\n```php\necho 1;\n```");
    expect(html).toContain("<strong>đậm</strong>");
    expect(html).toContain("<em>nghiêng</em>");
    expect(html).toContain("<code>code</code>");
    expect(html).toContain('<code class="language-php">');
  });

  it("marks links as user content that opens in a new tab", async () => {
    const html = await renderCommentMarkdown("[docs](https://laravel.com)");
    expect(html).toBe('<p><a href="https://laravel.com" rel="nofollow ugc noopener noreferrer" target="_blank">docs</a></p>');
  });

  it.each([
    ["script tags", "<script>alert(1)</script>", "<script"],
    ["inline handlers", '<img src=x onerror="alert(1)">', "onerror"],
    ["javascript links", "[x](javascript:alert(1))", "javascript:"],
    ["data links", "[x](data:text/html;base64,PHNjcmlwdD4=)", "data:"],
    ["images", "![a](https://example.com/a.png)", "<img"],
    ["iframes", '<iframe src="https://evil.test"></iframe>', "<iframe"],
    ["style attributes", '<p style="position:fixed">x</p>', "style="],
  ])("removes %s", async (_name, input, forbidden) => {
    expect(await renderCommentMarkdown(input)).not.toContain(forbidden);
  });

  it("turns headings into plain text", async () => {
    const html = await renderCommentMarkdown("# To đùng");
    expect(html).not.toContain("<h1");
    expect(html).toContain("To đùng");
  });
});
