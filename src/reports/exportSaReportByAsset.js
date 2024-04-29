import * as reportGetters from './reportGetters.js';
import * as reportUtils from './reportUtils.js';

async function runExportSAReportByAsset(auth, args, collections, emassMap) {

    try {

        //console.log(collections);

        var metrics = [];
        var labels = [];
        let labelMap = new Map();

        var rows = [];
        /*var rows = [
            {
                datePulled: 'Date Pulled',
                code: 'Code',
                shortName: 'Short Name',
                collectionName: 'Collection',
                asset: 'Asset',
                deviveType: 'Device-Asset',
                primOwner: 'Primary Owner',
                sysAdmin: 'Sys Admin',                
                rmfAction: "RMF Action",
                isso: "ISSO",
                ccbSAActions: 'CCB_SA_Actions',
                other: "OTHER",
                lastTouched: 'Last Touched',
                stigs: 'STIGs',
                assessed: 'Assessed',
                submitted: 'Submitted',
                accepted: 'Accepted',
                rejected: 'Rejected'
            }
        ];*/

        const headers = [
            { label: 'Date Pulled', key: 'datePulled' },
            { label: 'Code', key: 'code' },
            { label: 'Short Name', key: 'shortName' },
            { label: 'Collection', key: 'collectionName' },
            { label: 'Asset', key: 'asset' },
            { label: 'Device-Asset', key: 'deviveType' },
            { label: 'Primary Owner', key: 'primOwner' },
            { label: 'Sys Admin', key: 'sysAdmin' },
            { label: "RMF Action", key: 'rmfAction' },
            { label: "ISSO", key: 'isso' },
            { label: 'CCB_SA_Actions', key: 'ccbSAActions' },
            { label: "OTHER", key: 'other' },
            { label: 'Last Touched', key: 'lastTouched' },
            { label: 'STIGs', key: 'stigs' },
            { label: 'Assessed', key: 'assessed' },
            { label: 'Submitted', key: 'submitted' },
            { label: 'Accepted', key: 'accepted' },
            { label: 'Rejected', key: 'rejected' }
        ];


        var today = new Date();
        var todayStr = today.toISOString().substring(0, 10);

        for (var i = 0; i < collections.length; i++) {
            var collectionName = collections[i].name;

            var upperCaseName = collectionName.toUpperCase();

            //exclude collections thqt do not start with NP_C
            if (!upperCaseName.startsWith('NP_C')) {
                continue;
            }

            if (collections[i].metadata.NonStig) {
                continue;
            }
            else if (collections[i].metadata.ParkingLot) {
                continue;
            }


            //console.log(collectionName);
            labelMap.clear();
            labels.length = 0;

            labels = await reportGetters.getLabelsByCollection(auth, collections[i].collectionId);
            for (var x = 0; x < labels.data.length; x++) {
                labelMap.set(labels.data[x].labelId, labels.data[x].description);
            }


            metrics = await reportGetters.getCollectionMerticsAggreatedByAsset(auth, collections[i].collectionId);
            //console.log(metrics);

            for (var j = 0; j < metrics.data.length; j++) {
                var myData = getRow(todayStr, collections[i], metrics.data[j], labelMap);
                rows.push(myData);

            }
        }

        //alert('returning report data');
        const returnData = { headers: headers, rows: rows }
        //return rows;
        return returnData;
    }
    catch (e) {
        console.log(e)
    }
}

function getRow(todayStr, collection, metrics, labelMap) {

    var collectionName = collection.name;
    var code = collection.metadata.Code;
    if (!code) {
        code = '';
    }
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
    var touched;

    // set lastTouched to either hours or days
    if (diffInDays < 1) {
        touched = Math.round(diffInHours);
        lastTouched = touched + ' h';
    }
    else {
        touched = Math.round(diffInDays);
        lastTouched = touched.toString() + ' d';
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

    var rowData = {
        datePulled: todayStr,
        code: code,
        shortName: shortName,
        collectionName: collectionName,
        asset: metrics.name,
        deviveType: collectionMetadata.device,
        primOwner: collectionMetadata.primOwner,
        sysAdmin: collectionMetadata.sysAdmin,
        rmfAction: collectionMetadata.rmfAction,
        isso: collectionMetadata.isso,
        ccbSAActions: collectionMetadata.ccbSAActions,
        other: collectionMetadata.other,
        lastTouched: lastTouched,
        stigs: metrics.benchmarkIds.length,
        assessed: avgAssessed + '%',
        submitted: avgSubmitted + '%',
        accepted: avgAccepted + '%',
        rejected: avgRejected + '%'
    }

    return rowData;

}

export { runExportSAReportByAsset };