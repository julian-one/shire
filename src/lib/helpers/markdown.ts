import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'isomorphic-dompurify';

const marked = new Marked(
	{
		gfm: true,
		breaks: true
	},
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			if (lang && hljs.getLanguage(lang)) {
				return hljs.highlight(code, { language: lang }).value;
			}
			return hljs.highlightAuto(code).value;
		}
	})
);

export function render_markdown(md: string): string {
	if (!md) return '';
	const html = marked.parse(md) as string;
	return DOMPurify.sanitize(html);
}
