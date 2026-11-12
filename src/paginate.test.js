import assert from 'node:assert/strict';
import {paginate} from './paginate.js';
const rows=Array.from({length:21},(_,i)=>i);
assert.deepEqual(paginate(rows,2).items,[10,11,12,13,14,15,16,17,18,19]);
assert.deepEqual(paginate(rows,999),{page:3,totalPages:3,items:[20]});
for(const value of [0,-1,'oops','1.5',Infinity])assert.equal(paginate(rows,value).page,1);
assert.deepEqual(paginate([],1),{page:1,totalPages:1,items:[]});
console.log('Pagination checks passed');
