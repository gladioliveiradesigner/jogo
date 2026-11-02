import {expect,it} from 'vitest';
import {trail,groves,pathClearance,inLagoon,ribbon} from './landscape';
it('keeps 64 ordered trail steps at walkable distances without overlapping tiles',()=>{
 expect(trail).toHaveLength(64);
 for(let i=0;i<trail.length;i++){
  if(i)expect(trail[i].distanceTo(trail[i-1])).toBeLessThan(2.5);
  for(let j=i+1;j<trail.length;j++)expect(trail[i].distanceTo(trail[j])).toBeGreaterThan(1.2);
 }
 expect(Math.max(...trail.map(p=>p.x))-Math.min(...trail.map(p=>p.x))).toBeGreaterThan(27);
});
it('keeps trees out of the walking route and water',()=>{for(const p of groves){expect(pathClearance(p.x,p.z)).toBeGreaterThan(2);expect(inLagoon(p.x,p.z)).toBe(false)}});
it('builds a finite connected trail surface',()=>{const g=ribbon();expect(g.index?.count).toBe(384*6);expect([...g.attributes.position.array].every(Number.isFinite)).toBe(true);g.dispose()});
