import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trove',
    short_name: 'Trove',
    description: 'A simple and elegant bookmarks manager to organize your web discoveries.',
    start_url: '/bookmarks',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: "/screenshoot/1.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/screenshoot/2.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/screenshoot/3.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/screenshoot/4.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/screenshoot/5.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      }
    ],
  }
}