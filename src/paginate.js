export function paginate(items,requestedPage){
  const totalPages=Math.max(1,Math.ceil(items.length/10));
  const page=Math.min(totalPages,Math.max(1,Number.isSafeInteger(Number(requestedPage))?Number(requestedPage):1));
  return {page,totalPages,items:items.slice((page-1)*10,page*10)};
}
