
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
    // var sections = getSectionData(course),
    //     totalGradePoints = 0,
    //     totalGrades = 0,
    //     aveGPA;
    // for (var section in sections) {
    //     totalGradePoints += sections[section].avgGPA * sections[section].count;
    //     totalGrades += sections[section].count;
    // }
    // aveGPA = totalGradePoints / totalGrades;
    // return { aveGPA: aveGPA };
	getDistribution(course);
    return { aveGPA: course };
}


function getRmpScores(professors) {

}


function getLocationLinks(locations) {

}


function getDistribution(course, count) {
	// TODO: worry about specific count when we have more in db
	return getDistributions(course);
}
