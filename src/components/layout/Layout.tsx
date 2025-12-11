import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollManager from '../ScrollManager';
import CustomScrollbar from '../CustomScrollbar';
import { usePortfolioStore } from '../../store/usePortfolioStore';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { introComplete } = usePortfolioStore();

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#050505] overflow-x-hidden">
      <ScrollManager />
      <CustomScrollbar />
      <div
        className={`transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transitionDelay: introComplete ? '0.3s' : '0s' }}
      >
        <Header />
      </div>
      <main className="flex-grow flex flex-col relative w-full z-10">
        {children}
      </main>
      <div
        className={`transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transitionDelay: introComplete ? '0.3s' : '0s' }}
      >
        <Footer />
      </div>
    </div>
  );
} 