
// set up listener for messages from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.action);
    switch(request.action) {
      case "getAverageGPA":
	  sendResponse(getAverageGpa(request.course));
	break;
      case "getRmpScores":
	  sendResponse(getRmpScores(request.professors));
	break;
      case "getLocationLinks":
	  sendResponse(getLocationLinks(request.locations));
	break;
      case "getDistributions":
	  sendResponse(getDistributions(request.course, request.count));
	  break;
    }
  }
);


function getAverageGPA(course) {
    var returnVal = { aveGPA: 4 };
    console.log(returnVal);
    return 4;
}


function getRmpScores(professors) {

}


function getLocationLinks(locations) {

}


function getDistribution(course, count) {

}

