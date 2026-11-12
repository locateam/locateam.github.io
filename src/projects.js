export function projectsFor(projects,language){
  return projects.filter(project=>project.visible&&/^https:\/\//.test(project.url)).map(project=>{
    if(language==='ru')return project;
    if(project.en?.enabled!==true)return null;
    for(const field of ['title','description'])if(typeof project.en[field]!=='string'||!project.en[field].trim())throw Error(`English translation of project ${project.slug}: fill ${field} before enabling publication`);
    return {...project,title:project.en.title,description:project.en.description};
  }).filter(Boolean).sort((a,b)=>(a.order??0)-(b.order??0));
}
