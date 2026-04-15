document.addEventListener('DOMContentLoaded', () => {
    // --- New Crackin Style GSAP Loading Animation ---
    const crackinLoader = document.getElementById('crackin-loader');
    const perceEl = document.getElementById('loader-perc');

    if (crackinLoader && perceEl && typeof gsap !== 'undefined') {
        let counter = { value: 0 };
        gsap.to(counter, {
            value: 100,
            duration: 1.5,
            ease: "circ.inOut",
            onUpdate: () => {
                perceEl.innerText = Math.round(counter.value);
            },
            onComplete: () => {
                gsap.to(crackinLoader, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut",
                    delay: 0.1,
                    onComplete: () => {
                        crackinLoader.style.display = 'none';
                        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
                    }
                });
            }
        });
    }

    // 1. Loading Animation & Hero Sequence (Crackin style)
    const loader = document.querySelector('.loader');
    const bg = document.querySelector('.loader-bg');
    const textWrapper = document.querySelector('.loader-text-wrapper');
    const header = document.querySelector('.js-header-reveal');
    const heroBg = document.querySelector('.js-hero-bg');
    const heroTexts = document.querySelectorAll('.js-hero-text-reveal');
    const heroSubs = document.querySelectorAll('.js-hero-sub-reveal');

    // 2. GSAP Scroll Reveal & Text Flicker (FunTech Style)
    const initReveal = () => {
        if (typeof gsap === 'undefined') return;

        // Simple Fade Ups
        const revealElements = document.querySelectorAll('.js-reveal');
        revealElements.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 40 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                }
            );
            // Remove pure CSS classes since GSAP handles it
            el.classList.remove('js-reveal');
        });

        // Crackin Style Scramble/Flicker Text Reveal
        const textElements = document.querySelectorAll('.js-text-reveal');
        textElements.forEach(el => {
            const text = el.innerText;
            if (!text) return;
            el.innerHTML = '';

            // Split text manually handling newlines
            const chars = text.split('').map(char => {
                if (char === '\n') {
                    el.appendChild(document.createElement('br'));
                    return null;
                }
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.dataset.orig = char === ' ' ? '\u00A0' : char; // Keep original char for hover
                span.style.opacity = '0';
                span.style.display = 'inline-block';
                el.appendChild(span);
                return span;
            });
            const validChars = chars.filter(c => c !== null);

            gsap.fromTo(validChars,
                { opacity: 0, scale: 1.2, filter: "blur(4px)" },
                {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 0.1,
                    stagger: {
                        each: 0.04,
                        from: "random" // Cyberpunk random decoding effect!
                    },
                    ease: "power1.inOut",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                    },
                    onComplete: () => {
                        el.classList.add('is-revealed'); // Triggers the terminal blinking cursor
                    }
                }
            );

            // --- Crackin Hover Scramble Effect ---
            const isJapanese = el.classList.contains('jp-main') || el.classList.contains('jp') || /[ぁ-んァ-ン一-龥]/.test(text);
            const pool = isJapanese
                ? 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'
                : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

            if (window.matchMedia("(hover: hover)").matches) {
                el.addEventListener('mouseenter', () => {
                    validChars.forEach(span => {
                        const orig = span.dataset.orig;
                        // Avoid scrambling spaces and punctuation for visual cleanliness
                        if (orig === '\u00A0' || orig === ' ' || orig === '、' || orig === '。' || orig === '_') return;

                        let iter = 0;
                        const maxIter = Math.floor(Math.random() * 8) + 5; // 5 to 12 frames of scramble
                        const interval = setInterval(() => {
                            if (iter >= maxIter) {
                                clearInterval(interval);
                                span.innerText = orig;
                            } else {
                                span.innerText = pool[Math.floor(Math.random() * pool.length)];
                            }
                            iter++;
                        }, 40); // 40ms per frame swap
                    });
                });
            }
        });
    };

    if (loader && textWrapper) {
        // Prevent scrolling during load sequence
        document.body.style.overflow = 'hidden';

        // Sequence timing
        setTimeout(() => {
            // 1. Text reveals up
            textWrapper.querySelector('.loader-text').classList.add('is-active');

            setTimeout(() => {
                // 2. Text hides up
                textWrapper.querySelector('.loader-text').classList.remove('is-active');
                textWrapper.querySelector('.loader-text').classList.add('is-hidden');

                setTimeout(() => {
                    // 3. BG slides up (curtain effect) revealing hero
                    bg.classList.add('is-active');

                    // Allow scrolling again
                    document.body.style.overflow = '';

                    setTimeout(() => {
                        // Hide loader completely
                        loader.style.display = 'none';

                        // 4. Trigger Hero Animations
                        if (heroBg) heroBg.classList.add('is-active');
                        if (header) header.classList.add('is-active');

                        heroTexts.forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.add('is-active');
                            }, index * 200 + 300); // Stagger text
                        });

                        heroSubs.forEach((el) => {
                            setTimeout(() => {
                                el.classList.add('is-active');
                            }, 1000); // Show sub after main text
                        });

                        // Trigger initial scroll reveals
                        initReveal();

                    }, 1000); // Wait for BG slide animation
                }, 600); // Wait for text hide
            }, 1200); // Wait for text to be visible
        }, 300); // Initial delay
    } else {
        // No Crackin loader, trigger header immediately if available and init reveal
        if (header) header.classList.add('is-active');
        initReveal();
    }


    // 3. Custom Cursor with Mix-Blend-Mode Difference
    const cursor = document.querySelector('.js-cursor');
    const hoverTargets = document.querySelectorAll('.js-hover-target a, .js-hover-target button, .js-hover-target');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            if (!cursor.classList.contains('is-active')) {
                cursor.classList.add('is-active'); // Show after first move
            }
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        });

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('is-hover');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('is-hover');
            });
        });

        // Ensure cursor is hidden when leaving viewport
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('is-active');
        });
        document.addEventListener('mouseenter', () => {
            cursor.classList.add('is-active');
        });
    }

    // 4. Sticker Effect has been moved to 3d-scene.js

});
