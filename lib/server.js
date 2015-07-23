var hapi = require('hapi');
var path = require('path');

var options = {
  name: 'jazz',
  resourceDir: 'resources',
};

var DIST_DIR = path.join(__dirname, '..', 'dist');
var RESOURCE_DIR = path.join(DIST_DIR, options.resourceDir);
var INDEX_FILE = path.join(DIST_DIR, 'index.html');
var UI_ROUTE_PATH = '/ui/' + options.name + '/{path*}';
var UI_RESOURCE_RE = new RegExp('^' + options.resourceDir);

var server = new hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: __dirname,
      }
    }
  }
});

server.connection({
  port: 4000,
  host: 'localhost',
});

server.route({
  method: 'GET',
  path: UI_ROUTE_PATH,
  handler: function (request, reply) {
    if (request.params.path && request.params.path.match(UI_RESOURCE_RE)) {
      reply.file(path.join(DIST_DIR, request.params.path));
    } else {
      reply.file(INDEX_FILE);
    }
  }
});

// TODO figure out how to DRY this up w/ production proxy stuff or if this is different in use
var util = require('util');
// Returns a route for the given parameters
var proxyRoute = function proxyRoute(path, stripRegex, replaceString, hostConfig, methods) {
  if(!methods) {
    methods = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'];
  }

  return {
    path: path,
    method: methods,
    config: {
      // pre: routePre,
      handler: {
        proxy: {
          passThrough: true,
          mapUri: function(request, callback) {
            var uri = request.url.path;

            if(stripRegex) {
              uri = request.url.path.replace(stripRegex, '');
            }
            if(hostConfig) {
              uri = util.format('https://%s%s', hostConfig.host, uri);
            }
            console.log('[proxy]', uri);
            // pretend to be the host we're going to for https to work
            request.headers.host = hostConfig.host;
            return callback(null, uri, request.headers);
          }
        }
      }
    }
  };
};


var THE_ONE_TRUE_FRY = {
  host: 'fry.dev.yb0t.cc',
  port: 443,
};

server.route([
  proxyRoute('/graphite-east/{path*}', '', '', THE_ONE_TRUE_FRY),
  proxyRoute('/graphite-west/{path*}', '', '', THE_ONE_TRUE_FRY),
  proxyRoute('/admetrics/v4/{path*}', '', '', THE_ONE_TRUE_FRY),
]);

server.start(function () {
  console.log('Server started at: ' + server.info.uri + '/ui/' + options.name);
});
