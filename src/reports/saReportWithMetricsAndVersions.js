import * as reportGetters from "./reportGetters.js";
import * as reportUtils from "./reportUtils.js";

async function runSAReportWithMetricsAndVersions(auth, emassMap, benchmark) {
  try {
    console.log(
      `runSAReportWithMetricsAndVersions: Requesting STIG Manager Collections`
    );

    var labels = [];
    let labelMap = new Map();
    var rows = [];

    const headers = [
      { label: "Collection", key: "collectionName" },
      { label: "Asset", key: "asset" },
      { label: "Device-Asset", key: "deviveType" },
      { label: "Primary Owner", key: "primOwner" },
      { label: "Sys Admin", key: "sysAdmin" },
      { label: "STIG Benchmark", key: "benchmarks" },
      { label: "Latest Revision", key: "latestRev" },
      { label: "Previous Revision", key: "prevRev" },
      { label: "Current Quarter STIG Version", key: "quarterVer" },
      { label: "Web or DB", key: "cklWebOrDatabase" },
    ];

    const emassKeysArray = Array.from(emassMap.keys());
    for (var iEmass = 0; iEmass < emassKeysArray.length; iEmass++) {
      console.log("emassKeysArray[iEmass]: " + emassKeysArray[iEmass]);
      var collections = emassMap.get(emassKeysArray[iEmass]);

      for (var i = 0; i < collections.length; i++) {
        var collectionName = collections[i].name;
        var collectionId = collections[i].collectionId;
        console.log("collection name: " + collectionName);

        if (!collectionName.startsWith("NP_C")) {
          continue;
        }

        labelMap.clear();
        labels.length = 0;

        labels = await reportGetters.getLabelsByCollection(
          auth,
          collections[i].collectionId
        );
        for (var x = 0; x < labels.data.length; x++) {
          labelMap.set(labels.data[x].labelId, labels.data[x].description);
        }

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
          //var myMetrics = stigs[iStigs].metrics;
          var benchmarkId = stigs[iStigs].benchmarkId;
          if (benchmarkId !== benchmark) {
            continue;
          }

          //
          // Get Benchmark revisions
          //
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

          const currentQuarter = reportUtils.getCurrentQuarter(latestRevDate);

          //
          // Get Assets associated with a stig
          //
          var tempAssets =
            await reportGetters.getCollectionMerticsByCollectionAndBenchmark(
              auth,
              collectionId,
              benchmarkId
            );
          if (!tempAssets) {
            continue;
          }
          var assets = tempAssets.data;
          for (var iAssets = 0; iAssets < assets.length; iAssets++) {

            var tempMeta = await reportGetters.getAssetMetadata(
              auth,
              assets[iAssets].assetId
            );
            var metaData = tempMeta.data;

            var cklWebOrDatabase = "";
            if (metaData && metaData.cklWebOrDatabase) {
              cklWebOrDatabase = metaData.cklWebOrDatabase;
            }

            var myData = getRow(
              collectionName,
              labelMap,
              latestRev,
              latestRevDate,
              prevRev,
              benchmarkId,
              currentQuarter,
              assets[iAssets],
              cklWebOrDatabase
            );

            rows.push(myData);
          } // end for each asset
        } // end for each stig
      } // end for each collection
    } // end for each iEmass

    const returnData = { headers: headers, rows: rows };
    //return rows;
    return returnData;
  } catch (e) {
    console.log(e);
  }
}

function getRow(
  collectionName,
  labelMap,
  latestRev,
  latestRevDate,
  prevRev,
  benchmarkID,
  currentQuarter,
  asset,
  cklWebOrDatabase
) {
  const quarterVer = reportUtils.getVersionForQuarter(
    currentQuarter,
    latestRevDate,
    latestRev
  );

  const assetName = asset.name;
  const collectionMetadata = reportUtils.getMetadataByAsset(
    labelMap,
    asset.labels
  );

  var rowData = {
    collectionName: collectionName,
    asset: assetName,
    deviveType: collectionMetadata.device,
    primOwner: collectionMetadata.primOwner,
    sysAdmin: collectionMetadata.sysAdmin,
    benchmarks: benchmarkID,
    latestRev: latestRev,
    prevRev: prevRev,
    quarterVer: quarterVer,
    cklWebOrDatabase: cklWebOrDatabase,
  };

  return rowData;
}

export { runSAReportWithMetricsAndVersions };
