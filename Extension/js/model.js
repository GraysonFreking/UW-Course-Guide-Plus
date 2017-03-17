
// set up listener for messages from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.action) {
        case "getAverageGPA":
            sendResponse(getAverageGPA(request.course));
            break;
        case "getRmpScores":
	        sendResponse(getRmpScores(request.professors));
	        break;
        case "getLocationLinks":
	        sendResponse(getLocationLinks(request.locations));
	        break;
        case "getDistribution":
	        sendResponse(getDistribution(request.course, request.count));
            break;
    }
  }
);


function getAverageGPA(course) {
    var sections = getDistributions(course).sections,
        totalGradePoints = 0,
        totalGrades = 0,
        aveGPA;
    if (sections.length == 0) {
        return undefined;
    }
    for (var section in sections) {
        totalGradePoints += sections[section].avgGPA * sections[section].count;
        totalGrades += sections[section].count;
    }
    aveGPA = totalGradePoints / totalGrades;
    if (aveGPA <= 0) {
        return undefined;
    }
    return { aveGPA: aveGPA.toFixed(3) };
}


function getRmpScores(professors) {

}


function getLocationLinks(locations) {

}


function getDistribution(course, count) {
	// TODO: worry about specific count when we have more in db
	return getDistributions(course);
}
