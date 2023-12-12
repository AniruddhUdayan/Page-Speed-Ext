document.getElementById('checkSpeedButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: getPageSpeedData
        });
    });
});

function getPageSpeedData() {
    const startTime = window.performance.timing.navigationStart;
    const endTime = window.performance.timing.loadEventEnd;
    const loadTime = (endTime - startTime) / 1000;
    const pageSize = Math.round(window.performance.getEntriesByType("navigation")[0].transferSize / 1024);
    const speedScore = Math.round(100 - (loadTime * 5 + pageSize / 50));

    chrome.runtime.sendMessage({loadTime, pageSize, speedScore});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    document.getElementById('loadTime').textContent = request.loadTime;
    document.getElementById('pageSize').textContent = request.pageSize;
    document.getElementById('speedScore').textContent = request.speedScore;
    document.getElementById('results').style.display = 'block';
});
