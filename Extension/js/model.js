
// set up listener for messages from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.action) {
      case "getAverageGpa":
	sendResponse(getAverageGpa(request.courses));
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


function getAverageGpa(courses) {

}


function getRmpScores(professors) {

}


function getLocationLinks(locations) {

}


function getDistribution(course, count) {

}

