import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import { ReactLenis } from 'lenis/react';
import Hero from './components/sections/Hero';
import { usePortfolioStore } from './store/usePortfolioStore';

const Projects = lazy(() => import('./components/sections/Projects'));
const WorkWithMe = lazy(() => import('./components/sections/WorkWithMe'));

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
          {introComplete && (
            <Suspense fallback={null}>
              <Projects />
              <WorkWithMe />
            </Suspense>
          )}
        </div>
      </Layout>
    </ReactLenis>
  );
}

export default App;
