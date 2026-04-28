const CACHE_NAME = "samoussapp-v3";

const FILES_TO_CACHE = [
  "./",
  "index.html?v=2",
  "bar.html?v=2",
  "carte.html?v=2",
  "categorie.html?v=2",
  "ajouter.html?v=2",
  "login.html?v=2",
  "dashboard.html?v=2",
  "devenir-samoussatier.html?v=2",
  "connexion-samoussatier.html?v=2",
  "dashboard-samoussatier.html?v=2",
  "manifest.json",
  "icon-192.png?v=2",
  "icon-512.png?v=2"
];

self.addEventListener("install", function(event){
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.map(function(key){
          if(key !== CACHE_NAME){
            return caches.delete(key);
          }
        })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event){
  event.respondWith(
    fetch(event.request)
      .then(function(response){
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(function(){
        return caches.match(event.request);
      })
  );
});
