import React from 'react';
import type { Page } from '../types';
import usePermissions from '../hooks/usePermissions';
import { HomeIcon, EyeIcon, WrenchScrewdriverIcon, PencilSquareIcon, Cog6ToothIcon, ShoppingCartIcon, ShieldCheckIcon, UserGroupIcon, UserIcon, MapPinIcon } from './icons/Icons';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, isOpen }) => {
  const { hasPermission } = usePermissions();

  const navItems = [
    { page: 'DASHBOARD', label: 'Dashboard', icon: HomeIcon, requiredPermission: true },
    { page: 'BROWSE', label: 'Browse', icon: EyeIcon, requiredPermission: true },
    { page: 'MANAGE_COMPETITIONS', label: 'Competitions', icon: WrenchScrewdriverIcon, requiredPermission: hasPermission('competitions:edit') },
    { page: 'MANAGE_TEAMS', label: 'Teams', icon: UserGroupIcon, requiredPermission: hasPermission('teams:edit') },
    { page: 'MANAGE_PLAYERS', label: 'Players', icon: UserIcon, requiredPermission: hasPermission('players:manage') },
    { page: 'MANAGE_ARENAS', label: 'Arenas', icon: MapPinIcon, requiredPermission: hasPermission('arenas:manage') },
    { page: 'PUBLISH', label: 'Publish', icon: PencilSquareIcon, requiredPermission: hasPermission('publish:manage_articles') || hasPermission('publish:customize_sites') },
    { page: 'SETTINGS', label: 'Settings', icon: Cog6ToothIcon, requiredPermission: hasPermission('settings:manage_organization') || hasPermission('users:invite') },
    { page: 'MARKETPLACE', label: 'Marketplace', icon: ShoppingCartIcon, requiredPermission: true },
  ];
  
  const visibleNavItems = navItems.filter(item => item.requiredPermission);

  const parentPages: Partial<Record<Page, Page>> = {
    'COMPETITION_DETAIL': 'MANAGE_COMPETITIONS',
    'LIVE_MATCH': 'MANAGE_COMPETITIONS',
    'WEB_BUILDER': 'PUBLISH',
    'PORTAL_BUILDER': 'PUBLISH',
    'MANAGE_ARTICLES': 'PUBLISH',
    'EDIT_ARTICLE': 'PUBLISH',
    'MANAGE_MEDIA': 'PUBLISH',
    'EDIT_GALLERY': 'PUBLISH',
    'MANAGE_SPONSORS': 'PUBLISH',
  };

  const activePage = parentPages[currentPage] || currentPage;

  return (
    <div className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col transition-width duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center h-16 px-6 border-b border-gray-200 flex-shrink-0">
        <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
        {isOpen && <span className="ml-3 text-xl font-bold text-gray-800">Futbalito</span>}
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {visibleNavItems.map((item) => {
          const isActive = activePage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-6 w-6 ${isOpen ? '' : 'mx-auto'}`} />
              {isOpen && <span className="ml-4">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="flex-1"></div>
    </div>
  );
};

export default Sidebar;