//import got from 'got';
import axios from "axios";
import * as reportUtils from "./reportUtils.js";
import { getAuth } from "../store/index.js";

const apiBase = "https://stigman.nren.navy.mil/np/api";

async function getMetricsData(auth, myUrl) {
  var storedAuth = getAuth();

  //console.log(myUrl);
  var accessToken = storedAuth.userData?.access_token;

  try {
    var resp = await axios.get(myUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    //alert('returning resp')
    return resp;
  } catch (e) {
    console.log("Error in getMetricsData url: " + myUrl);
    console.log(e.message);
    var msg = e.message.toLowerCase();
    var errMsg = "401";
    console.log("getMetricsData: msg: " + msg);
    if (!msg.includes(errMsg)) {
      return null;
    }

    console.log("In catch. Get new token");

    storedAuth = getAuth();
    console.log("Access token in getMetricsData catch");
    console.log(auth.userData);

    accessToken = storedAuth.userData?.access_token;
    //accessToken = myAuth.userData?.access_token;
    //var refreshToken = myAuth.userData?.refresh_token

    try {
      resp = await axios.get(myUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (e2) {
      console.log("getMetricsData: second try");
      console.log(e2);
      return null;
    }

    console.log("getMetricsData returning resp.");
    return resp;
  }
}

async function getCollections(auth) {
  try {
    var myUrl = apiBase + "/collections";
    var collections = getMetricsData(auth, myUrl);
    return collections;
  } catch (e) {
    console.log("Error in getCollections");
    console.log(e);
  }
}

async function getCollectionsMetrics(auth) {
  try {
    var myUrl = apiBase + "/collections";
    var collections = getMetricsData(auth, myUrl);
    return collections;
  } catch (e) {
    console.log("Error in getCollections");
    console.log(e);
  }
}

async function getCollectionByName(auth, collectionName) {
  // add escape characters to slashes in the collection name
  var tempName = collectionName.replaceAll("/", "%2F");
  tempName = tempName.replaceAll("&", "%26");
  var myUrl = apiBase + "/collections?name=" + tempName + "&name-match=exact";
  //console.log('url: ' + myUrl);
  var collections = getMetricsData(auth, myUrl);
  return collections;
}

async function getStigs(auth, collectionId) {
  //console.log('inGetStigs')
  var myUrl =
    apiBase + "/collections/" + collectionId + "/stigs?projection=assets";
  var stigs = getMetricsData(auth, myUrl);
  return stigs;
}

async function getStigById(auth, benchmarkId) {
  //console.log('inGetStigs')
  var myUrl = apiBase + "/stigs/" + benchmarkId;
  var stig = getMetricsData(auth, myUrl);
  return stig;
}

async function getStigsByAsset(auth, assetId) {
  try {
    //console.log('inGetStigsByAssets')
    var myUrl = apiBase + "/assets/" + assetId + "/stigs";
    //console.log('myUrl: ' + myUrl);
    var stigs = await getMetricsData(auth, myUrl);
    return stigs;
  } catch (e) {
    console.log("Error in getStigsByAsset");
    console.log(e);
  }
}

async function getAssets(auth, collectionId, benchmarkId) {
  //console.log('getAssets')
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/stigs/" +
    benchmarkId +
    "/assets";

  var assets = getMetricsData(auth, myUrl);
  return assets;
}

async function getAssetMetricsSummary(auth, collectionId) {
  //console.log('getAssetMetricsSummary')
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary/asset?format=json";
  var assets = getMetricsData(auth, myUrl);
  return assets;
}

async function getAssetMetricsSummaryByBenchmark(
  auth,
  collectionId,
  benchmarkId
) {
  //console.log('getAssetMetricsSummary')
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary/asset?benchmarkId=" +
    benchmarkId +
    "&format=json";
  var assets = getMetricsData(auth, myUrl);
  return assets;
}

//Return meta-metrics aggregated by STIG
async function getMetaMetricsSummary(auth, collectionId, benchmarkId) {
  //console.log('getMetaMetricsSummary')
  //http://localhost:64/collections/meta/metrics/summary/stig?collectionId=1&benchmarkId=V5R3&format=json
  var myUrl =
    apiBase +
    "/collections/meta/metrics/summary/stig?collectionId=" +
    collectionId +
    "&benchmarkId=" +
    benchmarkId +
    "&format=json";
  var metaData = getMetricsData(auth, myUrl);
  return metaData;
}

async function getMetaMetricsSummaryAggregatedByStig(
  auth,
  collectionId,
  benchmarkId
) {
  //console.log('getMetaMetricsSummary')
  var myUrl =
    apiBase +
    "/collections/meta/metrics/summary/stig?collectionId=" +
    collectionId +
    "&format=json";
  // http://localhost:64001/api/collections/1/metrics/summary/stig?benchmarkId=22&format=json
  /*var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary/stig?benchmarkId=" +
    benchmarkId +
    "&format=json";*/
  var metaData = getMetricsData(auth, myUrl);
  return metaData;
}

async function getAssetMetricsSummaryByAssetId(auth, collectionId, assetId) {
  //console.log('getAssetMetricsSummary')
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary?assetId=" +
    assetId +
    "&format=json";
  var assets = getMetricsData(auth, myUrl);
  return assets;
}

async function getAssetMetricsSummaryByAssetIdAndBenchmarkId(
  auth,
  collectionId,
  assetId,
  benchmarkId
) {
  //console.log('getAssetMetricsSummaryByAssetIdAndBenchmarkId');
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary/asset?benchmarkId=" +
    benchmarkId +
    "&assetId=" +
    assetId +
    "&format=json";

  var assets = getMetricsData(auth, myUrl);
  return assets;
}

async function getAssetsByCollection(auth, collectionId) {
  try {
    //console.log('getAssetsByCollection');
    var myUrl =
      apiBase + "/assets?collectionId=" + collectionId + "&name-match=exact";
    var assets = getMetricsData(auth, myUrl);
    return assets;
  } catch (e) {
    console.log("Error in getAssetsByCollection");
    console.log(e);
  }
}

async function getAssetsByLabel(auth, collectionId, labelId) {
  //console.log('getAssetsByLabel');
  var myUrl =
    apiBase + "/collections/" + collectionId + "/labels/" + labelId + "/assets";
  var assets = getMetricsData(auth, myUrl);
  return assets;
}

async function getAssetsByName(auth, collectionId, assetName) {
  var myUrl =
    apiBase +
    "/assets?collectionId=" +
    collectionId +
    "&name=" +
    assetName +
    "&name-match=exact";
  //console.log('getAssetsByName: ' + myUrl);
  var asset = await getMetricsData(auth, myUrl);
  //console.log('getAssetsByName: ' + asset);
  return asset;
}

async function getAssetsById(auth, assetId) {
  var myUrl = apiBase + "/assets/" + assetId;
  //console.log('getAssetsByName: ' + myUrl);
  var asset = await getMetricsData(auth, myUrl);
  //console.log('getAssetsByName: ' + asset);
  return asset;
}

async function getFindingsByCollectionAndAsset(auth, collectionId, assetId) {
  //console.log('getFindingsByCollectionAndAsset assetId: ' + assetId);
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/findings?aggregator=ruleId&acceptedOnly=false&assetId=" +
    assetId;
  var assets = getMetricsData(auth, myUrl);
  return assets;
}

async function getFindingsByCollection(auth, collectionId) {
  //console.log('getFindingsByCollectionAndAsset assetId: ' + assetId);
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "findings?aggregator=ruleId&acceptedOnly=false";
  var assets = getMetricsData(auth, myUrl);
  return assets;
}

async function getCollectionMertics(auth, collectionId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/detail/collection?format=json";
  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}

async function getCollectionMerticsAggreatedByLabel(auth, collectionId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary/label?format=json";
  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}

async function getCollectionMerticsAggreatedByAsset(auth, collectionId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary/asset?format=json";
  //console.log(myUrl);
  try {
    var metrics = getMetricsData(auth, myUrl);
    return metrics;
  } catch (e) {
    console.log(e);
  }
}

// Return metrics for the specified Collection aggregated by collection ID, stig benchmark, asset ID, label ID
async function getCollectionMerticsByCollectionBenchmarkAsset(
  auth,
  collectionId,
  benchmark,
  assetId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/detail/stig?benchmarkId=" +
    benchmark +
    "&assetId=" +
    assetId +
    "&format=json";
  //console.log(myUrl);

  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}

// Return metrics for the specified Collection aggregated by collection ID, stig benchmark, asset ID, label ID
async function getCollectionMerticsByCollectionAssetAndLabel(
  auth,
  collectionId,
  assetId,
  labelId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/detail?assetId=" +
    assetId +
    "&labelId=" +
    labelId +
    "&format=json";

  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}

// Return metrics for the specified Collection by collection ID, and asset ID
async function getCollectionMerticsByCollectionAndAsset(
  auth,
  collectionId,
  assetId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/detail?assetId=" +
    assetId +
    "&format=json";

  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}

// Return metrics for the specified Collection aggregated by collection ID, stig benchmark, asset ID, label ID
/*async function getCollectionMerticsByCollectionBenchmarkAsset(
  auth,
  collectionId,
  benchmark,
  assetId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/detail/stig?benchmarkId=" +
    benchmark +
    "&assetId=" +
    assetId +
    "&format=json";
  //console.log(myUrl);
  
  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}*/

// Return metrics for the specified Collection aggregated by collection ID, stig benchmark, asset ID, label ID
/*async function getCollectionMerticsByCollectionAssetAndLabel(
  auth,
  collectionId,
  assetId,
  labelId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/detail?assetId=" +
    assetId +
    "&labelId=" +
    labelId +
    "&format=json";

  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}*/

// Return metrics for the specified Collection by collection ID, and asset ID
async function getCollectionMerticsByCollectionAndBenchmark(
  auth,
  collectionId,
  benchmarkId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/detail/asset?benchmarkId=" +
    benchmarkId +
    "&format=json";

  var metrics = await getMetricsData(auth, myUrl);
  return metrics;
}

// Return summary metrics for the specified Collection by collection ID, and asset ID
async function getSummaryMerticsByCollectionAndAsset(
  auth,
  collectionId,
  assetId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary?assetId=" +
    assetId +
    "&format=json";

  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}

async function getCollectionMerticsUnaggregated(auth, collectionId) {
  var myUrl =
    apiBase + "/collections/" + collectionId + "/metrics/detail?format=json";
  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}

async function getCollectionMerticsdByStig(auth, collectionId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary/stig?format=json";
  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}

async function getMerticsSummarydByBenchmark(
  auth,
  collectionId,
  benchmarkId,
  assetId
) {
  //http://localhost:64001/api/collections/1/metrics/summary/stig?benchmarkId=v2r1&assetId=1234&format=json
  //var myUrl = apiBase + '/collections/' + collectionId + '/metrics/summary/stig?benchmarkId=' + benchmarkId + '&assetId=' + assetId + 'format=json';
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/metrics/summary/stig?benchmarkId=" +
    benchmarkId +
    "&format=json";
  console.log(myUrl);
  var metricsSummary = await getMetricsData(auth, myUrl);
  return metricsSummary;
}

//Return metrics for the specified Collection aggregated by STIG

async function getCollectionMerticsSummary(auth, collectionId) {
  //var myUrl = apiBase + '/collections/' + collectionId + '/metrics/summary/collection?format=json';
  var myUrl =
    apiBase + "/collections/" + collectionId + "/metrics/summary?format=json";
  console.log(myUrl);
  var metrics = getMetricsData(auth, myUrl);
  return metrics;
}

async function getLabelsByCollection(auth, collectionId) {
  var myUrl = apiBase + "/collections/" + collectionId + "/labels";
  //console.log(myUrl);
  try {
    var labels = getMetricsData(auth, myUrl);
    return labels;
  } catch (e) {
    console.log(e);
  }
}

async function getBenchmarkRevisions(auth, benchmarkId) {
  var myUrl = apiBase + "/stigs/" + benchmarkId + "/revisions";
  //console.log(myUrl);
  try {
    var revisions = getMetricsData(auth, myUrl);
    return revisions;
  } catch (e) {
    console.log("getBenchmarkRevisions error: " + e);
    console.log(myUrl);
  }
}

async function getCollectionBenchmarkChecklist(
  auth,
  collectionId,
  benchmarkId,
  revisionStr
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/checklists/" +
    benchmarkId +
    "/" +
    revisionStr;
  //console.log(myUrl);
  try {
    var checklists = getMetricsData(auth, myUrl);
    return checklists;
  } catch (e) {
    console.log("getCollectionBenchmarkChecklist error: " + e);
    console.log(myUrl);
  }
}

async function getChecklists(auth, assetId, benchmarkId, revisionStr) {
  var myUrl =
    apiBase +
    "/assets/" +
    assetId +
    "/checklists/" +
    benchmarkId +
    "/" +
    revisionStr;
  //console.log(myUrl);
  try {
    var checklists = await getMetricsData(auth, myUrl);
    return checklists;
  } catch (e) {
    console.log("getCollectionBenchmarkChecklist error: " + e);
    console.log(myUrl);
  }
}

async function getAssetChecklists(auth, assetId) {
  var myUrl = apiBase + "/assets/" + assetId + "/checklists";
  console.log(myUrl);
  try {
    var checklists = getMetricsData(auth, myUrl);
    return checklists;
  } catch (e) {
    console.log("getAssetChecklists error: " + e);
    console.log(e);
  }
}

async function getMultiStigChecklist(auth, assetId, benchmarkId) {
  /*
  var myUrl = apiBase + '/assets/' + assetId + '/checklists?benchmarkId=' + benchmarkId;
  console.log(myUrl);
  try {
    var checklists = await getXMLMetricsData(auth, myUrl);
    return checklists;
  }
  catch (e) {
    console.log('getAssetChecklists error: ' + e);
    console.log(e);
  }*/
}

async function getReview(auth, collectionId, assetId, ruleId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/reviews/" +
    assetId +
    "/" +
    ruleId;
  //console.log(myUrl);
  try {
    var reviews = getMetricsData(auth, myUrl);
    return reviews;
  } catch (e) {
    console.log("getReview error: " + e);
    console.log(myUrl);
  }
}

async function getReviewByGroupId(
  auth,
  collectionId,
  assetId,
  benchmarkId,
  groupId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/reviews?rules=all&groupId=" +
    groupId +
    "&assetId=" +
    assetId +
    "&benchmarkId=" +
    benchmarkId;
  //console.log(myUrl);
  try {
    var reviews = getMetricsData(auth, myUrl);
    return reviews;
  } catch (e) {
    console.log("getReview error: " + e);
    console.log(myUrl);
  }
}

async function getReviews(
  auth,
  collectionId,
  assetId,
  benchmarkId,
  ruleId,
  groupId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/reviews?ruleId=" +
    ruleId +
    "&groupId=" +
    groupId +
    "&assetId=" +
    assetId +
    "&benchmarkId=" +
    benchmarkId;

  //console.log(myUrl);

  try {
    var reviews = await getMetricsData(auth, myUrl);
    return reviews;
  } catch (e) {
    console.log("getReviews error: " + e);
    console.log(myUrl);
  }
}

async function getReviewsByCollection(auth, collectionId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/reviews?status=submitted&projection=stigs";
  //console.log(myUrl);
  try {
    var reviews = await getMetricsData(auth, myUrl);
    return reviews;
  } catch (e) {
    console.log("getReview error: " + e);
    console.log(myUrl);
  }
}

async function getReviewsByCollectionAndStig(auth, collectionId, benchmarkId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/reviews?result=notapplicable&status=submitted&benchmarkId=" +
    benchmarkId;
  //'/reviews?rules=current&status=submitted&benchmarkId=' + benchmarkId;
  //'/reviews?result=informational&status=submitted&benchmarkId=' + benchmarkId;
  //'/reviews?benchmarkId=' + benchmarkId + '&projection=stigs';
  console.log(myUrl);
  try {
    var allReviews = [];
    var reviews = await getMetricsData(auth, myUrl);
    allReviews = reviews;

    myUrl =
      apiBase +
      "/collections/" +
      collectionId +
      "/reviews?result=fail&status=submitted&benchmarkId=" +
      benchmarkId;
    reviews = await getMetricsData(auth, myUrl);
    allReviews = allReviews.concat(reviews);

    myUrl =
      apiBase +
      "/collections/" +
      collectionId +
      "/reviews?result=notchecked&status=submitted&benchmarkId=" +
      benchmarkId;
    reviews = await getMetricsData(auth, myUrl);
    allReviews = allReviews.concat(reviews);

    return allReviews;
  } catch (e) {
    console.log("getReview error: " + e);
    console.log(myUrl);
  }
}

async function getSubmittedReviewsByCollectionAndAsset(
  auth,
  collectionId,
  assetId
) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/reviews/" +
    assetId +
    "?status=submitted&projection=stigs";

  //console.log(myUrl);F

  try {
    //var reviews = await getMetricsData(tokenUtils.getMyTokens().access_token, myUrl);
    //return reviews;
  } catch (e) {
    console.log("getSubmittedReviewsByCollectionAndAsset error: " + e.message);
    console.log(myUrl);
  }
}

async function getAllReviewsByCollectionAndAsset(auth, collectionId, assetId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/reviews/" +
    assetId +
    "?projection=stigs";

  //console.log(myUrl);

  try {
    // var reviews = await getMetricsData(tokenUtils.getMyTokens().access_token, myUrl);
    //return reviews;
  } catch (e) {
    console.log("getReviewByCollectionAndAsset error: " + e.message);
    console.log(myUrl);
  }
}

async function getReviewByCollectionAndAsset(auth, collectionId, assetId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/reviews/" +
    assetId +
    "?result=informational&projection=stigs";

  //console.log(myUrl);

  try {
    /*
    var allReviews = [];
    var reviews = await getMetricsData(tokenUtils.getMyTokens().access_token, myUrl);
    allReviews = reviews;

    myUrl = apiBase + '/collections/' + collectionId +
      '/reviews/' + assetId + '?result=fail&projection=stigs';
    var reviews = await getMetricsData(tokenUtils.getMyTokens().access_token, myUrl);
    allReviews = allReviews.concat(reviews);

    myUrl = apiBase + '/collections/' + collectionId +
      '/reviews/' + assetId + '?result=notchecked&projection=stigs';
    var reviews = await getMetricsData(tokenUtils.getMyTokens().access_token, myUrl);
    allReviews = allReviews.concat(reviews);

    return allReviews;*/
  } catch (e) {
    console.log("getReviewByCollectionAndAsset error: " + e.message);
    console.log(myUrl);
  }
}

async function createLabel(auth, collectionId, labelDetails, labelAssetMap) {
  //var myUrl = apiBase + '/collections/' + collectionId + '/labels';
  //console.log(labelDetails);

  const primOwner = labelDetails.primOwner;
  const sysAdmin = labelDetails.sysAdmin;
  const assetType = labelDetails.assetType;
  var labelName = "";
  var description = "";
  var color = "";

  if (primOwner && !primOwner === "") {
    labelName = labelDetails.primOwner;
    description = "Primary Owner";
    color = "0000ff";
    await mapLabelsAndAssets(
      labelName,
      description,
      color,
      labelAssetMap,
      collectionId,
      auth,
      labelDetails.asset
    );
    //console.log(labelAssetMap);
  }
  if (sysAdmin && !sysAdmin === "") {
    labelName = labelDetails.sysAdmin;
    description = "Sys Admin";
    color = "ffff00";
    await mapLabelsAndAssets(
      labelName,
      description,
      color,
      labelAssetMap,
      collectionId,
      auth,
      labelDetails.asset
    );
  }
  if (assetType && !assetType === "") {
    labelName = labelDetails.assetType;
    description = "Asset Type";
    color = "90EE90";
    await mapLabelsAndAssets(
      labelName,
      description,
      color,
      labelAssetMap,
      collectionId,
      auth,
      labelDetails.asset
    );
    //console.log(labelAssetMap);
  }

  return;
}

async function mapLabelsAndAssets(
  labelName,
  description,
  color,
  labelAssetMap,
  collectionId,
  auth,
  asset
) {
  const mappedAssets = labelAssetMap.get(labelName);
  var labelId = "";
  if (!mappedAssets) {
    //var label = await saveLabel(auth, collectionId, description, labelName, color);
    //console.log(label);
    //labelId = label.labelId;
  } else {
    labelId = mappedAssets[0].labelId;
  }

  var assetToMap;
  if (labelId !== "") {
    assetToMap = await getAssetsByName(auth, collectionId, asset);
    //console.log('back from getAssetsByName');
    // wait a second to give server time to process the request
    //await setTimeout(1000);

    //console.log(assetToMap);
    if (assetToMap) {
      //console.log(assetToMap);
      //console.log('assetId: ' + assetToMap[0].assetId);
      //console.log('assetName: ' + assetToMap[0].name);
      await mapAssetToLabel(
        labelName,
        labelId,
        assetToMap[0].assetId,
        labelAssetMap,
        collectionId,
        asset
      );
      //console.log(labelAssetMap);
    }
  }
}

async function mapAssetToLabel(
  labelName,
  labelId,
  assetId,
  labelAssetMap,
  collectionId,
  assetName
) {
  // Does the labelId already exist in the map
  var assetInfo = {
    labelId: labelId,
    assetId: assetId,
    assetName: assetName,
  };

  var assets = labelAssetMap.get(labelName);
  if (assets) {
    assets.push(assetInfo);
    labelAssetMap.set(labelName, assets);
  } else {
    var tmpAssets = [];
    tmpAssets.push(assetInfo);
    labelAssetMap.set(labelName, tmpAssets);
  }
}

async function getAssetEmassMap(auth, collectionId, emassFilter) {
  var assetEmassMap = new Map();
  const assets = await getAssetsByCollection(auth, collectionId);
  if (assets) {
    for (var i = 0; i < assets.data.length; i++) {
      var emassNum = "";
      if (
        assets.data[i] &&
        assets.data[i].metadata &&
        assets.data[i].metadata.eMass
      ) {
        emassNum = assets.data[i].metadata.eMass;
        if (emassFilter) {
          if (emassNum && emassNum === emassFilter) {
            assetEmassMap.set(assets.data[i].name, emassNum);
          }
        } else {
          assetEmassMap.set(assets.data[i].name, emassFilter);
        }
      } else {
        assetEmassMap.set(assets.data[i].name, emassFilter);
      }
    }
  }

  return assetEmassMap;
}

async function getAllCollections(emassNums, emassMap) {
  var storedAuth = getAuth();
  var collections = [];
  var tempCollections = [];

  tempCollections = await getCollections(storedAuth);
  if (!emassNums || emassNums.length === 0) {
    //collections = tempCollections;
    for (var j = 0; j < tempCollections.data.length; j++) {
      collections.push(tempCollections.data[j]);
    }
  } else {
    emassMap = reportUtils.getCollectionsByEmassNumber(
      tempCollections,
      emassNums
    );
    var emassArray = emassNums.split(",");
    for (var mapIdx = 0; mapIdx < emassArray.length; mapIdx++) {
      console.log("emassArray[mapIdx]: " + emassArray[mapIdx]);
      var mappedCollection = emassMap.get(emassArray[mapIdx]);

      if (mappedCollection) {
        collections = collections.concat(mappedCollection);
      }
    }
  }

  return collections;
}

async function getAssetMetadata(auth, assetId) {
  var myUrl = apiBase + "/assets/" + assetId + "/metadata";
  //console.log(myUrl);
  try {
    var assetMeatdata = await getMetricsData(auth, myUrl);
    return assetMeatdata;
  } catch (e) {
    console.log("getAssetMetadata error: " + e);
    console.log(myUrl);
  }
}

async function getJsonSummary(auth, assetId, benchmarkId, revisionStr) {
  var myUrl =
    apiBase +
    "/assets/" +
    assetId +
    "/checklists/" +
    benchmarkId +
    "/" +
    revisionStr +
    "?format=json";
  console.log(myUrl);
  try {
    var assetSummary = await getMetricsData(auth, myUrl);
    return assetSummary;
  } catch (e) {
    console.log("getJsonSummary error: " + e);
    console.log(myUrl);
  }
}

async function getReviewsByAsset(auth, collectionId, assetId, benchmarkId) {
  var myUrl =
    apiBase +
    "/collections/" +
    collectionId +
    "/reviews/" +
    assetId +
    "?rules=default-mapped&benchmarkId=" +
    benchmarkId;

  console.log(myUrl);
  try {
    var reviews = await getMetricsData(auth, myUrl);
    return reviews;
  } catch (e) {
    console.log("getJsonSummary error: " + e);
    console.log(myUrl);
  }
}

async function getAllStigs(auth) {
  try {
    //console.log('getAssetsByCollection');
    var myUrl = apiBase + "/stigs?elevate=false";
    var stigs = getMetricsData(auth, myUrl);
    return stigs;
  } catch (e) {
    console.log("Error in getAssetsByCollection");
    console.log(e);
  }
}

export {
  getCollections,
  getCollectionByName,
  getAllCollections,
  getStigs,
  getStigById,
  getStigsByAsset,
  getAssets,
  getAssetsByLabel,
  getAssetsByCollection,
  getAssetsByName,
  getAssetMetricsSummary,
  getAssetMetricsSummaryByAssetId,
  getCollectionMerticsAggreatedByLabel,
  getCollectionMerticsAggreatedByAsset,
  getFindingsByCollectionAndAsset,
  getFindingsByCollection,
  getCollectionMertics,
  getCollectionMerticsSummary,
  getCollectionMerticsByCollectionBenchmarkAsset,
  getCollectionMerticsByCollectionAndAsset,
  getCollectionMerticsByCollectionAssetAndLabel,
  getCollectionMerticsUnaggregated,
  getCollectionMerticsdByStig,
  getLabelsByCollection,
  getBenchmarkRevisions,
  createLabel,
  getChecklists,
  getCollectionBenchmarkChecklist,
  getAssetChecklists,
  getMultiStigChecklist,
  getReview,
  getReviews,
  getReviewsByCollection,
  getReviewsByCollectionAndStig,
  getReviewByCollectionAndAsset,
  getAllReviewsByCollectionAndAsset,
  getReviewByGroupId,
  getSubmittedReviewsByCollectionAndAsset,
  getAssetsById,
  getAssetEmassMap,
  getAssetMetadata,
  getMetaMetricsSummary,
  getMerticsSummarydByBenchmark,
  getAssetMetricsSummaryByAssetIdAndBenchmarkId,
  getSummaryMerticsByCollectionAndAsset,
  getJsonSummary,
  getMetaMetricsSummaryAggregatedByStig,
  getReviewsByAsset,
  getAssetMetricsSummaryByBenchmark,
  getCollectionsMetrics,
  getCollectionMerticsByCollectionAndBenchmark,
  getAllStigs,
};
