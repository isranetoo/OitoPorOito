import React from 'react';
import { FaFileAlt, FaPlay, FaYoutube, FaTiktok, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const RecentNews = () => {
  const newsItems = [
    { icon: <FaFileAlt />, text: 'Notícia 1' },
    { icon: <FaPlay />, text: 'Notícia 2' },
    { icon: <FaFileAlt />, text: 'Notícia 3' },
  ];

  const socialMedia = [
    { icon: <FaYoutube />, color: 'bg-red-600', count: '85,631' },
    { icon: <FaInstagram />, color: 'bg-pink-500', count: '26,651' },
    { icon: <FaTwitter />, color: 'bg-blue-500', count: '12,064' },
    { icon: <FaFacebook />, color: 'bg-blue-700', count: '47,153' },
  ];

  return (
    <div className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] w-full max-w-xs p-5 rounded-2xl shadow-xl border border-[#c29d5d]/40 text-white">
      <h2 className="text-xl font-bold mb-4 text-[#e7c27d] drop-shadow flex items-center gap-2">
        📰 Últimas Notícias
      </h2>
      <ul className="space-y-3 text-base">
        {newsItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 bg-[#232526]/70 border border-[#c29d5d]/20 rounded-lg px-3 py-2 shadow hover:bg-[#333] transition-all"
          >
            <span className="text-[#e7c27d] text-lg">{item.icon}</span>
            <span className="truncate font-semibold text-white">{item.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h3 className="text-md font-semibold text-[#c29d5d] mb-2">Redes Sociais</h3>
        <div className="flex justify-between flex-wrap gap-2">
          {socialMedia.map((media, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-1">
              <div
                className={`w-10 h-10 flex items-center justify-center shadow ${media.color}`}
                style={{ borderRadius: 20 }}
              >
                {media.icon}
              </div>
              <span className="text-xs font-bold text-[#e7c27d]">{media.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentNews;