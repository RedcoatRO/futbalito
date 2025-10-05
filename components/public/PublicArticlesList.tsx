import React from 'react';
import { useCompetitions } from '../../context/CompetitionContext';

interface PublicArticlesListProps {
  competitionId: string;
}

const PublicArticlesList: React.FC<PublicArticlesListProps> = ({ competitionId }) => {
  const { articles } = useCompetitions();
  const publicArticles = articles.filter(a => a.competitionId === competitionId && a.status === 'published');

  if (publicArticles.length === 0) {
    return null;
  }

  const publicUrl = (articleId: string) => `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}&articleId=${articleId}`;

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publicArticles.map(article => (
          <a href={publicUrl(article.id)} key={article.id} className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <img src={article.featuredImageUrl} alt={article.title} className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{article.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{new Date(article.createdAt).toLocaleDateString()}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PublicArticlesList;
