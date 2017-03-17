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
                var table = document.createElement("table");
                table.border = "1px solid black";
                /*for (var i = 0, il = jsonObj.length; i < il; i++) {
                    //create row
                    var row = document.createElement('tr'),
                        td;
                    //create term column
                    td = document.createElement('td');
                    td.appendChild(document.createTextNode(value.term));
                    row.appendChild(td);
                    
                    //append row to table
                    table.appendChild(row);
                    console.log("row appended...");
                }*/
                //create row
                var row = document.createElement("tr");
                //create term column
                var tdTerm = document.createElement("td");
                tdTerm.appendChild(document.createTextNode(jsonObj.sections[0].term));
                row.appendChild(tdTerm);
                //create count column
                var tdCount = document.createElement("td");
                tdCount.appendChild(document.createTextNode(jsonObj.sections[0].count));
                row.appendChild(tdCount);
                //create avg GPA column
                var tdAvgGpa = document.createElement("td");
                tdAvgGpa.appendChild(document.createTextNode(jsonObj.sections[0].avgGPA));
                row.appendChild(tdAvgGpa);
                //create aPercent column
                var tdAPercent = document.createElement("td");
                tdAPercent.appendChild(document.createTextNode(jsonObj.sections[0].aPercent));
                row.appendChild(tdAPercent);
                //create abPercent column
                var tdABPercent = document.createElement("td");
                tdABPercent.appendChild(document.createTextNode(jsonObj.sections[0].abPercent));
                row.appendChild(tdABPercent);
                //create bPercent column
                var tdBPercent = document.createElement("td");
                tdBPercent.appendChild(document.createTextNode(jsonObj.sections[0].bPercent));
                row.appendChild(tdBPercent);
                //create bcPercent column
                var tdBCPercent = document.createElement("td");
                tdBCPercent.appendChild(document.createTextNode(jsonObj.sections[0].bcPercent));
                row.appendChild(tdBCPercent);
                //create cPercent column
                var tdCPercent = document.createElement("td");
                tdCPercent.appendChild(document.createTextNode(jsonObj.sections[0].cPercent));
                row.appendChild(tdCPercent);
                //create dPercent column
                var tdDPercent = document.createElement("td");
                tdDPercent.appendChild(document.createTextNode(jsonObj.sections[0].dPercent));
                row.appendChild(tdDPercent);
                //create fPercent column
                var tdFPercent = document.createElement("td");
                tdFPercent.appendChild(document.createTextNode(jsonObj.sections[0].fPercent));
                row.appendChild(tdFPercent);
                //create iPercent column
                var tdIPercent = document.createElement("td");
                tdIPercent.appendChild(document.createTextNode(jsonObj.sections[0].iPercent));
                row.appendChild(tdIPercent);
                    
                //append row to table
                table.appendChild(row);
                    
                currElement.parent().append(table);
                console.log("table appended...");
                
                });

                //test
                console.log("clicked the new link");

                //toggle the div
                $(this).next().toggle();
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
            tableDiv.append(distTable);
            //testing
            var testNode = document.createElement("p");
            testNode.innerHTML = "Wow this is a neat test, check this out.";
            tableDiv.append(testNode);
            //append div into the page
            //$(this).parent().append(tableDiv);*/

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

