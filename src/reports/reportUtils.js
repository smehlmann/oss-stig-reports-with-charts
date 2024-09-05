var quarters = [
  {
    name: "Q1",
    startDate: "10/1/2023",
    endDate: "12/31/2023",
  },
  {
    name: "Q2",
    startDate: "1/1/2024",
    endDate: "3/31/2024",
  },
  {
    name: "Q3",
    startDate: "4/1/2024",
    endDate: "6/30/2024",
  },
  {
    name: "Q4",
    startDate: "7/1/2024",
    endDate: "9/30/2024",
  },
];

function getCollectionsByEmassNumber(collections, emassNumsFilter) {
  let emassMap = new Map();

  console.log("collections.data.length: " + collections.data.length);
  console.log(collections);

  try {
    var emassArray = emassNumsFilter.split(",");
    var collectionEmass = '';

    if (emassNumsFilter) {
      for (var x = 0; x < collections.data.length; x++) {
        if(collections.data[x].name === 'NP_C34-NCCM-NW_7371_Zone B'){
          console.log(collections.data[x].name);
        }
        else if(collections.data[x].name === 'NP_C60-NCCM-S_7373_Zone B'){
          console.log(collections.data[x].name);
        }
        collectionEmass = collections.data[x].metadata.eMASS;
        if (collectionEmass) {
          var collectioEmassArray = collectionEmass.split(",");

          for (var iCol = 0; iCol < collectioEmassArray.length; iCol++) {
            for (var j = 0; j < emassArray.length; j++) {
              if (collectioEmassArray[iCol] === emassArray[j]) {
                var myCollections = emassMap.get(emassArray[j]);
                if (myCollections) {
                  myCollections.push(collections.data[x]);
                  emassMap.set(emassArray[j], myCollections);
                } else {
                  myCollections = [collections.data[x]];
                  emassMap.set(emassArray[j], myCollections);
                }
              }
            }
          }
        }
      }
    } else {
      for (var x = 0; x < collections.data.length; x++) {
        collectionEmass = collections.data[x].metadata.eMASS;
        if (collectionEmass) {
          var collectioEmassArray = collectionEmass.split(",");

          for (var iCol = 0; iCol < collectioEmassArray.length; iCol++) {
            var myCollections = emassMap.get(collectioEmassArray[iCol]);
            if (myCollections) {
              myCollections.push(collections.data[x]);
              emassMap.set(collectioEmassArray[iCol], myCollections);
            } else {
              myCollections = [collections.data[x]];
              emassMap.set(collectioEmassArray[iCol], myCollections);
            }
          }
        }
      }
    }
  } catch (e) {
    console.log("Error in getCollectionsByEmassNumber");
    console.log(e);
  }

  return emassMap;
}

function getCurrentQuarter(latestRevisinDate) {
  const currentDate = new Date();
  const revisionDate = new Date(latestRevisinDate);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  var retQuarter = null;
  for (var i = 0; i < quarters.length; i++) {
    var splitStartDate = quarters[i].startDate.split("/");
    var splitEndDate = quarters[i].endDate.split("/");

    // Are the years the same?
    if (parseInt(splitStartDate[2]) === currentYear) {
      // is the month within range
      if (
        currentMonth >= parseInt(splitStartDate[0]) &&
        currentMonth <= parseInt(splitEndDate[0])
      ) {
        retQuarter = quarters[i];
        break;
      }
    }
  }

  if (retQuarter) {
    const startDate = new Date(retQuarter.startDate);
    const endDate = new Date(retQuarter.endDate);

    if (revisionDate < startDate || revisionDate > endDate) {
      retQuarter = null;
    }
  }

  return retQuarter;
}

