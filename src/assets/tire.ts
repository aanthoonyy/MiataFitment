import { Settings } from "@/types/settings";
import { CarModel } from "@/constants/wheelPositions";
import rollingDiameter from "./common/rollingDiameter";
import { calculateWheelPosition, WheelPosition } from "./common/wheelPositionCalculator";

export function makeTires(
    THREE: any,
    _x: number,
    _y: number,
    _z: number,
    wheelDiameter: number,
    wheelWidth: number,
    tireWidth: number,
    tireSidewall: number,
    position: WheelPosition,
    settings: Settings,
    model: CarModel = "na"
) {
    const totalDiameter = rollingDiameter(wheelDiameter, tireWidth, tireSidewall);
    const points = [];
    let beadleft = new THREE.Vector2(wheelDiameter/2, -1 * (wheelWidth - 0.0)/2);
    let treadleft = new THREE.Vector2(totalDiameter/2, -1 * tireWidth/2/12/2);
    let treadright = new THREE.Vector2(totalDiameter/2, tireWidth/2/12/2);
    let treadmidpoint = new THREE.Vector2(totalDiameter/2, 0);
    let beadright = new THREE.Vector2(wheelDiameter/2, (wheelWidth - 0.0)/2);
    beadleft = beadleft.divideScalar(12);
    treadleft = treadleft.divideScalar(12);
    treadright = treadright.divideScalar(12);
    treadmidpoint = treadmidpoint.divideScalar(12);
    beadright = beadright.divideScalar(12);

    const bevelpercent = 0.1;
    const betweenbeadleftandtreadleft = beadleft.clone().lerp(treadleft, 1 - bevelpercent);
    const betweentreadleftandmidpoint = treadleft.clone().lerp(treadmidpoint, bevelpercent);
    const betweentreadrightandmidpoint = treadright.clone().lerp(treadmidpoint, bevelpercent);
    const betweenbeadrightandtreadright = beadright.clone().lerp(treadright, 1 - bevelpercent);

    points.push(beadleft);

    const numpoints = 10;
    for (let i = 0; i < numpoints; i++){
        const t = i / numpoints;
        const x = (1 - t) * (1 - t) * betweenbeadleftandtreadleft.x + 2 * (1 - t) * t * treadleft.x + t * t * betweentreadleftandmidpoint.x;
        const y = (1 - t) * (1 - t) * betweenbeadleftandtreadleft.y + 2 * (1 - t) * t * treadleft.y + t * t * betweentreadleftandmidpoint.y;
        points.push(new THREE.Vector2(x, y));
    }
    for (let i = numpoints; i > 0; i--){
        const t = i / numpoints;
        const x = (1 - t) * (1 - t) * betweenbeadrightandtreadright.x + 2 * (1 - t) * t * treadright.x + t * t * betweentreadrightandmidpoint.x;
        const y = (1 - t) * (1 - t) * betweenbeadrightandtreadright.y + 2 * (1 - t) * t * treadright.y + t * t * betweentreadrightandmidpoint.y;
        points.push(new THREE.Vector2(x, y));
    }

    points.push(beadright);
    const tireGeometry = new THREE.LatheGeometry(points, 64);
    const tireMaterial = new THREE.MeshPhysicalMaterial({color: 0x202227}, false);
    tireMaterial.roughness = 0.5;
    tireMaterial.metalness = 0;
    tireMaterial.specularIntensity = 0.1;
    const tire = new THREE.Mesh(tireGeometry, tireMaterial);

    const wheelData = calculateWheelPosition(position, settings, model);
    
    tire.rotation.x = wheelData.rotation.x;
    tire.rotation.z = wheelData.rotation.z;
    tire.position.x = wheelData.position.x;
    tire.position.y = wheelData.position.y;
    tire.position.z = wheelData.position.z;

    return tire;
}