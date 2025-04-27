
import React from 'react';
import { GithubIcon, BarChartIcon, UsersIcon, HomeIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  
  // Get current repository data
  const repoOwner = localStorage.getItem('repoOwner') || '';
  const repoName = localStorage.getItem('repoName') || '';
  
  const navigationLinks = [
    { icon: <HomeIcon size={20} />, label: 'Dashboard', path: '/' },
    { icon: <BarChartIcon size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <UsersIcon size={20} />, label: 'Team', path: '/team' },
    { icon: <SettingsIcon size={20} />, label: 'Settings', path: '/settings' },
  ];
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`${collapsed && !isMobile ? 'w-16' : 'w-64'} bg-sidebar transition-all duration-300 border-r border-sidebar-border flex flex-col`}>
        {/* Logo */}
        <div className={`p-4 flex items-center ${collapsed && !isMobile ? 'justify-center' : 'justify-between'} border-b border-sidebar-border`}>
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-2">
              <GithubIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-sidebar-foreground">GitPulse</span>
            </div>
          )}
          {collapsed && !isMobile && <GithubIcon className="h-6 w-6 text-primary" />}
          
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {collapsed ? '→' : '←'}
            </Button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 pt-6">
          <ul className="space-y-1 px-2">
            {navigationLinks.map((item, idx) => (
              <li key={idx}>
                <Link 
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors
                    ${location.pathname === item.path 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }
                    ${collapsed && !isMobile ? 'justify-center' : ''}
                  `}
                >
                  {item.icon}
                  {(!collapsed || isMobile) && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User */}
        <div className={`p-4 border-t border-sidebar-border ${collapsed && !isMobile ? 'items-center justify-center' : ''} flex gap-3`}>
          <div className="flex-shrink-0">
            <img 
              src="https://ui-avatars.com/api/?name=GitHub+User&background=random" 
              alt="User" 
              className="h-8 w-8 rounded-full"
            />
          </div>
          {(!collapsed || isMobile) && (
            <div className="overflow-hidden">
              <p className="text-sidebar-foreground font-medium truncate">{repoOwner || 'GitHub User'}</p>
              <p className="text-sidebar-foreground/60 text-sm truncate">{repoName || 'No Repository'}</p>
            </div>
          )}
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;