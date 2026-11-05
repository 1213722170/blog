import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { getAssetPath } from "@/lib/utils";

interface MarkdownRendererProps { content: string; className?: string; }
interface HtmlNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
}
function nodeText(node: HtmlNode): string {
  return node.type === "text" ? node.value || "" : (node.children || []).map(nodeText).join("");
}
/** IDs come from the parsed tree, so code fences and duplicate headings work correctly. */
function headingAnchors() {
  return (tree: HtmlNode) => {
    const seen = new Set<string>();
    function visit(node: HtmlNode) {
      if (/^h[1-6]$/.test(node.tagName || "")) {
        const base = nodeText(node).trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-") || "section";
        let id = base;
        let suffix = 2;
        while (seen.has(id)) id = base + "-" + suffix++;
        seen.add(id);
        node.properties = { ...node.properties, id };
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return <div className={"markdown-body " + className}>
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex, headingAnchors]} components={{
      img: ({ node, src = "", alt = "", ...props }) => {
        const source = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src) ? src : getAssetPath(src.startsWith("/") ? src : "/images/posts/" + src);
        // Native images support static export and keep course screenshots at their natural ratio.
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} src={source} alt={alt} className="article-image" loading="lazy" />;
      },
      table: ({ node, ...props }) => <div className="table-scroll"><table {...props} /></div>,
    }}>{content}</ReactMarkdown>
  </div>;
}
