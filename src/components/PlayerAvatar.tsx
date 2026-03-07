'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PlayerAvatarProps {
  name: string;
  src?: string;
  size?: number;
}

export default function PlayerAvatar({
  name,
  src,
  size = 80
}: PlayerAvatarProps) {

  const [imgError, setImgError] = useState(false);

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=2563eb&color=fff&size=256`;

  const imageSrc = !imgError && src ? src : fallback;

  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        position: 'relative'
      }}
    >
      <Image
        src={imageSrc}
        alt={name}
        fill
        sizes={`${size}px`}
        onError={() => setImgError(true)}
        style={{
          borderRadius: '16px',
          objectFit: 'cover',
          background: '#1e293b',
        }}
      />
    </div>
  );
}
