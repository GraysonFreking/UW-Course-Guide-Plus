
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
    for (var i = 0; i < sections.length; i++) {
        totalGradePoints += sections[i].avgGPA * sections[i].count;
        totalGrades += sections[i].count;
    }
    aveGPA = totalGradePoints / totalGrades;
    if (aveGPA <= 0 || sections.length == 0) {
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

function getDistributionsByProfessor(course, professor) {
    // TODO: Wasn't in original planning docs, but this is necessary at some point for the by-professor charts on the course pages
}
