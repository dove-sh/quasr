import * as prc from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
async function exec(exec, cwd='.'){
	console.log(`=>  ${exec}`);
	let run = prc.spawn(process.platform == "win32" ? `cmd` : `bash`,
	 [process.platform == "win32" ? "/c" : "-c", exec], {cwd: cwd});
	let output = '';
	run.stderr.on('data',data=>{ process.stdout.write(data.toString()); output+=data.toString();});
	run.stdout.on('data',data=>{ process.stdout.write(data.toString()); output+=data.toString();});
	let closed = false; let exitCode = 0;
	run.on('close', function (code) {
    	closed = true; exitCode = code; 
	});

	while(!closed){await new Promise(resolve => setTimeout(resolve, 100))};
	let functionOutput = {output, exitCode};
	return functionOutput.exitCode==0; 
}

(async ()=>{

    let brand_ts_file = await (await fs.readFile(path.resolve(__dirname, './src/base/context.ts'))).toString();
    await fs.writeFile(path.resolve(__dirname, './src/base/context.ts'), brand_ts_file.replaceAll("$_VERSION",process.env.npm_package_version));

	await exec ('rd /s /q build');

    await exec('npx swc ./src -d ./build') 
    && await exec('node --experimental-specifier-resolution=node build/quasr.js -v');
    await fs.writeFile(path.resolve(__dirname, './src/base/context.ts'),brand_ts_file);
})();