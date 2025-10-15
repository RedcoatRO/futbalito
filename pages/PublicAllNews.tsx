import React from 'react';
import Card from '../components/ui/Card.tsx';

const PublicAllNews: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">All News</h1>
      <p className="mt-2 text-gray-600">This feature is under construction.</p>
      <Card className="mt-8">
        <p className="text-center text-gray-500">
          This page will display all news articles.
        </p>
      </Card>
    </div>
  );
};

export default PublicAllNews;
