import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { inchesToFeet } from '@/utils/unitConversions';

const INCH_SCALE = inchesToFeet(1);

const CAR_MODELS = {
  na: '/na_render.glb',
  nb: '/nb_render.glb',
  nd: '/nd_render.glb',
};

export function makeCar(y: number, model: string = 'na') {
    const material = new THREE.MeshPhysicalMaterial({ color: 0xff0000 }); // this is red
    const geometry = new THREE.BoxGeometry(0, 0, 0);
    const car = new THREE.Mesh(geometry, material);

    const loader = new GLTFLoader();
    const modelPath = CAR_MODELS[model as keyof typeof CAR_MODELS] || CAR_MODELS.na;

    return new Promise<THREE.Object3D>((resolve, reject) => {
        loader.load(
            modelPath,
            (gltf) => {
                // The model is authored in inches; the scene works in feet.
                gltf.scene.scale.set(INCH_SCALE, INCH_SCALE, INCH_SCALE);
                gltf.scene.rotation.y = Math.PI / 2;
                gltf.scene.position.y = y;
                gltf.scene.position.x = +5;
                car.add(gltf.scene);
                resolve(car);
            },
            undefined,
            // Without this the promise never settles when the .glb 404s or
            // fails to parse, and the car silently never appears.
            (error) => reject(error),
        );
    });
}
