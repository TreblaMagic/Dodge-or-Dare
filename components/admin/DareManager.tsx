import React, { useState, useEffect } from 'react';
import { Card, CardType, Difficulty } from '../../game/types';
import { adminDataService } from '../../services/adminDataService';
import Button from '../ui/Button';

const DareManager: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCard, setCurrentCard] = useState<Partial<Card>>({
    type: CardType.DARE,
    difficulty: Difficulty.EASY,
    text: '',
    active: true
  });

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = () => {
    setCards(adminDataService.getDares());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCard.text) return;

    let newCards = [...cards];
    if (currentCard.id) {
      // Update
      newCards = newCards.map(c => c.id === currentCard.id ? { ...c, ...currentCard } as Card : c);
    } else {
      // Create
      const newCard: Card = {
        id: crypto.randomUUID(),
        type: CardType.DARE,
        text: currentCard.text!,
        difficulty: currentCard.difficulty || Difficulty.EASY,
        active: currentCard.active ?? true
      };
      newCards.push(newCard);
    }

    adminDataService.saveDares(newCards);
    setCards(newCards);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure?')) return;
    const newCards = cards.filter(c => c.id !== id);
    adminDataService.saveDares(newCards);
    setCards(newCards);
  };

  const toggleActive = (card: Card) => {
    const newCards = cards.map(c => c.id === card.id ? { ...c, active: !c.active } : c);
    adminDataService.saveDares(newCards);
    setCards(newCards);
  };

  const editCard = (card: Card) => {
    setCurrentCard(card);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentCard({ type: CardType.DARE, difficulty: Difficulty.EASY, text: '', active: true });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manage Dares</h2>
      
      {/* Form */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Dare' : 'Create New Dare'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Dare Text</label>
            <textarea 
              value={currentCard.text} 
              onChange={e => setCurrentCard({...currentCard, text: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-indigo-500 outline-none"
              rows={2}
              placeholder="e.g., Dance like a robot..."
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Difficulty</label>
              <select 
                value={currentCard.difficulty}
                onChange={e => setCurrentCard({...currentCard, difficulty: e.target.value as Difficulty})}
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none"
              >
                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-3">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input 
                  type="checkbox" 
                  checked={currentCard.active ?? true}
                  onChange={e => setCurrentCard({...currentCard, active: e.target.checked})}
                  className="w-5 h-5 accent-indigo-500"
                 />
                 <span className="font-bold text-slate-300">Active</span>
               </label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="py-2">{isEditing ? 'Update Card' : 'Add Card'}</Button>
            {isEditing && <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">Cancel</button>}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-2">
        {cards.map(card => (
          <div key={card.id} className={`flex justify-between items-center p-4 rounded-lg border ${card.active ? 'bg-slate-800 border-slate-700' : 'bg-slate-800/50 border-slate-700/50 opacity-60'}`}>
            <div className="flex-1 pr-4">
              <div className="flex gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  card.difficulty === Difficulty.HARD ? 'bg-rose-900 text-rose-200' : 
                  card.difficulty === Difficulty.MEDIUM ? 'bg-yellow-900 text-yellow-200' : 
                  'bg-emerald-900 text-emerald-200'
                }`}>
                  {card.difficulty}
                </span>
                {!card.active && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">INACTIVE</span>}
              </div>
              <p className="text-slate-200">{card.text}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(card)} className="text-xs font-bold uppercase text-slate-400 hover:text-white px-2">
                {card.active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => editCard(card)} className="text-indigo-400 hover:text-indigo-300 font-bold px-2">Edit</button>
              <button onClick={() => handleDelete(card.id)} className="text-rose-500 hover:text-rose-400 font-bold px-2">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DareManager;