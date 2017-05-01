
// set up listener for messages from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.action) {
        case "getAverageGPA":
            sendResponse(getAverageGPA(request.course));
            break;
        case "getRmpScores":
	        sendResponse(getRmpScores(request.professor));
	        break;
        case "getLocationLinks":
	        sendResponse(getLocationLinks(request.locations, request.index));
	        break;
        case "getDistribution":
	        sendResponse(getDistribution(request.course, request.count));
            break;
    }
  }
);


function getAverageGPA(course) {
    return findAverageGPA(course).courseGPA;
}


function getRmpScores(profName) {
    var prof_info = searchForProf(profName);

    if (prof_info == "professor not found" || prof_info == "bad search request") {
        if (profName.indexOf("-") > 0) {
            prof_info = formatNameWithDash(profName);
        } else if (profName.split(", ")[1].indexOf(" ") > 0) {
            prof_info = formatNameWithSpace(profName);
        } else {
            prof_info = tryNickNames(profName);
        }
    }

    return prof_info;
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

        var number_of_ratings_start_index = search_response.indexOf('rating-count') + 56;
        var number_of_ratings_end_index = search_response.indexOf(' ', number_of_ratings_start_index);
        var number_of_ratings = search_response.substring(number_of_ratings_start_index, number_of_ratings_end_index);

        var stub1 = search_response.indexOf('rating-count') + 57;
        var stub2 = search_response.indexOf('Student Ratings') - 1;
        var number_of_ratings = search_response.substring(stub1, stub2);
        //console.log(number_of_ratings + "length is " + number_of_ratings.length);

        prof_info["error"] = "none";
        prof_info["score"] = score;
        prof_info["would_take_again"] = would_take_again;
        prof_info["difficulty"] = difficulty;
        prof_info["number_of_ratings"] = number_of_ratings;
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

function formatNameWithDash(profName) {
    var first_name = profName.split(", ")[1];
    var last_name = profName.split(", ")[0];
    if (last_name.indexOf("-")) {
        last_name = last_name.split("-")[0];
    }
    return searchForProf(last_name + ", " + first_name);
}

function formatNameWithSpace(profName) {
    var first_name = profName.split(", ")[1];
    var last_name = profName.split(", ")[0];

    var tempInfo = searchForProf(last_name + ", " + first_name.split(" ")[0]);
    if (tempInfo != "professor not found" && tempInfo != "bad search request") {
        return tempInfo;
    }

    tempInfo = searchForProf(last_name + ", " + first_name.split(" ")[1]);
    if (tempInfo != "professor not found" && tempInfo != "bad search request") {
        return tempInfo;
    }

    tempInfo = searchForProf(last_name + ", " + last_name.split(" ")[1]);
    if (tempInfo != "professor not found" && tempInfo != "bad search request") {
        return tempInfo;
    }

    tempInfo = searchForProf(last_name + ", " + last_name.split(" ")[1]);
    if (tempInfo != "professor not found" && tempInfo != "bad search request") {
        return tempInfo;
    }

    return "professor not found";
}

function tryNickNames(profName) {
    var nickNames = [{"name":"ABIGAIL","nickName":"ABBIE"},{"name":"ABIGAIL","nickName":"ABBY"},{"name":"ABRAHAM","nickName":"ABE"},{"name":"ABRAM","nickName":"ABE"},{"name":"ADALINE","nickName":"ADA"},{"name":"ADALINE","nickName":"ADDY"},{"name":"AGATHA","nickName":"AGGY"},{"name":"AGNES","nickName":"AGGY"},{"name":"AUGUSTA","nickName":"AGGY"},{"name":"AUGUSTINA","nickName":"AGGY"},{"name":"ALAN","nickName":"AL"},{"name":"ALBERT","nickName":"AL"},{"name":"ALDO","nickName":"AL"},{"name":"ALEXANDER","nickName":"AL"},{"name":"ALFONSE","nickName":"AL"},{"name":"ALFRED","nickName":"AL"},{"name":"ALLAN","nickName":"AL"},{"name":"ALLEN","nickName":"AL"},{"name":"ALONZO","nickName":"AL"},{"name":"ALEXANDER","nickName":"ALEX"},{"name":"ALEXANDRA","nickName":"ALEX"},{"name":"ALICE","nickName":"ALLIE"},{"name":"ALICIA","nickName":"ALLIE"},{"name":"ALMENA","nickName":"ALLIE"},{"name":"ANDERSON","nickName":"ANDY"},{"name":"ANDREW","nickName":"ANDY"},{"name":"ANTOINETTE","nickName":"ANN"},{"name":"ANTONIA","nickName":"ANN"},{"name":"ROSAENN","nickName":"ANN"},{"name":"ROSAENNA","nickName":"ANN"},{"name":"ROXANNE","nickName":"ANN"},{"name":"ROXANNA","nickName":"ANN"},{"name":"ANN","nickName":"ANNIE"},{"name":"ANNE","nickName":"ANNIE"},{"name":"ARABELLA","nickName":"ARA"},{"name":"ARABELLE","nickName":"ARA"},{"name":"ARCHIBALD","nickName":"ARCHIE"},{"name":"ARLENE","nickName":"ARLY"},{"name":"ARTHUR","nickName":"ART"},{"name":"BARBARA","nickName":"BABS"},{"name":"BARBARA","nickName":"BARBIE"},{"name":"BARNABAS","nickName":"BARNEY"},{"name":"BERNARD","nickName":"BARNEY"},{"name":"BARTHOLOMEW","nickName":"BART"},{"name":"BEATRICE","nickName":"BEA"},{"name":"REBECCA","nickName":"BECCA"},{"name":"REBECCA","nickName":"BECKY"},{"name":"ARABELLA","nickName":"BELLA"},{"name":"ISABELLA","nickName":"BELLA"},{"name":"ROSABELLA","nickName":"BELLA"},{"name":"ARABELLA","nickName":"BELLE"},{"name":"BELINDA","nickName":"BELLE"},{"name":"ISABEL","nickName":"BELLE"},{"name":"ISABELLE","nickName":"BELLE"},{"name":"ROSABEL","nickName":"BELLE"},{"name":"BENEDICT","nickName":"BEN"},{"name":"BENJAMIN","nickName":"BEN"},{"name":"BENJAMIN","nickName":"BENJY"},{"name":"BENEDICT","nickName":"BENNIE"},{"name":"BERNARD","nickName":"BERNY"},{"name":"ALBERT","nickName":"BERT"},{"name":"DELBERT","nickName":"BERT"},{"name":"ELBERT","nickName":"BERT"},{"name":"GILBERT","nickName":"BERT"},{"name":"HERBERT","nickName":"BERT"},{"name":"HUBERT","nickName":"BERT"},{"name":"NORBERT","nickName":"BERT"},{"name":"ELIZABETH","nickName":"BESS"},{"name":"ELIZABETH","nickName":"BETH"},{"name":"ELIZABETH","nickName":"BETSY"},{"name":"ELIZABETH","nickName":"BETTY"},{"name":"ROBERT","nickName":"BILL"},{"name":"WILLIAM","nickName":"BILL"},{"name":"ROBERT","nickName":"BILLY"},{"name":"WILLIAM","nickName":"BILLY"},{"name":"BERTHA","nickName":"BIRDIE"},{"name":"ROBERTA","nickName":"BIRDIE"},{"name":"ROBERTA","nickName":"BIRTIE"},{"name":"ROBERT","nickName":"BOB"},{"name":"BARBARA","nickName":"BOBBIE"},{"name":"ROBERTA","nickName":"BOBBIE"},{"name":"ROBERT","nickName":"BOBBY"},{"name":"BRADFORD","nickName":"BRAD"},{"name":"BRODERICK","nickName":"BRODY"},{"name":"CALVIN","nickName":"CAL"},{"name":"CAMILE","nickName":"CAMMIE"},{"name":"CHARLES","nickName":"CARL"},{"name":"CAROLANN","nickName":"CAROL"},{"name":"CAROLINE","nickName":"CAROL"},{"name":"CAROLINE","nickName":"CASSIE"},{"name":"CASSANDRA","nickName":"CASSIE"},{"name":"CATHERINE","nickName":"CASSIE"},{"name":"CATHLEEN","nickName":"CASSIE"},{"name":"CATHERINE","nickName":"CATHY"},{"name":"CATHLEEN","nickName":"CATHY"},{"name":"CHARLES","nickName":"CHARLIE"},{"name":"CHESTER","nickName":"CHET"},{"name":"CHRISTA","nickName":"CHRIS"},{"name":"CHRISTIAN","nickName":"CHRIS"},{"name":"CHRISTINA","nickName":"CHRIS"},{"name":"CHRISTINE","nickName":"CHRIS"},{"name":"CHRISTOPHER","nickName":"CHRIS"},{"name":"KRISTEN","nickName":"CHRIS"},{"name":"KRISTIN","nickName":"CHRIS"},{"name":"KRISTY","nickName":"CHRIS"},{"name":"CHARLES","nickName":"CHUCK"},{"name":"CINDERLLA","nickName":"CINDY"},{"name":"CYNTHIA","nickName":"CINDY"},{"name":"CLARISSA","nickName":"CLARA"},{"name":"CLIFFORD","nickName":"CLIFF"},{"name":"CLIFTON","nickName":"CLIFF"},{"name":"CONSTANCE","nickName":"CONNIE"},{"name":"CHRINTINA","nickName":"CRISSY"},{"name":"CHRINTINE","nickName":"CRISSY"},{"name":"CURTIS","nickName":"CURT"},{"name":"CYRUS","nickName":"CY"},{"name":"DANIEL","nickName":"DAN"},{"name":"DANIEL","nickName":"DANNY"},{"name":"DAVID","nickName":"DAVE"},{"name":"DAVID","nickName":"DAVEY"},{"name":"DEBORAH","nickName":"DEB"},{"name":"DEBRA","nickName":"DEB"},{"name":"DEBORAH","nickName":"DEBBIE"},{"name":"DEBRA","nickName":"DEBBIE"},{"name":"DELORES","nickName":"DEE"},{"name":"DELBERT","nickName":"DEL"},{"name":"DELORES","nickName":"DELLA"},{"name":"DENNIS","nickName":"DENNIE"},{"name":"DENNISON","nickName":"DENNIS"},{"name":"DENNIS","nickName":"DENNY"},{"name":"RICHARD","nickName":"DICK"},{"name":"DOROTHY","nickName":"DOLLY"},{"name":"DOMENIC","nickName":"DOM"},{"name":"DOMINICO","nickName":"DOM"},{"name":"DONALD","nickName":"DON"},{"name":"DONATO","nickName":"DON"},{"name":"DONALD","nickName":"DONNIE"},{"name":"DONALD","nickName":"DONNY"},{"name":"DOROTHY","nickName":"DORA"},{"name":"ELDORA","nickName":"DORA"},{"name":"ISADORA","nickName":"DORA"},{"name":"DOROTHY","nickName":"DOT"},{"name":"DOROTHY","nickName":"DOTTIE"},{"name":"DOROTHY","nickName":"DOTTY"},{"name":"ANDREW","nickName":"DREW"},{"name":"EDGAR","nickName":"ED"},{"name":"EDMOND","nickName":"ED"},{"name":"EDMUND","nickName":"ED"},{"name":"EDUARDO","nickName":"ED"},{"name":"EDWARD","nickName":"ED"},{"name":"EDWIN","nickName":"ED"},{"name":"EDGAR","nickName":"EDDIE"},{"name":"EDMOND","nickName":"EDDIE"},{"name":"EDMUND","nickName":"EDDIE"},{"name":"EDUARDO","nickName":"EDDIE"},{"name":"EDWARD","nickName":"EDDIE"},{"name":"EDWIN","nickName":"EDDIE"},{"name":"EDGAR","nickName":"EDDY"},{"name":"EDMOND","nickName":"EDDY"},{"name":"EDMUND","nickName":"EDDY"},{"name":"EDUARDO","nickName":"EDDY"},{"name":"EDWARD","nickName":"EDDY"},{"name":"EDWIN","nickName":"EDDY"},{"name":"EDITH","nickName":"EDIE"},{"name":"EDYTH","nickName":"EDIE"},{"name":"EDYTHE","nickName":"EDIE"},{"name":"EDYTH","nickName":"EDYE"},{"name":"EDYTHE","nickName":"EDYE"},{"name":"ELEANOR","nickName":"ELAINE"},{"name":"GABRIELLA","nickName":"ELLA"},{"name":"ELEANOR","nickName":"ELLEN"},{"name":"AMELIA","nickName":"EMILY"},{"name":"EMELINE","nickName":"EMILY"},{"name":"EMELINE","nickName":"EMMA"},{"name":"EMILY","nickName":"EMMA"},{"name":"GENEVIEVE","nickName":"EVE"},{"name":"FAITH","nickName":"FAY"},{"name":"FLORENCE","nickName":"FLO"},{"name":"FLORENCE","nickName":"FLORA"},{"name":"FRANCES","nickName":"FRAN"},{"name":"FRANCINE","nickName":"FRAN"},{"name":"FRANCIS","nickName":"FRAN"},{"name":"FRANCES","nickName":"FRANCIE"},{"name":"FRANCINE","nickName":"FRANCIE"},{"name":"FRANCIS","nickName":"FRANK"},{"name":"FRANKLIN","nickName":"FRANK"},{"name":"FRANCIS","nickName":"FRANKIE"},{"name":"FRANCES","nickName":"FRANNIE"},{"name":"FRANCINE","nickName":"FRANNIE"},{"name":"FRANCES","nickName":"FRANNY"},{"name":"FRANCINE","nickName":"FRANNY"},{"name":"ALFRED","nickName":"FRED"},{"name":"FERDINAND","nickName":"FRED"},{"name":"FREDERICK","nickName":"FRED"},{"name":"FRIEDA","nickName":"FRED"},{"name":"WINNIFRED","nickName":"FRED"},{"name":"ALFREDA","nickName":"FREDA"},{"name":"FREDERICKA","nickName":"FREDA"},{"name":"FERDINAND","nickName":"FREDDIE"},{"name":"FREDERICK","nickName":"FREDDIE"},{"name":"FRIEDA","nickName":"FREDDIE"},{"name":"WINNIFRED","nickName":"FREDDIE"},{"name":"ALFREDA","nickName":"FREDDY"},{"name":"FERDINAND","nickName":"FREDDY"},{"name":"FREDERICK","nickName":"FREDDY"},{"name":"FRIEDA","nickName":"FREDDY"},{"name":"WINNIFRED","nickName":"FREDDY"},{"name":"GABRIELLA","nickName":"GABBY"},{"name":"GABRIELLE","nickName":"GABBY"},{"name":"GABRIEL","nickName":"GABE"},{"name":"ABIGAIL","nickName":"GAIL"},{"name":"EUGENE","nickName":"GENE"},{"name":"GEOFFREY","nickName":"GEOFF"},{"name":"JEFFREY","nickName":"GEOFF"},{"name":"GERALDINE","nickName":"GERRIE"},{"name":"GERALD","nickName":"GERRY"},{"name":"GERALDINE","nickName":"GERRY"},{"name":"GERTRUDE","nickName":"GERTIE"},{"name":"GILBERT","nickName":"GIL"},{"name":"REGINA","nickName":"GINA"},{"name":"MARGARETTA","nickName":"GRETTA"},{"name":"AUGUSTINE","nickName":"GUS"},{"name":"AUGUSTUS","nickName":"GUS"},{"name":"GWENDOLYN","nickName":"GWEN"},{"name":"HAROLD","nickName":"HAL"},{"name":"HENRY","nickName":"HAL"},{"name":"HENRY","nickName":"HANK"},{"name":"JOHANNAH","nickName":"HANNAH"},{"name":"HAROLD","nickName":"HARRY"},{"name":"HENRY","nickName":"HARRY"},{"name":"HARRIET","nickName":"HATTIE"},{"name":"HENRIETTA","nickName":"HENNY"},{"name":"HERBERT","nickName":"HERB"},{"name":"HESTER","nickName":"HETTY"},{"name":"HIPSBIBAH","nickName":"HIPSIE"},{"name":"HUBERT","nickName":"HUGH"},{"name":"IGNATIUS","nickName":"IGGY"},{"name":"ISABEL","nickName":"ISSY"},{"name":"ISABELLA","nickName":"ISSY"},{"name":"ISABELLE","nickName":"ISSY"},{"name":"ISADORA","nickName":"ISSY"},{"name":"ISADORE","nickName":"IZZY"},{"name":"JACOB","nickName":"JAKE"},{"name":"BENJAMIN","nickName":"JAMIE"},{"name":"JAMES","nickName":"JAMIE"},{"name":"JANET","nickName":"JAN"},{"name":"JACOB","nickName":"JAY"},{"name":"GENEVIEVE","nickName":"JEAN"},{"name":"JEBADIAH","nickName":"JEB"},{"name":"GEOFFREY","nickName":"JEFF"},{"name":"JEFFERSON","nickName":"JEFF"},{"name":"JEFFREY","nickName":"JEFF"},{"name":"JENNIFER","nickName":"JENNIE"},{"name":"JENNIFER","nickName":"JENNY"},{"name":"GENEVIEVE","nickName":"JENNY"},{"name":"GERALD","nickName":"JERRY"},{"name":"GERALDINE","nickName":"JERRY"},{"name":"JEREMIAH","nickName":"JERRY"},{"name":"JESSICA","nickName":"JESSIE"},{"name":"JAMES","nickName":"JIM"},{"name":"JAMES","nickName":"JIMMIE"},{"name":"JAMES","nickName":"JIMMY"},{"name":"JOAN","nickName":"JO"},{"name":"JOANN","nickName":"JO"},{"name":"JOANNA","nickName":"JO"},{"name":"JOANNE","nickName":"JO"},{"name":"JOHANNA","nickName":"JO"},{"name":"JOHANNAH","nickName":"JO"},{"name":"JOSOPHINE","nickName":"JO"},{"name":"JOSEPH","nickName":"JODY"},{"name":"JOSEPH","nickName":"JOE"},{"name":"JOSHUA","nickName":"JOE"},{"name":"JOSEPH","nickName":"JOEY"},{"name":"JOSOPHINE","nickName":"JOEY"},{"name":"JOHANN","nickName":"JOHN"},{"name":"JONATHAN","nickName":"JOHN"},{"name":"JONATHAN","nickName":"JON"},{"name":"JOSOPHINE","nickName":"JOSEY"},{"name":"JOSHUA","nickName":"JOSH"},{"name":"JOYCE","nickName":"JOY"},{"name":"JUDITH","nickName":"JUDY"},{"name":"JULIA","nickName":"JULIE"},{"name":"KATELIN","nickName":"KATE"},{"name":"KATELYN","nickName":"KATE"},{"name":"KATHERINE","nickName":"KATE"},{"name":"KATHERINE","nickName":"KATHY"},{"name":"KATHLEEN","nickName":"KATHY"},{"name":"KATHRYN","nickName":"KATHY"},{"name":"KATHERINE","nickName":"KATY"},{"name":"KATHLEEN","nickName":"KATY"},{"name":"KATELIN","nickName":"KAY"},{"name":"KATELYN","nickName":"KAY"},{"name":"KATHERINE","nickName":"KAY"},{"name":"KATELIN","nickName":"KAYE"},{"name":"KATELYN","nickName":"KAYE"},{"name":"KATHERINE","nickName":"KAYE"},{"name":"KENNETH","nickName":"KEN"},{"name":"KENNETH","nickName":"KENNY"},{"name":"KIMBERLEY","nickName":"KIM"},{"name":"KIMBERLY","nickName":"KIM"},{"name":"LAURENCE","nickName":"LARRY"},{"name":"LAWRENCE","nickName":"LARRY"},{"name":"ELIAS","nickName":"LEE"},{"name":"AILEEN","nickName":"LENA"},{"name":"ARLENE","nickName":"LENA"},{"name":"CATHLEEN","nickName":"LENA"},{"name":"DARLENE","nickName":"LENA"},{"name":"KATHLEEN","nickName":"LENA"},{"name":"MAGDELINA","nickName":"LENA"},{"name":"LEONARD","nickName":"LENNY"},{"name":"LEONARD","nickName":"LEO"},{"name":"LEONARD","nickName":"LEON"},{"name":"NAPOLEON","nickName":"LEON"},{"name":"LESTER","nickName":"LES"},{"name":"ELIZABETH","nickName":"LIBBY"},{"name":"LILLIAN","nickName":"LILLY"},{"name":"BELINDA","nickName":"LINDA"},{"name":"MELINDA","nickName":"LINDA"},{"name":"MELISSA","nickName":"LISA"},{"name":"ELIZABETH","nickName":"LIZ"},{"name":"ELIZABETH","nickName":"LIZZIE"},{"name":"LOUISE","nickName":"LOIS"},{"name":"LORETTA","nickName":"LORIE"},{"name":"LORRAINE","nickName":"LORIE"},{"name":"LOUIS","nickName":"LOU"},{"name":"LOUISE","nickName":"LOU"},{"name":"LUCINDA","nickName":"LOU"},{"name":"LUCINDA","nickName":"LUCY"},{"name":"LUCAS","nickName":"LUKE"},{"name":"LUCIAS","nickName":"LUKE"},{"name":"CAROLINE","nickName":"LYNN"},{"name":"CAROLYN","nickName":"LYNN"},{"name":"MADELINE","nickName":"MADDY"},{"name":"MADELYN","nickName":"MADDY"},{"name":"MAGDELINA","nickName":"MADGE"},{"name":"MARGARETTA","nickName":"MADGE"},{"name":"MADELINE","nickName":"MADIE"},{"name":"MADELYN","nickName":"MADIE"},{"name":"MADELINE","nickName":"MAGGIE"},{"name":"MAGDELINA","nickName":"MAGGIE"},{"name":"MARGARET","nickName":"MAGGIE"},{"name":"MARGARET","nickName":"MAGGY"},{"name":"AMANDA","nickName":"MANDY"},{"name":"MARGARET","nickName":"MARGE"},{"name":"MARGARETTA","nickName":"MARGE"},{"name":"MARGARET","nickName":"MARGIE"},{"name":"MARJORIE","nickName":"MARGIE"},{"name":"MARGARET","nickName":"MARGY"},{"name":"MARJORIE","nickName":"MARGY"},{"name":"MARCUS","nickName":"MARK"},{"name":"MARTIN","nickName":"MARTY"},{"name":"MARVIN","nickName":"MARV"},{"name":"MATHEW","nickName":"MATT"},{"name":"MATTHEW","nickName":"MATT"},{"name":"MADELINE","nickName":"MAUD"},{"name":"MELINDA","nickName":"MEL"},{"name":"MELISSA","nickName":"MEL"},{"name":"MERVIN","nickName":"MERV"},{"name":"MICHAEL","nickName":"MICK"},{"name":"MICHAEL","nickName":"MICKEY"},{"name":"MICHAEL","nickName":"MIKE"},{"name":"MELINDA","nickName":"MINDY"},{"name":"WILHELMINA","nickName":"MINNIE"},{"name":"MELISSA","nickName":"MISSY"},{"name":"MITCHELL","nickName":"MITCH"},{"name":"LAMONT","nickName":"MONTY"},{"name":"NATHANIEL","nickName":"NAT"},{"name":"NATHAN","nickName":"NATE"},{"name":"NATHANIEL","nickName":"NATE"},{"name":"JONATHAN","nickName":"NATHAN"},{"name":"CORNELIUS","nickName":"NEIL"},{"name":"NEWTON","nickName":"NEWT"},{"name":"NICHOLAS","nickName":"NICK"},{"name":"NICHOLAS","nickName":"NICKIE"},{"name":"ELEANOR","nickName":"NORA"},{"name":"LENORA","nickName":"NORA"},{"name":"OBEDIAH","nickName":"OBIE"},{"name":"OLIVER","nickName":"OLLIE"},{"name":"OSWALD","nickName":"OZZY"},{"name":"PATRICIA","nickName":"PAT"},{"name":"PATRICK","nickName":"PAT"},{"name":"PATRICIA","nickName":"PATSY"},{"name":"PATRICIA","nickName":"PATTY"},{"name":"MARGARET","nickName":"PEGGY"},{"name":"PENELOPE","nickName":"PENNY"},{"name":"PETER","nickName":"PETE"},{"name":"PHILIP","nickName":"PHIL"},{"name":"PHILLIP","nickName":"PHIL"},{"name":"PAULINA","nickName":"POLLY"},{"name":"PRISCILLA","nickName":"PRISSY"},{"name":"PRUDENCE","nickName":"PRUDY"},{"name":"RANDOLPH","nickName":"RANDY"},{"name":"RAYMOND","nickName":"RAY"},{"name":"REBECCA","nickName":"REBA"},{"name":"REGINALD","nickName":"REGGIE"},{"name":"IRENE","nickName":"RENA"},{"name":"ALDRICH","nickName":"RICH"},{"name":"RICHARD","nickName":"RICH"},{"name":"ALDRICH","nickName":"RICHIE"},{"name":"RICHARD","nickName":"RICHIE"},{"name":"DERICK","nickName":"RICK"},{"name":"RICARDO","nickName":"RICK"},{"name":"RICHARD","nickName":"RICK"},{"name":"BRODERICK","nickName":"RICKY"},{"name":"DERICK","nickName":"RICKY"},{"name":"RICHARD","nickName":"RICKY"},{"name":"ROBERT","nickName":"ROB"},{"name":"ROBERTO","nickName":"ROB"},{"name":"ROBERT","nickName":"ROBBY"},{"name":"BRODERICK","nickName":"ROD"},{"name":"AARON","nickName":"RON"},{"name":"RONALD","nickName":"RON"},{"name":"VERONICA","nickName":"RON"},{"name":"AARON","nickName":"RONNIE"},{"name":"RONALD","nickName":"RONNIE"},{"name":"VERONICA","nickName":"RONNIE"},{"name":"RONALD","nickName":"RONNY"},{"name":"VERONICA","nickName":"RONNY"},{"name":"ROSABEL","nickName":"ROSE"},{"name":"ROSABELLA","nickName":"ROSE"},{"name":"ROSALYN","nickName":"ROSE"},{"name":"ROSEANN","nickName":"ROSE"},{"name":"ROSEANNA","nickName":"ROSE"},{"name":"ROXANNA","nickName":"ROSE"},{"name":"ROXANNE","nickName":"ROSE"},{"name":"ROSABEL","nickName":"ROZ"},{"name":"ROSABELLA","nickName":"ROZ"},{"name":"ROSALYN","nickName":"ROZ"},{"name":"REUBEN","nickName":"RUBE"},{"name":"RUDOLPH","nickName":"RUDY"},{"name":"RUSSELL","nickName":"RUSS"},{"name":"RUSSELL","nickName":"RUSTY"},{"name":"SOLOMON","nickName":"SAL"},{"name":"SAMUEL","nickName":"SAM"},{"name":"SAMUEL","nickName":"SAMMY"},{"name":"CASSANDRA","nickName":"SANDRA"},{"name":"CASSANDRA","nickName":"SANDY"},{"name":"SANDRA","nickName":"SANDY"},{"name":"PRESCOTT","nickName":"SCOTT"},{"name":"PRESCOTT","nickName":"SCOTTY"},{"name":"MICHELLE","nickName":"SHELLY"},{"name":"RACHEL","nickName":"SHELLY"},{"name":"SHELTON","nickName":"SHELLY"},{"name":"SHIRLEY","nickName":"SHERRY"},{"name":"SYLVESTER","nickName":"SLY"},{"name":"ESTELLA","nickName":"STELLA"},{"name":"STEPHEN","nickName":"STEPH"},{"name":"STEVEN","nickName":"STEPH"},{"name":"STEPHEN","nickName":"STEVE"},{"name":"STEVEN","nickName":"STEVE"},{"name":"SUSAN","nickName":"SUE"},{"name":"SUSANNAH","nickName":"SUE"},{"name":"SULLIVAN","nickName":"SULLY"},{"name":"SUSAN","nickName":"SUSIE"},{"name":"SUSANNAH","nickName":"SUSIE"},{"name":"TABITHA","nickName":"TABBY"},{"name":"THEODORE","nickName":"TED"},{"name":"THEODORE","nickName":"TEDDY"},{"name":"TERENCE","nickName":"TERRY"},{"name":"TERESA","nickName":"TESS"},{"name":"THERESA","nickName":"TESS"},{"name":"TERESA","nickName":"TESSA"},{"name":"THERESA","nickName":"TESSA"},{"name":"TERESA","nickName":"TESSIE"},{"name":"THERESA","nickName":"TESSIE"},{"name":"THADDEUS","nickName":"THAD"},{"name":"THEODORE","nickName":"THEO"},{"name":"THOMAS","nickName":"THOM"},{"name":"MATILDA","nickName":"TILLA"},{"name":"TIMOTHY","nickName":"TIM"},{"name":"TIMOTHY","nickName":"TIMMY"},{"name":"AUGUSTINA","nickName":"TINA"},{"name":"CHRISTINA","nickName":"TINA"},{"name":"MARTINA","nickName":"TINA"},{"name":"LATISHA","nickName":"TISH"},{"name":"TISHA","nickName":"TISH"},{"name":"LATISHA","nickName":"TISHA"},{"name":"TOBIAS","nickName":"TOBY"},{"name":"THOM","nickName":"TOM"},{"name":"THOMAS","nickName":"TOM"},{"name":"THOM","nickName":"TOMMY"},{"name":"THOMAS","nickName":"TOMMY"},{"name":"ANTHONY","nickName":"TONY"},{"name":"SHELTON","nickName":"TONY"},{"name":"VICTORIA","nickName":"TORI"},{"name":"VICTORIA","nickName":"TORIE"},{"name":"VICTORIA","nickName":"TORRI"},{"name":"VICTORIA","nickName":"TORRIE"},{"name":"VICTORIA","nickName":"TORY"},{"name":"PATRICIA","nickName":"TRISHA"},{"name":"BEATRICE","nickName":"TRIXIE"},{"name":"GERTRUDE","nickName":"TRUDY"},{"name":"VALERI","nickName":"VAL"},{"name":"VALERIE","nickName":"VAL"},{"name":"SULLIVAN","nickName":"VAN"},{"name":"VANESSA","nickName":"VANNA"},{"name":"VICTOR","nickName":"VIC"},{"name":"VINCENT","nickName":"VIC"},{"name":"VINCENZON","nickName":"VIC"},{"name":"VICTORIA","nickName":"VICKI"},{"name":"VICTORIA","nickName":"VICKIE"},{"name":"VICTORIA","nickName":"VICKY"},{"name":"VINCENT","nickName":"VIN"},{"name":"VINCENZO","nickName":"VIN"},{"name":"VINCENT","nickName":"VINCE"},{"name":"VINSON","nickName":"VINCE"},{"name":"VINCENT","nickName":"VINNIE"},{"name":"VINCENZO","nickName":"VINNIE"},{"name":"OSWALD","nickName":"WALDO"},{"name":"GWENDOLYN","nickName":"WENDY"},{"name":"GILBERT","nickName":"WILBER"},{"name":"WILBUR","nickName":"WILL"},{"name":"WILLIAM","nickName":"WILL"},{"name":"WILSON","nickName":"WILL"},{"name":"WILBUR","nickName":"WILLIE"},{"name":"WILLIAM","nickName":"WILLIE"},{"name":"WILSON","nickName":"WILLIE"},{"name":"WILHELMINA","nickName":"WILMA"},{"name":"WINNIFRED","nickName":"WINNIE"},{"name":"WINNIFRED","nickName":"WINNY"},{"name":"ELWOOD","nickName":"WOODY"},{"name":"ZACHARIAH","nickName":"ZACH"}];
    var first_name = profName.split(", ")[1];
    var last_name = profName.split(", ")[0];
    for (var i=0; i<nickNames.length; i++) {
        if (nickNames[i].name.toLowerCase() == first_name.toLowerCase()) {
            var tryName = searchForProf(last_name + ", " + nickNames[i].nickName);
            if (tryName != "professor not found" && tryName != "bad search request") {
                return tryName;
            }
        }
    }

    return "professor not found";
}


function getLocationLinks(locations, index) {
    var result =  getMap(locations);
    //Used in adding text to link.
    result['name'] = locations;
    //Used for adding breakpoints
    result['index'] = index;
    return result;
}


function getDistribution(course, count) {
	// TODO: worry about specific count when we have more in db
	return getDistributions(course);
}

function getDistributionsByProfessor(course, professor) {
    // TODO: Wasn't in original planning docs, but this is necessary at some point for the by-professor charts on the course pages
}
