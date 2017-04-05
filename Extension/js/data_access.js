// set up db on event page loaded
function dbSetup() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/db/guideInfo.db', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function(e) {
	  var uInt8Array = new Uint8Array(this.response);
	  db = new SQL.Database(uInt8Array);
	};
	xhr.send();
}
var db;
dbSetup();

// close db connection on page suspend
chrome.runtime.onSuspend.addListener(function() {
	db.close();
});

// if suspend cancelled, reload db
chrome.runtime.onSuspendCanceled.addListener(function() {
	dbSetup();
});

function getDistributions(course) {
	var stmt = db.prepare("select name as term, avgGPA, count, aPercent, abPercent, bPercent, bcPercent, cPercent, dPercent, fPercent, iPercent \
	from Grades \
	join Section on Section.gradesID = Grades.gradesID \
	join Term on Term.termID = Section.termID \
	where courseID = $course");
	
	stmt.bind({$course: course});
	
	var distributions = {
		sections: []
	}
	
	while (stmt.step()) {
		var row = stmt.getAsObject();
		distributions.sections.push(row);
	}
	
	distributions.sections.sort(function(x, y) {
		if (x.term === y.term)
			return 0;
		else if (parseInt(x.term.split("-")[1]) > parseInt(y.term.split("-")[1]))
			return -1;
		else if (parseInt(x.term.split("-")[1]) < parseInt(y.term.split("-")[1]))
			return 1;
		else if (x.term.includes("Spring"))
			return -1;
		else
			return 1;
	});
	
	return distributions;
}

function getProfInfo(profName) {

	return searchForProf(profName);
}

function searchForProf(profName) {

    // create request url
    var searchURL = "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=University+of+Wisconsin+-+Madison&schoolID=1256&query=";
    var query = profName.toLowerCase().replace(" ", "+");
    var error_info = {};

    // make request
    var searchResponse_1 = makeXMLHttpRequest(searchURL + query);

    // return error if bad request
    if ( searchResponse_1 === 'undefined') {
	    return "bad search request";
    }

    // parse searchResponse_1 for link to profile
    var profileLinkStub_1 = '<li class="listing PROFESSOR">';
    var searchResponse_2;
    var no_Results_Msg = "Your search didn't return any results.";

	// has linkstub_1 and doesn't have "didn't return any"
    if (searchResponse_1.indexOf(profileLinkStub_1) !== -1 && searchResponse_1.indexOf(no_Results_Msg) === -1) {
    	searchResponse_2 = searchResponse_1.substring(searchResponse_1.indexOf(profileLinkStub_1));

	    var profileLinkStub_2 = '"';
	    var link_temp;
	    var link_final;

	    // has linkstub
	    if (searchResponse_2.indexOf(profileLinkStub_2) !== -1) {

			link_temp = searchResponse_2.substring(57, 100);
			link_final = link_temp.substring(0, link_temp.indexOf('"'));
	    	var link_final = "http://www.ratemyprofessors.com" + link_final;

	    	return scrapeProfInfo(link_final);

	    } 
	} else {
	    return "professor not found";
	}
	
}

function scrapeProfInfo(link) {
	
	var search_response;
	var no_Results_Msg = "Your search didn't return any results.";
    var profile_Info_Stub = '<div class="grade" title="">';
    var prof_info = {};

	try {
		search_response = makeXMLHttpRequest(link);
	} catch (err) {
		return "prof does not have scores info";
	}

    if (search_response.indexOf(profile_Info_Stub) !== -1 && search_response.indexOf(no_Results_Msg) === -1) {
    	var score_start_index = search_response.indexOf(profile_Info_Stub)+28;
    	var score_end_index = search_response.indexOf('<', score_start_index);
    	var score = search_response.substring(score_start_index, score_end_index);

    	var would_take_again_start_index = search_response.indexOf('<div class="grade" title="">', score_start_index)+28;
    	var would_take_again_end_index = search_response.indexOf('<', would_take_again_start_index);
    	var would_take_again = search_response.substring(would_take_again_start_index, would_take_again_end_index);

    	var difficulty_start_index = search_response.indexOf('<div class="grade" title="">', would_take_again_start_index)+28;
    	var difficulty_end_index = search_response.indexOf('<', difficulty_start_index);
    	var difficulty = search_response.substring(difficulty_start_index, difficulty_end_index);

    	prof_info["error"] = "none";
    	prof_info["score"] = score;
    	prof_info["would_take_again"] = would_take_again;
    	prof_info["difficulty"] = difficulty;
		prof_info["link"] = link;
		prof_info["test1"] = "N/A";
		return prof_info;
    } else {
    	return "prof does not have scores info";
    }
    
}

function makeXMLHttpRequest(url) {
    // make request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    xmlhttp.send();

    if (xmlhttp.status === 200) {
      return xmlhttp.responseText;
    }
}