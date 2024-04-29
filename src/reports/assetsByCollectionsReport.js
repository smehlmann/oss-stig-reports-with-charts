import * as reportGetters from './reportGetters.js';
import * as reportUtils from './reportUtils.js';

async function runAssetByCollectionReport(auth, emassMap) {

    try {

        console.log(`Running Assets by Collection Report`);
        //alert(`Running Assets by Collection Report`);

        var stigs = [];
        var assets = [];
        //var collections = [];

        var rows = [];
        const headers = [
            { label: 'EMASS', key: 'emass' },
            { label: 'Collection', key: 'collection' },
            { label: 'STIG Benchmark', key: 'benchmark' },
            { label: 'Version', key: 'stigVersion' },
            { label: 'Assets', key: 'assetNames' }
        ];

        //const emassKeys = emassMap.getKeys();
        //const emassKeysArray = Array.from(emassKeys);
        const emassKeysArray = Array.from(emassMap.keys());

        for (var iEmass = 0; iEmass < emassKeysArray.length; iEmass++) {
            var collections = emassMap.get(emassKeysArray[iEmass]);
            var emassNum = emassKeysArray[iEmass];
            var assetEmassMap;

            console.log('emassKeysArray[iEmass]: ' + emassKeysArray[iEmass]);

            for (var j = 0; j < collections.length; j++) {
                //console.log("Requesting STIGS");j                
                console.log('collections: ' + collections[j]);

                var collectionName = collections[j].name;
                if(collectionName === 'NP_C25-NCCM_Zone B'){
                    console.log(collectionName);
                }

                assetEmassMap = await reportGetters.getAssetEmassMap(auth, collections[j].collectionId, emassNum);
                if(!assetEmassMap || assetEmassMap.size === 0){
                    continue;
                }
                

                //var strToRemove = '_' + emassNum + '_';
                //collectionName = collectionName.replace(strToRemove, '');
                stigs = await reportGetters.getStigs(auth, collections[j].collectionId);
                //console.log(stigs)

                //console.log("Requesting assets")
                for (var k = 0; k < stigs.data.length; k++) {
                    //assets.length = 0;
                    assets = await
                        reportGetters.getAssets(auth, collections[j].collectionId, stigs.data[k].benchmarkId);
                    //console.log(assets)

                    var myData = await
                        getRow(emassNum, collectionName, stigs.data[k], assetEmassMap, assets);
                    if (myData) {
                        rows.push(myData);
                    }
                }
            }
        }

        //alert('returning report data');
        const returnData = { headers: headers, rows: rows }
        //return rows;
        return returnData;
    }
    catch (e) {
        console.log(e);
        throw (e);
    }
}

async function getRow(collectionEmass, collectionName, stigs, assetEmassMap, assets) {

    var assetNames = '';
    var benchmarkId = stigs.benchmarkId;
    var stigVersion = stigs.revisionStr;

    for (var i = 0; i < assets.data.length; i++) {

        //var assetMetadata = await reportGetters.getAssetMetadata(auth, assets.data[i].assetId);
        //var assetEmass = assetMetadata.data.eMass;
        if(assets.data[i].name === 'c25-infra-02'){
            console.log('assetName: ' + assets.data[i].name);
        }

        /*if (assets.data[i].metadata && assets.data[i].metadata.eMass) {
            if (!assetEmassMap.get(assets.data[i].name)) {
                return null;
            }
        }*/

        var assetName = assets.data[i].name;
        var assetEmass = assetEmassMap.get(assetName);
        if(assetEmass === collectionEmass){
            assetNames += assetName + ';'
        }
        //assetNames = reportUtils.generateAssetNames(collectionEmass, assetName, assetNames, assetEmass);
    }


    //assetNames = Array.from(assetEmassMap.keys()).join(';');


    /*if (assetNames) {
        assetNames = assetNames.trim();
    }*/

    var rowData = {
        emass: collectionEmass,
        collection: collectionName,
        benchmark: benchmarkId,
        stigVersion: stigVersion,
        assetNames: assetNames
    }

    return rowData
}


export { runAssetByCollectionReport };