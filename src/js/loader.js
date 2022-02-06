import * as THREE from "three";

import _spaceBackground from "@/assets/space_background.jpg";
import _cubeTexture from "@/assets/cube_texture.png";
import _marsTexture from "@/assets/mars_texture.jpg";
import _marsNormal from "@/assets/mars_normal.jpg";

const loader = new THREE.TextureLoader();

export const spaceBackground = loader.load(_spaceBackground);
export const cubeTexture = loader.load(_cubeTexture);
export const marsTexture = loader.load(_marsTexture);
export const marsNormal = loader.load(_marsNormal);