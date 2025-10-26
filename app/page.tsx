import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">
          欢迎来到我的博客
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          分享生活、思考与体验的个人空间
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-sky-700 dark:text-sky-400">
          最新文章
        </h2>
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative overflow-hidden border border-sky-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:scale-[1.02] hover:border-sky-400/50 dark:hover:border-cyan-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 to-cyan-500/0 group-hover:from-sky-500/5 group-hover:to-cyan-500/5 transition-all duration-300"></div>
              <Link href={`/posts/${post.slug}`} className="relative z-10">
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {post.title}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed relative z-10">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 relative z-10">
                <time dateTime={post.date} className="flex items-center gap-1">
                  {formatDate(post.date)}
                </time>
                {post.tags && (
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gradient-to-r from-sky-500/10 to-cyan-500/10 dark:from-sky-500/20 dark:to-cyan-500/20 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full text-xs font-medium border border-sky-200/50 dark:border-sky-700/50 hover:scale-110 transition-transform"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
