console.log(`HERE WE GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO`);

const FILES_TO_CACHE = [
  //want icons and manifest cached and ready
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "manifest.webmanifest",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`PRELOAD SUCCESS!`);

      return cache.addAll(FILES_TO_CACHE);
    })
  );
});
