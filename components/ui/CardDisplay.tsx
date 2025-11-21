import React from 'react';
import { Card, CardType } from '../../game/types';

interface CardDisplayProps {
  card: Card | null;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  if (!card) return null;

  const isDare = card.type === CardType.DARE;
  const cardBg = isDare 
    ? "bg-gradient-to-br from-indigo-500 to-purple-600" 
    : "bg-gradient-to-br from-rose-500 to-orange-600";
  
  return (
    <div className={`w-full aspect-[3/4] max-h-80 ${cardBg} rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden transform transition-all`}>
      <div className="absolute top-4 left-4 text-white/40 font-bold text-sm tracking-widest uppercase">
        {card.type}
      </div>
      <div className="absolute bottom-4 right-4 text-white/40 font-bold text-xs bg-black/20 px-2 py-1 rounded">
        {card.difficulty}
      </div>
      
      <p className="text-2xl md:text-3xl font-black text-white drop-shadow-md">
        {card.text}
      </p>
    </div>
  );
};

export default CardDisplay;