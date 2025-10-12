
import React, { useState, useEffect } from 'react';
import type { Referee } from '../types.ts';
import Button from './ui/Button.tsx';

interface RefereeFormProps {
  referee?: Referee | null;
  onSave: (data: { name: string }) => void;
  onClose: () => void;
}

const RefereeForm: React.FC<RefereeFormProps> = ({ referee, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (referee) {
      setName(referee.name);
    } else {
      setName('');
    }
    setError('');
  }, [referee]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Referee name is required.');
      return;
    }
    onSave({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Referee Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default RefereeForm;
