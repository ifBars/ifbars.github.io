import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Contributions from './components/sections/Contributions';
import { usePortfolioStore } from './store/usePortfolioStore';

function App() {
  const { introComplete } = usePortfolioStore();

  return (
    <Layout>
      <Hero />
      <div 
        className={`transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transitionDelay: introComplete ? '0.3s' : '0s' }}
      >
        <Projects />
        <Contributions />
      </div>
    </Layout>
  );
}

export default App;
