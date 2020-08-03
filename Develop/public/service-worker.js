console.log(`HERE WE GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO`);

const FILES_TO_CACHE = [
  //want icons and manifest cached and ready
  "/",
  "/index.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/manifest.webmanifest",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//install evt list ============= start
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`PRELOAD SUCCESS!`);

      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
//install evt list ============= end

//active evt list ============= start
self.addEventListener("active", function (evt) {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // if key inst V1 and V2 delete it
          if (key === CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removed old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  // be sure serviceWorker is running correctly
  self.ClientRectList.claim();
});
//active evt list ============= end

//fetch evt list ============= start
self.addEventListener("fetch", function (evt) {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              //   if (response) {
              //     return response;
              //   } else if (
              //     event.request.headers.get("accept").includes("text/html")
              //   ) {
              //     // return the cached home page for all requests for html pages
              //     return caches.match("/");
              //   }
              return response;
            })
            .catch((err) => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        })
        .catch((err) => console.log(err))
    );

    return;
  }
});

//fetch evt list ============= end
