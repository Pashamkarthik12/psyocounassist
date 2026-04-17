import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Home, Mic, FileText, BarChart3, Info, LogOut } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/speech', label: 'Speech', icon: Mic },
    { path: '/text', label: 'Text', icon: FileText },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-teal-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-teal-600" />
            <span className="text-xl font-bold text-teal-700">PsyCounAssist</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 ml-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              data-testid="nav-logout"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
