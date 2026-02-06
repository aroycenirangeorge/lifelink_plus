import { useState } from 'react';
import { ThemeProvider } from "@/app/components/theme-provider"
import { Toaster } from "@/app/components/ui/sonner"
import { Navbar } from '@/app/components/Navbar';
import { AIChatbot } from '@/app/components/AIChatbot';
import { Footer } from '@/app/components/Footer';
import { HomePage } from '@/app/pages/HomePage';
import { DashboardPage } from '@/app/pages/DashboardPage';
import { BloodPage } from '@/app/pages/BloodPage';
import { DonationsPage } from '@/app/pages/DonationsPage';
import { DisasterPage } from '@/app/pages/DisasterPage';
import { EventsPage } from '@/app/pages/EventsPage';
import { AdminPage } from '@/app/pages/AdminPage';

type Page = 'home' | 'dashboard' | 'blood' | 'donations' | 'disaster' | 'events' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'blood':
        return <BloodPage onNavigate={handleNavigate} />;
      case 'donations':
        return <DonationsPage onNavigate={handleNavigate} />;
      case 'disaster':
        return <DisasterPage onNavigate={handleNavigate} />;
      case 'events':
        return <EventsPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme" attribute="class">
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {currentPage !== 'home' && <Navbar currentPage={currentPage} onNavigate={handleNavigate} />}
        <main className="fade-in">{renderPage()}</main>
        {currentPage !== 'home' && <Footer onNavigate={handleNavigate} />}
        <AIChatbot />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}