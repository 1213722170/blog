import Image from "next/image";
import Link from "next/link";

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
    avatar: "/blog/avatars/b_900bb864c57dde3936210cb63206c166.jpg",  // GitHub Pages 需要 basePath
    link: "https://zestfulyk.github.io/ZestfulYK-blog/",
    description: "前端大手子",
  },
  {
    name: "猫猫大人是也",
    avatar: "/blog/avatars/50056E6D432E05D30206F4AFCCF4DEA1.jpg",  // GitHub Pages 需要 basePath
    link: "https://www.yuanshen.com/#/",
    description: "",
  },
  // 你可以在这里添加更多友链
];

export default function FriendsPage() {
  return (
    <div className="max-w-none">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
          💕 友情链接
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
            <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 backdrop-blur-sm">
              {/* 装饰性渐变 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
              
              {/* 头像容器 */}
              <div className="relative flex justify-center pt-8 pb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <Image
                    src={friend.avatar}
                    alt={friend.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="96px"
                  />
                </div>
              </div>

              {/* 信息容器 */}
              <div className="relative px-6 pb-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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

      {/* 申请友链说明 */}
      <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 flex items-center gap-2">
          <span>💌</span>
          申请友链
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            欢迎大家速速添加我的友链，如果你想添加友链，请确保满足以下条件：
          </p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✔</span>
              网站能够正常访问
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 text-lg mt-6">
            符合条件的朋友可以通过邮件或其他方式联系我，附上你的网站信息：
          </p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">🎯</span>
              网站名称
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">🔗</span>
              网站链接
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500">📝</span>
              网站描述（一句话简介）
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">🖼️</span>
              头像图片链接
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