/*
    Returns the version string if versionDateStr is in the current quarter
*/
function getVersionForQuarter(quarter, versionDateStr, versionStr) {
  var returnVer = "";

  /* if quarter is null, return an empty string */
  if (!quarter) {
    return returnVer;
  }

  var splitVersionDateStr = versionDateStr.split("-");
  var startSplitDate = quarter.startDate.split("/");
  var endSplitDate = quarter.endDate.split("/");

  /* check that the years are the same */
  if (
    splitVersionDateStr[0] === startSplitDate[2] &&
    splitVersionDateStr[0] === endSplitDate[2]
  ) {
    /* check if the month is in range for the quarter */
    if (
      parseInt(splitVersionDateStr[1]) >= parseInt(startSplitDate[1]) &&
      parseInt(splitVersionDateStr[1]) <= parseInt(endSplitDate[1])
    ) {
      returnVer = versionStr;
    }
  }

  return returnVer;
}

function getEmassAcronymMap() {
  let emassAcronymMap = new Map();

  emassAcronymMap.set("6969", "C34 ZD-U");
  emassAcronymMap.set("1446", "AIMTCIS");
  emassAcronymMap.set("7296", "VWES-U");
  emassAcronymMap.set("6931", "USWRIC");
  emassAcronymMap.set("1656", "C15 ZD-U");
  emassAcronymMap.set("6491", "C15 PIT A-ZD-U");
  emassAcronymMap.set("8061", "C85 ZD - U");
  emassAcronymMap.set("6593", "C70 ZD-U");
  emassAcronymMap.set("11238", "AUTEC ASSA");
  emassAcronymMap.set("3504", "C70 PIT A-ZD-U");
  emassAcronymMap.set("5492", "AUTEC - ISPNET");
  emassAcronymMap.set("7374", "RDT&E CSS");
  emassAcronymMap.set("2008", "Enchilada");
  emassAcronymMap.set("1878", "ASI");
  emassAcronymMap.set("7371", "NCCM-NW");
  emassAcronymMap.set("7372", "NCCM-W");
  emassAcronymMap.set("2862", "NewPortal");
  emassAcronymMap.set("7373", "NCCM-S");
  emassAcronymMap.set("1761", "Unclass Core");
  emassAcronymMap.set("1315", "NUWCDIVNPT B3COI");
  emassAcronymMap.set("2874", "NERDS");
  emassAcronymMap.set("12412", "NDNSA");
  emassAcronymMap.set("4435", "TOPSIDEC3");
  emassAcronymMap.set("3212", "AUURV");
  emassAcronymMap.set("8801", "C45 ZD-U");

  return emassAcronymMap;
}

function getMetricsAverages(metrics) {
  const numAssessments = metrics.metrics.assessments;
  const numAssessed = metrics.metrics.assessed;
  const numSubmitted = metrics.metrics.statuses.submitted;
  const numAccepted = metrics.metrics.statuses.accepted;
  const numRejected = metrics.metrics.statuses.rejected;

  const avgAssessed = numAssessments ? (numAssessed / numAssessments) * 100 : 0;
  //const avgAssessed = Math.round(numAssessments ? (numAssessed / numAssessments) * 100 : 0);

  const avgSubmitted = numAssessments
    ? ((numSubmitted + numAccepted + numRejected) / numAssessments) * 100
    : 0;
  //const avgSubmitted = Math.round(numAssessments ? ((numSubmitted + numAccepted + numRejected) / numAssessments) * 100 : 0);

  const avgAccepted = numAssessments ? (numAccepted / numAssessments) * 100 : 0;
  //const avgAccepted = Math.round(numAssessments ? ((numAccepted) / numAssessments) * 100 : 0);

  const avgRejected = numAssessments ? (numRejected / numAssessments) * 100 : 0;

  //const avgRejected = Math.round(numAssessments ? ((numRejected) / numAssessments) * 100 : 0);

  var averages = {
    assessed: avgAssessed,
    submitted: avgSubmitted,
    accepted: avgAccepted,
    rejected: avgRejected,
  };

  return averages;
}

