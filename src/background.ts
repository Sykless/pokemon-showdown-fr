chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == "complete")
    {
        if (tab.url == "https://play.pokemonshowdown.com/teambuilder")
        {
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
        }
        else if (tab.url?.includes("https://play.pokemonshowdown.com/battle"))
        {
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
    }
 });