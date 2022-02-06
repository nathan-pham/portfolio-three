import * as THREE from "three";

import "@/css/globals.css";
import "@/css/index.css";

class App {
    /**
     * initialize a new Three.js App
     * @class
     * @param {object} param - App paramters
     * @param {HTMLCanvasElement} canvas - Canvas element to render to with Three.js
     */
    constructor({ canvas }) {
        this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
        this.objects = [];

        this.#createScene();
        this.#renderScene();
    }

    /**
     * Get the size of the canvas
     * @return {object} - size object containing width, height and aspect ratio
     */
    get size() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        return {
            width,
            height,
            aspect: width / height,
        };
    }

    /**
     * Create the Three.js scene
     * @private
     * @returns {void}
     */
    #createScene() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, this.size.aspect, 0.1, 1000);
        this.camera.position.z = 30;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.size.width, this.size.height);
    }

    /**
     * Render the scene
     * @private
     * @returns {void}
     */
    #renderScene() {
        /**
         * Animate the scene
         * @private
         */
        const animate = () => {
            this.renderer.render(this.scene, this.camera);

            const torus = this.find("torus");
            if(torus) {
                torus.rotation.x += 0.01;
                torus.rotation.y += 0.01;
            }

            window.requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * Add an object to the scene
     * @param {object} object - contains a Three.js Mesh and a name
     * @param {string} object.name - name of the object
     * @param {THREE.Mesh} object.mesh - mesh to add to the scene
     * @returns {void}
     */
    add(object) {
        this.objects.push(object);
        this.scene.add(object.mesh);
    }

    /**
     * Find an object in the scene by name
     * @param {string} name - name of the object
     * @returns {THREE.Mesh|undefined} - a mesh (if found) or nothing
     */
    find(name) {
        return this.objects.find(o => o.name == name)?.mesh
    }

    /**
     * Create a torus
     * @returns {THREE.Mesh} - A torus mesh
     */
    createTorus() {
        const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
        const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
}

const app = new App({ canvas: "#webgl-canvas" });
app.add({ name: "torus", mesh: app.createTorus() });
