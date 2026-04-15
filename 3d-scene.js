import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';

const container = document.getElementById('canvas-container');
if (container) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.003); // Dark fog for neon vibe

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3; // Boosted for neon pop
    container.appendChild(renderer.domElement);

    // Neutral monochrome lighting directly matching Crackin's aesthetic
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5);
    hemiLight.position.set(0, 100, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(20, 30, 40);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(-20, -10, -30);
    scene.add(backLight);

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const materialChrome = new THREE.MeshStandardMaterial({
        color: 0x181818, // Extremely dark metal, almost silhouette against black fog
        metalness: 0.9,
        roughness: 0.15,
    });

    const mainSphereGroup = new THREE.Group();
    const mainSphere = new THREE.Mesh(geometry, materialChrome);
    mainSphere.scale.set(18, 18, 18);
    mainSphereGroup.add(mainSphere);
    scene.add(mainSphereGroup);

    const bgSpheres = [];
    for (let i = 0; i < 15; i++) {
        const mesh = new THREE.Mesh(geometry, materialChrome);
        mesh.position.set(
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150,
            -30 - Math.random() * 100
        );
        const s = 2 + Math.random() * 8;
        mesh.scale.set(s, s, s);
        const speed = {
            y: Math.random() * 0.002,
            x: Math.random() * 0.001,
            offsetY: Math.random() * Math.PI * 2,
            offsetX: Math.random() * Math.PI * 2,
            baseY: mesh.position.y,
            baseX: mesh.position.x
        };
        scene.add(mesh);
        bgSpheres.push({ mesh, speed });
    }

    const decalTextures = [];

    // 画像URLやSVGのデータURLを受け取り、Canvasテクスチャとバンプマップ(厚み)を生成する
    const createTextureFromImageSource = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1024; canvas.height = 1024;
                const ctx = canvas.getContext('2d');

                // 画像のアスペクト比を維持しつつ、余白（パディング）を持たせて描画
                const padding = 150;
                const availableSize = 1024 - (padding * 2);
                const scale = Math.min(availableSize / img.width, availableSize / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                const x = (1024 - w) / 2;
                const y = (1024 - h) / 2;

                ctx.drawImage(img, x, y, w, h);
                const texColor = new THREE.CanvasTexture(canvas);
                texColor.colorSpace = THREE.SRGBColorSpace;

                // バンプマップ（凹凸）の生成。画像の不透明部分を白として抽出し厚みを持たせる
                const bumpCanvas = document.createElement('canvas');
                bumpCanvas.width = 1024; bumpCanvas.height = 1024;
                const bctx = bumpCanvas.getContext('2d');
                bctx.fillStyle = "black";
                bctx.fillRect(0, 0, 1024, 1024);

                bctx.drawImage(img, x, y, w, h);
                bctx.globalCompositeOperation = "source-in";
                bctx.fillStyle = "white";
                bctx.fillRect(0, 0, 1024, 1024);
                const texBump = new THREE.CanvasTexture(bumpCanvas);

                resolve({ color: texColor, bump: texBump });
            };
            img.onerror = () => {
                console.warn("ステッカー画像が読み込めませんでした: " + src);
                resolve(null); // エラー時はnullを返してスキップ
            };
            img.src = src;
        });
    };

    // モノクロ。ロゴのファイルパスを指定（ステッカーはロゴのみに限定）
    const imageSources = [
        'images/モノクロロゴ.png',   // 縦型ロゴ 
        'images/モノクロロゴ横.png'   // 横型ロゴ
    ];

    Promise.all(imageSources.map(createTextureFromImageSource)).then(results => {
        // 正常に読み込めたテクスチャのみ追加
        const textures = results.filter(t => t !== null);
        if (textures.length > 0) {
            decalTextures.push(...textures);
        }
    });

    const decalMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.1,
        roughness: 0.8,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        bumpScale: 0.05
    });

    const decals = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (event) => {
        targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('click', (event) => {
        if (decalTextures.length === 0) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(mainSphere);
        if (intersects.length > 0) {
            const hit = intersects[0];
            const pos = hit.point.clone();
            const n = hit.face.normal.clone();
            n.transformDirection(mainSphere.matrixWorld);
            const target = pos.clone().add(n);
            const dummy = new THREE.Object3D();
            dummy.position.copy(pos);
            dummy.lookAt(target);
            dummy.rotateZ((Math.random() - 0.5) * Math.PI);
            const orientation = dummy.rotation.clone();
            const baseScale = 8 + Math.random() * 6;
            const size = new THREE.Vector3(baseScale, baseScale, baseScale);
            const texBundle = decalTextures[Math.floor(Math.random() * decalTextures.length)];
            const mat = decalMaterial.clone();
            mat.map = texBundle.color;
            mat.bumpMap = texBundle.bump;
            const decalMesh = new THREE.Mesh(new DecalGeometry(mainSphere, pos, orientation, size), mat);
            mainSphereGroup.worldToLocal(decalMesh.position);
            decalMesh.quaternion.multiplyQuaternions(mainSphereGroup.quaternion.clone().invert(), decalMesh.quaternion);
            decalMesh.scale.set(0.01, 0.01, 0.01);
            mainSphereGroup.add(decalMesh);
            decals.push({ mesh: decalMesh, mat: mat });

            // Make sure gsap is loaded globally
            if (window.gsap) {
                window.gsap.to(decalMesh.scale, {
                    x: 1, y: 1, z: 1,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.4)"
                });
            } else {
                decalMesh.scale.set(1, 1, 1);
            }

            if (decals.length > 60) {
                const old = decals.shift();
                mainSphereGroup.remove(old.mesh);
                old.mesh.geometry.dispose();
                old.mat.dispose();
            }
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let time = 0;
    function render() {
        requestAnimationFrame(render);
        time += 1;
        mainSphereGroup.rotation.y += 0.003;
        mainSphereGroup.rotation.x += 0.001;
        camera.position.x += (targetMouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (targetMouseY * -5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        bgSpheres.forEach(obj => {
            obj.mesh.position.y = obj.speed.baseY + Math.sin(time * obj.speed.y + obj.speed.offsetY) * 10;
            obj.mesh.position.x = obj.speed.baseX + Math.cos(time * obj.speed.x + obj.speed.offsetX) * 10;
            obj.mesh.rotation.y += 0.005;
            obj.mesh.rotation.x += 0.005;
        });
        renderer.render(scene, camera);
    }
    render();
}
