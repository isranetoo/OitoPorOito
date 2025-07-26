# OitoPorOito

OitoPorOito é uma plataforma web para jogar xadrez online, resolver puzzles, aprender estratégias, acompanhar partidas e interagir com outros jogadores. O projeto utiliza React, Vite, TailwindCSS e Supabase para autenticação e backend.

## Funcionalidades
- Tabuleiro de xadrez interativo
- Autenticação de usuários (login e cadastro)
- Interface moderna e responsiva
- Navegação entre modos de jogo, puzzles, aprendizado, partidas e social

## Como rodar o app localmente

1. **Pré-requisitos:**
   - Node.js 20+ (veja `.nvmrc`)
   - npm instalado

2. **Instale as dependências:**
   ```powershell
   npm install
   ```

   Esse comando também baixa a engine de xadrez [`stockfish.wasm`](https://www.npmjs.com/package/stockfish.wasm), utilizada para gerar os lances do robô.

3. **Inicie o servidor de desenvolvimento:**
   ```powershell
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:5173](http://localhost:5173) para visualizar o app.

## Estrutura do projeto

- `src/` - Código-fonte principal
  - `components/` - Componentes React (Board, Navbar, CTA, Footer)
  - `pages/` - Páginas de Login e Cadastro
  - `lib/` - Utilitários e integração com Supabase
- `public/assets/` - Imagens e peças do xadrez
- `plugins/` - Plugins customizados para o editor visual

## Licença
MIT License