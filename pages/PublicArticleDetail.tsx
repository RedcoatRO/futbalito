
import React from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { ShieldCheckIcon, ChevronLeftIcon } from '../components/icons/Icons.tsx';

interface PublicArticleDetailProps {
  competitionId: string;
  articleId: string;
}

const PublicArticleDetail: React.FC<PublicArticleDetailProps> = ({ competitionId, articleId }) => {
  const { getCompetitionById, getArticleById } = useCompetitions();
  const competition = getCompetitionById(competitionId);
  const article = getArticleById(articleId);

  if (!competition || !article || !competition.publicConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700">Article Not Found</h1>
          <p className="text-gray-500 mt-2">The requested article is not available.</p>
        </div>
      </div>
    );
  }

  const { publicConfig } = competition;
  const backUrl = `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}`;

  return (
    <div style={{ backgroundColor: publicConfig.backgroundColor }} className="min-h-screen font-sans">
      <header className="p-6">
        <div className="container mx-auto flex items-center">
            <img src={publicConfig.logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover"/>
            <h2 className="ml-4 text-xl font-bold" style={{ color: publicConfig.primaryColor }}>{publicConfig.title}</h2>
        </div>
      </header>
      <main className="container mx-auto py-12 px-6">
        <a href={backUrl} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-8">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to News
        </a>
        <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={article.featuredImageUrl} alt={article.title} className="w-full h-64 object-cover" />
            <div className="p-8">
                <h1 className="text-4xl font-extrabold text-gray-900">{article.title}</h1>
                <p className="text-sm text-gray-500 mt-4">
                    Published on {new Date(article.createdAt).toLocaleDateString()} by {article.author}
                </p>
                <div className="mt-8 prose prose-lg max-w-none">
                    {article.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </article>
      </main>
      <footer className="py-8 mt-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)'}}>
        <div className="container mx-auto text-center text-gray-500 flex items-center justify-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400"/>
            Powered by Futbalito
        </div>
      </footer>
    </div>
  );
};

export default PublicArticleDetail;
