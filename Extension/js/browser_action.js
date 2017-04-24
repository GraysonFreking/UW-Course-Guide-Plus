// Brings user to course guide in new tab on icon click
chrome.browserAction.onClicked.addListener(function(tab) {
    // Deprecated: Opens in current tab
    // chrome.tabs.update(tab.id, { url: "https://my.wisc.edu/portal/p/CourseGuide-Browse-Courses/detached/action.uP?pCm=view&pP_action=advancedSearch" });

    // Opens in new tab
    chrome.tabs.create({ url: "https://my.wisc.edu/portal/p/CourseGuide-Browse-Courses/detached/action.uP?pCm=view&pP_action=advancedSearch"});
});