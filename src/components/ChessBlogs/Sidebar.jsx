
function SectionCard({ title, right, children }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] border-2 border-[#c29d5d]/20 shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between border-b-2 border-[#c29d5d]/10">
        <h4 className="font-semibold text-[#e7c27d]">{title}</h4>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function Sidebar(){
  return (
    <>
      {/* Navegação */}
      <SectionCard title="Blogs" right={<span className="text-[#e7c27d]">▸</span>}>
        <ul className="text-sm">
          {['Todos os blogs','Melhores blogueiros','Meu blog','Meus Rascunhos','Configurações do Blog'].map(i=>(
            <li key={i}>
              <a className="block px-2 py-2 rounded hover:bg-[#c29d5d]/10 text-gray-200 font-medium">{i}</a>
            </li>
          ))}
        </ul>
        <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black font-bold py-2 shadow hover:from-[#ffe7b3] hover:to-[#e7c27d] transition-all">Criar post</button>

        <div className="mt-3">
          <label className="text-sm text-[#e7c27d] font-semibold">Idioma</label>
          <select className="mt-1 w-full rounded bg-[#232526] border border-[#c29d5d]/20 px-3 py-2 text-sm text-gray-200">
            <option>Inglês + meu idioma</option>
            <option>Apenas português</option>
          </select>
        </div>

        <div className="mt-3 relative">
          <input className="w-full rounded bg-[#232526] border border-[#c29d5d]/20 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400"
                 placeholder="Procurar Blogs..." />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e7c27d]">🔍</span>
        </div>
      </SectionCard>

      {/* CTA “Se aliste” */}
      <SectionCard title="Se aliste">
        <p className="text-sm text-gray-200">
          Escreva sobre xadrez e alcance um público maior. Participe do programa de Blogueiros.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-200">
          <li>• Posts exibidos em /today e /blogs</li>
          <li>• Acesso ao clube oficial de Blogueiros</li>
        </ul>
        <button className="mt-4 rounded-xl bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black font-bold px-4 py-2 shadow hover:from-[#ffe7b3] hover:to-[#e7c27d] transition-all">Aplicar</button>
      </SectionCard>
    </>
  );
}
