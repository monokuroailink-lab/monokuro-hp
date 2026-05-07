/**
 * ====================================================================
 * Lenis Setup Module
 * ====================================================================
 * 
 * [用途]
 * サイト全体に高品質なスムーズスクロール (Lenis) を導入し、
 * GSAP ScrollTrigger と同期させるための汎用モジュールです。
 * 
 * [必須依存ライブラリ]
 * - GSAP (gsap.min.js)
 * - GSAP ScrollTrigger (ScrollTrigger.min.js)
 * - Lenis (https://unpkg.com/lenis@1.1.20/dist/lenis.min.js など)
 * 
 * [CSS必須要件]
 * html.lenis, html.lenis body { height: auto; }
 * ※ style.css に記載済み
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. GSAP ScrollTriggerの登録確認
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 2. Lenisの初期化
    const lenis = new Lenis({
        // === Animation Settings ===
        duration: 1.2, // スクロールの長さ (デフォルト1.2。少し早めたい場合は 0.8 など)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo: 滑らかな減速
        // 別のeasing例 (easeOutQuart): (t) => 1 - Math.pow(1 - t, 4)
        
        // === Scroll Settings ===
        wheelMultiplier: 1.2, // マウスホイールのスクロール量倍率
        smoothWheel: true,    // マウスホイールでのスムーズスクロール有効化
        smoothTouch: false,   // タッチデバイスでのスムーズスクロール (基本はfalse推奨、ネイティブに任せる)
        touchMultiplier: 2,   // タッチ時のスクロール倍率 (smoothTouchがtrueの場合のみ有効)
        infinite: false       // 無限スクロールの有効化
    });

    // 3. LenisとGSAP ScrollTriggerの同期処理
    // ※ スクロールが起きるたびにScrollTriggerの判定を更新する
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
    }

    // 4. RequestAnimationFrame (rAF) の設定
    // GSAPを使っている場合は、GSAPのTickerをrAFループとして使うことで
    // 二重のrAFによるカクつき (jitter) を防ぐ
    if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000); // GSAPのtime(秒)をミリ秒に変換してLenisに渡す
        });
        
        // ラグスパイク時のスクロールジャンプを防ぐための設定
        gsap.ticker.lagSmoothing(0);
    } else {
        // GSAPがない場合の標準のrAFループ
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 5. グローバル変数への登録 (他のスクリプトから lenis.stop() 等を呼べるようにするため)
    window.lenis = lenis;
});
