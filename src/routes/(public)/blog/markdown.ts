import { Marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

const marked = new Marked({
	tokenizer: {
		// Disable indented code blocks (4-space indent) to prevent
		// user content from being unexpectedly rendered as code.
		// Fenced code blocks (```) still work via the `fences` tokenizer.
		code() {
			return undefined;
		}
	}
});

export function render_markdown(md: string): string {
	if (!md) return '';
	const html = marked.parse(md) as string;
	return DOMPurify.sanitize(html);
}
