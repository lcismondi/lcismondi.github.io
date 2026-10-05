export function createSheetMock() {
  const rows=[['Fecha','Nombre','Email','Empresa','Mensaje','ID','Estado correo']];
  let max=1000;
  const range=(row,col,height=1,width=1)=>({
    getValues:()=>Array.from({length:height},(_,r)=>Array.from({length:width},(_,c)=>rows[row-1+r]?.[col-1+c]??'')),
    getValue:()=>rows[row-1]?.[col-1]??'',
    setValues:values=>{values.forEach((cells,r)=>{rows[row-1+r]??=[];cells.forEach((v,c)=>rows[row-1+r][col-1+c]=v);});},
    setValue:value=>{rows[row-1]??=[];rows[row-1][col-1]=value;},setNumberFormat(){},setWrap(){},
    createTextFinder:text=>({matchEntireCell:()=>({findNext:()=>{for(let r=row-1;r<row-1+height;r++)if(rows[r]?.[col-1]===text)return {getRow:()=>r+1};return null;}})})
  });
  const sheet={getRange:range,getLastRow:()=>rows.length,getMaxRows:()=>max,insertRowsAfter:(_,n)=>max+=n};
  const service={openById:()=>({getSheetByName:()=>sheet}),flush(){}};
  return {service,sheet,rows};
}
