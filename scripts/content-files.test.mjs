import assert from 'node:assert/strict';
import {mkdtemp,writeFile,unlink,rmdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {contentFiles} from './content-files.mjs';
const directory=await mkdtemp(join(tmpdir(),'locateam-content-'));
try{
  assert.deepEqual(await contentFiles(join(directory,'missing')),[]);
  assert.deepEqual(await contentFiles(directory),[]);
  await writeFile(join(directory,'post.json'),'{}');
  await writeFile(join(directory,'.gitkeep'),'');
  assert.deepEqual(await contentFiles(directory),['post.json']);
  await assert.rejects(contentFiles(join(directory,'post.json')));
}finally{for(const file of ['post.json','.gitkeep'])await unlink(join(directory,file)).catch(e=>{if(e.code!=='ENOENT')throw e});await rmdir(directory);}
console.log('Missing/empty content directory checks passed');
