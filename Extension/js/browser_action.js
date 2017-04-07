// Brings user to course guide on icon click
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.update(tab.id, { url: "https://my.wisc.edu/portal/f/u360303l1s4/p/CourseGuide-Browse-Courses.u360303l1n15/detached/render.uP?pCm=view&pP_action=advancedSearch&pP_form-submit=true" });
});