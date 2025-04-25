import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import MusicPlayer from './components/MusicPlayer';

function App() {
  return (
    <Layout>
      <Hero />
      <Projects />
      <MusicPlayer />
    </Layout>
  );
}

export default App;
