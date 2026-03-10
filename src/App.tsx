import Layout from './components/layout/Layout';
import { ReactLenis } from 'lenis/react';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import WorkWithMe from './components/sections/WorkWithMe';
import { usePortfolioStore } from './store/usePortfolioStore';

function App() {
  const { introComplete } = usePortfolioStore();

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
        autoRaf: false,
      }}
    >
      <Layout>
        <Hero />
        <div
          className={`transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ transitionDelay: introComplete ? '0.3s' : '0s' }}
        >
          <Projects />
          <WorkWithMe />
        </div>
      </Layout>
    </ReactLenis>
  );
}

export default App;
