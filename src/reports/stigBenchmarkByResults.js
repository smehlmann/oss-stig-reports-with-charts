import * as reportGetters from "./reportGetters.js";
import * as reportUtils from "./reportUtils.js";

async function runStigBenchmarkByResults(auth, emassMap, benchmark) {
  var labels = [];
  let labelMap = new Map();
  var rows = [];

  const headers = [
    { label: "Collection", key: "collectionName" },
    { label: "Code", key: "code" },
    { label: "Asset", key: "asset" },
    { label: "Primary Owner", key: "primOwner" },
    { label: "Sys Admin", key: "sysAdmin" },
    { label: "STIG Benchmark", key: "benchmark" },
    { label: "Group ID", key: "groupId" },
    { label: "Latest Revision", key: "latestRev" },
    { label: "Current Quarter STIG Version", key: "quarterVer" },
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
        var code = collections[i].metadata.Code;
        var collectionId = collections[i].collectionId;
        console.log(
          "collection " + i + " " + collectionName + " ID: " + collectionId
        );

        labelMap.clear();
        labels.length = 0;

        labelMap.clear();
        labels.length = 0;
        labels = await reportGetters.getLabelsByCollection(auth, collectionId);
        for (var x = 0; x < labels.data.length; x++) {
          labelMap.set(labels.data[x].labelId, labels.data[x].description);
        }

        //
        // Get STIGs for each collection
        //
        var tempStigs = await reportGetters.getStigs(auth, collectionId);
        if (!tempStigs) {
          continue;
        }

        var stigs = tempStigs.data;
        for (var iStigs = 0; iStigs < stigs.length; iStigs++) {
          if (stigs[iStigs].assetCount === 0) {
            continue;
          }

          var assets = stigs[iStigs].assets;
          var benchmarkId = stigs[iStigs].benchmarkId;

          if (benchmark !== "" && benchmark !== benchmarkId) {
            continue;
          }

          for (var iAssets = 0; iAssets < assets.length; iAssets++) {
            var assetName = assets[iAssets].name;
            var assetId = assets[iAssets].assetId;

            console.log(assetName);
            console.log(assetId);

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
              var assetLabels = assetMetrics[iMetrics].labels;
              var myMetrics = assetMetrics[iMetrics].metrics;

              if (
                myMetrics.findings.low === 0 &&
                myMetrics.findings.medium === 0 &&
                myMetrics.findings.high === 0
              ) {
                continue;
              }

              var revisionsData = await reportGetters.getBenchmarkRevisions(
                auth,
                benchmarkId
              );
              var revisions = revisionsData.data;

              var latestRev = "";
              var prevRev = "";
              var latestRevDate = "";

              for (
                var bmIdx = 0;
                bmIdx < revisions.length && bmIdx < 2;
                bmIdx++
              ) {
                if (bmIdx === 0) {
                  latestRev = revisions[bmIdx].revisionStr;
                  latestRevDate = revisions[bmIdx].benchmarkDate;
                } else if (bmIdx === 1) {
                  prevRev = revisions[bmIdx].revisionStr;
                }
              }

              const currentQuarter =
                reportUtils.getCurrentQuarter(latestRevDate);

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
                  var detail = reportUtils.formatCsvString(
                    reviews[iReview].detail
                  );
                  var comment = reportUtils.formatCsvString(
                    reviews[iReview].comment
                  );
                  var status = reviews[iReview].status.label;

                  var myData = getRow(
                    collectionName,
                    code,
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
                    status,
                    assetLabels,
                    labelMap
                  );
                  rows.push(myData);
                } // end for each review
              } // end for each checklist
            } // end for each metric
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
  code,
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
  status,
  labels,
  labelMap
) {
  const collectionMetadata = reportUtils.getMetadataByAsset(labelMap, labels);

  const quarterVer = reportUtils.getVersionForQuarter(
    currentQuarter,
    latestRevDate,
    latestRev
  );

  var row = {
    collectionName: collectionName,
    code: code,
    asset: assetName,
    primOwner: collectionMetadata.primOwner,
    sysAdmin: collectionMetadata.sysAdmin,
    benchmark: benchmarkId,
    groupId: groupId,
    latestRev: latestRev,
    quarterVer: quarterVer,
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
