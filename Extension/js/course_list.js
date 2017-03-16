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
        // Table cell to eventaully put append average GPA to
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

    //Runs for every class card in DOM -- same as averageGPA() setup
    $.initialize('a.sectionExpand', function() {
        //make sure it's not one of the links we inserted
        if ($(this).attr('href') !== "javascript:void(0)") {
            //creating the new link to be appended
            var newLink = document.createElement("a");
            newLink.href = "javascript:void(0)";
            newLink.innerHTML = "grades";
            newLink.className = "sectionExpand hide collapsibleCriteria enabled";
            newLink.onclick = function () {
                //write the expandSection function here
                
                //create skeleton table
                var distTable = document.createElement("table");
                //append skeleton table to section
                $(this).parent().append(distTable);
                
                //get courseID
                var courseURL = $(this).attr('href');
                var courseID = courseURL.match(/courseID=([0-9]*)/)[1];
                courseID.replace("courseID=", "");
                
                //call distributionExpanded which makes DB request
                distributionExpanded(courseID);
            }
            
            //quick create the arrow icon
            var arrowIcon = document.createElement("img");
            arrowIcon.src = chrome.extension.getURL('img/left-arrow.png');
            arrowIcon.className = "expandCollapseIcon";
            arrowIcon.width = "15";
            arrowIcon.height = "15";
            newLink.appendChild(arrowIcon);
            
            //append newLink to the section, below the sections link
            $(this).parent().append(newLink);
        }
    })
    
}

function sectionsListenerSetup() {
    $.initialize('table.sectionDetailList', function() {
        // All sections table actions done in here
    });
}


/***** event handlers (listener callbacks) *****/

function gpaSortingToggled() {

}

function listLoaded() {

}

// Probably deprecated, anything done in the sections table that needs to be done can be done in the sectionsListenerSetup's initialize function
function sectionsExpanded(sectionsTable) {

}

function distributionExpanded(course) {

}

