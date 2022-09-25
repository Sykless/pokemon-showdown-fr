chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    // Load all content script on first loading page
    // It could be cleaner to load the content script only when they are needed by checking the tab URL
    // However this would add loading times during app usage and I would rather avoid that
    if (changeInfo.status == "complete")
    {
        // Check if homeContentScript is already loaded
        chrome.tabs.sendMessage(tabId, {text: "isHomeContentScriptLoaded"}, function(msg)
        {
            // Basically catching an error sent by Chrome if we try to communicate with a non-existing element
            // The whole point of this sendMessage is to check wether the script exists or not,
            // So we will have to communicate with a non-existing element at some point
            if (chrome.runtime.lastError)
            
            // Check if we got an answer : if so, the script was already injected, so we do nothing
            msg = msg || {};
            if (msg.status != 'yes')
            {
                console.log("Injecting homeContentScript.js");

                chrome.scripting.executeScript({
                    target: {tabId: tabId, allFrames: false},
                    files: ['homeContentScript.js'],
                });
            }
        });

        // Check if teambuilderContentScript is already loaded
        chrome.tabs.sendMessage(tabId, {text: "isTeambuilderContentScriptLoaded"}, function(msg)
        {
            // Basically catching an error sent by Chrome if we try to communicate with a non-existing element
            // The whole point of this sendMessage is to check wether the script exists or not,
            // So we will have to communicate with a non-existing element at some point
            if (chrome.runtime.lastError)
            
            // Check if we got an answer : if so, the script was already injected, so we do nothing
            msg = msg || {};
            if (msg.status != 'yes')
            {
                console.log("Injecting teambuilderContentScript.js");

                chrome.scripting.executeScript({
                    target: {tabId: tabId, allFrames: false},
                    files: ['teambuilderContentScript.js'],
                });
            }
        });

        // Check if battleContentScript is already loaded
        chrome.tabs.sendMessage(tabId, {text: "isBattleContentScriptLoaded"}, function(msg)
        {
            // Basically catching an error sent by Chrome if we try to communicate with a non-existing element
            // The whole point of this sendMessage is to check wether the script exists or not,
            // So we will have to communicate with a non-existing element at some point
            if (chrome.runtime.lastError)
            
            // Check if we got an answer : if so, the script was already injected, so we do nothing
            msg = msg || {};
            if (msg.status != 'yes')
            {
                console.log("Injecting battleContentScript.js");

                chrome.scripting.executeScript({
                    target: {tabId: tabId, allFrames: false},
                    files: ['battleContentScript.js'],
                });
            }
        });
    }
 });