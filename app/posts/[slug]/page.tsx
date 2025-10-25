import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { formatDate } from "@/lib/utils";
import "highlight.js/styles/github-dark.css";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | 我的博客`,
    description: post.description,
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <header className="mb-8 not-prose pb-8 border-b-2 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
          <time dateTime={post.date} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <span>📅</span>
            {formatDate(post.date)}
          </time>
          {post.tags && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-300/50 dark:border-blue-600/50 hover:scale-110 transition-transform"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="prose-headings:bg-gradient-to-r prose-headings:from-blue-600 prose-headings:to-purple-600 dark:prose-headings:from-blue-400 dark:prose-headings:to-purple-400 prose-headings:bg-clip-text prose-headings:text-transparent prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
