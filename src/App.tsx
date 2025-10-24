import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Organizations from './components/sections/Organizations';
import MusicPlayer from './components/MusicPlayer';

function App() {
  return (
    <Layout>
      <Hero />
      <Projects />
      <Organizations />
      <MusicPlayer />
    </Layout>
  );
}

export default App;
