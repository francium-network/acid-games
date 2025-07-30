function ensureTrailingSlash(path) {
  return path.endsWith('/') ? path : path + '/';
}

try {
  // Get the parameters from the service worker's URL
  console.log("Parsing URL parameters...");
  var url = new URLSearchParams(self.location.search);
  var bare = atob(url.get("bare"));
  var scope = ensureTrailingSlash(atob(url.get("scope")));

  console.log("Scope (path) decoded: " + scope);
  console.log("Bare server decoded: " + bare);

  // Import the necessary scripts
  console.log("Importing scripts...");
  importScripts(scope + "uv/uv.bundle.js");
  console.log("Imported " + scope + "uv/uv.bundle.js");
  
  importScripts(scope + "uv/uv.config.js");
  console.log("Imported " + scope + "uv/uv.config.js");
  
  importScripts(scope + "uv/uv.sw.js");
  console.log("Imported " + scope + "uv/uv.sw.js");

  // Update the UV configuration with the scope and bare parameters
  console.log("Updating UV configuration...");
  self.__uv$config.prefix = self.__uv$config.prefix.replace("theserviceworkerscriptscope/", scope);
  self.__uv$config.config = self.__uv$config.config.replace("theserviceworkerscriptscope/", scope);
  self.__uv$config.bundle = self.__uv$config.bundle.replace("theserviceworkerscriptscope/", scope);
  self.__uv$config.handler = self.__uv$config.handler.replace("theserviceworkerscriptscope/", scope);
  self.__uv$config.sw = self.__uv$config.sw.replace("theserviceworkerscriptscope/", scope);
  self.__uv$config.bare = bare;

  console.log("UV configuration updated with scope and bare values.");

  // Create the UVServiceWorker with the updated config
  console.log("Creating UVServiceWorker instance...");
  const sw = new UVServiceWorker(self.__uv$config);
  console.log("UVServiceWorker instance created.");

  // Fetch event listener outside of a function
  self.addEventListener("fetch", (event) => {
    console.log("Intercepted fetch event for: " + event.request.url);

    if (event.request.url.includes(self.__uv$config.config)) {
      console.log("Handling request for UV config.");
      // Handle requests for the UV config
      event.respondWith(
        new Response(`self.__uv$config = {
    prefix: '${self.__uv$config.prefix}',
    bare: '${self.__uv$config.bare}',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '${self.__uv$config.handler}',
    bundle: '${self.__uv$config.bundle}',
    config: '${self.__uv$config.config}',
    sw: '${self.__uv$config.sw}',
};`, {
          headers: {
            'Content-Type': "application/javascript"
          }
        })
      );
    } else {
      // Handle other fetch requests with the UV service worker
      console.log("Delegating fetch event to UVServiceWorker.");
      event.respondWith(sw.fetch(event));
    }
  });

} catch (e) {
  console.log("An error occurred: " + e.message);
}
