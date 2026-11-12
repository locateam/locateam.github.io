import assert from 'node:assert/strict';
import {blogUrl,postUrl,routeParams,legacyUrl} from './routes.js';
assert.equal(blogUrl(1),'/blog/');assert.equal(blogUrl(2),'/blog/page/2/');
assert.equal(postUrl('hello-loka'),'/blog/hello-loka/');
assert.equal(routeParams('/blog/hello-loka/').get('post'),'hello-loka');
assert.equal(routeParams('/blog/page/2/').get('page'),'2');
assert.equal(legacyUrl('?blog&post=hello-loka'),'/blog/hello-loka/');
assert.equal(legacyUrl('?blog&page=2'),'/blog/page/2/');assert.equal(legacyUrl(''),null);
console.log('Route checks passed');
