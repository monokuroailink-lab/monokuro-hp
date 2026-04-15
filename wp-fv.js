/* ========================================
   モノクロ。FV - SWELL用JavaScript
   設置場所: 子テーマ/js/monokuro-fv.js
======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // GSAPプラグイン登録
    gsap.registerPlugin(ScrollTrigger);

    // ========================================
    // 背景パーティクル生成
    // ========================================
    const bgParticles = document.querySelector('.monokuro-bg-particles');
    if (bgParticles) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'monokuro-bg-particle';
            const size = 1 + Math.random() * 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.opacity = 0.1 + Math.random() * 0.4;
            bgParticles.appendChild(particle);

            gsap.to(particle, {
                x: -30 + Math.random() * 60,
                y: -40 + Math.random() * 80,
                duration: 5 + Math.random() * 7,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 3
            });
        }
    }

    // ========================================
    // 右側グラフィック - 浮遊ドット生成
    // ========================================
    const floatingDots = document.querySelector('.monokuro-graphic__dots');
    if (floatingDots) {
        for (let i = 0; i < 15; i++) {
            const dot = document.createElement('div');
            dot.className = 'monokuro-float-dot';
            const size = 2 + Math.random() * 4;
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            dot.style.left = Math.random() * 100 + '%';
            dot.style.top = Math.random() * 100 + '%';
            floatingDots.appendChild(dot);

            gsap.to(dot, {
                x: -20 + Math.random() * 40,
                y: -30 + Math.random() * 60,
                opacity: 0.1 + Math.random() * 0.5,
                duration: 3 + Math.random() * 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 2
            });
        }
    }

    // ========================================
    // ローディングアニメーション
    // ========================================
    const loadingScreen = document.querySelector('.monokuro-loading');
    console.log('LOADING SCREEN FOUND:', !!loadingScreen);

    if (loadingScreen) {
        console.log('STARTING GSAP LOADING TL');
        const loadingTl = gsap.timeline({
            onComplete: function () {
                console.log('LOADING TL COMPLETE, CALLING FV ANIMATION');
                fvAnimation();
            }
        });

        loadingTl
            .to('.monokuro-loading__logo, .monokuro-loading__logo-img', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            })
            .to('.monokuro-loading__percent', {
                opacity: 1,
                duration: 0.3
            }, '-=0.3')
            .to('.monokuro-loading__bar', {
                width: '100%',
                duration: 2.0, // 少し長くしてLOADINGを見せる
                ease: 'power2.inOut',
                onUpdate: function () {
                    const percentEl = document.querySelector('.monokuro-loading__percent');
                    if (percentEl) {
                        // 時間ベースで0〜3のドットを安全に生成
                        const dots = Math.floor(Date.now() / 300) % 4;
                        percentEl.textContent = 'LOADING' + '.'.repeat(dots);
                    }
                }
            })
            .to('.monokuro-loading', {
                yPercent: -100,
                duration: 0.9,
                ease: 'power4.inOut',
                delay: 0.2
            });
    } else {
        console.log('NO LOADING SCREEN FOUND, JUMPING TO FV ANIMATION');
        // ローディングがない場合は直接FVアニメーション
        fvAnimation();
    }

    // ========================================
    // FVアニメーション
    // ========================================
    function fvAnimation() {
        const tl = gsap.timeline();

        tl
            // 背景レイヤー群
            .to('.monokuro-bg-gradient', { opacity: 1, duration: 1.5 })
            .to('.monokuro-bg-noise', { opacity: 0.025, duration: 1 }, '-=1.2')
            .to('.monokuro-bg-grid', { opacity: 1, duration: 1.2 }, '-=0.8')
            .to('.monokuro-bg-circle', {
                opacity: 1,
                duration: 1.5,
                stagger: 0.2,
                ease: 'power2.out'
            }, '-=1')
            .to('.monokuro-bg-lines', { opacity: 1, duration: 1 }, '-=1')
            .to('.monokuro-bg-particles', { opacity: 1, duration: 1.2 }, '-=0.8')
            .to('.monokuro-bg-glow', { opacity: 1, duration: 1.5, stagger: 0.3 }, '-=1')
            .to('.monokuro-bg-moving-lines', { opacity: 1, duration: 0.8 }, '-=1')

            // 右側グラフィック
            .to('.monokuro-graphic', {
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out'
            }, '-=1.5')

            // メインテキスト
            .to('.monokuro-fv__main .line-inner', {
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.5)'
            }, '-=1')

            // サブテキスト
            .to('.monokuro-fv__sub', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'back.out(1.2)'
            }, '-=0.4')

            // CTA
            .to('.monokuro-fv__cta', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'back.out(1.2)'
            }, '-=0.4')

            // マーキー
            .to('.monokuro-marquee', {
                opacity: 1,
                duration: 0.8
            }, '-=0.5')

            // ヘッダー
            // note: The WP site animated class `.monokuro-header__logo`, but we are using our `.header-logo`. We'll adjust this manually.
            .to('.header-logo', { // updated to point to our static header class
                opacity: 1,
                duration: 0.5
            }, '-=0.6')
            .to('.header-nav a', { // updated to point to our static header navigation class
                opacity: 1,
                stagger: 0.05,
                duration: 0.4
            }, '-=0.4')

            // スクロール
            .to('.monokuro-scroll', {
                opacity: 1,
                duration: 0.6
            }, '-=0.2');
    }

    // ========================================
    // マウス視差（パララックス）効果
    // ========================================
    const graphicElement = document.querySelector('.monokuro-graphic');
    const bgParticlesParallax = document.querySelector('.monokuro-bg-particles');

    window.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

        if (graphicElement) {
            gsap.to(graphicElement, {
                x: mouseX * -30,
                y: mouseY * -30,
                rotationX: mouseY * -10,
                rotationY: mouseX * 10,
                ease: 'power2.out',
                duration: 1
            });
        }

        if (bgParticlesParallax) {
            gsap.to(bgParticlesParallax, {
                x: mouseX * 40,
                y: mouseY * 40,
                ease: 'power2.out',
                duration: 1.5
            });
        }
    });

});
