import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const CAR_MODELS = {
  na: '/MiataFixed.glb',
  nb: '/nb_render.glb', // You'll need to add this file
};

export function makeCar(THREE: any, y: number, model: string = 'na') {
    const material = new THREE.MeshPhysicalMaterial({color: 0xff0000}, 0); // this is red
    
    let geometry = new THREE.BoxGeometry(0,0,0);
    const car = new THREE.Mesh(geometry, material);

    const loader = new GLTFLoader();
    const modelPath = CAR_MODELS[model as keyof typeof CAR_MODELS] || CAR_MODELS.na;

    // Create a promise to handle the async loading
    return new Promise<THREE.Object3D>((resolve) => {
        loader.load(
            modelPath,
            (gltf) => {
                // Remove any existing models
                while(car.children.length > 0) {
                    car.remove(car.children[0]);
                }

                gltf.scene.scale.set(1/12, 1/12, 1/12);
                gltf.scene.rotation.y = Math.PI / 2;
                gltf.scene.position.y = y;
                gltf.scene.position.x = +5;
                car.add(gltf.scene);
                resolve(car);
            },
            undefined,
            undefined
        );
    });
}

