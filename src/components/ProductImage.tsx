'use client';
import { useState } from 'react';
import { imgSrc } from '@/lib/format';

export default function ProductImage({ url, alt }: { url: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);
  const src = imgSrc(url);
  return (
    <div className="product-thumb">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <i className="fas fa-leaf ph" aria-hidden="true"></i>
      )}
    </div>
  );
}
