import assert from 'node:assert/strict';
import {bendAt} from './text-bend.js';
assert.equal(bendAt(100,100,null),0);
assert.equal(bendAt(100,100,{x:100,y:100}),30);
assert.ok(bendAt(400,100,{x:100,y:100})<.01);
assert.equal(bendAt(80,100,{x:100,y:100}),bendAt(120,100,{x:100,y:100}));
console.log('Text bend checks passed');
