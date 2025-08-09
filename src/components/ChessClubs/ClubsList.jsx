import React from "react";
import ClubItem from "./ClubItem";

// Mock data para clubes
const mockClubs = [
  {
    id: 1,
    name: "Academia de Xadrez GM Rafael Leitão",
    verified: true,
    url: "https://www.chess.com/vo…",
    members: 20364,
    online: 181,
    thumb: "/assets/rafael.png",
    description:
      "Queres desafiar o GM Rafael Leitão? https://www.chess.com/…",
  },
  {
    id: 2,
    name: "Clube Xadrez Brasil",
    verified: false,
    url: "https://www.chess.com/club/xadrez-brasil",
    members: 15000,
    online: 120,
    thumb: "/assets/logo-oitoporoito.png",
    description: "O maior clube brasileiro de xadrez online!",
  },
  {
    id: 3,
    name: "Chess Portugal",
    verified: true,
    url: "https://www.chess.com/club/chess-portugal",
    members: 8000,
    online: 60,
    thumb: "/assets/logo.png",
    description: "Comunidade portuguesa de xadrez para todos os níveis.",
  },
  {
    id: 4,
    name: "Xadrez Feminino Brasil",
    verified: false,
    url: "https://www.chess.com/club/xadrez-feminino-brasil",
    members: 4200,
    online: 35,
    thumb: "/assets/logo-oitoporoito.png",
    description: "Grupo dedicado ao xadrez feminino no Brasil. Participe das nossas atividades!",
  },
  {
    id: 5,
    name: "Chess Masters Club",
    verified: true,
    url: "https://www.chess.com/club/chess-masters-club",
    members: 12000,
    online: 98,
    thumb: "/assets/logo.png",
    description: "Clube internacional para jogadores avançados e mestres. Torneios semanais!",
  },
];

export default function ClubsList() {
  const clubs = mockClubs;
  return (
    <div className="rounded-md bg-[#2a2b29] border border-white/10">
      {clubs.map((c, i) => (
        <ClubItem key={c.id} club={c} last={i === clubs.length - 1} />
      ))}
    </div>
  );
}
