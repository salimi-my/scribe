import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function constructMetadata({
  title = 'Scribe — Chat with Your Documents',
  description = 'Enhance your document experience with Scribe: Upload PDFs and chat with them through AI for seamless productivity. Unlock the power of interactive PDFs today!',
  image = '/social-preview.png',
  icons = '/favicon.ico',
  noIndex = false
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@mysalimi'
    },
    icons,
    metadataBase: new URL('https://scribe.salimi.my'),
    themeColor: '#FFF',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  };
}
