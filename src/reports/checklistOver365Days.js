import * as reportGetters from './reportGetters.js';
import * as reportUtils from './reportUtils.js';

async function runChecklistOver365Days(auth, emassMap, numDaysOver) {

    try {

        //const currentQuarter = reportUtils.getCurrentQuarter();

        console.log(`runSAReportWithMetricsAndVersions: Requesting STIG Manager Collections`);

        var labels = [];
        let labelMap = new Map();
        var rows = []
        const emassKeysArray = Array.from(emassMap.keys());

        /*var rows = [
            {
                collectionName: 'Collection',
                asset: 'Asset',
                primOwner: 'Primary Owner',
                sysAdmin: 'Sys Admin',
                other: "OTHER",
                benchmark: 'STIG Benchmark',
                revision: 'Revision',
                groupId: 'Group ID',
                result: 'Result',
                modifiedDate: 'Modified Date',
                modifiedBy: 'Modified By',
                ruleId: 'Rule',
                status: 'Status',
                statusDate: 'Status Date',
                checkedBy: 'Checked By'
            }
        ];*/

        var headers = [

            { label: 'Collection', key: 'collectionName' },
            { label: 'Asset', key: 'asset' },
            { label: 'Primary Owner', key: 'primOwner' },
            { label: 'Sys Admin', key: 'sysAdmin' },
            { label: "Other", key: 'other' },
            { label: 'STIG Benchmark', key: 'benchmark' },
            { label: 'Revision', key: 'revision' },
            { label: 'Group ID', key: 'groupId' },
            { label: 'Result', key: 'result' },
            { label: 'Modified Date', key: 'modifiedDate' },
            { label: 'Modified By', key: 'modifiedBy' },
            { label: 'Rule', key: 'ruleId' },
            { label: 'Status', key: 'status' },
            { label: 'Status Date', key: 'statusDate' },
            { label: 'Checked By', key: 'checkedBy' }

        ];

        for (var iEmass = 0; iEmass < emassKeysArray.length; iEmass++) {
            var collections = emassMap.get(emassKeysArray[iEmass]);
            var emassNum = emassKeysArray[iEmass];
            var assetEmassMap;

            console.log('emassKeysArray[iEmass]: ' + emassKeysArray[iEmass]);
            console.log('Number of collections: ' + collections.length);

            for (var i = 0; i < collections.length; i++) {
                var collectionName = collections[i].name;
                var collectionId = collections[i].collectionId;
                console.log(i + ' collection name: ' + collectionName);

                labelMap.clear();
                labels.length = 0;
                if (collectionName.toUpperCase() === "HAPPY CORP") {
                    continue;
                }

                //exclude collections that do not start with NP_C
                if (!collectionName.startsWith('NP_C')) {
                    continue;
                }

                var collection = await
                    reportGetters.getCollectionMerticsSummary(auth, collectionId);
                for (var iColl = 0; iColl < collection.data.length; iColl++) {
                    var minTs = collection.data[iColl].metrics.minTs;
                    //var diffInDays = reportUtils.calcDiffInDays(minTs);
                    var diffInDays = reportUtils.calcDiffInDays(minTs);
                    if (diffInDays < numDaysOver) {
                        continue;
                    }

                    var assetId = collection.data[iColl].assetId;
                    var assetName = collection.data[iColl].name;

                    labelMap.clear();
                    labels.length = 0;
                    //labels = await reportGetters.getLabelsByCollection(auth, collections[i].collectionId);
                    labels = await reportGetters.getLabelsByCollection(auth, collectionId);
                    for (var x = 0; x < labels.data.length; x++) {
                        labelMap.set(labels.data[x].labelId, labels.data[x].description);
                    }

                    var benchmarkId = collection.data[iColl].benchmarkId;
                    var revisionStr = collection.data[iColl].revisionStr;

                    var checklists = await reportGetters.getChecklists(
                        auth, assetId, benchmarkId, revisionStr);

                    for (var iCkl = 0; iCkl < checklists.data.length; iCkl++) {
                        var result = checklists.data[iCkl].result;
                        result = reportUtils.resultAbbreviation(result);

                        var groupId = checklists.data[iCkl].groupId;
                        var ruleId = checklists.data[iCkl].ruleId;

                        //var reviews = await reportGetters.getReviewByGroupId(
                        //auth, collectionId, assetId, benchmarkId, groupId);
                        var reviews =
                            await reportGetters.getReviews(auth, collectionId, assetId, benchmarkId, ruleId, groupId);
                        //console.log('Number of reviews: ' + reviews.length);

                        if (reviews === 'undefined' || !reviews || !reviews.data.length) {
                            continue;
                        }

                        for (var iReviews = 0; iReviews < reviews.data.length; iReviews++) {

                            var modifiedDate = reviews.data[iReviews].ts;
                            diffInDays = reportUtils.calcDiffInDays(modifiedDate);
                            if (diffInDays < numDaysOver) {
                                continue;
                            }

                            var modifiedBy = reviews.data[iReviews].username;
                            var status = reviews.data[iReviews].status.label;
                            var statusDate = reviews.data[iReviews].status.ts;
                            var checkedBy = reviews.data[iReviews].status.user.username;

                            var myData = getRow(collectionName,
                                assetName,
                                benchmarkId,
                                revisionStr,
                                groupId,
                                result,
                                modifiedDate,
                                modifiedBy,
                                ruleId,
                                status,
                                statusDate,
                                checkedBy,
                                collection.data[iColl],
                                labelMap);
                            rows.push(myData);

                        } // end reviews
                    } // end checklists
                }// end collection metrics
            } // end collections
        }// end eMass

        const returnData = { headers: headers, rows: rows }
        //return rows;
        return returnData;
    }
    catch (e) {
        console.log(e);
        throw (e);
    }

    function getRow(
        collectionName,
        assetName,
        benchmarkId,
        revisionStr,
        groupId,
        result,
        modifiedDate,
        modifiedBy,
        ruleId,
        status,
        statusDate,
        checkedBy,
        metrics,
        labelMap) {

        const collectionMetadata = reportUtils.getMetadata(labelMap, metrics);

        var rowData = {
            collectionName: collectionName,
            asset: assetName,
            primOwner: collectionMetadata.primOwner,
            sysAdmin: collectionMetadata.sysAdmin,
            other: collectionMetadata.other,
            benchmark: benchmarkId,
            revision: revisionStr,
            groupId: groupId,
            result: result,
            modifiedDate: modifiedDate,
            modifiedBy: modifiedBy,
            ruleId: ruleId,
            status: status,
            statusDate: statusDate,
            checkedBy: checkedBy
        }

        return rowData;

    }
}

export { runChecklistOver365Days };