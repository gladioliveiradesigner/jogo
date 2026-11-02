import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {OrbitControls,RoundedBox,Html} from '@react-three/drei';
import {Suspense,useEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib';
import {board,colors,position} from './rules';
import {trail,trailAngle,ribbon,groves,lagoon,pathClearance,inLagoon} from './landscape';
import {Character} from './Character';
import {useGame} from './store';

const reduced=()=>typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function Tree({x,z,i,scale=1}:{x:number;z:number;i:number;scale?:number}){
 const crown=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(crown.current&&!reduced())crown.current.rotation.z=Math.sin(clock.elapsedTime*.65+i*2.4)*.025+Math.sin(clock.elapsedTime*1.1+i)*.008});
 return <group position={[x,.03,z]} scale={scale}><mesh castShadow position={[0,.7,0]}><cylinderGeometry args={[.12,.2,1.4,8]}/><meshStandardMaterial color="#977456"/></mesh><group ref={crown} position={[0,.8,0]}>{i%3===0?[0,1,2].map(j=><mesh key={j} castShadow position={[0,.55+j*.45,0]}><coneGeometry args={[.95-j*.2,1.35,10]}/><meshStandardMaterial color={j%2?'#659875':'#447d64'}/></mesh>):[[-.3,.65,0],[.35,.8,.1],[0,1.25,0]].map((p,j)=><mesh key={j} castShadow position={p as [number,number,number]} scale={[.8,.8,.7]}><icosahedronGeometry args={[1,2]}/><meshStandardMaterial color={i%4===0?'#c3c379':j%2?'#83ae77':'#669c72'} roughness={1}/></mesh>)}</group></group>
}
function Pawn({index}:{index:number}){
 const p=useGame(s=>s.players[index]),active=useGame(s=>s.active),phase=useGame(s=>s.phase);
 const r=useRef<THREE.Group>(null),target=position(p.pos);
 useFrame((_,dt)=>{if(r.current){r.current.position.lerp(new THREE.Vector3(target[0]+(index?.22:-.22),target[1]+.16,target[2]),1-Math.exp(-dt*9));if(phase==='moving'&&active===index)r.current.rotation.y=THREE.MathUtils.lerp(r.current.rotation.y,trailAngle(p.pos),1-Math.exp(-dt*6))}});
 return <group ref={r} position={target}><Character avatar={p.avatar} walking={active===index&&phase==='moving'}/></group>
}
function Lagoon(){
 const ripples=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(ripples.current&&!reduced())ripples.current.children.forEach((c,i)=>{const s=1+Math.sin(clock.elapsedTime*.7+i)*.12;c.scale.set(s,s,1)})});
 return <group position={[lagoon.x,.04,lagoon.z]}><mesh rotation={[-Math.PI/2,0,0]} scale={[lagoon.rx+ .3,lagoon.rz+.3,1]} receiveShadow><circleGeometry args={[1,64]}/><meshStandardMaterial color="#d9d5ac"/></mesh><mesh rotation={[-Math.PI/2,0,0]} position={[0,.025,0]} scale={[lagoon.rx,lagoon.rz,1]}><circleGeometry args={[1,64]}/><meshStandardMaterial color="#6ebec5" roughness={.35}/></mesh><group ref={ripples}>{[-1,0,1].map((n,i)=><mesh key={n} position={[n*1.3,.04,n*1.8]} rotation={[-Math.PI/2,0,.3*i]}><ringGeometry args={[.65,.68,40,1,0,4.5]}/><meshBasicMaterial color="#b5e4dd" transparent opacity={.45} side={THREE.DoubleSide}/></mesh>)}</group>{[-1,1].map(n=><mesh key={n} position={[n*1.8,.06,-n*2]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.3,12,0,5.7]}/><meshStandardMaterial color="#72a678" side={THREE.DoubleSide}/></mesh>)}</group>
}
function Bridge(){return <group>{trail.map((p,i)=>inLagoon(p.x,p.z)&&p.y>.4?<group key={i} position={[p.x,p.y-.1,p.z]} rotation={[0,trailAngle(i),0]}>{[-.55,-.28,0,.28,.55].map(z=><mesh key={z} position={[0,-.05,z]} receiveShadow><boxGeometry args={[2.1,.16,.23]}/><meshStandardMaterial color="#b48b62"/></mesh>)}{[-1,1].map(side=><group key={side}><mesh position={[side*1.02,.25,0]} castShadow><cylinderGeometry args={[.065,.08,.8,8]}/><meshStandardMaterial color="#95724f"/></mesh><mesh position={[side*1.02,.55,0]}><boxGeometry args={[.09,.09,1.5]}/><meshStandardMaterial color="#bf9c70"/></mesh></group>)}</group>:null)}</group>}
function Camp(){
 const fire=useRef<THREE.Mesh>(null);
 useFrame(({clock})=>{if(fire.current&&!reduced()){fire.current.scale.y=1+Math.sin(clock.elapsedTime*6)*.14;fire.current.rotation.y=clock.elapsedTime*.4}});
 return <group position={[8,.08,-8]}><mesh rotation={[-Math.PI/2,0,0]}><circleGeometry args={[2.2,32]}/><meshStandardMaterial color="#cbd098"/></mesh><group position={[.8,0,-.5]} rotation={[0,.3,0]}><mesh castShadow position={[0,.7,0]} rotation={[0,0,Math.PI/2]} scale={[1,1,1.5]}><cylinderGeometry args={[1,1,1.8,3]}/><meshStandardMaterial color="#e5aa75"/></mesh><mesh position={[.92,.58,0]} rotation={[0,Math.PI/2,0]}><circleGeometry args={[.7,3]}/><meshStandardMaterial color="#755c4c" side={THREE.DoubleSide}/></mesh></group><group position={[-1.1,.05,.6]}>{Array.from({length:7},(_,i)=><mesh key={i} position={[Math.cos(i)*.45,.1,Math.sin(i)*.45]} scale={[.18,.13,.16]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#9caaa1"/></mesh>)}<mesh ref={fire} position={[0,.32,0]}><coneGeometry args={[.25,.65,7]}/><meshStandardMaterial color="#f8bc64" emissive="#e98c47" emissiveIntensity={.4}/></mesh></group></group>
}
function Sign({i,label}:{i:number;label:string}){const p=trail[i];return <group position={[p.x,p.y,p.z-1.4]}><mesh position={[0,.5,0]}><cylinderGeometry args={[.07,.09,1,8]}/><meshStandardMaterial color="#95734e"/></mesh><RoundedBox position={[0,1.1,0]} args={[1.8,.55,.17]} radius={.08}><meshStandardMaterial color="#f2dfad"/></RoundedBox><Html center position={[0,1.12,.13]} distanceFactor={28} className="trail-sign">{label}</Html></group>}
function Details(){return <group>{Array.from({length:100},(_,i)=>{
 const x=Math.sin(i*31+1)*16,z=Math.cos(i*47+3)*12;
 if(pathClearance(x,z)<1.3||inLagoon(x,z))return null;
 return <group key={i} position={[x,.06,z]}>{i%3===0?<><mesh position={[0,.16,0]}><cylinderGeometry args={[.055,.07,.3,8]}/><meshStandardMaterial color="#eee0ba"/></mesh><mesh position={[0,.34,0]} scale={[.25,.12,.25]}><sphereGeometry args={[1,12,8]}/><meshStandardMaterial color="#d78b78"/></mesh></>:i%3===1?<mesh scale={[.35,.23,.3]} castShadow><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#a4afa3"/></mesh>:<>{[0,1,2].map(j=><mesh key={j} position={[Math.cos(j*2)*.14,.15,Math.sin(j*2)*.14]} scale={[.13,.12,.13]}><sphereGeometry args={[1,8,6]}/><meshStandardMaterial color={i%2?'#f3d588':'#dca9b6'}/></mesh>)}</>}</group>
 })}</group>}
function Butterflies(){const ref=useRef<THREE.Group>(null);useFrame(({clock})=>{if(ref.current&&!reduced())ref.current.children.forEach((g,i)=>{const t=clock.elapsedTime*.4+i*2;g.position.set(Math.sin(t)*3-5,1.6+Math.sin(t*2)*.3,Math.cos(t*.7)*2+3);g.rotation.y=-t;g.children.forEach((wing,j)=>{wing.rotation.z=Math.sin(t*20)*(j?1:-1)*.6})})});return <group ref={ref}>{[0,1,2].map(i=><group key={i}>{[-1,1].map(s=><mesh key={s} position={[s*.12,0,0]} scale={[.16,.035,.12]}><sphereGeometry args={[1,8,6]}/><meshStandardMaterial color={i%2?'#f3c579':'#c4ace0'}/></mesh>)}</group>)}</group>}
const overviewPosition=new THREE.Vector3(24,34,38);
function Camera(){const r=useRef<OrbitControlsImpl>(null),camera=useThree(s=>s.camera);const active=useGame(s=>s.active),phase=useGame(s=>s.phase),p=useGame(s=>s.players[s.active].pos);
 useEffect(()=>{camera.position.copy(overviewPosition);camera.lookAt(0,0,0)},[camera]);
 useFrame((_,dt)=>{if(!r.current)return;const controls=r.current;if(phase==='moving'){const t=new THREE.Vector3(...position(p));const next=controls.target.clone().lerp(t,1-Math.exp(-dt*2));camera.position.add(next.clone().sub(controls.target));controls.target.copy(next)}controls.target.x=THREE.MathUtils.clamp(controls.target.x,-16,16);controls.target.z=THREE.MathUtils.clamp(controls.target.z,-12,12);controls.update()});
 return <OrbitControls ref={r} key={active} makeDefault target={[0,0,0]} minDistance={10} maxDistance={65} minPolarAngle={.25} maxPolarAngle={.95} enableDamping/>
}
export function Scene({overview}:{overview:number}){
 const players=useGame(s=>s.players),path=useMemo(ribbon,[]);
 return <Canvas shadows camera={{position:[24,34,38],fov:43,far:180}} dpr={[1,1.5]}><color attach="background" args={['#e6eee3']}/><fog attach="fog" args={['#e6eee3',65,115]}/><ambientLight intensity={1.5}/><hemisphereLight args={['#fff5df','#8aab8c',.8]}/><directionalLight position={[-12,26,14]} intensity={2.1} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-24} shadow-camera-right={24} shadow-camera-top={24} shadow-camera-bottom={-24} shadow-normalBias={.04}/><Suspense fallback={null}>
 <mesh position={[0,-.45,0]} scale={[19,1,15]} receiveShadow><cylinderGeometry args={[1,1,.8,96]}/><meshStandardMaterial color="#a1bf83" roughness={1}/></mesh><mesh position={[0,-1.35,0]} scale={[19.1,.7,15.1]}><sphereGeometry args={[1,64,24]}/><meshStandardMaterial color="#c1b68c"/></mesh>
 <Lagoon/><mesh geometry={path} receiveShadow><meshStandardMaterial color="#e6d4ad" side={THREE.DoubleSide}/></mesh><Bridge/>
 {board.map((kind,i)=><group key={i} position={position(i)} rotation={[0,trailAngle(i),0]}><RoundedBox args={[1.18,.23,1.08]} radius={.16} castShadow receiveShadow><meshStandardMaterial color={colors[kind]} roughness={.85}/></RoundedBox><Html position={[0,.2,0]} center distanceFactor={30} className="tile-label">{i+1}</Html>{i<63&&i%3===0&&<mesh position={[0,-.1,.68]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.12,3]}/><meshStandardMaterial color="#b29b72" side={THREE.DoubleSide}/></mesh>}</group>)}
 {groves.map(p=><Tree key={p.i} {...p}/>)}<Details/><Camp/><Butterflies/><Sign i={0} label="A AVENTURA COMEÇA"/><Sign i={63} label="CHEGADA ✦"/>
 <Html position={[-9,.2,-9]} center distanceFactor={40} className="region-label">BOSQUE DOS ENIGMAS</Html><Html position={[-.5,.2,5.7]} center distanceFactor={40} className="region-label">LAGOA DOS DESEJOS</Html>
 {players.map((_,i)=><Pawn key={i} index={i}/>)}<Camera key={overview}/></Suspense></Canvas>
}
