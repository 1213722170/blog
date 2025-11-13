'use client';

import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  rotation: number;
}

export function PetalAnimation() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // 生成20个花瓣
    const newPetals: Petal[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 8 + Math.random() * 8, // 8-16秒
      animationDelay: Math.random() * 5,
      size: 15 + Math.random() * 15, // 15-30px
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute -top-10 animate-fall"
          style={{
            left: `${petal.left}%`,
            animationDuration: `${petal.animationDuration}s`,
            animationDelay: `${petal.animationDelay}s`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
          }}
        >
          <div
            className="petal"
            style={{
              transform: `rotate(${petal.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
