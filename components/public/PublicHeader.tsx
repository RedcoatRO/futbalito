import React from 'react';

interface NavItem {
  name: string;
  href: string;
}

interface PublicHeaderProps {
  logoUrl: string;
  title: string;
  primaryColor: string;
  navItems?: NavItem[];
}

/**
 * A reusable header for all public-facing pages.
 * It displays a logo, title, and an optional navigation menu.
 * @param {PublicHeaderProps} props The component props.
 * @returns {JSX.Element} The rendered header component.
 */
const PublicHeader: React.FC<PublicHeaderProps> = ({ logoUrl, title, primaryColor, navItems }) => {
  return (
    <header className="p-6 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
          <h2 className="ml-4 text-xl font-bold" style={{ color: primaryColor }}>{title}</h2>
        </div>
        {navItems && navItems.length > 0 && (
          <nav className="hidden md:flex space-x-6">
            {navItems.map(item => (
              <a key={item.name} href={item.href} className="text-sm font-semibold text-gray-600 hover:text-gray-900">{item.name}</a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;
