// chrome://serviceworker-internals/
// chrome://inspect/#service-workers
// navigator.serviceWorker.controller

var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  'post-message': 'post-message-cache-v' + CACHE_VERSION
};

// This is a somewhat contrived example of using client.postMessage() to originate a message from
// the service worker to each client (i.e. controlled page).
// Here, we send a message when the service worker starts up, prior to when it's ready to start
// handling events.
self.clients.matchAll().then(function(clients) {
  clients.forEach(function(client) {
    console.log(client);
    client.postMessage('The service worker just started up.');
  });
});

self.addEventListener('install', function(event) {
  // Perform install steps
  var now = Date.now();
  console.log('SW install wevent...',event);

  // event.waitUntil(
  //   caches.open(CACHE_NAME)
  //     .then(function(cache) {
  //       console.log('Opened cache');
  //       return cache.addAll(urlsToCache);
  //     })
  // );

});

self.addEventListener('activate', function(event) {

  console.log('SW install activate...', event);

  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return clients.claim();
    }).then(function() {
      // After the activation and claiming is complete, send a message to each of the controlled
      // pages letting it know that it's active.
      // This will trigger navigator.serviceWorker.onmessage in each client.
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(clients.map(function(client) {
          return client.postMessage('The service worker has activated and ' +
            'taken control.');
        }));
      });
    })
  );
});

self.addEventListener('message', function(event) {
  console.log('Handling message event:', event.data.command);
  var now = Date.now();
  var request;
  
   event.ports[0].postMessage({
          error: null,
          time : now
   });
  


  /*
  caches.open(CURRENT_CACHES['post-message']).then(function(cache) {
    switch (event.data.command) {
      // This command returns a list of the URLs corresponding to the Request objects
      // that serve as keys for the current cache.
      // This command removes a request/response pair from the cache (assuming it exists).
      case 'test':
        request = new Request(event.data.url);
        event.ports[0].postMessage({
          error: null,
          time : now
        });
        break;


      case 'keys':
        cache.keys().then(function(requests) {
          var urls = requests.map(function(request) {
            return request.url;
          });

          return urls.sort();
        }).then(function(urls) {
          // event.ports[0] corresponds to the MessagePort that was transferred as part of the controlled page's
          // call to controller.postMessage(). Therefore, event.ports[0].postMessage() will trigger the onmessage
          // handler from the controlled page.
          // It's up to you how to structure the messages that you send back; this is just one example.
          event.ports[0].postMessage({
            error: null,
            urls: urls
          });
        });
        break;

      // This command adds a new request/response pair to the cache.
      case 'add':
        // If event.data.url isn't a valid URL, new Request() will throw a TypeError which will be handled
        // by the outer .catch().
        // Hardcode {mode: 'no-cors} since the default for new Requests constructed from strings is to require
        // CORS, and we don't have any way of knowing whether an arbitrary URL that a user entered supports CORS.
        request = new Request(event.data.url, {mode: 'no-cors'});
        cache.add(request).then(function() {
          event.ports[0].postMessage({
            error: null
          });
        });
        break;

      // This command removes a request/response pair from the cache (assuming it exists).
      case 'delete':
        request = new Request(event.data.url);
        cache.delete(request).then(function(success) {
          event.ports[0].postMessage({
            error: success ? null : 'Item was not found in the cache.'
          });
        });
        break;

      default:
        // This will be handled by the outer .catch().
        throw Error('Unknown command: ' + event.data.command);
    }
  }).catch(function(error) {
    // If the promise rejects, handle it by returning a standardized error message to the controlled page.
    console.error('Message handling failed:', error);

    event.ports[0].postMessage({
      error: error.toString()
    });
  });
  */

});