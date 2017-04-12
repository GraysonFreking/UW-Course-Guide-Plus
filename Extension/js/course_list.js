// functions to call on script injected
listSetup();
filteringFieldsSetup();

/***** setup functions *****/

function listSetup() {
  averageGPASetup();
  distributionSetup();
  sectionsListenerSetup();
  RMPSetup();
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
        }, function(gpa) {
            if (gpa != undefined && gpa != null) {
                addlInfoTD.append("<strong>Ave. GPA: </strong>" + gpa + "<br>");
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

            //keep track of whether table is built yet
            var tableBuilt = false;

            //add listener to newLink
            newLink.addEventListener('click', function () {
                //check if the table has already been made, if not then make it
//                if (!$(this).next().is(".distTable")) {
                if (!tableBuilt) {

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
                    }, function(jsonObj) {
                        // Border radius formatting
                        currElement.parent().toggleClass('courseResultLL courseResultLR');

                        //only build the table if get a good response
                        if (jsonObj != undefined) {

                            var $headerRow = $("<tr></tr>");
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
                            var $table = $('<table><tbody></tbody></table>').addClass('sectionDetailList').html($headerRow);
                            var $div = $('<div><div></div></div>').addClass('CGsectionTable').html($table);
                            var $td = $('<td></td>').attr('colspan', '8').addClass('courseResultLL courseResultLR courseResultSections').html($div);
                            var $tr = $('<tr></tr>').addClass('courseResult CG_detail').html($td);

                            //parse the returned JSON
                            for (var i = 0; i < jsonObj.sections.length; i++) {

                                // <tr class="sectionNote ListRow inline detailsClassSection" data-enrollmentpackageid="010">

                                //create row
                                var row = document.createElement("tr");
                                row.className = "sectionNote ListRow inline detailsClassSection";
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
                                $table.append(row);
                            }

                            if (!tableBuilt) {
                                // currElement.parent().append(table);
                                currElement.parent().parent().after($tr);
                                console.log(currElement.parent().parent());
                                console.log("table appended...");
                            }

                            //keep track that we built the table
                            tableBuilt = true;
                        }
                        else {
                            console.log("The database returned undefined.");
                        }
                    });

                } else {
                    currElement.parent().toggleClass('courseResultLL courseResultLR');
                }

                //switch the arrow icon
                if (arrowIcon.src = chrome.extension.getURL('img/left-arrow.png')) {
                    console.log($(this).parent());
                    arrowIcon.src = chrome.extension.getURL('img/down-arrow.png');
                }
                else {
                    arrowIcon.src = chrome.extension.getURL('img/left-arrow.png');
                }

                //toggle the div
                $(this).parent().parent().next().toggle();
            });

            //append newLink to the section, below the sections link
            $(this).parent().append(newLink);

        }
    });

}

function sectionsListenerSetup() {
    $.initialize('table.sectionDetailList', function() {
        // All sections table actions done in here
		$(this).find('tr').slice(1).each( function() {
			var locations = $(this).find('td').eq(4);
			addMapLinks(locations);
		})
    });
}

function addMapLinks(locations) {
	//Add map links for each row
	locations.each( function() {
		var loc = $(this);
		var loc_clone = $(this).clone();
		loc_clone.find("br").replaceWith("\n");
		loc_text = loc_clone.text();
		var loc_split = loc_text.split("\n");

		//Go through each location in the row. Skip the first all whitespace split
		for (var i = 1; i < loc_split.length; i++) {
			var loc_str = loc_split[i].trim();
            chrome.runtime.sendMessage( {
                        action: "getLocationLinks",
                        locations: loc_str, 
                        index: i
                    }, function(response) {
                        var map = response;
                        //Add line breaks if not the first link. Not very elegant
       		            if (map['index'] != 1) {
                            var linebreak = document.createElement("br");
                            loc.append(linebreak);
                        }
                        if (map['index'] == 1) {
                            loc.empty();
                        }
                        
                        if (map['link']) {
			                var link = document.createElement("a");
        	                link.href = map['link'];
        	                link.className = "mapLink";
                            link.setAttribute('target', '_blank');
			                var t = document.createTextNode(map['name']);

                        
			                link.append(t);
			                loc.append(link);
                        }
                        //If can't find a link, just use the text
                        else {
                            var t = document.createTextNode(map['name']);
                            loc.append(t);
                        }
                })

		}
	});



}

function RMPSetup() {
    // Will run for every class card inserted into DOM (including realtime insertions)
    $.initialize('div.CGsectionTable', function() {
        $(this).find('tr').slice(1).each( function() {
            var profNames = $(this).find('td').eq(5)
            pullRMPData(profNames);
        })
    });
}

function pullRMPData(profNames) {

    profNames.find('a').each( function() {

        var overall_quality;
        var would_take_again;
        var level_of_difficulty;
        var RMP_link;

        //console.log($(this).text());
        var prof_name = $(this).text();
        var curr_prof = $(this);



        chrome.runtime.sendMessage( {
                        action: "getRmpScores",
                        professor: prof_name
                    }, function(response) {
                        var prof_info = response;
                        if (prof_info == "professor not found" || prof_info == "bad search request") {
                            console.log("professor not found");
                            Tipped.create(curr_prof, '<div>Professor not found</div>');
                        } else if (prof_info == "prof does not have scores info") {
                            console.log("Professor has not been rated yet");
                            Tipped.create(curr_prof, '<div>Professor has not been rated yet</div>');
                        } else {
                            console.log(prof_info["score"]);
                            console.log(prof_info["link"]);
                            console.log(prof_info["would_take_again"]);
                            console.log(prof_info["difficulty"]);
                            overall_quality = prof_info["score"];
                            would_take_again = prof_info["would_take_again"];
                            level_of_difficulty = prof_info["difficulty"];
                            RMP_link = prof_info["link"];

                            Tipped.create(curr_prof, '<div class="hover"><h3>Overall Rating:</h3><p class="hover_highlight">'+overall_quality+'</p><h5>Would take again: <p style="display:inline">'+would_take_again+'</p></h5><h5>Level of difficulty: <p style="display:inline">'+level_of_difficulty+'</p></h5><p class="insert"></p><hr><a target="_blank" href="'+RMP_link+'">Link to this professor&#39s Rate My Professor</a></div>');
                        }

                    }
        )

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

