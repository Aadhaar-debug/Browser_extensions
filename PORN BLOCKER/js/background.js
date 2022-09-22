chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install" || details.reason == "update") {
        chrome.storage.local.set({
            t: new Date()
                .getTime()
        });
    }
});