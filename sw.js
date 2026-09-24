const CACHE="pocket-budget-v5",LIB="pocket-budget-reader-v1";
const FILES=["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/favicon.svg"];
const LIBHOSTS=["cdn.jsdelivr.net","tessdata.projectnaptha.com"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE&&n!==LIB).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(LIBHOSTS.includes(u.hostname)){e.respondWith(caches.open(LIB).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))));return}
  if(u.origin!==location.origin)return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put("./index.html",c));return res}).catch(()=>caches.match("./index.html")));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
