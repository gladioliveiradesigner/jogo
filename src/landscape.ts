import * as THREE from 'three';

// One continuous trail, sampled by distance so walking steps stay evenly spaced.
const landmarks = [
  [-14, 9], [-10, 10], [-6, 8], [-9, 4], [-14, 2], [-13, -3],
  [-8, -5], [-4, -2], [0, 1], [5, 2], [9, 6], [14, 5],
  [14, 0], [10, -3], [5, -5], [1, -8], [4, -11], [10, -10], [14, -8],
];
const curve = new THREE.CatmullRomCurve3(landmarks.map(([x,z])=>new THREE.Vector3(x,0,z)), false, 'centripetal');
export const trail = Array.from({length:64},(_,i)=>{
  const p=curve.getPointAt(i/63);
  // A gentle raised crossing over the lagoon.
  const bridge=Math.exp(-(((p.x+.5)/3.5)**2+((p.z-.5)/3)**2));
  return new THREE.Vector3(p.x,.3+bridge*.65,p.z);
});
export function trailPosition(i:number):[number,number,number]{const p=trail[Math.max(0,Math.min(63,i))];return [p.x,p.y,p.z]}
export function trailAngle(i:number){const a=trail[Math.max(0,i-1)],b=trail[Math.min(63,i+1)];return Math.atan2(b.x-a.x,b.z-a.z)}
export function pathClearance(x:number,z:number){return Math.min(...trail.map(p=>Math.hypot(x-p.x,z-p.z)))}
export const lagoon={x:-.5,z:.5,rx:3.5,rz:4};
export function inLagoon(x:number,z:number){return ((x-lagoon.x)/lagoon.rx)**2+((z-lagoon.z)/lagoon.rz)**2<1.35}
export function ribbon(){
  const smooth=new THREE.CatmullRomCurve3(trail);
  const vertices:number[]=[],indices:number[]=[];
  for(let i=0;i<=384;i++){
    const p=smooth.getPointAt(i/384),t=smooth.getTangentAt(i/384);
    for(const side of [-1,1])vertices.push(p.x+t.z*.92*side,p.y-.14,p.z-t.x*.92*side);
    if(i<384){const n=i*2;indices.push(n,n+2,n+1,n+1,n+2,n+3)}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
// Stable procedural decoration: never scatter an obstacle onto the trail.
export const groves=Array.from({length:170},(_,i)=>{
 const x=Math.sin(i*127.1+4)*17,z=Math.sin(i*311.7+8)*13;
 return {x,z,i,scale:.65+(Math.sin(i*17)+1)*.28};
}).filter(p=>(p.x/18)**2+(p.z/14)**2<.9&&pathClearance(p.x,p.z)>2&&!inLagoon(p.x,p.z)&&Math.hypot(p.x-8,p.z+8)>2.5);
