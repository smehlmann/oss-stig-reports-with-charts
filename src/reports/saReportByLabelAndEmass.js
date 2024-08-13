import * as reportGetters from './reportGetters.js';
import * as reportUtils from './reportUtils.js';

async function runSAReportByLabelAndEmass(auth, emassMap) {

    try {

        //console.log(`runSAReportByLabelAndEmass Requesting STIG Manager Data for collection ` + collectionName);
        //var emassMap = reportUtils.filterCollectionsByEmassNumber(collections);
        var acronymMap = reportUtils.getEmassAcronymMap();

        var metrics = [];
        var rows = [];

        const headers = [
            { label: 'eMASS Number', key: 'emass' },
            { label: 'eMASS Acronym', key: 'acronym' },
            { label: 'Asset', key: 'asset' },
            { label: 'Checks', key: 'checks' },
            { label: 'Assessed', key: 'assessed' },
            { label: 'Submitted', key: 'submitted' },
            { label: 'Accepted', key: 'accepted' },
            { label: 'Rejected', key: 'rejected' },
            { label: 'CAT3', key: 'cat3' },
            { label: 'CAT2', key: 'cat2' },
            { label: 'CAT1', key: 'cat1' }
        ];

        const emassKeysArray = Array.from(emassMap.keys());

        for (var iEmass = 0; iEmass < emassKeysArray.length; iEmass++) {
            console.log('emassKeysArray[iEmass]: ' + emassKeysArray[iEmass]);
            var emassNum = emassKeysArray[iEmass];
            var myCollections = emassMap.get(emassNum);
            var metricsData = [];
            var assetEmassMap;

            for (var i = 0; i < myCollections.length; i++) {

                var collectionEmass = myCollections[i].metadata.eMASS;

                // get the collection assets
                const assets = await reportGetters.getAssetsByCollection(auth, myCollections[i].collectionId);
                if (!assets) {
                    continue;
                }

                var tempEmassMap = await reportUtils.getAssetEmassMapByAssets(emassNum, assets, 1, collectionEmass);
                if (i === 0) {
                    assetEmassMap = tempEmassMap
                }
                else {
                    tempEmassMap.forEach((value, key) => assetEmassMap.set(key, value));
                }

                metrics = await reportGetters.getCollectionMerticsUnaggregated(auth, myCollections[i].collectionId);
                if (metrics && metrics.data.length > 0) {
                    metricsData.push(metrics);
                }

            }

            if (metricsData.length > 0) {
                var myData = getRow(emassNum, metricsData, acronymMap, assetEmassMap);
                rows.push(myData);
            }
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

function getRow(emassNum, metrics, acronymMap, assetEmassMap) {

    var numAssessments = 0;
    var numAssessed = 0;
    var numSubmitted = 0;
    var numAccepted = 0;
    var numRejected = 0;
    var sumOfCat3 = 0;
    var sumOfCat2 = 0;
    var sumOfCat1 = 0;
    const numAssets = assetEmassMap.size;


    for (var i = 0; i < metrics.length; i++) {

        for (var j = 0; j < metrics[i].data.length; j++) {

            var myMetricsData = metrics[i].data[j];

            // check the asset eMass
            var assetName = myMetricsData.name;
            var assetEmass = assetEmassMap.get(assetName);

            if (assetEmass && assetEmass === emassNum) {
                //numAssets += myMetricsData.assets;

                var myMetrics = myMetricsData.metrics;
                numAssessments += myMetrics.assessments;
                numAssessed += myMetrics.assessed;
                numSubmitted += myMetrics.statuses.submitted.total;
                numAccepted += myMetrics.statuses.accepted.total;
                numRejected += myMetrics.statuses.rejected.total;
                sumOfCat3 += myMetrics.findings.low;
                sumOfCat2 += myMetrics.findings.medium;
                sumOfCat1 += myMetrics.findings.high;
            }
        }
    }

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

    const totalChecks = numAssessments;

    var emassAcronym = acronymMap.get(emassNum);
    if (!emassAcronym) {
        emassAcronym = '';
    }

    var rowData = {
        emass: emassNum,
        acronym: emassAcronym,
        asset: numAssets,
        checks: totalChecks,
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

export { runSAReportByLabelAndEmass };