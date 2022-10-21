function parseVal(str:string){
	if (!str) return false;
	str=str.replaceAll('\r\n','').replaceAll('\n','');
	if (str=='null'||str=='') return null;
	if (str=='undefined') return undefined;
	if (str=="True"||str=="true") return true;
	if (str=="False"||str=="false") return false;
	if (!isNaN(parseInt(str))) return parseInt(str);
	return str;
}
export function parse(content:any){
	if (!content || content.length===0) return {}
	let retur:any = {};
	let lines = content.split('\n');
	let currentCommentary = '';
	for(var line of lines){
		let key = line.split('=')[0];
		let value = line.split('=')[1];
		retur[key]=parseVal(value);
	}
	return retur;
}
export function stringify(o:any){
	let retur ='';
	for(var key in o){
		let val = o[key];
		if (val===null) val = "";
		retur += `${key}=${val}\n`;
	}
	return retur;
}