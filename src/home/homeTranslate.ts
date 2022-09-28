import { translateLogMessage, translateMenu, translatePokemonTeam, translateRegexLogMessage, translateRegexMessage } from "../translator";

console.log("HomeTranslate successfully loaded !");

// Create a MutationObserver element in order to track every page change
// So we can it dynamically translate new content
var observer = new MutationObserver(onMutation);

observer.observe(document, {
	childList: true, // report added/removed nodes
	subtree: true,   // observe any descendant elements
});

translateHomePage();

// Everytime a new element is added to the page, onMutation method is called
function onMutation(mutations: MutationRecord[])
{
	// Iterate over every mutated nodes
	for (var i = 0, len = mutations.length; i < len ; i++)
	{		
		// console.log(mutations[i]);

		if (mutations[i].type == "childList")
		{
			var newNodes = mutations[i].addedNodes;

			for (var j = 0, node; (node = newNodes[j]); j++)
			{
				var newElement = node as Element;
                var parentElement = mutations[i].target as Element;
                var translatedElement = true;

				console.log(newElement.outerHTML);

                if (newElement.classList)
                {
                    // Tier has been updated
                    if (newElement.classList.contains("teamselect"))
                    {
                        // Translate team name
                        updatePokemonTeamName(newElement);
                    }
                    // New window has ben opened
                    if (newElement.classList.contains("pm-window"))
                    {
                        // Translate window content
                        updateWindow(newElement);
                    }
                    // Chat message has been received
                    if (newElement.classList.contains("chat"))
                    {
                        // Translate log message (don't change chat message)
                        updateChatMessage(newElement);
                    }
                    // Challenge has been received
                    else if (newElement.className == "challenge" && newElement.firstElementChild) 
                    {
                        // Update challenge request
                        updateMainButton(newElement.firstElementChild);
                    }
                    else
                    {
                        translatedElement = false;
                        // console.log("Non-processed nodes : " + newElement.outerHTML);
                    }
                }
                else {
                    translatedElement = false;
                }

                if (parentElement.classList && !translatedElement)
                {
                    // Translate menu button labels
                    if (parentElement.classList.contains("mainmenu1"))
                    {
                        if (newElement.textContent) {
                            newElement.textContent = translateMenu(newElement.textContent);
                        }
                    }
                    // A Menugroup has been added
                    if (parentElement.classList.contains("menugroup"))
                    {
                        // Translate team name
                        updateMenuGroup(newElement);
                    }
                    // Background has been changed
                    else if (parentElement.className == "bgcredit")
                    {
                        // Update Credits
                        updateBackgroundCredit(newElement);
                    }
                    // Room updated
                    else if (parentElement.className == "inner" && newElement.tagName == "UL")
                    {
                        // Translate room name
                        updateRoomName(newElement);
                    }
                    // Team selection has been updated
                    if (parentElement.classList.contains("teamselect"))
                    {
                        // Translate team name
                        updatePokemonTeamName(parentElement);
                    }
                }
			}
		}
	}
}

function translateHomePage()
{
	var mainMenu = document.getElementsByClassName("mainmenuwrapper");

	// mainMenu should always be present, but if it's not, the MutationObserver will handle the page creation
	if (!mainMenu || mainMenu.length <= 0) {
		return;
	}

    mainMenu[0].childNodes.forEach(function (sideMenuNode) {
        var sideMenuElement = sideMenuNode as Element;

        // Battle/Teambuilder/Ladder/News
        if (sideMenuElement.className == "leftmenu")
        {
            sideMenuElement.childNodes.forEach(function (leftMenuNode) {
                var leftMenuElement = leftMenuNode as Element;

                // Battle/Teambuilder/Ladder/WatchBattle/FindUser
                if (leftMenuElement.className == "mainmenu")
                {
                    // Menugroup
                    leftMenuElement.childNodes.forEach(function (menuGroupNode) {
                        updateMenuGroup(menuGroupNode as Element);
                    })
                }
                // News
                else if (leftMenuElement.className == "activitymenu")
                {
                    
                }
            })
        }
        // Empty space if chat rooms are hidden
        else if (sideMenuElement.className == "rightmenu")
        {
            // Button the only element is within three tags layers
            var joinChatButton = sideMenuElement.firstChild?.firstChild?.firstChild as Element;
            
            if (joinChatButton.tagName == "BUTTON" && joinChatButton.textContent) {
                joinChatButton.textContent = translateMenu(joinChatButton.textContent);
            }
        }
        // Links to Showdown pages/Background credits
        else if (sideMenuElement.className == "mainmenufooter")
        {
            sideMenuElement.childNodes.forEach(function (footerNode) {
                var footerElement = footerNode as Element;

                // Links
                if (footerElement.tagName == "SMALL")
                {
                    footerElement.childNodes.forEach(function (linkNode) {
                        var linkElement = linkNode as Element;

                        if (linkElement.tagName == "A" && linkElement.textContent) {
                            linkElement.textContent = translateMenu(linkElement.textContent);
                        }
                    })
                }
                // Background credit
                else if (footerElement.className == "bgcredit") {
                    updateBackgroundCredit(footerElement.firstChild as Element)
                }
            })
        }
    })
}

