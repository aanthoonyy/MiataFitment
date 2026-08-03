import * as THREE from "three";

// Wheels and tires are torn down and rebuilt on every settings change, which
// is once per slider frame while dragging. Without this the geometries pile up
// on the GPU for the life of the page.
export function disposeObject(object: THREE.Object3D) {
    object.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        // Only geometries are freed: wheel materials are shared out of the
        // cached .glb and are still in use by every other wheel.
        mesh.geometry.dispose();
    });
}
