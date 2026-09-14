/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PHP dosyalarının public klasöründen çalışmasına izin ver
  async rewrites() {
    return [];
  },
};

export default nextConfig;