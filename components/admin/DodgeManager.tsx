import React, { useState, useEffect } from 'react';
import { Card, CardType, Difficulty } from '../../game/types';
import { adminDataService } from '../../services/adminDataService';
import Button from '../ui/Button';

const DodgeManager: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCard, setCurrentCard] = useState<Partial<Card>>({
    type: CardType.DODGE,
    difficulty: Difficulty.MEDIUM, // Default for dodge, ignored by game logic usually
    text: '',
    active: true
  });

  useEffect(() => {
    setCards(adminDataService.getDodges());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCard.text) return;

    let newCards = [...cards];
    if (currentCard.id) {
      newCards = newCards.map(c => c.id === currentCard.id ? { ...c, ...currentCard } as Card : c);
    } else {
      const newCard: Card = {
        id: crypto.randomUUID(),
        type: CardType.DODGE,
        text: currentCard.text!,
        difficulty: Difficulty.MEDIUM,
        active: currentCard.active ?? true
      };
      newCards.push(newCard);
    }

    adminDataService.saveDodges(newCards);
    setCards(newCards);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure?')) return;
    const newCards = cards.filter(c => c.id !== id);
    adminDataService.saveDodges(newCards);
    setCards(newCards);
  };

  const editCard = (card: Card) => {
    setCurrentCard(card);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentCard({ type: CardType.DODGE, difficulty: Difficulty.MEDIUM, text: '', active: true });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-rose-400">Manage Dodges</h2>
      
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Dodge' : 'Create New Dodge'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Dodge Text</label>
            <textarea 
              value={currentCard.text} 
              onChange={e => setCurrentCard({...currentCard, text: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-rose-500 outline-none"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
             <input 
              type="checkbox" 
              checked={currentCard.active ?? true}
              onChange={e => setCurrentCard({...currentCard, active: e.target.checked})}
              className="w-5 h-5 accent-rose-500"
             />
             <span className="font-bold text-slate-300">Active</span>
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="danger" className="py-2">{isEditing ? 'Update Dodge' : 'Add Dodge'}</Button>
            {isEditing && <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="space-y-2">
        {cards.map(card => (
          <div key={card.id} className={`flex justify-between items-center p-4 rounded-lg border ${card.active ? 'bg-slate-800 border-slate-700' : 'bg-slate-800/50 border-slate-700/50 opacity-60'}`}>
            <div className="flex-1 pr-4">
              <p className="text-slate-200">{card.text}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editCard(card)} className="text-indigo-400 hover:text-indigo-300 font-bold px-2">Edit</button>
              <button onClick={() => handleDelete(card.id)} className="text-rose-500 hover:text-rose-400 font-bold px-2">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DodgeManager;