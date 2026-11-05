import Image from "next/image";
import Link from "next/link";
import { getAssetPath } from "@/lib/utils";

interface Friend {
  name: string;
  avatar: string;
  link: string;
  description: string;
}

// 友链数据配置
const friends: Friend[] = [
  {
    name: "zestfulyk",
    avatar: "/avatars/b_900bb864c57dde3936210cb63206c166.jpg",
    link: "https://zestfulyk.github.io/ZestfulYK-blog/",
    description: "前端大手子",
  },
  {
    name: "猫猫大人是也",
    avatar: "/avatars/50056E6D432E05D30206F4AFCCF4DEA1.jpg",
    link: "https://www.yuanshen.com/#/",
    description: "原神实在是太好玩了",
  },
  {
    name: "岛越月望",
    avatar: "/avatars/hero-full-960-7436f6fcebde.jpg",
    link: "https://daoyezongzi.org/",
    description: "完美的文艺青年",
  },
  // 你可以在这里添加更多友链
];

export default function FriendsPage() {
  return (
    <div className="max-w-none">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">
          友情链接
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          这里是我的好朋友们的站点，欢迎访问！
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {friends.map((friend, index) => (
          <Link
            key={index}
            href={friend.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative bg-gradient-to-br from-white via-sky-50/30 to-cyan-50/30 dark:from-gray-800 dark:via-sky-900/20 dark:to-cyan-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sky-200/50 dark:border-slate-700/50 hover:border-sky-400 dark:hover:border-cyan-500 hover:scale-105 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-cyan-500/0 group-hover:from-sky-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
              
              <div className="relative flex justify-center pt-8 pb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-600 group-hover:border-sky-400 dark:group-hover:border-cyan-500 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <Image
                    src={getAssetPath(friend.avatar)}
                    alt={friend.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="96px"
                  />
                </div>
              </div>

              <div className="relative px-6 pb-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors">
                  {friend.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {friend.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
