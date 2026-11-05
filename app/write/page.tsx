import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import { WriteClient } from "./WriteClient";

export const metadata = {
  title: "写博客",
};

export default function WritePage() {
  return <WriteClient />;
}