function calcDiffInDays(minTs) {
  var touchDate = new Date(minTs);
  var today = new Date();
  var timeDiff = today - touchDate;
  var diffInDays = timeDiff / (1000 * 3600 * 24);

  return diffInDays;
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

function filterCollectionsByEmassNumber(collections) {
  let emassMap = new Map();

  try {
    for (var x = 0; x < collections.length; x++) {
      console.log("collectionName: " + collections[x].name);

      if (!collections[x].name.startsWith("NP_C")) {
        continue;
      }

      if (!collections[x].metadata) {
        continue;
      }

      var emassNum = collections[x].metadata.eMASS;

      // Is emass a comma delimited string? if so, add each emass separately.
      if (emassNum) {
        if (emassNum.includes(",")) {
          var emassNums = emassNum.split(",");
          for (var iEmass = 0; iEmass < emassNums.length; iEmass++) {
            addEmassToMap(emassNums[iEmass], emassMap, collections[x]);
          }
        } else {
          addEmassToMap(emassNum, emassMap, collections[x]);
        }
      }
    }
  } catch (e) {
    console.log("Error in getCollectionsByEmassNumber");
    console.log(e);
  }

  return emassMap;
}

function getFilteredCollections(auth, emassMap, emassNums) {
  var collections = [];

  var emassArray = emassNums.split(",");
  for (var mapIdx = 0; mapIdx < emassArray.length; mapIdx++) {
    console.log("emassArray[mapIdx]: " + emassArray[mapIdx]);
    var mappedCollection = emassMap.get(emassArray[mapIdx]);
    if (mappedCollection) {
      collections = collections.concat(mappedCollection);
    }
  }

  return collections;
}

function addEmassToMap(emassNum, emassMap, collection) {
  var myVal = emassMap.get(emassNum);
  if (myVal) {
    myVal.push(collection);
    emassMap.set(emassNum, myVal);
  } else {
    myVal = collection;
    var collVal = [];
    collVal.push(myVal);
    emassMap.set(emassNum, collVal);
  }
}

function getMetadata(labelMap, metrics) {
  var collectionMetadata = {
    primOwner: "",
    sysAdmin: "",
    device: "",
    ccbSAActions: "",
    rmfAction: "",
    isso: "",
    other: "",
  };

  const labels = metrics.labels;
  if (!labels || labels.length === 0) {
    return collectionMetadata;
  }
  const nameMap = new Map();

  try {
    for (var i = 0; i < labels.length; i++) {
      nameMap.set(labels[i].labelId, labels[i].name);
    }

    labelMap.forEach((value, key, map) => {
      //console.log(key, value);
      var labelId = key;
      var labelDesc = value.toUpperCase();

      var name = nameMap.get(labelId);

      if (name && name !== "") {
        //labelDesc = labelMap.get(labels[iLabel].labelId);
        //console.log("labelDesc: " + labelDesc);
        //labelDesc = labelMap.get(labels[iLabel].labelId).toUpperCase();

        switch (labelDesc) {
          case "PRIMARY OWNER":
            collectionMetadata.primOwner =
              collectionMetadata.primOwner + name + ";";
            break;
          case "SYS ADMIN":
            collectionMetadata.sysAdmin =
              collectionMetadata.sysAdmin + name + ";";
            break;
          case "CCB_SA_ACTIONS":
            collectionMetadata.ccbSAActions =
              collectionMetadata.ccbSAActions + name + ";";
            break;
          case "RMF ACTION":
            collectionMetadata.rmfAction =
              collectionMetadata.rmfAction + name + ";";
            break;
          case "ISSO":
            collectionMetadata.isso = collectionMetadata.isso + name + ";";
            break;
          case "OTHER":
            collectionMetadata.other = collectionMetadata.other + name + ";";
            break;
          case "ASSET TYPE":
            collectionMetadata.device = collectionMetadata.device + name + ";";
            break;
          default:
            break;
        }
      } // end check for no name
    }); // end for each labelMap

    // remove trailing ';'
    collectionMetadata.primOwner = collectionMetadata.primOwner.replace(
      /;$/,
      ""
    );
    collectionMetadata.sysAdmin = collectionMetadata.sysAdmin.replace(/;$/, "");
    collectionMetadata.ccbSAActions = collectionMetadata.ccbSAActions.replace(
      /;$/,
      ""
    );
    collectionMetadata.rmfAction = collectionMetadata.rmfAction.replace(
      /;$/,
      ""
    );
    collectionMetadata.isso = collectionMetadata.isso.replace(/;$/, "");
    collectionMetadata.other = collectionMetadata.other.replace(/;$/, "");
    collectionMetadata.device = collectionMetadata.device.replace(/;$/, "");

    return collectionMetadata;
  } catch (e) {
    console.log(e);
    throw e;
  }
} // end function getMetadata

function getMetadataByAsset(labelMap, labels) {
  var collectionMetadata = {
    primOwner: "",
    sysAdmin: "",
    device: "",
    ccbSAActions: "",
    rmfAction: "",
    isso: "",
    other: "",
  };

  var labelDesc = "";

  for (var iLabel = 0; iLabel < labels.length; iLabel++) {
    var assetLabel = labels[iLabel].labelId;
    if (!assetLabel) {
      assetLabel = "";
    } else {
      assetLabel = assetLabel.toUpperCase();
      labelDesc = labelMap.get(labels[iLabel].labelId).toUpperCase();

      switch (labelDesc) {
        case "PRIMARY OWNER":
          collectionMetadata.primOwner = labels[iLabel].name;
          break;
        case "SYS ADMIN":
          collectionMetadata.sysAdmin = labels[iLabel].name;
          break;
        case "CCB_SA_ACTIONS":
          collectionMetadata.ccbSAActions = labels[iLabel].name;
          break;
        case "RMF Action":
          collectionMetadata.rmfAction = labels[iLabel].name;
          break;
        case "ISSO":
          collectionMetadata.isso = labels[iLabel].name;
          break;
        case "OTHER":
          collectionMetadata.other = labels[iLabel].name;
          break;
        case "ASSET TYPE":
          collectionMetadata.device = labels[iLabel].name;
          break;
        default:
          break;
      }
    }
  }

  return collectionMetadata;
}

function getAssetMetadata(labelMap, labels) {
  var collectionMetadata = {
    primOwner: "",
    sysAdmin: "",
    device: "",
    ccbSAActions: "",
    rmfAction: "",
    isso: "",
    other: "",
  };

  var labelDesc = "";

  for (var iLabel = 0; iLabel < labels.length; iLabel++) {
    var labelId = labels[iLabel];
    labelDesc = labelMap.get(labelId);
    if (labelDesc) {
      labelDesc = labelDesc.toLocaleUpperCase();
      switch (labelDesc) {
        case "PRIMARY OWNER":
          collectionMetadata.primOwner = labels[iLabel].name;
          break;
        case "SYS ADMIN":
          collectionMetadata.sysAdmin = labels[iLabel].name;
          break;
        case "CCB_SA_ACTIONS":
          collectionMetadata.ccbSAActions = labels[iLabel].name;
          break;
        case "RMF Action":
          collectionMetadata.rmfAction = labels[iLabel].name;
          break;
        case "ISSO":
          collectionMetadata.isso = labels[iLabel].name;
          break;
        case "OTHER":
          collectionMetadata.other = labels[iLabel].name;
          break;
        case "ASSET TYPE":
          collectionMetadata.device = labels[iLabel].name;
          break;
        default:
          break;
      } // end switch
    } // end if label decsription
  } // end for each label

  return collectionMetadata;
}

function mergeHeadersAndData(data) {
  const headers = data.headers;
  const rows = data.rows;
  //var jsonData = {};
  var jsonArray = [];
  var myJson = {};
  headers.forEach(function (column) {
    var columnName = column.key;
    var columnValue = column.label;
    myJson[columnName] = columnValue;
  });

  jsonArray.push(myJson);
  //const mergedData = rows.unshift(jsonArray);
  const mergedData = jsonArray.concat(rows);

  return mergedData;
}

function generateAssetNames(emassNum, assetName, assetNames, assetEmass) {
  var names = assetNames;

  if (assetEmass) {
    if (assetEmass === emassNum) {
      names += assetName + ";";
      /*if (idx < assets.data.length - 1) {
                names += assets.data[idx].name + ';'
            }
            else {
                names += assets.data[idx].name
            }*/
    }
  }
  /*else {
        if (idx < assets.data.length - 1) {
            names += assets.data[idx].name + ';'
        }
        else {
            names += assets.data[idx].name
        }
    }*/

  return names;
}

async function getAssetEmassMapByAssets(
  emassFilter,
  assets,
  checkDbWeb,
  collectionEmass
) {
  var assetEmassMap = new Map();
  if (assets) {
    for (var i = 0; i < assets.data.length; i++) {
      if (checkDbWeb === 1) {
        if (
          assets.data[i] &&
          assets.data[i].metadata &&
          assets.data[i].metadata.cklWebOrDatabase
        ) {
          if (assets.data[i].metadata.cklWebOrDatabase === "true") {
            continue;
          }
        }
      }

      if (assets.data[i].name === "NP0902WK400011") {
        console.log("assetName: " + assets.data[i].name);
      }

      var emassNum = "";

      if (
        assets.data[i] &&
        assets.data[i].metadata &&
        assets.data[i].metadata.eMass
      ) {
        // there is an eMASS key for this asset, so get the value
        emassNum = assets.data[i].metadata.eMass;
        if (emassFilter) {
          // an eMASS filter has been specified
          if (emassNum && emassNum === emassFilter) {
            // the asset eMASS is the same as the eMASS filter so use the asset's emass
            assetEmassMap.set(assets.data[i].name, emassNum);
          }
        } else if (emassNum) {
          // an eMASS filter has not been specifed but he asset has the eMASS set in its metadata
          assetEmassMap.set(assets.data[i].name, emassNum);
        } else {
          // emass is not specifed in the asset metadata so use collection eMASS
          assetEmassMap.set(assets.data[i].name, collectionEmass);
        }
      } else {
        // there is no asset eMass metadata so use collection emass
        assetEmassMap.set(assets.data[i].name, collectionEmass);
      }
    }
  }

  return assetEmassMap;
}

function formatCsvString(myDetail) {
  var detail = myDetail.replaceAll("/", "-");
  detail = detail.replaceAll("\r", "\\r");
  detail = detail.replaceAll("\n", "\\n");
  detail = detail.replaceAll("\t", "\\t");
  detail = detail.replaceAll(",", ";");
  /*if(detail === '0' || detail === '1' || detail === '2'){
                                            console.log('myDetail before truncate: ' + myDetail);
                                        }*/

  if (detail.length > 32000) {
    detail = detail.substring(0, 32000);
  }

  return detail;
}

async function getAssetEmassMapForUnassigned(assets) {
  var unassignedAssets = [];
  if (assets) {
    for (var i = 0; i < assets.data.length; i++) {
      if (assets.data[i] && !assets.data[i].metadata) {
        unassignedAssets.push(assets.data[i]);
      }
      if (
        assets.data[i] &&
        assets.data[i].metadata &&
        !assets.data[i].metadata.eMass
      ) {
        unassignedAssets.push(assets.data[i]);
      }
    }
  }

  return unassignedAssets;
}

export {
  getCollectionsByEmassNumber,
  getCurrentQuarter,
  getVersionForQuarter,
  getEmassAcronymMap,
  getMetricsAverages,
  calcDiffInDays,
  resultAbbreviation,
  filterCollectionsByEmassNumber,
  getMetadata,
  getMetadataByAsset,
  mergeHeadersAndData,
  generateAssetNames,
  getFilteredCollections,
  getAssetEmassMapByAssets,
  getAssetEmassMapForUnassigned,
  formatCsvString,
  getAssetMetadata,
};
