import * as reportGetters from "./reportGetters.js";

async function runAssetsByRmfSampleReport(auth, emassMap) {
  try {
    console.log(`Running Assets by Collection Report`);
    //alert(`Running Assets by Collection Report`);

    var stigs = [];
    var assets = [];
    //var collections = [];

    var rows = [];
    const headers = [
      { label: "EMASS", key: "emass" },
      { label: "Collection", key: "collection" },
      { label: "STIG Benchmark", key: "benchmark" },
      { label: "Version", key: "stigVersion" },
      { label: "Assets", key: "assetNames" },
    ];

    //const emassKeys = emassMap.getKeys();
    //const emassKeysArray = Array.from(emassKeys);
    const emassKeysArray = Array.from(emassMap.keys());

    for (var iEmass = 0; iEmass < emassKeysArray.length; iEmass++) {
      var collections = emassMap.get(emassKeysArray[iEmass]);
      var emassNum = emassKeysArray[iEmass];
      var assetEmassMap;

      console.log("emassKeysArray[iEmass]: " + emassKeysArray[iEmass]);

      for (var j = 0; j < collections.length; j++) {
        //console.log("Requesting STIGS");j
        console.log("collections: " + collections[j]);

        var collectionName = collections[j].name;
        if (collectionName === "NP_C25-NCCM_Zone B") {
          console.log(collectionName);
        }
        if (collectionName === "NP_C34-NCCM-NW_7371_Zone B") {
          console.log(collectionName);
        } else if (collectionName === "NP_C60-NCCM-S_7373_Zone B") {
          console.log(collectionName);
        }

        assetEmassMap = await reportGetters.getAssetEmassMap(
          auth,
          collections[j].collectionId,
          emassNum
        );
        if (!assetEmassMap || assetEmassMap.size === 0) {
          continue;
        }

        //var strToRemove = '_' + emassNum + '_';
        //collectionName = collectionName.replace(strToRemove, '');
        stigs = await reportGetters.getStigs(auth, collections[j].collectionId);
        //console.log(stigs)

        //console.log("Requesting assets")
        for (var k = 0; k < stigs.data.length; k++) {
          //assets.length = 0;
          if (stigs.data[k].benchmarkId === "Enclave_-_Zone_B") {
            console.log("benchmarkId: " + stigs.data[k].benchmarkId);
          }
          assets = await reportGetters.getAssets(
            auth,
            collections[j].collectionId,
            stigs.data[k].benchmarkId,
            "RMF_Sample"
          );
          //console.log(assets)

          if(!assets){
            continue;
          }

          if (assets.data.length === 0) {
            continue;
          }

          var myData = await getRow(
            emassNum,
            collectionName,
            stigs.data[k],
            assetEmassMap,
            assets
          );
          if (myData) {
            rows.push(myData);
          }
        }
      }
    }

    //alert('returning report data');
    const returnData = { headers: headers, rows: rows };
    //return rows;
    return returnData;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function getRow(
  collectionEmass,
  collectionName,
  stigs,
  assetEmassMap,
  assets
) {
  var assetNames = "";
  var benchmarkId = stigs.benchmarkId;
  var stigVersion = stigs.revisionStr;

  for (var i = 0; i < assets.data.length; i++) {
    var assetName = assets.data[i].name;
    var assetEmass = assetEmassMap.get(assetName);
    if (assetEmass === collectionEmass) {
      assetNames += assetName + ";";
    }
  }

  var rowData = {
    emass: collectionEmass,
    collection: collectionName,
    benchmark: benchmarkId,
    stigVersion: stigVersion,
    assetNames: assetNames,
  };

  return rowData;
}

export { runAssetsByRmfSampleReport };
