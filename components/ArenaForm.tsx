

import React, { useState, useEffect } from 'react';
// FIX: Added .ts extension to module import.
import type { Arena } from '../types.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from './ui/Button.tsx';
// FIX: Added .tsx extension to module import.
import { PlusIcon, XMarkIcon } from './icons/Icons.tsx';

interface ArenaFormProps {
  arena?: Arena | null;
  onSave: (data: { name: string; location: string; fields: string[] }) => void;
  onClose: () => void;
}

const ArenaForm: React.FC<ArenaFormProps> = ({ arena, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [fields, setFields] = useState<string[]>(['Field 1']);
  const [error, setError] = useState('');

  useEffect(() => {
    if (arena) {
      setName(arena.name);
      setLocation(arena.location);
      setFields(arena.fields.length > 0 ? arena.fields : ['Field 1']);
    } else {
      setName(''); setLocation(''); setFields(['Field 1']);
    }
    setError('');
  }, [arena]);

  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };

  const addField = () => {
    if (fields.length < 6) {
      setFields([...fields, `Field ${fields.length + 1}`]);
    }
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      setError('Name and location are required.');
      return;
    }
    onSave({ name, location, fields: fields.filter(f => f.trim()) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div><label htmlFor="name" className="block text-sm font-medium">Arena Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        <div><label htmlFor="location" className="block text-sm font-medium">Location</label><input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        <div>
            <label className="block text-sm font-medium mb-1">Playing Fields</label>
            {fields.map((field, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                    <input type="text" value={field} onChange={(e) => handleFieldChange(index, e.target.value)} className="flex-grow border rounded-md p-2" />
                    {fields.length > 1 && <button type="button" onClick={() => removeField(index)} className="p-1 text-red-500 hover:text-red-700"><XMarkIcon className="h-5 w-5"/></button>}
                </div>
            ))}
            {fields.length < 6 && <Button type="button" variant="outline" onClick={addField}><PlusIcon className="h-4 w-4 mr-1"/> Add Field</Button>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></div>
    </form>
  );
};

export default ArenaForm;
