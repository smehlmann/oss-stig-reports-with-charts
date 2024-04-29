import * as reportGetters from './reportGetters.js';
import * as reportUtils from './reportUtils.js';

async function runSAReport(auth, emassNums) {

    try {

        //const prompt = promptSync();
        //const collectionName = prompt('Enter collection name.');

        console.log(`runSAReport: Requesting STIG Manager Collections`);
        //console.log(`runStatusReport: Requesting STIG Manager Data for collection ` + collectionName);

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

        //var labels = [];
        var assets = [];
        var metrics = [];

        //let labelMap = new Map();

        var rows = [];

        const headers = [
            { label: 'Collections', key: 'collectionName' },
            { label: 'Asset', key: 'asset' },
            { label: 'Assessed', key: 'assessed' },
            { label: 'Submitted', key: 'submitted' },
            { label: 'Accepted', key: 'accepted' },
            { label: 'Rejected', key: 'rejected' },
            { label: 'CAT3', key: 'cat3' },
            { label: 'CAT2', key: 'cat2' },
            { label: 'CAT1', key: 'cat1' }
        ];


        for (var i = 0; i < collections.length; i++) {
            var collectionName = collections[i].name;

            if (!collectionName.startsWith('NP_C')) {
                continue;
            }

            metrics = await reportGetters.getCollectionMertics(auth, collections[i].collectionId);
            //console.log(metrics);
            //console.log(metrics.length);
            var myData = getRow(collectionName, metrics);
            rows.push(myData);
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

function getRow(collectionName, metrics) {

    const numAssessments = metrics.data.metrics.assessments;
    const numAssessed = metrics.data.metrics.assessed;
    const numSubmitted = metrics.data.metrics.statuses.submitted.total;
    const numAccepted = metrics.data.metrics.statuses.accepted.total;
    const numRejected = metrics.data.metrics.statuses.rejected.total;
    const numSaved = metrics.data.metrics.statuses.rejected.total;
    const numAssets = metrics.data.assets;

    const numUnassessed = numAssessments - numAssessed;
    const totalChecks = numAssessments;

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

    const sumOfCat3 = metrics.data.metrics.findings.low;
    const sumOfCat2 = metrics.data.metrics.findings.medium;
    const sumOfCat1 = metrics.data.metrics.findings.high;

    var rowData = {
        collectionName: collectionName,
        asset: numAssets,
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

export { runSAReport };