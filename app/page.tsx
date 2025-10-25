import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient">
          欢迎来到我的博客
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          🌟 分享生活、思考与体验的个人空间
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span className="text-blue-600 dark:text-blue-400">📝</span>
          最新文章
        </h2>
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative overflow-hidden border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:scale-[1.02] hover:border-blue-400/50 dark:hover:border-blue-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>
              <Link href={`/posts/${post.slug}`} className="relative z-10">
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed relative z-10">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 relative z-10">
                <time dateTime={post.date} className="flex items-center gap-1">
                  <span>📅</span>
                  {formatDate(post.date)}
                </time>
                {post.tags && (
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-200/50 dark:border-blue-700/50 hover:scale-110 transition-transform"
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
