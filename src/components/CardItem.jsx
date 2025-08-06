export default function CardItem({ icon, title, description, bgColor }) {
  return (
    <div
      className={`flex flex-col items-start p-4 rounded-md cursor-pointer hover:scale-105 transition-transform ${bgColor}`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
}
