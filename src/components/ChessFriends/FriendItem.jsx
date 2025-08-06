export default function FriendItem({ avatar, name, username, flag, onWatch }) {
  return (
    <div className="flex items-center justify-between py-3 px-3 mb-1 rounded-xl bg-[#232526]/60 border border-[#c29d5d]/20 shadow-lg hover:scale-[1.015] transition-all duration-200">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={username} className="w-11 h-11 rounded-full border border-[#c29d5d]/30 bg-[#232526]" />
        <div>
          <p className="font-bold flex items-center gap-1 text-white">
            {username} {flag && <img src={flag} alt="" className="w-4 h-4 rounded-sm border border-[#c29d5d]/40" />}
          </p>
          <p className="text-sm text-gray-400">{name}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {onWatch && (
          <button
            onClick={onWatch}
            className="bg-gradient-to-r from-[#232526] to-[#2d2d2d] px-3 py-1 rounded-md text-sm font-bold text-white shadow hover:from-[#e7c27d] hover:to-[#c29d5d] hover:text-black transition-colors"
          >
            Assistir
          </button>
        )}
        <button className="bg-gradient-to-r from-[#232526] to-[#2d2d2d] p-2 rounded-md text-lg text-[#e7c27d] border border-[#c29d5d]/30 shadow hover:bg-[#444] hover:text-[#c29d5d] transition-colors">♟️</button>
        <button className="bg-gradient-to-r from-[#232526] to-[#2d2d2d] p-2 rounded-md text-lg text-[#e7c27d] border border-[#c29d5d]/30 shadow hover:bg-[#444] hover:text-[#c29d5d] transition-colors">📧</button>
      </div>
    </div>
  );
}
