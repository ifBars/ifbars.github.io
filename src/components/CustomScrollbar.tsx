import { useEffect, useRef, useState, useCallback } from 'react';
import { useLenis } from 'lenis/react';
import { gsap } from 'gsap';

export default function CustomScrollbar() {
    const lenis = useLenis();
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Update thumb size and position
    const updateScrollbar = useCallback(() => {
        if (!lenis || !trackRef.current || !thumbRef.current) return;

        const { scroll, limit } = lenis;
        const viewportHeight = window.innerHeight;
        const contentHeight = limit + viewportHeight;

        // Calculate thumb height as a percentage of viewport
        // Minimum height of 50px for usability
        const height = Math.max(
            (viewportHeight / contentHeight) * viewportHeight,
            50
        );

        // Calculate scroll progress (0 to 1)
        const progress = scroll / limit;

        // Calculate thumb position
        // We need to subtract thumb height from track height (viewport) to map 0-1 correctly
        const availableHeight = viewportHeight - height;
        const top = progress * availableHeight;

        // Apply styles directly for performance
        thumbRef.current.style.height = `${height}px`;
        thumbRef.current.style.transform = `translateY(${top}px)`;
    }, [lenis]);

    // Handle dragging
    useEffect(() => {
        const thumb = thumbRef.current;
        if (!thumb || !trackRef.current || !lenis) return;

        let startY = 0;
        let startScroll = 0;

        const onPointerDown = (e: PointerEvent) => {
            setIsDragging(true);
            startY = e.clientY;
            startScroll = lenis.scroll;

            // Prevent text selection during drag
            document.body.style.userSelect = 'none';

            setExpand(true);

            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
        };

        const onPointerMove = (e: PointerEvent) => {
            e.preventDefault();
            const deltaY = e.clientY - startY;
            const viewportHeight = window.innerHeight;
            const thumbHeight = thumbRef.current?.offsetHeight || 0;
            const availableHeight = viewportHeight - thumbHeight;

            // Calculate how much we moved in relation to the available track
            const ratio = deltaY / availableHeight;

            // Apply that ratio to the scroll limit
            const targetScroll = startScroll + (ratio * lenis.limit);

            lenis.scrollTo(targetScroll, { immediate: true });
        };

        const onPointerUp = () => {
            setIsDragging(false);
            setExpand(false);
            document.body.style.userSelect = '';
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        thumb.addEventListener('pointerdown', onPointerDown);

        return () => {
            thumb.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [lenis]);

    // Sync with Lenis scroll and Resize
    useEffect(() => {
        if (!lenis) return;

        // Update initially
        updateScrollbar();

        // Listen to scroll
        lenis.on('scroll', updateScrollbar);

        // Provide a resize observer to update when content changes
        const resizeObserver = new ResizeObserver(() => {
            updateScrollbar();
        });
        resizeObserver.observe(document.body);

        return () => {
            lenis.off('scroll', updateScrollbar);
            resizeObserver.disconnect();
        };
    }, [lenis, updateScrollbar]);

    // Use a ref for direct GSAP animation if needed, or just classes
    // Let's use simple React state for width/opacity to keep it clean, or GSAP if we want "integration" feeling

    const setExpand = (expand: boolean) => {
        if (!trackRef.current) return;
        const thumb = thumbRef.current;
        if (!thumb) return;

        if (expand) {
            gsap.to(thumb, {
                width: 6,
                duration: 0.3,
                ease: 'power2.out',
                backgroundColor: 'var(--gold)'
            });
            gsap.to(trackRef.current, {
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                width: 12,
                duration: 0.3
            });
        } else {
            gsap.to(thumb, {
                width: 2,
                duration: 0.3,
                ease: 'power2.out',
                backgroundColor: 'var(--gold)' // Keep gold but thin
            });
            gsap.to(trackRef.current, {
                backgroundColor: 'transparent',
                width: 12, // Keep hit area
                duration: 0.3
            });
        }
    };

    useEffect(() => {
        if (!thumbRef.current) return;
        // Initialize state
        gsap.set(thumbRef.current, { width: 2, backgroundColor: 'var(--gold)', borderRadius: 4 });
    }, []);

    return (
        <div
            ref={trackRef}
            className={`fixed top-0 right-0 h-full z-[100] transition-opacity duration-300 ${!lenis ? 'opacity-0' : 'opacity-100'}`}
            style={{ width: '12px' }}
            onPointerEnter={() => !isDragging && setExpand(true)}
            onPointerLeave={() => !isDragging && setExpand(false)}
        >
            <div
                ref={thumbRef}
                className="absolute right-[2px] rounded-full cursor-grab active:cursor-grabbing"
                style={{ width: '2px', backgroundColor: 'var(--gold)' }}
            />
        </div>
    );
}
