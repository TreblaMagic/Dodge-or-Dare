import React, { useState, useEffect } from 'react';
import { CardPattern, Card, PatternStep } from '../../game/types';
import { adminDataService } from '../../services/adminDataService';
import Button from '../ui/Button';

type PatternFormState = {
  id?: string;
  name: string;
  fallbackMode: 'random' | 'loop' | 'stop';
  steps: PatternStep[];
};

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const emptyForm: PatternFormState = {
  name: '',
  fallbackMode: 'random',
  steps: [],
};

const PatternManager: React.FC = () => {
  const [patterns, setPatterns] = useState<CardPattern[]>([]);
  const [dareCards, setDareCards] = useState<Card[]>([]);
  const [dodgeCards, setDodgeCards] = useState<Card[]>([]);
  const [form, setForm] = useState<PatternFormState>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = () => {
    setPatterns(adminDataService.getPatterns());
    setDareCards(adminDataService.getActiveDares());
    setDodgeCards(adminDataService.getActiveDodges());
  };

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setError('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setError('Pattern name is required.');
      return;
    }

    const duplicateName = patterns.some(
      pattern => pattern.name.toLowerCase() === trimmedName.toLowerCase() && pattern.id !== form.id
    );
    if (duplicateName) {
      setError('Another pattern already uses this name.');
      return;
    }

    const invalidStep = form.steps.some(step => !step.dareCardId);
    if (invalidStep) {
      setError('Each step must have a Dare card selected.');
      return;
    }

    let updatedPatterns = [...patterns];
    if (form.id) {
      updatedPatterns = updatedPatterns.map(pattern =>
        pattern.id === form.id
          ? { ...pattern, name: trimmedName, fallbackMode: form.fallbackMode, steps: form.steps }
          : pattern
      );
    } else {
      const newPattern: CardPattern = {
        id: createId(),
        name: trimmedName,
        fallbackMode: form.fallbackMode,
        steps: form.steps,
      };
      updatedPatterns.push(newPattern);
    }

    adminDataService.savePatterns(updatedPatterns);
    setPatterns(updatedPatterns);
    resetForm();
  };

  const editPattern = (pattern: CardPattern) => {
    setForm({
      id: pattern.id,
      name: pattern.name,
      fallbackMode: pattern.fallbackMode,
      steps: pattern.steps.map(step => ({ ...step })),
    });
    setIsEditing(true);
    setError('');
  };

  const deletePattern = (id: string) => {
    if (!confirm('Delete this pattern?')) return;
    const updated = patterns.filter(p => p.id !== id);
    adminDataService.savePatterns(updated);
    setPatterns(updated);
    if (form.id === id) resetForm();
  };

  const addStep = () => {
    setForm(prev => ({
      ...prev,
      steps: [...prev.steps, { id: createId(), dareCardId: '', dodgeCardId: undefined }],
    }));
  };

  const updateStep = (stepId: string, updates: Partial<PatternStep>) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map(step => (step.id === stepId ? { ...step, ...updates } : step)),
    }));
  };

  const removeStep = (stepId: string) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId),
    }));
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    setForm(prev => {
      const steps = [...prev.steps];
      const index = steps.findIndex(step => step.id === stepId);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= steps.length) return prev;

      const temp = steps[index];
      steps[index] = steps[targetIndex];
      steps[targetIndex] = temp;

      return { ...prev, steps };
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-amber-400">Card Patterns</h2>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
        <h3 className="text-lg font-bold text-amber-100">
          {isEditing ? 'Edit Pattern' : 'Create New Pattern'}
        </h3>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Pattern Name</label>
            <input
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-amber-500"
              placeholder="e.g. Tutorial Script"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Fallback Mode</label>
            <select
              value={form.fallbackMode}
              onChange={e =>
                setForm(prev => ({ ...prev, fallbackMode: e.target.value as PatternFormState['fallbackMode'] }))
              }
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-amber-500"
            >
              <option value="random">Random – draw random dare after sequence ends</option>
              <option value="loop">Loop – restart sequence when it ends</option>
              <option value="stop">Stop – treat future turns as random after sequence</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs uppercase font-bold text-slate-500">Pattern Steps</label>
              <Button type="button" variant="secondary" className="py-2 text-sm" onClick={addStep}>
                Add Step
              </Button>
            </div>

            {form.steps.length === 0 && (
              <p className="text-sm text-slate-500 italic">No steps yet. Add one to start scripting.</p>
            )}

            <div className="space-y-3">
              {form.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-xs uppercase font-bold text-slate-400">
                      Step {index + 1}
                    </p>
                    <div className="flex gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => moveStep(step.id, 'up')}
                        disabled={index === 0}
                        className="text-slate-500 hover:text-white disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(step.id, 'down')}
                        disabled={index === form.steps.length - 1}
                        className="text-slate-500 hover:text-white disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="text-rose-500 hover:text-rose-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                        Dare Card
                      </label>
                      <select
                        value={step.dareCardId}
                        onChange={e => updateStep(step.id, { dareCardId: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm outline-none"
                      >
                        <option value="">Select Dare...</option>
                        {dareCards.map(card => (
                          <option key={card.id} value={card.id}>
                            [{card.difficulty}] {card.text.slice(0, 60)}
                            {card.text.length > 60 ? '…' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                        Optional Dodge
                      </label>
                      <select
                        value={step.dodgeCardId || ''}
                        onChange={e =>
                          updateStep(step.id, { dodgeCardId: e.target.value || undefined })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm outline-none"
                      >
                        <option value="">No scripted dodge</option>
                        {dodgeCards.map(card => (
                          <option key={card.id} value={card.id}>
                            {card.text.slice(0, 60)}
                            {card.text.length > 60 ? '…' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-rose-400 text-sm font-bold">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" className="py-2">
              {isEditing ? 'Update Pattern' : 'Create Pattern'}
            </Button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white font-bold">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

  <div className="space-y-4">
        {patterns.map(pattern => (
          <div key={pattern.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-amber-100">{pattern.name}</h3>
                <p className="text-xs text-slate-500 uppercase font-bold">
                  Fallback: {pattern.fallbackMode}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editPattern(pattern)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePattern(pattern.id)}
                  className="text-rose-500 hover:text-rose-400 text-sm font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Steps: {pattern.steps.length}
            </p>
          </div>
        ))}
        {patterns.length === 0 && (
          <p className="text-center text-slate-500 italic">No patterns created yet.</p>
        )}
      </div>
    </div>
  );
};

export default PatternManager;