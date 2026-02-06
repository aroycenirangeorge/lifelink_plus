import { useState, useEffect } from "react";
import {
  Heart,
  Droplet,
  DollarSign,
  AlertTriangle,
  Calendar,
  User,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Home,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useTheme } from "next-themes";
import { currentUser } from "@/data/mockData";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({
  currentPage,
  onNavigate,
}: NavbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);
    
    // Log current theme for debugging
    console.log('Current theme:', theme);
  }, [theme]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, description: "Overview & stats" },
    { id: "blood", label: "Blood Bank", icon: Droplet, description: "Donations & requests" },
    { id: "donations", label: "Donations", icon: DollarSign, description: "Fundraising" },
    { id: "disaster", label: "Disaster Relief", icon: AlertTriangle, description: "Emergency aid" },
    { id: "events", label: "Events", icon: Calendar, description: "Community events" },
  ];

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Modern Navigation Bar */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Section - Menu & Logo */}
            <div className="flex items-center gap-4">
              {/* Menu Button */}
              {userRole !== 'client' && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface hover:bg-surface-elevated transition-all duration-200 group"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" strokeWidth={2} />
                </button>
              )}

              {/* Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onNavigate("home")}
              >
                <div className="relative">
                  <div className="absolute inset-0 gradient-brand rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-200 blur-xl" />
                  <div className="relative gradient-brand p-2 rounded-xl shadow-brand-sm">
                    <Heart className="w-5 h-5 text-white" fill="white" />
                  </div>
                </div>
                <div>
                  <span className="text-lg font-bold gradient-brand-text">LifeLink+</span>
                  <div className="text-xs text-text-tertiary">Saving Lives Together</div>
                </div>
              </div>
            </div>

            {/* Center Section - Search (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-quaternary" />
                <input
                  type="text"
                  placeholder="Search features, donations, events..."
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-border-subtle rounded-xl text-sm placeholder:text-text-quaternary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              
              {/* Search Button (Mobile) */}
              <button
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-surface hover:bg-surface-elevated transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-text-secondary" strokeWidth={2} />
              </button>

              {/* Notifications */}
              {userRole !== 'client' && (
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-surface hover:bg-surface-elevated transition-all duration-200"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-text-secondary" strokeWidth={2} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  const newTheme = theme === "dark" ? "light" : "dark";
                  setTheme(newTheme);
                  console.log('Theme changed to:', newTheme);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface hover:bg-surface-elevated border border-border-subtle transition-all duration-300 hover:scale-105 group"
                aria-label="Toggle theme"
              >
                {mounted && (
                  theme === "dark" ? (
                    <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" strokeWidth={2} />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-500 group-hover:text-blue-400 transition-colors" strokeWidth={2} />
                  )
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                {userRole === 'client' && (
                  <Button
                    onClick={() => {
                      localStorage.setItem('userRole', 'user');
                      window.location.reload();
                    }}
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-600 hover:bg-brand-50 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium text-sm">Exit Client View</span>
                  </Button>
                )}
                
                {userRole !== 'client' && (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface hover:bg-surface-elevated transition-all duration-200 group"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center">
                      <User className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-text-primary">{currentUser.name}</div>
                      <div className="text-xs text-text-tertiary">Volunteer</div>
                    </div>
                  </button>
                )}

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 glass-effect rounded-2xl shadow-xl border border-border-subtle py-2 z-50 fade-in">
                      <div className="px-4 py-3 border-b border-border-subtle">
                        <div className="text-sm font-medium text-text-primary">{currentUser.name}</div>
                        <div className="text-xs text-text-tertiary">{currentUser.email}</div>
                      </div>
                      
                      <div className="py-2">
                        <button 
                          onClick={() => {
                            setUserMenuOpen(false);
                            onNavigate("dashboard");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                      </div>
                      
                      <div className="border-t border-border-subtle pt-2">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            localStorage.removeItem('userRole');
                            onNavigate("home");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Modern Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 glass-effect shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 gradient-brand rounded-xl opacity-20 blur-xl" />
              <div className="relative gradient-brand p-2 rounded-xl">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold gradient-brand-text">LifeLink+</span>
              <div className="text-xs text-text-tertiary">Navigation</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-surface transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </Button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center shadow-brand-sm">
              <User className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-text-primary">User</div>
              <div className="text-sm text-text-tertiary">Volunteer</div>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-xs text-text-quaternary">Active now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1">
          <div className="text-xs font-medium text-text-quaternary uppercase tracking-wider px-4 py-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "gradient-brand text-white shadow-brand-md"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-current"}`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${isActive ? "text-white/80" : "text-text-quaternary"}`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-subtle bg-surface/50">
          <div className="text-xs text-text-quaternary text-center">
            © 2026 LifeLink+ • Made with ❤️ by HumanityOS
          </div>
        </div>
      </div>
    </>
  );
}