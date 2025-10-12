import React from 'react';
import Card from '../components/ui/Card.tsx';

const ManageNationalTeam: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Manage National Team</h1>
      <p className="mt-2 text-gray-600">This feature is under construction.</p>
      <Card className="mt-8">
        <p className="text-center text-gray-500">
          The national team management module is coming soon. You'll be able to assemble squads, manage player call-ups, and track international stats here.
        </p>
      </Card>
    </div>
  );
};

export default ManageNationalTeam;
