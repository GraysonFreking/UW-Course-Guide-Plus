// Brings user to course guide on icon click
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.update(tab.id, { url: "https://my.wisc.edu/portal/p/CourseGuide-Browse-Courses/detached/action.uP?pCm=view&pP_action=advancedSearch" });
});