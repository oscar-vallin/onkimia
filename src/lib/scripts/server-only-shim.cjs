// Mocks `server-only` for tsx scripts running outside the Next.js runtime.
const Module = require('module');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request === 'server-only') return 'server-only';
  return originalResolve.call(this, request, ...args);
};
require.cache['server-only'] = {
  id: 'server-only',
  filename: 'server-only',
  loaded: true,
  exports: {},
  paths: [],
  parent: null,
  children: [],
};
