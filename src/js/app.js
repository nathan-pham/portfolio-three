import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { spaceBackground, cubeTexture, marsTexture, marsNormal } from "./loader";

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
        this.#createControls();

        this.#renderScene();
    }

    /**
     * get the size of the canvas
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
     * create the Three.js scene
     * @private
     * @returns {void}
     */
    #createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = spaceBackground;

        this.camera = new THREE.PerspectiveCamera(75, this.size.aspect, 0.1, 1000);
        this.camera.position.z = 50;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.size.width, this.size.height);
    }

    /**
     * render the scene
     * @private
     * @returns {void}
     */
    #renderScene() {
        /**
         * animate the scene
         * @private
         * @returns {void}
         */
        const animate = () => {
            this.renderer.render(this.scene, this.camera);

            const torus = this.find("torus");
            const cube = this.find("cube");
            const mars = this.find("mars");

            if (torus) {
                torus.rotation.x += 0.01;
                torus.rotation.y += 0.01;
                torus.rotation.z += 0.01;
            }

            if(torus && cube && mars) {
                const top = document.body.getBoundingClientRect().top;

                mars.rotation.y += 0.01;

                cube.rotation.y += 0.01;
                cube.rotation.z += 0.01;

                this.camera.position.x = top * -0.0002;
                this.camera.position.y = top * -0.0002;
                this.camera.position.z = top * -0.01;
            }

            this.controls.update();
            window.requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * initialize orbit controls
     * @private
     * @return {void}
     */
    #createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    /**
     * initialize or add any event listeners
     * @returns {void}
     */
    addEventListeners() {
        

        // onScroll();

        // window.addEventListener("scroll", onScroll);
    }

    /**
     * add an object to the scene
     * @param {object} objects[] - an objects array containing a name & a mesh
     * @param {string} [objects[].name] - name of the object
     * @param {THREE.Mesh} objects[].mesh - mesh to add to the scene
     * @returns {void}
     */
    add(...objects) {
        objects.flat(Infinity).forEach((o) => {
            this.objects.push(o);
            this.scene.add(o.mesh);
        });
    }

    /**
     * find an object in the scene by name
     * @param {string} name - name of the object
     * @returns {THREE.Mesh|undefined} - a mesh (if found) or nothing
     */
    find(name) {
        return this.objects.find((o) => o.name == name)?.mesh;
    }

    /**
     * find all objects in the scene by name
     * @param {string} name - name of the object
     * @returns {THREE.Mesh[]} - an array of meshes
     */
    findAll(name) {
        return this.objects.filter((o) => o.name == name);
    }

    /**
     * create a torus
     * @param {object} configMaterial - torus material paramters
     * @param {number} configMaterial.color - color of the torus
     * @param {boolean} configMaterial.wireframe - render wireframe
     * @returns {THREE.Mesh} - a torus mesh
     */
    createTorus(configMaterial) {
        const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
        const material = new THREE.MeshStandardMaterial(configMaterial);
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    /**
     * create a point light
     * @returns {THREE.PointLight} - a point light
     */
    createPointLight() {
        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(20, 20, 20);
        return pointLight;
    }

    /**
     * create a cool cube with logo as a texture
     * @returns {THREE.Mesh}
     */
    createCube() {
        const geometry = new THREE.BoxGeometry(3, 3, 3);
        const material = new THREE.MeshBasicMaterial({ map: cubeTexture });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    /**
     * create a star
     * @returns {THREE.Mesh} - a sphere mesh
     */
    createStar() {
        const geometry = new THREE.SphereGeometry(0.25);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);

        const position = new Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
        mesh.position.set(...position);

        return mesh;
    }

    /**
     * create Mars
     * @returns {THREE.Mesh} - a sphere mesh
     */
    createMars() {
        const geometry = new THREE.SphereGeometry(5);
        const material = new THREE.MeshStandardMaterial({
            map: marsTexture,
            normalMap: marsNormal,
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.z = 30;
        mesh.position.x = -10;

        return mesh;
    }

    /**
     * add helpers
     * @returns {void}
     */
    addHelpers() {
        this.add(
            {
                name: "axes-helper",
                mesh: new THREE.AxesHelper(20),
            },
            {
                name: "grid-helper",
                mesh: new THREE.GridHelper(50, 50),
            },
            {
                name: "point-light-helper",
                mesh: new THREE.PointLightHelper(app.find("point-light"), 2),
            }
        );
    }
}

const app = new App({ canvas: "#webgl-canvas" });

// add objects to the scene
app.add(
    {
        name: "torus",
        mesh: app.createTorus({ color: 0xff6347 }),
    },
    {
        name: "point-light",
        mesh: app.createPointLight(),
    },
    {
        name: "ambient-light",
        mesh: new THREE.AmbientLight(0xffffff, 0.5),
    },
    {
        name: "mars",
        mesh: app.createMars(),
    },
    {
        name: "cube",
        mesh: app.createCube(),
    },

    // add star field to the scene
    ...new Array(100).fill().map(() => ({ name: "star", mesh: app.createStar() }))
);

app.addEventListeners();
