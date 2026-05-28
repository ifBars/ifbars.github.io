import { useState } from 'react';

interface ProjectImageProps {
    src: string;
    alt: string;
    className?: string;
    fallbackClassName?: string;
    style?: React.CSSProperties;
}

export default function ProjectImage({ src, alt, className = '', fallbackClassName = '', style }: ProjectImageProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div
                className={`flex h-full w-full items-center justify-center bg-neutral-950 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600 ${fallbackClassName}`}
                style={style}
                aria-label={alt}
            >
                Preview unavailable
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            style={style}
            onError={() => setHasError(true)}
        />
    );
}
