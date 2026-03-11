/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 关键：将项目打包为静态 HTML/CSS/JS
  images: {
    unoptimized: true, // 静态导出不支持 Next.js 的图片优化功能
  },
};

export default nextConfig;