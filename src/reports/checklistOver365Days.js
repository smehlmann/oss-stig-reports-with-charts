import * as reportGetters from "./reportGetters.js";
import * as reportUtils from "./reportUtils.js";

async function runChecklistOver365Days(auth, emassMap, numDaysOver) {
  try {
    console.log(
      `runSAReportWithMetricsAndVersions: Requesting STIG Manager Collections`
    );

    var labels = [];
    let labelMap = new Map();
    var rows = [];
    const emassKeysArray = Array.from(emassMap.keys());

    var headers = [
      { label: "Collection", key: "collectionName" },
      { label: "Asset", key: "asset" },
      { label: "Primary Owner", key: "primOwner" },
      { label: "Sys Admin", key: "sysAdmin" },
      { label: "STIG Benchmark", key: "benchmark" },
      { label: "Revision", key: "revision" },
      { label: "Group ID", key: "groupId" },
      { label: "Result", key: "result" },
      { label: "Modified Date", key: "modifiedDate" },
      { label: "Modified By", key: "modifiedBy" },
      { label: "Rule", key: "ruleId" },
      { label: "Status", key: "status" },
      { label: "Status Date", key: "statusDate" },
      { label: "Checked By", key: "checkedBy" },
    ];

    for (var iEmass = 0; iEmass < emassKeysArray.length; iEmass++) {
      var collections = emassMap.get(emassKeysArray[iEmass]);

      console.log("emassKeysArray[iEmass]: " + emassKeysArray[iEmass]);
      console.log("Number of collections: " + collections.length);

      for (var i = 0; i < collections.length; i++) {
        var collectionName = collections[i].name;
        var collectionId = collections[i].collectionId;
        //console.log(i + " collection name: " + collectionName);
        if (collectionName === "NP_C10-NCCM-W_7372_Zone B") {
          console.log(i + " collection name: " + collectionName);
        }

        labelMap.clear();
        labels.length = 0;
        labels = await reportGetters.getLabelsByCollection(auth, collectionId);
        for (var x = 0; x < labels.data.length; x++) {
          labelMap.set(labels.data[x].labelId, labels.data[x].description);
        }

        //var collection = await reportGetters.getCollectionMerticsSummary(
        //var collection = await reportGetters.getCollectionMerticsSummary(
        var tempStigs = await reportGetters.getStigs(auth, collectionId);
        if (!tempStigs) {
          continue;
        }

        var stigs = tempStigs.data;
        for (var iStigs = 0; iStigs < stigs.length; iStigs++) {
          //for (var iColl = 0; iColl < collection.data.length; iColl++) {
          if (stigs[iStigs].assetCount === 0) {
            continue;
          }

          var assets = stigs[iStigs].assets;
          var benchmarkId = stigs[iStigs].benchmarkId;
          var revisionStr = stigs[iStigs].revisionStr;

          if (benchmarkId === "Adobe_Acrobat_Pro_DC_Continuous_STIG") {
            console.log(benchmarkId);
          }
          for (var iAssets = 0; iAssets < assets.length; iAssets++) {
            var assetName = assets[iAssets].name;
            var assetId = assets[iAssets].assetId;

            if (
              assetName === "NP0902WK437880" &&
              benchmarkId === "Adobe_Acrobat_Pro_DC_Continuous_STIG"
            ) {
              console.log(assetName);
              console.log(assetId);
            }

            var tempMetrics =
              await reportGetters.getAssetMetricsSummaryByAssetIdAndBenchmarkId(
                auth,
                collectionId,
                assetId,
                benchmarkId
              );
            if (!tempMetrics) {
              continue;
            }

            var assetMetrics = tempMetrics.data;

            for (var iMetrics = 0; iMetrics < assetMetrics.length; iMetrics++) {
              var statusTotals = assetMetrics[iMetrics].metrics.statuses;
              if (statusTotals.submitted === 0 && statusTotals.saved === 0) {
                continue;
              }
              var minTs = assetMetrics[iMetrics].metrics.minTs;
              var diffInDays = reportUtils.calcDiffInDays(minTs);
              if (diffInDays < numDaysOver) {
                continue;
              }

              var assetLabels = assetMetrics[iMetrics].labels;
              var checklists = await reportGetters.getChecklists(
                auth,
                assetId,
                benchmarkId,
                revisionStr
              );

              if(!checklists && !checklists.data){
                continue;
              }

              for (var iCkl = 0; iCkl < checklists.data.length; iCkl++) {
                if (
                  checklists.data[iCkl].status &&
                  checklists.data[iCkl].status !== "" &&
                  checklists.data[iCkl].status !== "submitted" &&
                  checklists.data[iCkl].status !== "saved"
                ) {
                  continue;
                }
                var result = checklists.data[iCkl].result;
                result = reportUtils.resultAbbreviation(result);

                var groupId = checklists.data[iCkl].groupId;
                if (groupId === "V-213129") {
                  console.log(groupId);
                }
                var ruleId = checklists.data[iCkl].ruleId;

                //var reviews = await reportGetters.getReviewByGroupId(
                //auth, collectionId, assetId, benchmarkId, groupId);
                var reviews = await reportGetters.getReviews(
                  auth,
                  collectionId,
                  assetId,
                  benchmarkId,
                  ruleId,
                  groupId
                );
                //console.log('Number of reviews: ' + reviews.length);

                var status = "";
                var modifiedBy = "";
                var statusDate = "";
                var checkedBy = "";

                //var myAsset = await reportGetters.getAssetsById(auth, assetId);
                //var assetLabels = assetMetrics.labels;

                var myData;
                if (reviews && reviews.data && reviews.data.length > 0) {
                  for (
                    var iReviews = 0;
                    iReviews < reviews.data.length;
                    iReviews++
                  ) {
                    var modifiedDate = reviews.data[iReviews].ts;
                    diffInDays = reportUtils.calcDiffInDays(modifiedDate);
                    if (diffInDays < numDaysOver) {
                       continue;
                    }

                    if (
                      reviews.data[iReviews].status &&
                      reviews.data[iReviews].status.label &&
                      reviews.data[iReviews].status.label !== ""
                    ) {
                      status =
                        reviews.data[iReviews].status.label.toUpperCase();
                    }

                    /* Only add this entry if status is 'submitted' or 'saved' */
                    if (
                      status !== "" &&
                      status !== "SUBMITTED" &&
                      status !== "SAVED"
                    ) {
                      continue;
                    }

                    if (status !== "") {
                      status = reviews.data[iReviews].status.label;
                    }
                    modifiedBy = reviews.data[iReviews].username;
                    statusDate = reviews.data[iReviews].status.ts;
                    checkedBy = reviews.data[iReviews].status.user.username;
                    myData = getRow(
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
                      assetLabels,
                      labelMap
                    );
                    rows.push(myData);
                  } // end for each review
                } // end if reviews
                else {
                  myData = getRow(
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
                    labels.data,
                    labelMap
                  );
                  rows.push(myData);
                } // end no reviews
              } // end checklists
            } // end each asset
          } // end for each stig metric
        } // end collection metrics
      } // end collections
    } // end eMass

    const returnData = { headers: headers, rows: rows };
    //return rows;
    return returnData;
  } catch (e) {
    console.log(e);
    throw e;
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
    labels,
    labelMap
  ) {
    const collectionMetadata = reportUtils.getMetadataByAsset(labelMap, labels);

    var rowData = {
      collectionName: collectionName,
      asset: assetName,
      primOwner: collectionMetadata.primOwner,
      sysAdmin: collectionMetadata.sysAdmin,
      benchmark: benchmarkId,
      revision: revisionStr,
      groupId: groupId,
      result: result,
      modifiedDate: modifiedDate,
      modifiedBy: modifiedBy,
      ruleId: ruleId,
      status: status,
      statusDate: statusDate,
      checkedBy: checkedBy,
    };

    return rowData;
  }
}

export { runChecklistOver365Days };
