import * as reportGetters from './reportGetters.js';
import * as reportUtils from './reportUtils.js';

async function runAssetCountReportByEmass(auth, emassNums) {

    try {

        //console.log(`runStatusReport: Requesting STIG Manager Collections`);
        console.log(`runAssetCountReportByEmass: Requesting STIG Manager Data`);
        var collections = [];
        var tempCollections = [];

        tempCollections = await reportGetters.getCollections(auth);
        if (!emassNums || emassNums.length === 0) {
            //collections = tempCollections;
            for (var j = 0; j < tempCollections.data.length; j++) {
                collections.push(tempCollections.data[j])
            }
        }
        else {
            var emassMap = reportUtils.getCollectionsByEmassNumber(tempCollections);
            var emassArray = emassNums.split(',');
            for (var mapIdx = 0; mapIdx < emassArray.length; mapIdx++) {
                if (emassMap.has(emassArray[mapIdx])) {

                    var mappedCollection = emassMap.get(emassArray[mapIdx]);
                    if (mappedCollection) {
                        collections = collections.concat(mappedCollection);
                    }
                }
            }
        }

        emassMap = reportUtils.filterCollectionsByEmassNumber(collections);
        var metrics = [];

        var rows = [];
        /*var rows = [
            {
                emassNum: 'EMASS Number',
                assetCount: 'Asset Count'
            }

        ];*/

        const headers = [
            { label: 'EMASS Number', key: 'emassNum' },
            { label: 'Asset Count', key: 'assetCount' }
        ];

        var iKey = 0;
        var iKeyend = emassMap.size;
        var myKeys = emassMap.keys();
        //console.log(myKeys);

        while (iKey < iKeyend) {
            var emassNum = myKeys.next().value;
            var myCollections = emassMap.get(emassNum);
            var metricsData = [];
            for (var i = 0; i < myCollections.length; i++) {

                var collectionName = collections[i].name;
                if (!collectionName.startsWith('NP_C')) {
                    continue;
                }

                metrics = await reportGetters.(auth, myCollections[i].collectionId);
                metricsData.push(metrics);

                //var myData = getRow(collectionName, metrics);
                //rows.push(myData);

            }
            var myData = getRow(emassNum, metricsData);
            rows.push(myData);
            iKey++;
            metricsData.length = 0;
        }

        const returnData = { headers: headers, rows: rows }
        //return rows;
        return returnData;
    }
    catch (e) {
        console.log(e);
        throw (e);
    }
}

function getRow(emassNum, metricsData) {

    var totalAssetCount = 0;
    for (var i = 0; i < metricsData.length; i++) {
        totalAssetCount += metricsData[i].data.assets;
    }

    var myMetricsData = {
        emassNum: emassNum,
        assetCount: totalAssetCount
    }

    return myMetricsData;

}

export { runAssetCountReportByEmass };