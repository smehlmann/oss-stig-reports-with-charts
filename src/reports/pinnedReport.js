import * as reportGetters from './reportGetters.js';
import * as reportUtils from './reportUtils.js';

async function runPinnedReport(auth, emassMap) {

    try {

        console.log(`runSAReportWithMetricsAndVersions: Requesting STIG Manager Collections`);

        var labels = [];
        let labelMap = new Map();
        var rows = [];
        
        const headers = [
            { label: 'Collection', key: 'collectionName' },
            { label: 'Asset', key: 'asset' },
            { label: 'Device-Asset', key: 'deviveType' },
            { label: 'Primary Owner', key: 'primOwner' },
            { label: 'Sys Admin', key: 'sysAdmin' },
            { label: "RMF Action", key: 'rmfAction' },
            { label: "ISSO", key: 'isso' },
            { label: 'CCB_SA_Actions', key: 'ccbSAActions' },
            { label: "Orher", key: 'other' },
            { label: 'STIG Benchmark', key: 'benchmarks' },
            { label: 'Pinned Revision', key: 'pinnedRev' },
            { label: 'Latest Revision', key: 'latestRev' },
            { label: 'Previous Revision', key: 'prevRev' },
            { label: 'Current Quarter STIG Version', key: 'quarterVer' },
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
            var collections = emassMap.get(emassKeysArray[iEmass]);

            for (var i = 0; i < collections.length; i++) {
                var collectionName = collections[i].name;
                var collectionId = collections[i].collectionId;
                console.log('collection name: ' + collectionName);

                if (!collectionName.startsWith('NP_C')) {
                    continue;
                }

                labelMap.clear();
                labels.length = 0;

                labels = await reportGetters.getLabelsByCollection(auth, collections[i].collectionId);
                for (var x = 0; x < labels.data.length; x++) {
                    labelMap.set(labels.data[x].labelId, labels.data[x].description);
                }

                // get assets 
                var assets = await reportGetters.getAssetMetricsSummary(auth, collections[i].collectionId);

                for (var iAssets = 0; iAssets < assets.data.length; iAssets++) {
                    var assetMetrics = await
                        reportGetters.getAssetMetricsSummaryByAssetId(auth, collections[i].collectionId, assets.data[iAssets].assetId);

                    for (var iMetrics = 0; iMetrics < assetMetrics.data.length; iMetrics++) {

                        var benchmarkId = assetMetrics.data[iMetrics].benchmarkId;
                        console.log('benchmarkId: ' + benchmarkId);
                        var stig = await reportGetters.getStigById(auth, benchmarkId);
                        var metricsSummary = await reportGetters.getMerticsSummarydByBenchmark(auth, collectionId, benchmarkId, assets.data[iAssets].assetId);
                        var pinned = metricsSummary.data[0].revisionPinned;
                        var pinnedRev = metricsSummary.data[0].revisionStr;
                        if(!pinned){
                            continue;
                        }

                        var revisions = await reportGetters.getBenchmarkRevisions(auth, benchmarkId);

                        var latestRev = '';
                        var prevRev = '';
                        var latestRevDate = '';
                        if (revisions) {
                            for (var bmIdx = 0; bmIdx < revisions.data.length && bmIdx < 2; bmIdx++) {
                                if (bmIdx === 0) {
                                    latestRev = revisions.data[bmIdx].revisionStr;
                                    latestRevDate = revisions.data[bmIdx].benchmarkDate;
                                }
                                else if (bmIdx === 1) {
                                    prevRev = revisions.data[bmIdx].revisionStr;
                                }
                            }
                        }
                        else {
                            //var stig = await reportGetters.getStigById(auth, benchmarkId);

                            latestRev = stig.data.lastRevisionStr;
                            latestRevDate = stig.data.lastRevisionDate;
                        }

                        const currentQuarter = reportUtils.getCurrentQuarter(latestRevDate);

                        var myData = getRow(
                            collectionName,
                            assetMetrics.data[iMetrics],
                            labelMap,
                            pinnedRev,
                            latestRev,
                            latestRevDate,
                            prevRev,
                            benchmarkId,
                            currentQuarter);

                        rows.push(myData);
                    }
                }
            } // end for each collection
        } // end for each iEmass

        const returnData = { headers: headers, rows: rows }
        //return rows;
        return returnData;
    }
    catch (e) {
        console.log(e)
    }
}

function getRow(collectionName,
    assetMetrics,
    labelMap,
    pinnedRev,
    latestRev,
    latestRevDate,
    prevRev,
    benchmarkID,
    currentQuarter) {

    const quarterVer = reportUtils.getVersionForQuarter(currentQuarter, latestRevDate, latestRev);

    const metrics = assetMetrics.metrics;
    const numAssessments = metrics.assessments;
    const numAssessed = metrics.assessed;
    const numSubmitted = metrics.statuses.submitted;
    const numAccepted = metrics.statuses.accepted;
    const numRejected = metrics.statuses.rejected;

    const assetName = assetMetrics.name;
    const collectionMetadata = reportUtils.getMetadataByAsset(labelMap, assetMetrics.labels);

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

    const sumOfCat3 = metrics.findings.low;
    const sumOfCat2 = metrics.findings.medium;
    const sumOfCat1 = metrics.findings.high;

    var rowData = {
        collectionName: collectionName,
        asset: assetName,
        deviveType: collectionMetadata.device,
        primOwner: collectionMetadata.primOwner,
        sysAdmin: collectionMetadata.sysAdmin,
        rmfAction: collectionMetadata.rmfAction,
        isso: collectionMetadata.isso,
        ccbSAActions: collectionMetadata.ccbSAActions,
        other: collectionMetadata.other,
        benchmarks: benchmarkID,
        pinnedRev: pinnedRev,
        latestRev: latestRev,
        prevRev: prevRev,
        quarterVer: quarterVer,
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

export { runPinnedReport };