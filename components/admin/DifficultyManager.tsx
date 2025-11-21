import React, { useState, useEffect } from 'react';
import { Difficulty, DifficultyPreset } from '../../game/types';
import { adminDataService } from '../../services/adminDataService';
import Button from '../ui/Button';

const DifficultyManager: React.FC = () => {
  const [presets, setPresets] = useState<DifficultyPreset[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<Partial<DifficultyPreset>>({
    name: '',
    allowedDifficulties: [Difficulty.EASY]
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = () => {
    setPresets(adminDataService.getPresets());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!currentPreset.name || currentPreset.name.trim() === '') {
      setError('Preset name is required');
      return;
    }

    if (!currentPreset.allowedDifficulties || currentPreset.allowedDifficulties.length === 0) {
      setError('At least one difficulty must be selected');
      return;
    }

    // Check for duplicate names (excluding current preset if editing)
    const nameExists = presets.some(
      p => p.name.toLowerCase() === currentPreset.name!.toLowerCase().trim() && p.id !== currentPreset.id
    );
    if (nameExists) {
      setError('A preset with this name already exists');
      return;
    }

    let updated = [...presets];
    if (currentPreset.id) {
      // Update existing
      updated = updated.map(p => 
        p.id === currentPreset.id 
          ? { ...p, name: currentPreset.name!.trim(), allowedDifficulties: currentPreset.allowedDifficulties! }
          : p
      );
    } else {
      // Create new
      const newPreset: DifficultyPreset = {
        id: crypto.randomUUID(),
        name: currentPreset.name.trim(),
        allowedDifficulties: currentPreset.allowedDifficulties!
      };
      updated.push(newPreset);
    }

    adminDataService.savePresets(updated);
    setPresets(updated);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this preset?')) return;
    const updated = presets.filter(p => p.id !== id);
    adminDataService.savePresets(updated);
    setPresets(updated);
  };

  const editPreset = (preset: DifficultyPreset) => {
    setCurrentPreset({ ...preset });
    setIsEditing(true);
    setError('');
  };

  const resetForm = () => {
    setCurrentPreset({ name: '', allowedDifficulties: [Difficulty.EASY] });
    setIsEditing(false);
    setError('');
  };

  const toggleDifficulty = (difficulty: Difficulty) => {
    const current = currentPreset.allowedDifficulties || [];
    const updated = current.includes(difficulty)
      ? current.filter(d => d !== difficulty)
      : [...current, difficulty];
    setCurrentPreset({ ...currentPreset, allowedDifficulties: updated });
    setError('');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-emerald-400">Difficulty Presets</h2>
      
      {/* Form */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Preset' : 'Create New Preset'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Preset Name</label>
            <input 
              value={currentPreset.name || ''}
              onChange={e => {
                setCurrentPreset({ ...currentPreset, name: e.target.value });
                setError('');
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-emerald-500"
              placeholder="e.g. Super Hard Mode"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Allowed Difficulties</label>
            <div className="space-y-2">
              {Object.values(Difficulty).map(diff => (
                <label key={diff} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-700/50">
                  <input
                    type="checkbox"
                    checked={currentPreset.allowedDifficulties?.includes(diff) || false}
                    onChange={() => toggleDifficulty(diff)}
                    className="w-5 h-5 accent-emerald-500"
                  />
                  <span className="font-bold text-slate-300">
                    {diff}
                    {diff === Difficulty.EASY && <span className="ml-2 text-xs text-emerald-400">(Beginner friendly)</span>}
                    {diff === Difficulty.MEDIUM && <span className="ml-2 text-xs text-yellow-400">(Moderate challenge)</span>}
                    {diff === Difficulty.HARD && <span className="ml-2 text-xs text-rose-400">(Extreme)</span>}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-rose-500 text-sm font-bold">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" variant="secondary" className="py-2">
              {isEditing ? 'Update Preset' : 'Create Preset'}
            </Button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white font-bold px-4">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {presets.map(p => (
          <div key={p.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-emerald-100">{p.name}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => editPreset(p)} 
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-bold"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(p.id)} 
                  className="text-rose-500 hover:text-rose-400 text-sm font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 uppercase font-bold mb-2">Allowed Difficulties:</p>
            <div className="flex flex-wrap gap-2">
              {p.allowedDifficulties.map(d => (
                <span 
                  key={d} 
                  className={`text-xs font-bold px-3 py-1 rounded ${
                    d === Difficulty.HARD ? 'bg-rose-900 text-rose-200' : 
                    d === Difficulty.MEDIUM ? 'bg-yellow-900 text-yellow-200' : 
                    'bg-emerald-900 text-emerald-200'
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
            {p.allowedDifficulties.length === 0 && (
              <p className="text-xs text-slate-500 italic">No difficulties selected</p>
            )}
          </div>
        ))}
        {presets.length === 0 && (
          <div className="col-span-2 text-center py-8 text-slate-500 italic">
            No presets created yet. Create your first preset above.
          </div>
        )}
      </div>
    </div>
  );
};

export default DifficultyManager;