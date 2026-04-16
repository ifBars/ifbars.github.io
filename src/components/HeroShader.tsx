import { useState, useCallback, useRef } from 'react';
import {
  Shader,
  Ascii,
  Liquify,
  SimplexNoise,
  LinearGradient,
  BrightnessContrast,
  RoundedRect,
} from 'shaders/react';

export default function HeroShader() {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleClick = useCallback(() => {
    setActive(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActive(false), 700);
  }, []);

  return (
    <div
      className="absolute inset-x-0 -z-10"
      style={{
        top: 0,
        bottom: '-30vh',
        maskImage: 'linear-gradient(to bottom, black 50%, black 70%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, black 70%, transparent 100%)',
      }}
      onClick={handleClick}
    >
      <Shader className="w-full h-full">
        <LinearGradient
          id="focusMask"
          colorA="#ffffff"
          colorB="#000000"
          angle={270}
          visible={false}
        />
        <RoundedRect
          id="textCutout"
          color="#000000"
          width={0.44}
          height={0.72}
          center={{ x: 0.2, y: 0.5 }}
          rounding={0.03}
          softness={0.03}
          visible={false}
        />
        <Liquify
          intensity={active ? 18 : 8}
          radius={active ? 0.6 : 0.38}
          stiffness={active ? 1.8 : 3.2}
          damping={active ? 2.4 : 3.6}
        >
          <BrightnessContrast
            brightness={active ? 0.25 : 0}
            contrast={active ? 0.3 : 0}
          >
            <Ascii
              characters=" .·:;-=+*#%@"
              cellSize={12}
              fontFamily="JetBrains Mono"
              spacing={0.9}
              gamma={active ? 0.35 : 0.6}
              maskSource="textCutout"
              maskType="luminanceInverted"
            >
              <SimplexNoise
                colorA="#cccccc"
                colorB="#0a0a0a"
                scale={active ? 4 : 2.5}
                speed={active ? 1.5 : 0.4}
                balance={active ? 15 : -10}
                contrast={active ? 50 : 30}
                maskSource="focusMask"
                maskType="luminance"
              />
            </Ascii>
          </BrightnessContrast>
        </Liquify>
      </Shader>

    </div>
  );
}
