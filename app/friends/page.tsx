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
    avatar: "/avatars/b_900bb864c57dde3936210cb63206c166.jpg",
    link: "https://zestfulyk.github.io/ZestfulYK-blog/",
    description: "前端大手子",
  },
  {
    name: "猫猫大人是也",
    avatar: "/avatars/50056E6D432E05D30206F4AFCCF4DEA1.jpg",
    link: "https://www.yuanshen.com/#/",
    description: "",
  },
  // 你可以在这里添加更多友链
];

export default function FriendsPage() {
  return (
    <div className="max-w-none">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">友情链接</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400">
              {/* 头像容器 */}
              <div className="flex justify-center pt-6 pb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors duration-300">
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
              <div className="px-6 pb-6 text-center">
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
      <div className="mt-12 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          申请友链
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            欢迎大家速速添加我的友链，如果你想添加友链，请确保满足以下条件：
          </p>
          <ul className="text-gray-700 dark:text-gray-300">
            <li>网站能够正常访问</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            符合条件的朋友可以通过邮件或其他方式联系我，附上你的网站信息：
          </p>
          <ul className="text-gray-700 dark:text-gray-300">
            <li>网站名称</li>
            <li>网站链接</li>
            <li>网站描述（一句话简介）</li>
            <li>头像图片链接</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
