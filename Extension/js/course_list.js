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
    // var aveGPAs = {};

    // Iterates over each class -- sections button used as selector since it has an href with the corresponding course number inside
    $('a.sectionExpand').each(function() {
        // Table cell to eventually append the average GPA to
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

