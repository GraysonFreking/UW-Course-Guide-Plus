
// set up listener for messages from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.action) {
        case "getAverageGPA":
            sendResponse(getAverageGPA(request.course));
            break;
        case "getRmpScores":
	        sendResponse(getRmpScores(request.professor));
	        break;
        case "getLocationLinks":
	        sendResponse(getLocationLinks(request.locations, request.index));
	        break;
        case "getDistribution":
	        sendResponse(getDistribution(request.course, request.count));
            break;
    }
  }
);


function getAverageGPA(course) {
    return findAverageGPA(course).courseGPA;
}

function getLocationLinks(locations, index) {
    var result =  getMap(locations);
    //Used in adding text to link.
    result['name'] = locations;
    //Used for adding breakpoints
    result['index'] = index;
    return result;
}


function getDistribution(course, count) {
	// TODO: worry about specific count when we have more in db
	return getDistributions(course);
}

function getDistributionsByProfessor(course, professor) {
    // TODO: Wasn't in original planning docs, but this is necessary at some point for the by-professor charts on the course pages
}
