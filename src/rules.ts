export type Kind='início'|'conhecimento'|'neutra'|'enigma'|'minijogo'|'aposta'|'duelo'|'caos'|'bônus'|'chegada';
export const colors:Record<Kind,string>={'início':'#fff2c6',conhecimento:'#6bbbd0',neutra:'#e9dabb',enigma:'#ae92cf',minijogo:'#e7a759',aposta:'#efcf66',duelo:'#e98f92',caos:'#7085bd',bônus:'#94c893',chegada:'#ffd16b'};
const counts: [Kind,number][]=[['conhecimento',16],['neutra',12],['enigma',8],['minijogo',7],['aposta',6],['duelo',5],['caos',5],['bônus',3]];
export const board:Kind[]=['início',...counts.flatMap(([k,n])=>Array.from({length:n},(_,i)=>({k,t:(i+.5)/n}))).sort((a,b)=>a.t-b.t).map(x=>x.k),'chegada'];
export const position=(i:number):[number,number,number]=>{const row=Math.floor(i/8),col=row%2?7-i%8:i%8;return [(col-3.5)*1.55,.35+Math.sin(i*.22)*.08,(row-3.5)*1.55]};
export const move=(from:number,steps:number)=>Math.max(0,Math.min(63,from+steps));
export type Avatar={name:string;skin:string;hair:string;shirt:string;style:string;glasses:boolean};
export type Player={avatar:Avatar;pos:number;stars:number};
export const defaults:Avatar[]=[{name:'Aurora',skin:'#dca47c',hair:'#44302c',shirt:'#df896b',style:'cacheado',glasses:false},{name:'Bento',skin:'#a96f4e',hair:'#282526',shirt:'#73a8b7',style:'curto',glasses:true}];
export function winner(players:Player[]){return [...players].sort((a,b)=>b.pos-a.pos||b.stars-a.stars).filter((p,_,all)=>p.pos===all[0].pos&&p.stars===all[0].stars).map(p=>p.avatar.name).join(' e ')}
