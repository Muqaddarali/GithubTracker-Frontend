
import React from 'react';
import { GithubIcon, BarChartIcon, UsersIcon, HomeIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState(false);
  
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
            {[
              { icon: <HomeIcon size={20} />, label: 'Dashboard', active: true },
              { icon: <BarChartIcon size={20} />, label: 'Analytics', active: false },
              { icon: <UsersIcon size={20} />, label: 'Team', active: false },
              { icon: <SettingsIcon size={20} />, label: 'Settings', active: false },
            ].map((item, idx) => (
              <li key={idx}>
                <a 
                  href="#" 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors
                    ${item.active 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }
                    ${collapsed && !isMobile ? 'justify-center' : ''}
                  `}
                >
                  {item.icon}
                  {(!collapsed || isMobile) && <span>{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User */}
        <div className={`p-4 border-t border-sidebar-border ${collapsed && !isMobile ? 'items-center justify-center' : ''} flex gap-3`}>
          <div className="flex-shrink-0">
            <img 
              src="https://ui-avatars.com/api/?name=Demo+User&background=random" 
              alt="User" 
              className="h-8 w-8 rounded-full"
            />
          </div>
          {(!collapsed || isMobile) && (
            <div className="overflow-hidden">
              <p className="text-sidebar-foreground font-medium truncate">Demo User</p>
              <p className="text-sidebar-foreground/60 text-sm truncate">demo@example.com</p>
            </div>
          )}
          {(!collapsed || isMobile) && (
            <Button variant="ghost" size="icon" className="ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOutIcon size={18} />
            </Button>
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