function updateRoomName(roomUlElement: Element)
{
    roomUlElement.childNodes.forEach(function (roomLiNode) {
        roomLiNode.childNodes.forEach(function (roomNameNode) {
            var roomNameElement = roomNameNode as Element;

            // Translate room name
            if (roomNameElement.tagName == "A" && roomNameElement.lastChild?.textContent) {
                roomNameElement.lastChild.textContent = translateMenu(roomNameElement.lastChild.textContent);
            }
        })
    })
}

function updateMenuGroup(menuGroup: Element)
{
    // Menu elements could be in a form tag
    if (menuGroup.firstElementChild?.tagName == "FORM") {
        updateMainButton(menuGroup.firstElementChild)
    }
    else {
        updateMainButton(menuGroup);
    }
}

function updateMainButton(battleForm: Element)
{
    // Mother element has a <p> tag
    battleForm.childNodes.forEach(function (pNode) {
        pNode.childNodes.forEach(function (buttonNode) {
            var buttonElement = buttonNode as Element;

            // Some information are just in plain text
            if (!buttonElement.tagName && buttonElement.textContent?.endsWith(" wants to battle!")) {
                buttonElement.textContent = buttonElement.textContent.replace(" wants to battle!", "") + translateMenu(" wants to battle!");
            }
            // Team selection
            else if (buttonElement.classList?.contains("teamselect")) {
                updatePokemonTeamName(buttonElement);
            }
            // Button
            else if (buttonElement.tagName == "BUTTON" && buttonElement.firstChild?.textContent) {
                buttonElement.firstChild.textContent = translateMenu(buttonElement.firstChild.textContent);
            }
            // Label
            else if (buttonElement.tagName == "LABEL")
            {
                // Translate every label child
                buttonElement.childNodes.forEach(function (labelNode) {
                    var labelElement = labelNode as Element;

                    if (labelElement.textContent) {
                        labelElement.textContent = translateMenu(labelElement.textContent);
                    }

                    // <abbr> elements have titles that need to be translated
                    if (labelElement.tagName == "ABBR")
                    {
                        var abbrTitle = labelElement.getAttribute("title");

                        if (abbrTitle) {
                            labelElement.setAttribute("title", translateMenu(abbrTitle));
                        }
                    }
                })
            }
        })
    })
}

function updateWindow(windowElement: Element)
{
    windowElement.childNodes.forEach(function (windowChildNode) {
        var windowChildElement = windowChildNode as Element;

        console.log(windowChildElement.outerHTML);

        // Messages
        if (windowChildElement.className == "pm-log")
        {
            windowChildElement.childNodes.forEach(function (logWindowNode) {
                var logWindowElement = logWindowNode as Element;

                // Button log
                if (logWindowElement.className == "pm-buttonbar" && logWindowElement.firstChild?.textContent) {
                    logWindowElement.firstChild.textContent = translateMenu(logWindowElement.firstChild.textContent);
                }
                // Message log
                else if (logWindowElement.className == "inner")
                {
                    logWindowElement.childNodes.forEach(function (chatNode) {
                        updateChatMessage(chatNode as Element)
                    })
                }
            })
        }
        // Challenge
        else if (windowChildElement.className == "challenge" && windowChildElement.firstElementChild) 
        {
            // Update challenge request
            updateMainButton(windowChildElement.firstElementChild);
        }
    })
}

function updateChatMessage(chatElement: Element)
{
    chatElement.childNodes.forEach(function (chatMessageNode) {
        var chatMessage = chatMessageNode as Element;

        // Only translate log messages, not chat messages
        if (chatMessage.textContent && (chatMessage.className == "message-log" || !chatMessage.tagName) ) {
            chatMessage.textContent = translateRegexMessage(chatMessage.textContent);
        }
    })
}

function updatePokemonTeamName(teamElement: Element)
{
    // Translate selected team
    teamElement.childNodes.forEach(function (teamNameNode) {
        var teamNameElement = teamNameNode as Element;

        // Team name is in <strong> tag
        if (teamNameElement.tagName == "STRONG" && teamNameElement.textContent) {
            teamNameElement.textContent = translatePokemonTeam(teamNameElement.textContent);
        } 
    })
}

function updateBackgroundCredit(footerElement: Element)
{
    footerElement.childNodes.forEach(function (backgroundNode) {
        var backgroundElement = backgroundNode as Element;

        // Pokémon Showdown day
        if (backgroundElement.tagName == "SMALL")
        {
            backgroundElement.childNodes.forEach(function (showdownDayNode) {
                if (showdownDayNode.textContent)
                {
                    // Author name
                    if (showdownDayNode.textContent.startsWith("by ")) {
                        showdownDayNode.textContent = translateMenu("by ") + showdownDayNode.textContent.replace("by ", "");
                    }
                    // Background name
                    else {
                        showdownDayNode.textContent = translateMenu(showdownDayNode.textContent);
                    }
                }
            })
        }
        // Other background
        else if (backgroundElement.tagName == "A")
        {
            backgroundElement.childNodes.forEach(function (creditsNode)
            {
                // Author name
                if (creditsNode.textContent && creditsNode.textContent.startsWith("background by ")) {
                    creditsNode.textContent = translateMenu("background by ") + creditsNode.textContent.replace("background by ", "");
                }
            })
        }
    })
}