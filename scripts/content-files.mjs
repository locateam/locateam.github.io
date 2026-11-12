import {readdir} from 'node:fs/promises';
export async function contentFiles(directory){
  try{return (await readdir(directory)).filter(file=>file.endsWith('.json'));}
  catch(error){if(error.code==='ENOENT')return [];throw error;}
}
