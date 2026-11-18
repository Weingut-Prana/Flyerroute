/* FlyerRoute street coverage solver. Original implementation, no STR1DE code. */
(function(root) {
"use strict";
function distance(a,b) {
 const R=Math.PI/180,dy=(b[0]-a[0])*R,dx=(b[1]-a[1])*R;
 const v=Math.sin(dy/2)**2+Math.cos(a[0]*R)*Math.cos(b[0]*R)*Math.sin(dx/2)**2;
 return 12742000*Math.asin(Math.min(1,Math.sqrt(v)));
}
function solve(edges,location) {
 if (!edges.length) return [];
 const adj=new Map();
 for(let i=0;i<edges.length;i++){
  const e=edges[i];
  for(const [a,b] of [[e.a,e.b],[e.b,e.a]]) {
   if(!adj.has(a)) adj.set(a,[]);
   adj.get(a).push({to:b,index:i,length:e.len});
  }
 }
 function shortest(start) {
  let dist=new Map([[start,0]]),prev=new Map(),queue=[[0,start]];
  while(queue.length){
   queue.sort((a,b)=>b[0]-a[0]);
   const [d,u]=queue.pop();
   if(d>dist.get(u)+1e-8)continue;
   for(const x of adj.get(u)||[]){
    const nd=d+x.length;
    if(nd < (dist.get(x.to)??Infinity)) {
     dist.set(x.to,nd);
     prev.set(x.to,{from:u,index:x.index});
     queue.push([nd,x.to]);
    }
   }
  }
  return {dist,prev};
 }
 // Work on connected components separately; never falsely draw travel between disconnected roads.
 let unseen=new Set(adj.keys()),components=[];
 while(unseen.size){
  const start=unseen.values().next().value,queue=[start],nodes=new Set([start]),set=new Set();
  unseen.delete(start);
  for(let j=0;j<queue.length;j++){
   const u=queue[j];
   for(const e of adj.get(u)||[]){
    set.add(e.index);
    if(!nodes.has(e.to)){nodes.add(e.to);unseen.delete(e.to);queue.push(e.to)}
   }
  }
  components.push({nodes,indices:[...set]});
 }
 const locate=location||edges[0].p;
 const pointFor=(n)=>{let x=adj.get(n)[0],e=edges[x.index];return e.a===n?e.p:e.q};
 components.sort((a,b)=>{
  const nearest=comp=>Math.min(...[...comp.nodes].map(n=>distance(locate,pointFor(n))));
  return nearest(a)-nearest(b);
 });
 let result=[];
 for(let componentIndex=0;componentIndex<components.length;componentIndex++) {
  const component=components[componentIndex],degree=new Map();
  for(const idx of component.indices){let e=edges[idx];degree.set(e.a,(degree.get(e.a)||0)+1);degree.set(e.b,(degree.get(e.b)||0)+1)}
  const odds=new Set([...degree].filter(([_,d])=>d%2===1).map(([n])=>n));
  // Greedy shortest-path odd-node pairing (Chinese Postman approximation).
  const duplicates=[];
  while(odds.size>=2) {
   const a=odds.values().next().value;odds.delete(a);
   const {dist,prev}=shortest(a);
   let b=null,best=Infinity;
   for(const candidate of odds){let d=dist.get(candidate);if(d!==undefined&&d<best){best=d;b=candidate}}
   if(b===null) break;
   odds.delete(b);
   let cursor=b;
   while(cursor!==a) {
    const p=prev.get(cursor);
    if(!p)break;
    duplicates.push(p.index);cursor=p.from;
   }
  }
  let instances=[];
  for(let i of component.indices)instances.push({idx:i,repeat:false});
  for(let i of duplicates)instances.push({idx:i,repeat:true});
  let multi=new Map();
  instances.forEach((instance,i)=>{
   let e=edges[instance.idx];
   for(const [u,v] of [[e.a,e.b],[e.b,e.a]]){
    if(!multi.has(u))multi.set(u,[]);
    multi.get(u).push({to:v,instance:i});
   }
  });
  let start=[...component.nodes][0],best=Infinity;
  for(const node of component.nodes){const d=distance(locate,pointFor(node));if(d<best){best=d;start=node}}
  let stack=[{node:start,step:null}],trail=[],used=new Set();
  while(stack.length) {
   const top=stack[stack.length-1],neighbors=multi.get(top.node)||[];
   let next=null;
   while(neighbors.length) {
    const test=neighbors.pop();
    if(!used.has(test.instance)){next=test;break}
   }
   if(next){
    used.add(next.instance);
    stack.push({node:next.to,step:{idx:instances[next.instance].idx,from:top.node,to:next.to,repeat:instances[next.instance].repeat}});
   } else {
    const item=stack.pop();
    if(item.step)trail.push(item.step);
   }
  }
  trail.reverse();
  if(componentIndex>0)result.push({jump:true,component:componentIndex+1});
  result.push(...trail);
 }
 return result;
}
root.FlyerPlanner={plan:solve};
})(typeof window!=="undefined"?window:globalThis);
