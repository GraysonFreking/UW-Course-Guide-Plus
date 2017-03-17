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
        var subjectID = courseURL.match(/subjectId=([0-9]*)/)[1];
        subjectID.replace("subjectId=", "");

        // Extract course number from a specific TD. Some trimming and RegEx magic needed to filter out ocassional "Cross-listed" or "Term" text in that same TD
        var courseNum = $(this).parent().parent().prev().prev().children('td:nth-child(4)')
            .html().trim().match(/([0-9]*)/)[1];
        console.log(courseNum);

        // Ask the model for the average GPA for this class, append it to the TD
        chrome.runtime.sendMessage( {
            action: "getAverageGPA",
            course: subjectID + courseNum
        }, function(response) {
            if (response) {
                console.log("Appending: " + response.aveGPA);
                addlInfoTD.append("<strong>Ave. GPA: </strong>" + response.aveGPA + "<br>");
            }
        })
    })

}

function filteringFieldsSetup() {

}

function distributionSetup() {

    // Runs for every class card in DOM -- same as averageGPA() setup
    $.initialize('a.sectionExpand', function() {
        //make sure it's not one of the links we inserted
        if ($(this).attr('href') !== "javascript:void(0)") {
            
            //creating the new link to be appended
            var newLink = document.createElement("a");
            newLink.href = "javascript:void(0)";
            newLink.innerHTML = "grades";
            newLink.className = "gradesExpand hide collapsibleCriteria enabled";
            /*newLink.onclick = function () {
                //write the expandSection function here

                //create skeleton table
                var distTable = document.createElement("table");
                //append skeleton table to section
                $(this).parent().append(distTable);

                //get courseID
                var courseURL = $(this).prev().attr('href');
                var courseID = courseURL.match(/courseID=([0-9]*)/)[1];
                courseID.replace("courseID=", "");

                //call distributionExpanded which makes DB request
                distributionExpanded(courseID);
            }*/

            //quick create the arrow icon
            var arrowIcon = document.createElement("img");
            arrowIcon.src = chrome.extension.getURL('img/left-arrow.png');
            arrowIcon.className = "expandCollapseIcon";
            arrowIcon.width = "15";
            arrowIcon.height = "15";
            newLink.appendChild(arrowIcon);
            
            //add listener to newLink
            newLink.addEventListener('click', function () {
                 //get courseID
                var courseURL = $(this).attr('href');
                var courseID = courseURL.match(/courseID=([0-9]*)/)[1];
                courseID.replace("courseID=", "");
                
                //call distributionExpanded which makes DB request
                distributionExpanded(courseID);
                
                //test
                alert("you clicked it");
                console.log("clicked the new link");
            });
            
            //append newLink to the section, below the sections link
            $(this).parent().append(newLink);
            
            
            /*//create the hidden div
            var tableDiv = $(document.createElement("div")).hide();
            tableDiv.className = "distTableDivClass";
            ////tableDiv.display = "none";
            //create the table to append to div
            var distTable = document.createElement("table");
            distTable.className = "distTableClass";
            tableDiv.appendChild(distTable);
            //testing
            var testNode = document.createElement("p");
            testNode.innerHTML = "Wow this is a neat test, check this out.";
            tableDiv.appendChild(testNode);
            //append div into the page
            $(this).parent().append(tableDiv);*/
            
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

    chrome.runtime.sendMessage( {
        action: "getDistribution",
        course: course,
        count: 5
    }, function(response) {
        //do response handling here & fill build/fill table
        var jsonObj = $.parseJSON(response);
    });
    
}

