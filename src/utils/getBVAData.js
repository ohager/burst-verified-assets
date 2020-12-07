/*
alias: name has to be unique (lowercase alphanumeric, no whitespace or special chars) 
and contains json data (1000 chars max) JSON format:

{
	version: "0.1",                     // format version
	name: "some unique art",            // human readable name, non unique
	description: "this is an image",    // just text. links should be in sources array
	tags: "test,image,rare",            // used to sort and search
	sources: [                          // (optional) multiple files related to this
		{
		name: "something",              // website / art / film / music / binary
		type: "img",                    // this helps to identify how to display the content, i.e video player, image tag, download button
		url: "http://...",              // the source link
		hash: "4563edf4564..."          // (optional) a dl SHA256 binary check 64 char
		}
	],	
	asset_id: "123151478661681",        // asset num id. contains name + description (as string because of unsigned 64 bits)
	buy_url: "https://...",             // direct buy link. Paypal or other. replaces $pubkey$ keyword with the key
	contact_url: "mailto:me@contct.me", // can be email or forum url ect.
	extended_data: "next_alias",		// (optional) where we can find more data. as max is 1000 bytes
}

example
------------------------------------------------------------------------------------------------
{ version: "0.1", "name": "HotWallet pro license", "description": "TEST - HotWallet pro secure download and license. A lite and secure Burstcoin wallet.", "tags": "hotwallet, binary, free, license", "sources": [{ "name": "windows", "url": "https://github.com/curbshifter/bursthotwallet/releases/download/v0.3.33/bursthotwallet.msi", "hash": "c6b839e66c09ba51affb9705cb5eae8fdc67520a450c4cf52ab284f87c208eea", "type": "bin" }, { "name": "macos", "url": "https://github.com/curbshifter/bursthotwallet/releases/download/v0.3.33/bursthotwallet.dmg", "hash": "dea1f77453f626b84e3eec0b597152bda7663af5276be09a81e60eb10d21ae55", "type": "bin" }, { "name": "Logo", "url": "https://curbshifter.github.io/BurstHotWallet/screenshot01.png", "type": "img" }, { "name": "Meme 1234567890 test", "url": "https://curbshifter.github.io/BurstHotWallet/meme.jpg", "type": "img" }], "assets_id": 13269126541312011129, "extended_data": "randomtest", "buy_url": "https://paypal.com", "contact_url": "mailto:curbshifter@pm.me" }
*/

import { ApiSettings, composeApi } from '@burstjs/core'
import { Vars } from '../context/vars'

// collects Burst Verified Assets and returns a object with all data
export async function getBVAData(alias) {
    const apiSettings = new ApiSettings(Vars.PeerUrl)
    const api = composeApi(apiSettings)
    
    let resultData;
    let maxExtendedData = 100;
	let currentAlias = alias;

    // collect all BVA data from the root alias
	while (currentAlias != undefined && maxExtendedData > 0)
	{
        let aliasDataRaw;        
        try { // get the alias from the blockchain
            aliasDataRaw = await api.alias.getAliasByName(currentAlias)
            //console.log(aliasDataRaw);
        }
        catch (error) {
            console.log(error);
        }
        
        if (aliasDataRaw != undefined)
        {
            if (resultData === undefined)
            {
                resultData = { ...aliasDataRaw }; // copy over the first alias data (account, timestamp ect)
                resultData["aliasURI"] = undefined; // is not needed
            }

            try { // should give a json with data                
                let aliasData = JSON.parse(aliasDataRaw['aliasURI']);
                let sources = resultData.sources == undefined ? aliasData.sources : 
                                                                aliasData.sources.concat(resultData.sources); // collect all sources
                resultData = { ...resultData, ...aliasData }; // copy over properties (replaces existing props)
                resultData.sources = sources; // copy sources array back
                
                currentAlias = aliasData.extended_data;
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    console.log(e);
                } else {
                    console.log(e);				
                }			
                currentAlias = undefined;
            }
        }
        else currentAlias = undefined;

        maxExtendedData -= 1;
	}

    // if it contains an asset ID. load the asset data into the object
    if (resultData && resultData["asset_id"] > 0)
    {
        let assetDataRaw;        
        try { // get the alias from the blockchain
            assetDataRaw = await api.asset.getAsset(resultData["asset_id"])
            resultData["asset_data"] = assetDataRaw; // copy over asset properties (replaces existing props)
        }
        catch (error) {
            console.log(error);
        }
        
    /*  work in progress - collect price data
        let askUrl = Vars.PeerUrl + "burst?requestType=getAskOrders&asset=" + resultData["asset_id"] + "&firstIndex=1&lastIndex=1"
        let bidUrl = Vars.PeerUrl + "burst?requestType=getBidOrders&asset=" + resultData["asset_id"] + "&firstIndex=1&lastIndex=1"
        
        let assetBidDataRaw;
        try {
            assetBidDataRaw = await api.asset.getBidOrders(resultData["asset_id"], 1, 1)
            resultData["bidOrder"] = assetBidDataRaw;
        }
        catch (error) {
            console.log(error);
        }
        let assetAskDataRaw;
        try {
            assetAskDataRaw = await api.asset.getAskOrders(resultData["asset_id"], 1, 1)
            resultData["askOrder"] = assetAskDataRaw;
        }
        catch (error) {
            console.log(error);
        }*/
    }
    // itemize the tags into an array
    if (resultData && resultData["tags"])
    {
        var tagArr = resultData["tags"].split(',');
        for (let i = 0; i < tagArr.length; i++)
            tagArr[i] = tagArr[i].trim(); // remove whitespace
        resultData["tags"] = tagArr;
    }
    return resultData;
}

export async function checkHash(fileList, sourcesHashes)
{
    var isValidIdx = 0;
	if (fileList.length > 0)
	{
		const reader = new FileReader();
		reader.addEventListener('load', (event) => {
			var filehash = sha256(event.target.result);
			//console.log("calced hash: " + filehash);
            var idx = sourcesHashes.indexOf(filehash);
            isValidIdx = idx;
            console.log(" hash: " + idx);
		/*	if (idx == -1)
                console.log("not a verified asset !");
			else console.log("this is a verified asset !");*/
		});
		
	/*	reader.addEventListener('progress', (event) => {
			if (event.loaded && event.total) {
				const percent = (event.loaded / event.total) * 100;
				console.log(`Progress: ${Math.round(percent)}`);
			}
		});*/
		
		reader.readAsArrayBuffer(fileList[0]);
    }
    return isValidIdx;
}