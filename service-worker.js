self.addEventListener("fetch",e=>{
 e.respondWith(
  caches.open("pos").then(c=>c.match(e.request)||fetch(e.request))
 );
});
