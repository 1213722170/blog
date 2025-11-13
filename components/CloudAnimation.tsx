'use client';

import { useEffect, useState } from 'react';

interface Cloud {
  id: number;
  top: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

export function CloudAnimation() {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    // 生成5朵云
    const newClouds: Cloud[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: 10 + Math.random() * 40, // 10-50% 从顶部
      animationDuration: 30 + Math.random() * 30, // 30-60秒
      animationDelay: Math.random() * 10,
      size: 80 + Math.random() * 80, // 80-160px
      opacity: 0.3 + Math.random() * 0.4, // 0.3-0.7
    }));
    setClouds(newClouds);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute -left-40 animate-cloud-move"
          style={{
            top: `${cloud.top}%`,
            animationDuration: `${cloud.animationDuration}s`,
            animationDelay: `${cloud.animationDelay}s`,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            opacity: cloud.opacity,
          }}
        >
          <div className="cloud" />
        </div>
      ))}
    </div>
  );
}
