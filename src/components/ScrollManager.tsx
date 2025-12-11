import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollManager() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis with GSAP Ticker
    // The time passed to the ticker callback is in seconds, Lenis needs milliseconds
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      // We don't need to destroy lenis as it's managed by ReactLenis
    };
  }, [lenis]);

  useEffect(() => {
    // Setup scroll-jacking for each section
    const sections = ['#hero', '#projects', '#contributions', '#organizations'];

    sections.forEach((selector) => {
      const section = document.querySelector(selector);
      if (!section) return;

      ScrollTrigger.create({
        trigger: selector,
        start: 'top top',
        end: 'bottom top',
        pin: false,
        scrub: false,
        onEnter: () => {
          // Section is entering viewport - trigger animations
          section.classList.add('section-active');
        },
        onLeave: () => {
          // Section is leaving viewport
          section.classList.remove('section-active');
        },
        onEnterBack: () => {
          // Scrolling back up to this section
          section.classList.add('section-active');
        },
        onLeaveBack: () => {
          // Scrolling back up past this section
          section.classList.remove('section-active');
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
