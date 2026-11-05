import { site } from "@/lib/site";
export function Footer() {
  return <footer className="site-footer">
    <div><span className="footer-name">{site.name}</span><p>在学习中生长，在文字里留痕。</p></div>
    <div className="footer-meta"><span>© {new Date().getFullYear()} {site.author}</span><a href="https://github.com/1213722170/blog" target="_blank" rel="noreferrer">GitHub ↗</a></div>
  </footer>;
}
