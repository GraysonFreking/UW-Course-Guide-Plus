// functions to call on script injected
listSetup();
filteringFieldsSetup();

/***** setup functions *****/

function listSetup() {
  averageGPASetup();
  distributionSetup();
  sectionsListenerSetup();
}

function averageGPASetup() {

    // Will run for every class card inserted into DOM (including realtime insertions)
    $.initialize('a.sectionExpand', function() {
        var addlInfoTD = $(this).parent().parent().prev().prev().children('td:nth-child(7)');

        // Extracts course ID
        var courseURL = $(this).attr('href');
        var courseID = courseURL.match(/courseID=([0-9]*)/)[1];
        courseID.replace("courseID=", "");

        // Ask the model for the average GPA for this class, append it to the TD
        chrome.runtime.sendMessage( {
            action: "getAverageGPA",
            course: courseID
        }, function(response) {
            addlInfoTD.append("<strong>Ave. GPA: </strong>" + response.aveGPA + "<br>");
        })
    })

}

function filteringFieldsSetup() {

}

function distributionSetup() {

}

function sectionsListenerSetup() {

}


/***** event handlers (listener callbacks) *****/

function gpaSortingToggled() {

}

function listLoaded() {

}

function sectionsExpanded(sectionsTable) {

}

function distributionExpanded(course) {

}

