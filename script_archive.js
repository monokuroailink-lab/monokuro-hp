/* ==========================================================
   Monokuro Inc. Main Script
   Features: Chaffle Scramble, GSAP Custom Cursor, GSAP ScrollTrigger
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------
    // 1. Chaffle Emulation (Hover Scramble)
    // ---------------------------------------------------
    const poolEn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    const poolJa = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    const isTouchDevice = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    if (!isTouchDevice()) {
        document.querySelectorAll('.js-crackin-text').forEach(el => {
            const originalText = el.innerText;
            const type = el.getAttribute('data-chaffle');
            const charPool = type === 'en' ? poolEn : poolJa;

            let spans = [];
            el.innerHTML = '';
            originalText.split('').forEach(char => {
                if (char === '\n') { el.appendChild(document.createElement('br')); return; }
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.dataset.orig = char === ' ' ? '\u00A0' : char;
                span.style.pointerEvents = 'none';
                el.appendChild(span);
                spans.push(span);
            });

            // Hover Glitch Animation
            let glitchInterval;
            el.addEventListener('mouseenter', () => {
                spans.forEach(span => {
                    const orig = span.dataset.orig;
                    if (orig === '\u00A0' || orig === ' ' || orig === '、' || orig === '。' || orig === '_') return;

                    let iter = 0;
                    const maxIter = Math.floor(Math.random() * 8) + 5;
                    const interval = setInterval(() => {
                        if (iter >= maxIter) {
                            clearInterval(interval);
                            span.innerText = orig;
                        } else {
                            span.innerText = charPool[Math.floor(Math.random() * charPool.length)];
                        }
                        iter++;
                    }, 40);
                });
            });
        });
    }

    // ---------------------------------------------------
    // 2. Crazy GSAP 遊び心万歳 Animations!
    // ---------------------------------------------------
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Inject Custom Cursor Styles Dynamically
        const cursorStyle = document.createElement('style');
        cursorStyle.innerHTML = `
            .gsap-cursor {
                position: fixed; top: 0; left: 0;
                width: 20px; height: 20px;
                background: rgba(255, 255, 255, 1);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
                transform: translate(-50%, -50%);
            }
            body.theme-neon .gsap-cursor {
                background: rgba(0, 243, 255, 0.8);
                box-shadow: 0 0 10px #00f3ff, 0 0 20px #ff00ff;
                mix-blend-mode: normal; border: 2px solid #fff;
            }
            body.theme-glass .gsap-cursor {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.4);
                mix-blend-mode: normal;
                width: 40px; height: 40px;
            }
            /* Hide Default Cursor on non-touch */
            @media (pointer: fine) {
                body { cursor: none; }
                a, button, .js-crackin-text { cursor: none; }
            }
        `;
        document.head.appendChild(cursorStyle);

        // Create Custom Cursor DOM
        const cursor = document.createElement('div');
        cursor.classList.add('gsap-cursor');
        document.body.appendChild(cursor);

        // Mouse Tracker
        let xTo = gsap.quickTo(cursor, "x", {duration: 0.4, ease: "power3"}),
            yTo = gsap.quickTo(cursor, "y", {duration: 0.4, ease: "power3"});

        window.addEventListener("mousemove", e => {
            xTo(e.clientX);
            yTo(e.clientY);
        });

        // Interactive Cursor Enlarge
        document.querySelectorAll('a, button, .js-crackin-text').forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(cursor, {scale: 3, opacity: 0.5, duration: 0.3, ease: "back.out(1.7)"}));
            el.addEventListener('mouseleave', () => gsap.to(cursor, {scale: 1, opacity: 1, duration: 0.3, ease: "power2.out"}));
        });

        // ---------------------------------------------------
        // 3. Page Load Hero Animations
        // ---------------------------------------------------
        const tlLoad = gsap.timeline();
        
        // Split Japanese Title for stagger
        const jpMain = document.querySelector('.jp-main');
        if (jpMain) {
            // Animating the container instead of breaking up chaffle spans
            tlLoad.from('.c-ttl__01 .font-en', { opacity: 0, x: -50, duration: 1, ease: 'power4.out', delay: 0.2 })
                  .from('.jp-main', { opacity: 0, y: 100, skewY: 5, duration: 1.2, ease: 'back.out(1.5)' }, "-=0.8")
                  .from('.sec-mv__tag-item', { opacity: 0, x: -20, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, "-=1.0")
                  .from('.sec-mv__btn', { opacity: 0, scale: 0, rotation: 360, duration: 1.5, ease: 'elastic.out(1, 0.4)' }, "-=0.5");
        }

        // ---------------------------------------------------
        // 4. ScrollTriggers! (遊び心)
        // ---------------------------------------------------
        // Services Item Reveal (Slide from sides & Bouncy pop)
        gsap.utils.toArray('.top-service-item').forEach((item, idx) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    toggleActions: "play none none reverse" // Makes it animate back out!
                },
                x: idx % 2 === 0 ? '-10vw' : '10vw',
                opacity: 0,
                scale: 0.9,
                duration: 1.2,
                ease: "back.out(1.5)"
            });
        });

        // Works Cards 3D Flip Stagger Entry
        const workCards = document.querySelectorAll('#works a');
        if (workCards.length > 0) {
            gsap.from(workCards, {
                scrollTrigger: {
                    trigger: '#works',
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                },
                y: 80,
                opacity: 0,
                rotationX: -45, /* Full 3D feel popup */
                transformPerspective: 500,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out"
            });
        }
        
        // Crazy floating philosophy panel
        gsap.utils.toArray('[class*="panel"]').forEach(panel => {
            gsap.from(panel, {
                scrollTrigger: {
                    trigger: panel,
                    start: "top 85%"
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "bounce.out"
            });
        });
    }
});
