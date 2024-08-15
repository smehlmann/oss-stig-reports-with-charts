import * as reportGetters from "./reportGetters.js";
import * as reportUtils from "./reportUtils.js";

async function runStigBenchmarkByResults(auth, emassMap, benchmark) {
  
  var rows = [];

  const headers = [
    { label: "Collection", key: "collectionName" },
    { label: "STIG Benchmark", key: "benchmark" },
    { label: "Latest Revision", key: "latestRev" },
    { label: "Previous Revision", key: "prevRev" },
    { label: "Current Quarter STIG Version", key: "quarterVer" },
    { label: "Group ID", key: "groupId" },
    { label: "Asset", key: "asset" },
    { label: "Result", key: "result" },
    { label: "Detail", key: "detail" },
    { label: "Comment", key: "comment" },
    { label: "Status", key: "status" },
  ];

  try {
    const emassKeysArray = Array.from(emassMap.keys());

    for (var iEmass = 0; iEmass < emassKeysArray.length; iEmass++) {
      var collections = emassMap.get(emassKeysArray[iEmass]);

      console.log("emassKeysArray[iEmass]: " + emassKeysArray[iEmass]);
      console.log("Number of collections: " + collections.length);
      // Get assets for each collection
      for (var i = 0; i < collections.length; i++) {
        var collectionName = collections[i].name;
        var collectionId = collections[i].collectionId;
        console.log(
          "collection " + i + " " + collectionName + " ID: " + collectionId
        );

        //
        // Get STIGS by summary metrics
        //
        var tempStigs =
          await reportGetters.getMetaMetricsSummaryAggregatedByStig(
            auth,
            collectionId,
            benchmark
          );
        if (!tempStigs) {
          continue;
        }
        var stigs = tempStigs.data;

        for (var iStigs = 0; iStigs < stigs.length; iStigs++) {
          var myMetrics = stigs[iStigs].metrics;
          var benchmarkId = stigs[iStigs].benchmarkId;
          if (benchmarkId !== benchmark) {
            continue;
          }
          if (benchmarkId === "Splunk_Enterprise_7-x_for_Windows_STIG") {
            console.log(benchmarkId);
          }

          if (
            myMetrics.findings.low === 0 &&
            myMetrics.findings.medium === 0 &&
            myMetrics.findings.high === 0
          ) {
            continue;
          }
          /*if(myMetrics.results.unassessed === 0){
            continue;
          }*/
          if (stigs[iStigs].assets === 0) {
            continue;
          }
          /*var averages = reportUtils.getMetricsAverages(stigs[iStigs]);
          if (averages.submitted === 100) {
            continue;
          }*/

          var revisionsData = await reportGetters.getBenchmarkRevisions(
            auth,
            benchmarkId
          );
          var revisions = revisionsData.data;

          var latestRev = "";
          var prevRev = "";
          var latestRevDate = "";

          for (var bmIdx = 0; bmIdx < revisions.length && bmIdx < 2; bmIdx++) {
            if (bmIdx === 0) {
              latestRev = revisions[bmIdx].revisionStr;
              latestRevDate = revisions[bmIdx].benchmarkDate;
            } else if (bmIdx === 1) {
              prevRev = revisions[bmIdx].revisionStr;
            }
          }

          const currentQuarter = reportUtils.getCurrentQuarter(latestRevDate );

          //
          // Get Assets associated with a stig
          //
          //var tempAssets = await reportGetters.getAssets(auth, collectionId, benchmarkId);
          var tempAssets =
            await reportGetters.getAssetMetricsSummaryByBenchmark(
              auth,
              collectionId,
              benchmarkId
            );
          if (!tempAssets) {
            continue;
          }
          var assets = tempAssets.data;
          for (var iAssets = 0; iAssets < assets.length; iAssets++) {
            /*if(assets[iAssets].metrics.results.unassessed === 0){
              continue;
            }*/
            var assetMetrics = assets[iAssets].metrics;
            if (
              assetMetrics.findings.low === 0 &&
              assetMetrics.findings.medium === 0 &&
              assetMetrics.findings.high === 0
            ) {
              continue;
            }
            var assetId = assets[iAssets].assetId;
            var assetName = assets[iAssets].name;

            var tempChecklists = await reportGetters.getChecklists(
              auth,
              assetId,
              benchmarkId,
              latestRev
            );
            if (!tempChecklists) {
              continue;
            }
            var checklists = tempChecklists.data;

            for (var iCkl = 0; iCkl < checklists.length; iCkl++) {
              var result = checklists[iCkl].result;
              result = resultAbbreviation(result);
              if (result !== "O") {
                continue;
              }

              var groupId = checklists[iCkl].groupId;

              /*var tempReviews = await reportGetters.getReviewsByAsset(
                auth,
                collectionId,
                assetId,
                benchmarkId
              );*/

              var tempReviews = await reportGetters.getReviewByGroupId(
                auth,
                collectionId,
                assetId,
                benchmarkId,
                groupId
              );

              if (!tempReviews) {
                continue;
              }

              var reviews = tempReviews.data;
              for (var iReview = 0; iReview < reviews.length; iReview++) {
                //var result = reviews[iReview].result;
                //result = resultAbbreviation(result);
                /*if (
                result !== "" &&
                result !== "O" &&
                result !== "NR+" &&
                result !== "I"
              ) {
                continue;
              }*/
               /*if (result !== "O") {
                  continue;
                }*/
                //var groupId = reviews[iReview].groupId;

                var detail = reportUtils.formatCsvString(
                  reviews[iReview].detail
                );
                var comment = reportUtils.formatCsvString(
                  reviews[iReview].comment
                );
                var status = reviews[iReview].status.label;

                var myData = getRow(
                  collectionName,
                  benchmarkId,
                  currentQuarter,
                  latestRevDate,
                  latestRev,
                  prevRev,
                  groupId,
                  assetName,
                  result,
                  detail,
                  comment,
                  status
                );
                rows.push(myData);
              } // end for each checklist
            } // end for each review
          } // end for each asset
        } // end for each stig
      } //end for each collection
    } //end for each eMass

    const returnData = { headers: headers, rows: rows };
    //return rows;
    return returnData;
  } catch (e) {
    // end try
    console.log("Error in runStigBenchmarkByResults");
    console.log(e.message);
  }
}

function getRow(
  collectionName,
  benchmarkId,
  currentQuarter,
  latestRevDate,
  latestRev,
  prevRev,
  groupId,
  assetName,
  result,
  detail,
  comment,
  status
) {
  const quarterVer = reportUtils.getVersionForQuarter(
    currentQuarter,
    latestRevDate,
    latestRev
  );

  var row = {
    collectionName: collectionName,
    benchmark: benchmarkId,
    latestRev: latestRev,
    prevRev: prevRev,
    quarterVer: quarterVer,
    groupId: groupId,
    asset: assetName,
    result: result,
    detail: detail,
    comment: comment,
    status: status,
  };

  return row;
}

function resultAbbreviation(result) {
  var abbrev = "";

  if (!result || result === "null" || result === "undefined") {
    return abbrev;
  }

  switch (result) {
    case "notchecked":
      abbrev = "NR+";
      break;
    case "notapplicable":
      abbrev = "NA";
      break;
    case "pass":
      abbrev = "NF";
      break;
    case "fail":
      abbrev = "O";
      break;
    case "informational":
      abbrev = "I";
      break;
    default:
      abbrev = "NR+";
      break;
  }

  return abbrev;
}

export { runStigBenchmarkByResults };
