chrome.tabs.getSelected(null, function(tab) {
    chrome.extension.getBackgroundPage().console.log(tab.url);
});