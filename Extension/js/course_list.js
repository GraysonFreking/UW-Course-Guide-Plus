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

        // Ask the model for the average GPA for this class, append it to the TD
        chrome.runtime.sendMessage( {
            action: "getAverageGPA",
            course: subjectID + courseNum
        }, function(response) {
            if (response != undefined) {
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

            var currElement = $(this);
            //creating the new link to be appended
            var newLink = document.createElement("a");
            newLink.href = "javascript:void(0)";
            newLink.innerHTML = "grades";
            newLink.className = "gradesExpand hide collapsibleCriteria enabled";

            //quick create the arrow icon
            var arrowIcon = document.createElement("img");
            arrowIcon.src = chrome.extension.getURL('img/left-arrow.png');
            arrowIcon.className = "expandCollapseIcon";
            arrowIcon.width = "15";
            arrowIcon.height = "15";
            newLink.appendChild(arrowIcon);

            //add listener to newLink
            newLink.addEventListener('click', function () {
                //check if the table has already been made, if not then make it
                if (!$(this).next().is(".distTable")) {

                    // Extracts course ID
                    var courseURL = $(this).prev().attr('href');
                    var subjectID = courseURL.match(/subjectId=([0-9]*)/)[1];
                    subjectID.replace("subjectId=", "");

                    // Extract course number from a specific TD. Some trimming and RegEx magic needed to filter out ocassional "Cross-listed" or "Term" text in that same TD
                    var courseNum = $(this).parent().parent().prev().prev().children('td:nth-child(4)').html().trim().match(/([0-9]*)/)[1];

                    //combine subjectID and courseNum into a courseID
                    var courseID = subjectID + courseNum

                    //call distributionExpanded which makes DB request
                    //distributionExpanded(courseID);
                    chrome.runtime.sendMessage( {
                        action: "getDistribution",
                        course: courseID,
                        count: 5
                    }, function(response) {
                        //do response handling here & fill build/fill table
                        console.log(response);
                        var jsonObj = response;
                        //create table to populate
                        var table = document.createElement("table");
                        table.className = "distTable";
                        table.border = "1px solid black";

                        //create the header row
                        var $headerRow = $("<tr/>");
                        //create all the table headers
                        $("<th/>").text("Term").appendTo($headerRow);
                        $("<th/>").text("Count").appendTo($headerRow);
                        $("<th/>").text("Avg GPA").appendTo($headerRow);
                        $("<th/>").text("A%").appendTo($headerRow);
                        $("<th/>").text("AB%").appendTo($headerRow);
                        $("<th/>").text("B%").appendTo($headerRow);
                        $("<th/>").text("BC%").appendTo($headerRow);
                        $("<th/>").text("C%").appendTo($headerRow);
                        $("<th/>").text("D%").appendTo($headerRow);
                        $("<th/>").text("F%").appendTo($headerRow);
                        $("<th/>").text("I%").appendTo($headerRow);
                        //append header row to table
                        //table.appendChild($headerRow);
                        $headerRow.appendTo(table);
                        
                        //parse the returned JSON
                        for (var i = 0; i < jsonObj.sections.length; i++) {

                            //create row
                            var row = document.createElement("tr");
                            //create term column
                            var tdTerm = document.createElement("td");
                            tdTerm.appendChild(document.createTextNode(jsonObj.sections[i].term));
                            row.appendChild(tdTerm);
                            //create count column
                            var tdCount = document.createElement("td");
                            tdCount.appendChild(document.createTextNode(jsonObj.sections[i].count));
                            row.appendChild(tdCount);
                            //create avg GPA column
                            var tdAvgGpa = document.createElement("td");
                            tdAvgGpa.appendChild(document.createTextNode(jsonObj.sections[i].avgGPA));
                            row.appendChild(tdAvgGpa);
                            //create aPercent column
                            var tdAPercent = document.createElement("td");
                            tdAPercent.appendChild(document.createTextNode(jsonObj.sections[i].aPercent));
                            row.appendChild(tdAPercent);
                            //create abPercent column
                            var tdABPercent = document.createElement("td");
                            tdABPercent.appendChild(document.createTextNode(jsonObj.sections[i].abPercent));
                            row.appendChild(tdABPercent);
                            //create bPercent column
                            var tdBPercent = document.createElement("td");
                            tdBPercent.appendChild(document.createTextNode(jsonObj.sections[i].bPercent));
                            row.appendChild(tdBPercent);
                            //create bcPercent column
                            var tdBCPercent = document.createElement("td");
                            tdBCPercent.appendChild(document.createTextNode(jsonObj.sections[i].bcPercent));
                            row.appendChild(tdBCPercent);
                            //create cPercent column
                            var tdCPercent = document.createElement("td");
                            tdCPercent.appendChild(document.createTextNode(jsonObj.sections[i].cPercent));
                            row.appendChild(tdCPercent);
                            //create dPercent column
                            var tdDPercent = document.createElement("td");
                            tdDPercent.appendChild(document.createTextNode(jsonObj.sections[i].dPercent));
                            row.appendChild(tdDPercent);
                            //create fPercent column
                            var tdFPercent = document.createElement("td");
                            tdFPercent.appendChild(document.createTextNode(jsonObj.sections[i].fPercent));
                            row.appendChild(tdFPercent);
                            //create iPercent column
                            var tdIPercent = document.createElement("td");
                            tdIPercent.appendChild(document.createTextNode(jsonObj.sections[i].iPercent));
                            row.appendChild(tdIPercent);

                            //append row to table
                            table.appendChild(row);

                        }

                        currElement.parent().append(table);
                        console.log("table appended...");

                    });

                }

                //test
                console.log("clicked the new link");

                //toggle the div
                $(this).next().toggle();
            });

            //append newLink to the section, below the sections link
            $(this).parent().append(newLink);

        }
    });

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

