export default function MetaRow({ author, date, reads, comments }) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#e7c27d] font-medium">
      <span className="inline-flex items-center gap-1">
        <span className="h-5 w-5 rounded bg-[#232526] border border-[#c29d5d]/40 grid place-items-center text-base">👤</span>
        {author}
      </span>
      <span>• {date}</span>
      <span>• 👁️ {reads}</span>
      <span>• 💬 {comments}</span>
    </div>
  );
}
