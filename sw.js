const CACHE_NAME = "samoussapp-v3";

const FILES_TO_CACHE = [
  "./",
  "index.html?v=3",
  "bar.html?v=3",
  "carte.html?v=3",
  "categorie.html?v=3",
  "ajouter.html?v=3",
  "login.html?v=3",
  "dashboard.html?v=3",
  "devenir-samoussatier.html?v=3",
  "connexion-samoussatier.html?v=3",
  "dashboard-samoussatier.html?v=3",
  "manifest.json",
  "icon-192.png?v=3",
  "icon-512.png?v=3"
];


// INSTALLATION (cache initial)
self.addEventListener("install", function(event){
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});


// ACTIVATION (supprime anciens caches)
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


// FETCH (toujours prioriser internet)
self.addEventListener("fetch", function(event){
  event.respondWith(
    fetch(event.request)
      .then(function(response){

        // clone pour stockage
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, responseClone);
        });

        return response;

      })
      .catch(function(){

        // fallback cache si offline
        return caches.match(event.request);

      })
  );
});
