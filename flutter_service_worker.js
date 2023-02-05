'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "931d4030115b60f450cfc0ef3c395e5d",
"assets/assets/images/android_tech_stack_image.png": "1f43afd45e1ab98cca2689f26ed5e050",
"assets/assets/images/autogeral_sobrescreen_image.jpg": "51f1e9172481940e92a983db2981160c",
"assets/assets/images/dart_tech_stack_image.png": "64e97dc79ed967728e336e558c813547",
"assets/assets/images/fatec_sobrescreen_image.png": "f75323692eaad7867a77ce2834d56a47",
"assets/assets/images/firebase_tech_stack_image.png": "10ef412d513b343b63ffbc0062ce63f5",
"assets/assets/images/flutter_tech_stack_image.png": "8a50b602aa79b19775c22d02a290f51f",
"assets/assets/images/github_tech_stack_image.png": "7618ddf2a619a9db4e7e940fd6c2124c",
"assets/assets/images/git_tech_stack_image.png": "042664999475fd8cc3672db6567e2e53",
"assets/assets/images/gmail_contactscreen_image.png": "eabc1a70245f1384e30960f25f9b2784",
"assets/assets/images/ifsp_sobrescreen_image.png": "b87805f9f574e0967ec1245417a47590",
"assets/assets/images/insomnia_tech_stack_image.png": "1e2c1d3f9e6ecf401c4a69975f5f5a20",
"assets/assets/images/ios_tech_stack_image.png": "403394427ebb8eea39a6da4e229bbd6d",
"assets/assets/images/java_tech_stack_image.png": "c43424186b9c089b9aa1d64c7f1989c1",
"assets/assets/images/linkedin_contactscreen_image.png": "30c453b7f5fbdb09ea0cb42a5dc7a6e5",
"assets/assets/images/linktree_contactscreen_image.png": "249976de03dd51c0984eab80a647938a",
"assets/assets/images/logo.png": "7a79bf74656f802715c957cfb5d30046",
"assets/assets/images/mysql_tech_stack_image.png": "51fcab8705ee70a51035126df56798f3",
"assets/assets/images/postman_tech_stack_image.png": "4726282388c194851c3a97fa81aecca1",
"assets/assets/images/profile_picture.jpg": "517566b0f114d69470e46af84f6dee41",
"assets/assets/images/rabbitmq_tech_stack_image.png": "5b14848a3654b0099a325fad076e9657",
"assets/assets/images/spring_boot_tech_stack_image.png": "27d77e56d88b7cdf403c84205933fda3",
"assets/assets/images/visual_studio_code_tech_stack_image.png": "4e0a5eba8f3c3367ff9e42e532ead120",
"assets/assets/images/whatsapp_contactscreen_image.png": "ec69d1fab1d1b2bd76ab53aab8e982e2",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "1a1fd0491050f0d6d07f9b5acd1ad28e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "ee9ef2ae9b6252069fa2ea4e4f66bcf2",
"/": "ee9ef2ae9b6252069fa2ea4e4f66bcf2",
"main.dart.js": "0fffa9be96c0b3b47b7d7a76c01c52cc",
"manifest.json": "9489fd5631ba1e20b033acee24aa6a18",
"version.json": "fb8d4678888024cd5f83d8522bb3a722"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
