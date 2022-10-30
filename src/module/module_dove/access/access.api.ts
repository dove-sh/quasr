import fetch from "node-fetch";
import { chk } from ".";
import ApiContext from "../../module_api/types/ApiContext";

export default async ({app}:ApiContext)=>{
	app.post('/_access/check_session_key', async (req,res)=>{
		if (!(await chk(req))) return res.json({session__expired: true});
		else return res.json({ok: 'true'});
	});
	app.put('/_access/session_key', async (req, res) => {
		if (!req.body) return res.json({error:'unknown'});
        verbose(`dove_env: verifying http://${config.environment.host}:1337/server/${config.environment.serverUid}/verifySession`);
        verbose(`dove_env: requestedKey=${req.body.key} integritySign=${req.body.integrity}`);

		let checkingResult = await fetch(`http://${config.environment.host}:1337/server/${config.environment.serverUid}/verifySession`,
		{
			method: "POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({requestedKey: req.body.key, integritySign: req.body.integrity})
		}).then(r=>r.text());
        verbose(`dove_env: session key check result is: ${checkingResult}`);
        
		if (checkingResult!="OK") {
            verbose(`dove_env: трахать трахать трахать трахать`);
            return res.json({error:checkingResult});
        }
        let session = new storage.dove_auth_sessions({key: req.body.key, expire: Date.now() + 15*60000});
		await session.save();
		res.send("OK!");res.end();return;
	})
}