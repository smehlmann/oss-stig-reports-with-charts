import * as reportGetters from './reportGetters.js';
import * as reportUtils from './reportUtils.js';

async function runSAReportByAsset(auth, inEmassNums, emassMap) {

    try {

        //console.log(collections);
        //const collections = await reportGetters.getCollectionByName(auth, collectionName);

        var metrics = [];
        var labels = [];
        let labelMap = new Map();

        var rows = [];
        const headers = [
            { label: 'Date Pulled', key: 'datePulled' },
            { label: 'Code', key: 'code' },
            { label: 'Short Name', key: 'shortName' },
            { label: 'Collection', key: 'collectionName' },
            { label: 'eMASS', key: 'emass' },
            { label: 'Asset', key: 'asset' },
            { label: 'NCCM', key: 'nccm' },
            { label: 'Device-Asset', key: 'deviceType' },
            { label: 'Primary Owner', key: 'primOwner' },
            { label: 'Sys Admin', key: 'sysAdmin' },
            { label: "RMF Action", key: 'rmfAction' },
            { label: "ISSO", key: 'isso' },
            { label: 'CCB_SA_Actions', key: 'ccbSAActions' },
            { label: "Other", key: 'other' },
            { label: 'Last Touched', key: 'lastTouched' },
            { label: 'STIGs', key: 'stigs' },
            { label: 'Benchmarks', key: 'benchmarks' },
            { label: 'Assessed', key: 'assessed' },
            { label: 'Submitted', key: 'submitted' },
            { label: 'Accepted', key: 'accepted' },
            { label: 'Rejected', key: 'rejected' },
            { label: 'CAT3', key: 'cat3' },
            { label: 'CAT2', key: 'cat2' },
            { label: 'CAT1', key: 'cat1' }
        ]

        var today = new Date();
        var todayStr = today.toISOString().substring(0, 10);

        const emassKeysArray = Array.from(emassMap.keys());
        for (var iEmass = 0; iEmass < emassKeysArray.length; iEmass++) {
            var collections = emassMap.get(emassKeysArray[iEmass]);
            var emassNum = emassKeysArray[iEmass];
            var assetEmassMap;

            for (var i = 0; i < collections.length; i++) {
                var collectionName = collections[i].name;
                var collectionEmass = collections[i].metadata.eMASS;
                console.log('runSAReportByAsset collectionName: ' + collectionName);

                if (!collectionName.startsWith('NP_C')) {
                    continue;
                }

                //assetEmassMap = await reportGetters.getAssetEmassMap(auth, collections[i].collectionId, emassNum);
                //get the collection assets
                var assets = await reportGetters.getAssetsByCollection(auth, collections[i].collectionId);
                if (!assets || assets.data.length === 0) {
                    continue;
                }

                assetEmassMap = await reportUtils.getAssetEmassMapByAssets(emassNum, assets, 0, collectionEmass);
                if (!assetEmassMap || assetEmassMap.size === 0) {
                    continue;
                }


                console.log(collectionName);
                labelMap.clear();
                labels.length = 0;

                labels = await reportGetters.getLabelsByCollection(auth, collections[i].collectionId);
                for (var x = 0; x < labels.data.length; x++) {
                    /*if(labels.data[x].description === 'RMF Action'){
                        console.log(labels.data[x].description);
                    }
                    if(labels.data[x].description === 'RMF ACTION'){
                        console.log(labels.data[x].description);
                    }*/
                    labelMap.set(labels.data[x].labelId, labels.data[x].description);
                    if(!labels.data[x].description){
                        console.log('No label description fpr labelId: ' + labels.data[x].labelId);
                    }
                }

                metrics = await reportGetters.getCollectionMerticsAggreatedByAsset(auth, collections[i].collectionId);
                //console.log(metrics);

                if (!metrics) {
                    continue;
                }

                for (var jMetrics = 0; jMetrics < metrics.data.length; jMetrics++) {

                    if (metrics.data[jMetrics].name === 'NP0902WK400011') {
                        console.log('assetName: ' + metrics.data[jMetrics].name);
                    }

                    // don't allow duplicates 
                    //var assetRowIdx = rows.findIndex(n=>n.asset.toUpperCase === metrics.data[jMetrics].name.toUpperCase());
                    /*var assetRowIdx = rows.findIndex(element => 
                        element.asset === metrics.data[jMetrics].name);*/

                    /*if(assetRowIdx && assetRowIdx >= 0){
                        continue;
                    }*/

                    var assetIdx = assets.data.findIndex(t => t.name === metrics.data[jMetrics].name);
                    var assetName = assets.data[assetIdx].name;
                    var assetEmass = assetEmassMap.get(assetName);
                    if (assetName === 'NP0902WK400011') {
                        console.log(assetName);
                    }
                    if (assetEmass && assetEmass.includes(',')) {
                        // check if duplicate
                        //var assetRowIdx = rows.findIndex(n => n.asset.toUpperCase === assetName.toUpperCase());
                        var assetRowIdx = rows.findIndex(element =>element.asset === assetName);
                        if (assetRowIdx && assetRowIdx >= 0) {
                            // don't add the row if the asset is already in rows array
                            continue;
                        }

                    }
                    /*var assets = await
                        reportGetters.getAssetsByName(auth, collections[i].collectionId, encodedName);*/

                    var myData =
                        getRow(todayStr, collections[i], metrics.data[jMetrics], labelMap, assets.data[assetIdx],
                            emassNum, assetEmassMap);
                    if (myData) {
                        rows.push(myData);
                    }

                }
            }
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

function getRow(todayStr, collection, metrics, labelMap, asset, emassNum, assetEmassMap) {

    var assetMetadata = '';
    var eMass = "";

    const metadata = asset.metadata;
    var assetName = asset.name;
    //var assetName = metrics.name;
    var assetEmass = assetEmassMap.get(assetName);
    if (!assetEmass) {
        return null;
    }

    if (assetName === 'c25-infra-02') {
        console.log('assetName: ' + assetName);
    }
    if (metrics.name === 'c25-infra-02') {
        console.log('assetName: ' + assetName);
    }

    if (assetEmass === emassNum) {
        eMass = assetEmass;
    }
    if (metadata) {
        if (metadata.assetMetadata) {
            assetMetadata = metadata.assetMetadata;
        }
        if (!metadata.eMass) {
            eMass = assetEmass;
        }
    }

    eMass = eMass.replaceAll(',', ';');

    var collectionName = collection.name;
    var code = collection.metadata.Code;
    var shortName = collection.metadata.ShortName;


    const numAssessments = metrics.metrics.assessments;
    const numAssessed = metrics.metrics.assessed;
    const numSubmitted = metrics.metrics.statuses.submitted;
    const numAccepted = metrics.metrics.statuses.accepted;
    const numRejected = metrics.metrics.statuses.rejected;

    var maxTouchTs = metrics.metrics.maxTouchTs;
    var touchDate = new Date(maxTouchTs);
    var today = new Date();
    var timeDiff = today - touchDate;
    var diffInHours = timeDiff / (1000 * 3600);
    var diffInDays = timeDiff / (1000 * 3600 * 24);
    var lastTouched = "";

    // set lastTouched to either hours or days
    var touched = "";
    if (diffInDays < 1) {
        touched = Math.round(diffInHours);
        lastTouched = touched + ' h';
    }
    else {
        touched = Math.round(diffInDays);
        lastTouched = touched.toString() + ' d';
    }

    if (collectionName === 'NP_C10-UnclassCore_Servers_1761_Zone A' && (metrics.name === 'NPK8VDIESX29' || metrics.name === 'npa0aznessus01')) {

        console.log(collectionName + ' ' + metrics.name);
    }

    const collectionMetadata = reportUtils.getMetadata(labelMap, metrics);
    var avgAssessed = 0;
    var avgSubmitted = 0;
    var avgAccepted = 0;
    var avgRejected = 0;
    var temp = 0;

    if (numAssessments) {
        temp = (numAssessed / numAssessments) * 100;
        avgAssessed = temp.toFixed(2);

        temp = ((numSubmitted + numAccepted + numRejected) / numAssessments) * 100;
        avgSubmitted = temp.toFixed(2);

        temp = (numAccepted / numAssessments) * 100;
        avgAccepted = temp.toFixed(2);

        temp = (numRejected / numAssessments) * 100;
        avgRejected = temp.toFixed(2);

    }

    const sumOfCat3 = metrics.metrics.findings.low;
    const sumOfCat2 = metrics.metrics.findings.medium;
    const sumOfCat1 = metrics.metrics.findings.high;

    var benchmarkIDs = metrics.benchmarkIds.toString();
    benchmarkIDs = benchmarkIDs.replaceAll(",", " ");

    var rowData = {
        datePulled: todayStr,
        code: code,
        shortName: shortName,
        collectionName: collectionName,
        emass: eMass,
        asset: metrics.name,
        nccm: assetMetadata,
        deviceType: collectionMetadata.device,
        primOwner: collectionMetadata.primOwner,
        sysAdmin: collectionMetadata.sysAdmin,
        rmfAction: collectionMetadata.rmfAction,
        isso: collectionMetadata.isso,
        ccbSAActions: collectionMetadata.ccbSAActions,
        other: collectionMetadata.other,
        lastTouched: lastTouched,
        stigs: metrics.benchmarkIds.length,
        benchmarks: benchmarkIDs,
        assessed: avgAssessed + '%',
        submitted: avgSubmitted + '%',
        accepted: avgAccepted + '%',
        rejected: avgRejected + '%',
        cat3: sumOfCat3,
        cat2: sumOfCat2,
        cat1: sumOfCat1
    }

    return rowData;
}

export { runSAReportByAsset };