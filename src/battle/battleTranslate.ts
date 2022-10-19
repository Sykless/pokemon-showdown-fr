import { isValidEnglishAbility, isValidEnglishLogMessage, isValidEnglishItem, isValidEnglishMenu, isValidEnglishMove, isValidEnglishPokemonName, isValidEnglishEffect, isValidEnglishType, translateLogMessage, translateWeather, PokemonDico, ItemsDico, MovesDico, AbilitiesDico, NaturesDico, TypesDico, translateRegexMessage, translateRegexBattleMessage, MovesLongDescDico, translateMoveEffect, isValidEnglishMoveEffect, MovesShortDescDico, translateRawElement } from "../translator";
import { translateAbility, translateEffect, translateItem, translateMenu, translateMove, translatePokemonName, translateStat, translateType }  from "../translator"; 
import { RegexLogMessagesMap }  from "../translator"; 

console.log("BattleTranslate successfully loaded !");

const HP = 0, ABILITY = 1, POSSIBLE_ABILITIES = 2, ITEM = 3, STATS = 4, SPEED = 5, UNKNOWN = 6;
const LogInfoDisplayed: Array<string> = ["HP", "ABILITY", "POSSIBLE_ABILITIES", "ITEM", "STATS", "SPEED", "UNKNOWN"];

// If a Battle is reloaded, the original code is not counted as a page change
// So we need to translate it if needed
translateBattleHomePage();

// The injected script cannot access chrome.runtime.getURL
// So we need to catch an event from the content script that sends it
var SpriteURL = "";

window.addEventListener('RecieveContent', function(evt: any) {
	SpriteURL = evt.detail;
});

declare var app: any;

// Create a MutationObserver element in order to track every page change
// So we can it dynamically translate new content
var observer = new MutationObserver(onMutation);

observer.observe(document, {
	childList: true, // report added/removed nodes
	subtree: true,   // observe any descendant elements
});

// Everytime a new element is added to the page, onMutation method is called
function onMutation(mutations: MutationRecord[])
{
	// If the Teambuilding tab is not visible, stop the mutation observation
	if (!isBattleOpen()) {
		return;
	}

	for (var i = 0, len = mutations.length; i < len ; i++)
	{		
        // Iterate on every added node that isn't on the preempt message target
		if (mutations[i].type == "childList"
            && !(mutations[i].target as Element).className?.includes("inner-preempt message-log"))
		{
			var newNodes = mutations[i].addedNodes;

			for (var j = 0, node; (node = newNodes[j]); j++)
			{
				var newElement = node as Element;
                var parentElement = mutations[i].target as Element;

                var elementClasses = newElement.classList;
                var parentClasses = parentElement.classList;

                // Don't want to add a break everytime a match is found
                // so instead we add a boolean that changes when no match is found
                var translatedElement = true;

                console.log(newElement.outerHTML);

                if (newElement.id)
                {
                    // New user joined or left
                    if (newElement.id.match(/^battle-(.*)-userlist-user-(.*)$/))
                    {
                        updateUserCountFromUsername(newElement)
                    }
                }

                if (elementClasses)
                {
                    // The whole room has been loaded
                    if (elementClasses.contains("innerbattle"))
                    {
                        console.log("Whole room, rien d'intéressant : " + newElement.outerHTML);
                    }
                    // Tooltip has been opened
                    else if (elementClasses.contains("tooltipinner"))
                    {
                        var tooltip = newElement.firstChild as Element;

                        // Pokémon tooltip
                        if (tooltip.classList.contains("tooltip-pokemon") || tooltip.classList.contains("tooltip-activepokemon")
                            || tooltip.classList.contains("tooltip-switchpokemon")  || tooltip.classList.contains("tooltip-allypokemon"))
                        {
                            updatePokemonTooltip(tooltip);
                        }
                        // Move tooltip
                        else if (tooltip.classList.contains("tooltip-move") || tooltip.classList.contains("tooltip-zmove")
                            || tooltip.classList.contains("tooltip-maxmove"))
                        {
                            updateMoveTooltip(tooltip);
                        }
                        // Field tooltip
                        else if (tooltip.classList.contains("tooltip-field"))
                        {
                            updateFieldTooltip(tooltip);
                        }
                    }
                    else if (elementClasses.contains("switch-controls"))
                    {
                        updateSwitchControls(newElement);
                    }
                    // Main control interface : Moves, 
                    else if (elementClasses.contains("controls"))
                    {
                        // Waiting and Active control panel use different structures
                        if ((newElement.firstChild as Element).tagName == "P")
                        {
                            if (newElement.getElementsByClassName("replayDownloadButton").length) {
                                updateBattleEnded(newElement);
                            }
                            else {
                                updateOpponentWait(newElement);
                            }
                        }
                        else {
                            updateControlPanel(newElement);
                        }
                    }
                    // Pokémon name and status
                    else if (elementClasses.contains("statbar"))
                    {
                        updatePokemonHealthBar(newElement);
                    }
                    // Pokémon result (little toast on the Pokémon to display what happened)
                    else if (elementClasses.contains("result"))
                    {
                        updatePokemonResult(newElement);
                    }
                    // Type sprite
                    else if (newElement.tagName == "IMG")
                    {
                        updatePokemonTypeSprite(newElement as HTMLImageElement);
                    }
                    // Transitory message that is only displayed a couple seconds
                    else if (newElement.tagName == "P" && newElement.getAttribute("style")?.includes("display: block; opacity: 0"))
                    {
                        updateShowdownMessage(newElement);
                    }
                    // Log message for battle action
                    else if (elementClasses.contains("battle-history"))
                    {
                        updateShowdownMessage(newElement);
                    }
                    // Various battle chat messages
                    else if (elementClasses.contains("battle-log-add"))
                    {
                        console.log("battle-log-add : " + newElement.outerHTML)
                        // This room is expired
                        // Connecting...
                        // <form><button name="login">Join chat</button></form>
                    }
                    // Chat message
                    else if (elementClasses.contains("chat"))
                    {
                        updateCommand(newElement);
                    }
                    // Battle Options button
                    else if (elementClasses.contains("battle-options"))
                    {
                        updateBattleOptionsButton(newElement);
                    }
                    // Turn counter
                    else if (elementClasses.contains("turn"))
                    {
                        updateTurnCounter(newElement);
                    }
                    else {
                        // No translation found
                        translatedElement = false;
                    }
                }
                else {
                    // No translation found
                    translatedElement = false;
                }

				if (parentClasses && !translatedElement)
                {
                    // Weather and side-conditions
                    if (newElement.tagName == "EM" && parentClasses.contains("weather"))
                    {
                        updateWeather(newElement);
                    }
                    // Pokémon condition (status under the health bar)
                    else if (newElement.tagName == "SPAN" && parentClasses.contains("status"))
                    {
                        updatePokemonCondition(newElement);
                    }
                    // Battle controls between turns (skip turn, etc)
                    else if (newElement.tagName == "P" && parentClasses.contains("battle-controls"))
                    {
                        updateControlBetweenTurns(newElement);
                    }
                    // Basic chat messages without class (rules, format)
                    else if (newElement.className == "" && parentClasses.contains("message-log"))
                    {
                        updateBattleRules(newElement);
                    }
                }
			}
		}
	}
}

function isBattleOpen()
{
    // Get all battle rooms
	var teambuilderElement = document.querySelectorAll('[id^=room-battle-]');
    var battleOpen = false;

    teambuilderElement.forEach(function (battleRoomNode) {
        var battleRoomElement = battleRoomNode as Element;

        // Check if the battle room is open
        if (!battleRoomElement.getAttribute("style")?.includes("display: none")) {
            battleOpen = true;
        }
    })

    return battleOpen;
}

function updatePokemonTooltip(tooltip: Element)
{
    // No classnames in tooltips, so we need to determine which info is what a bit more manually
    tooltip.childNodes.forEach(function (tooltipContentNode) {
        var tooltipContent = tooltipContentNode as Element;

        // Pokémon name/level/gender/types
        if (tooltipContent.tagName == "H2")
        {
            tooltipContent.childNodes.forEach(function (pokemonInfoNode) {
                var pokemonInfo = pokemonInfoNode as Element;

                if (pokemonInfo.tagName == "IMG") {
                    updatePokemonTypeSprite(pokemonInfo as HTMLImageElement);
                }
                // Level/Alternate form
                else if (pokemonInfo.tagName == "SMALL")
                {
                    if (pokemonInfo.textContent)
                    {
                        if (pokemonInfo.textContent.includes("(")) {
                            pokemonInfo.textContent = "(" + translatePokemonName(pokemonInfo.textContent.slice(1,-1)) + ")";
                        }
                        else {
                            pokemonInfo.textContent = pokemonInfo.textContent.replace("L","N");
                        }
                    }
                }
                // Pokémon name
                else if (pokemonInfo.tagName != "BR")
                {
                    if (pokemonInfo.textContent)
                    {
                        // If the next element is not a line break, a space has been added at the end of the name
                        if ((pokemonInfo.nextSibling as Element).tagName != "BR"){
                            pokemonInfo.textContent = translatePokemonName(pokemonInfo.textContent.slice(0,-1)) + " ";
                        }
                        else {
                            pokemonInfo.textContent = translatePokemonName(pokemonInfo.textContent);
                        }
                    }
                }
            })
        }
        // Moves
        else if (tooltipContent.className == "section")
        {
            tooltipContent.childNodes.forEach(function (moveNode) {
                var moveElement = moveNode as Element;

                // Every non-small or line break element is a move
                if (!["BR", "SMALL"].includes(moveElement.tagName) && moveElement.textContent) {
                    if (moveElement.textContent.slice(-1) == " ") {
                        moveElement.textContent = "• " + translateMove(moveElement.textContent.slice(2,-1)) + " ";
                    }
                    else {
                        moveElement.textContent = "• " + translateMove(moveElement.textContent.slice(2));
                    }
                }
            })
        }
        // Sub infos (Item, Ability, Moves, etc)
        else if (tooltipContent.tagName == "P")
        {
            var currentDisplayedInfo = UNKNOWN;

            tooltipContent.childNodes.forEach(function (tooltipSubInfo) {
                var tooltipSubInfoElement = tooltipSubInfo as Element;
                
                if (tooltipSubInfoElement.textContent)
                {
                    // Info name
                    if (tooltipSubInfoElement.tagName == "SMALL")
                    {
                        currentDisplayedInfo = getCurrentDisplayedInfo(tooltipSubInfoElement.textContent);

                        // Specific case
                        if (tooltipSubInfoElement.textContent.startsWith("Would take if ability removed: ")) {
                            tooltipSubInfoElement.textContent = translateMenu("Would take if ability removed: ")
                                + tooltipSubInfoElement.textContent.replace("Would take if ability removed: ", "");
                        }
                        // Actual info name
                        else if (tooltipSubInfoElement.textContent.includes(":")) {
                            tooltipSubInfoElement.textContent = translateMenu(tooltipSubInfoElement.textContent.slice(0,-1)) + " :";
                        }
                        else {
                            tooltipSubInfoElement.textContent = translateMenu(tooltipSubInfoElement.textContent);
                        }
                    }
                    // Status
                    else if (tooltipSubInfoElement.classList?.contains("status"))
                    {
                        // Translate status
                        tooltipSubInfoElement.textContent = translateEffect(tooltipSubInfoElement.textContent)
                    }
                    // Info value
                    else
                    {
                        // Estimated speed
                        if (currentDisplayedInfo == SPEED) {
                            tooltipSubInfoElement.textContent = tooltipSubInfoElement.textContent.replace(" to "," à ");
                        }
                        // Possible Ability
                        else if (currentDisplayedInfo == POSSIBLE_ABILITIES)
                        {
                            var possibleAbilities = tooltipSubInfoElement.textContent.split(",");
                            var translatedAbilities = "";

                            // Remove the space at the beggining of each ability, translate it and reformat it
                            for (var i = 0 ; i < possibleAbilities.length ; i++) {
                                translatedAbilities += " " + translateAbility(possibleAbilities[i].slice(1))
                                translatedAbilities += i == possibleAbilities.length - 1 ? "" : ",";
                            }

                            tooltipSubInfoElement.textContent = translatedAbilities;
                        }
                        // Ability
                        else if (currentDisplayedInfo == ABILITY)
                        {
                            if (tooltipSubInfoElement.textContent.includes(" / ")) {
                                // Remove all styling, translate the ability and reformat it
                                tooltipSubInfoElement.textContent = " " + translateAbility(tooltipSubInfoElement.textContent
                                    .replace(" / ","")
                                    .slice(1)) + " / ";
                            }
                            else
                            {
                                // Just remove the space
                                tooltipSubInfoElement.textContent = " " + translateAbility(tooltipSubInfoElement.textContent.slice(1))
                            }
                        }
                        // Item
                        else if (currentDisplayedInfo == ITEM)
                        {
                            if (tooltipSubInfoElement.textContent.includes(" (")) {
                                var itemInfos = tooltipSubInfoElement.textContent.split(" (");
                                var itemEffect = itemInfos[1].split(" was ");

                                if (itemEffect.length > 1) {
                                    tooltipSubInfoElement.textContent = " " + translateItem(itemInfos[0].slice(1))
                                    + " (" + translateItem(itemEffect[0]) + " a été " + translateMenu(itemEffect[1].slice(0,-1)) + ")"
                                }
                                else {
                                    tooltipSubInfoElement.textContent = " " + translateItem(itemInfos[0].slice(1))
                                    + " (" + translateMenu(itemEffect[0].slice(0,-1)) + ")";
                                }
                            }
                            else {
                                tooltipSubInfoElement.textContent = " " + translateItem(tooltipSubInfoElement.textContent.slice(1));
                            }
                        }
                        // Stats, don't translate values - however status specific cases could be present
                        else if (currentDisplayedInfo == STATS)
                        {
                            // Deal with specific cases
                            if (tooltipSubInfoElement.textContent.startsWith(" Next damage: ")) {
                                tooltipSubInfoElement.textContent = translateMenu(" Next damage: ")
                                    + tooltipSubInfoElement.textContent.replace(" Next damage: ", "");
                            }
                            else if (tooltipSubInfoElement.textContent.startsWith(" Turns asleep: ")) {
                                tooltipSubInfoElement.textContent = translateMenu(" Turns asleep: ")
                                    + tooltipSubInfoElement.textContent.replace(" Turns asleep: ", "");
                            }
                        }
                    }
                }
            })
        }
    })
}

function updateMoveTooltip(tooltip: Element)
{
    var moveName = "";
    var priorityMove = false;

    tooltip.childNodes.forEach(function (tooltipNode) {
        var tooltipElement = tooltipNode as Element;

        // Move name and type
        if (tooltipElement.tagName == "H2") {
            tooltipElement.childNodes.forEach(function (moveHeaderNode) {
                var moveHeader = moveHeaderNode as Element;

                // Raw text element : move name
                if (!moveHeader.tagName && moveHeader.textContent?.trim()) {
                    moveName = moveHeader.textContent;
                    moveHeader.textContent = translateMove(moveHeader.textContent);
                }
                // Move type
                else if (moveHeader.tagName == "IMG") {
                    updatePokemonTypeSprite(moveHeader as HTMLImageElement);
                }
            })
        }
        // Everything else : accuracy, power, description
        else if (tooltipElement.tagName == "P")
        {
            // Move base description
            if (tooltipElement.className == "section")
            {
                tooltipElement.childNodes.forEach(function (sectionNode) {
                    var sectionElement = sectionNode as Element;

                    if (sectionElement.textContent)
                    {
                        // Priority move : section element is the priority label
                        if (isValidEnglishMoveEffect(sectionElement.textContent)) {
                            sectionElement.textContent = translateMoveEffect(sectionElement.textContent);
                        }
                        // Priority value
                        else if (sectionElement.textContent.startsWith("(priority "))
                        {
                            priorityMove = true;
                            sectionElement.textContent = translateMenu("(priority ")
                                + sectionElement.textContent.replace("(priority ", "");
                        }
                        // Not a priority move : section element is the move description
                        else if (sectionElement.textContent != ".") {
                            // In hardcore mode, display short desc
                            var frenchDesc = app.curRoom?.battle?.hardcoreMode ? 
                                MovesShortDescDico[moveName] : MovesLongDescDico[moveName];
                            
                            if (frenchDesc) {
                                sectionElement.textContent = frenchDesc;
                            }
                        }
                    }

                    
                })
            }
            // Move tags (priority, sound, etc)
            else if (tooltipElement.className == "movetag") {
                tooltipElement.childNodes.forEach(function (moveTagNode) {
                    var moveTag = moveTagNode as Element;

                    // Each element is a description
                    if (moveTag.textContent && (!moveTag.tagName || moveTag.tagName == "SMALL")) {
                        moveTag.textContent = translateMoveEffect(moveTag.textContent);
                    }
                })
            }
            // Other (no classname) : accuracy, power OR description if priorityMove
            else if (!tooltipElement.className && tooltipElement.textContent)
            {
                // Priority move : empty classname element is the move description
                if (priorityMove) {
                    // In hardcore mode, display short desc
                    var frenchDesc = app.curRoom?.battle?.hardcoreMode ? 
                        MovesShortDescDico[moveName] : MovesLongDescDico[moveName];
                    
                    if (frenchDesc) {
                        tooltipElement.textContent = frenchDesc;
                    }
                }
                // Empty class element could also be a move tag (zone effect)
                else if (isValidEnglishMoveEffect(tooltipElement.textContent)) {
                    tooltipElement.textContent = translateMoveEffect(tooltipElement.textContent);
                }
                // Accuracy, translate title and potential label (can't miss, etc)
                else if (tooltipElement.textContent.startsWith("Accuracy: ")) {
                    tooltipElement.textContent = translateMenu("Accuracy: ")
                        + translateMenu(tooltipElement.textContent.replace("Accuracy: ", ""));
                }
                // Base Power, translate title and potential label
                else if (tooltipElement.textContent.startsWith("Base power: ")) {
                    tooltipElement.textContent = translateMenu("Base power: ")
                        + translateMenu(tooltipElement.textContent.replace("Base power: ", ""));
                }
            }
        }
    })
}

function updateFieldTooltip(tooltip: Element)
{
    tooltip.childNodes.forEach(function (tooltipNode) {
        tooltipNode.childNodes.forEach(function (tooltipContentNode) {
            var tooltipContent = tooltipContentNode as Element;

            // Side weather
            if (tooltipContent.tagName == "TBODY") {
                tooltipContent.childNodes.forEach(function (trNode) {
                    trNode.childNodes.forEach(function (tdNode) {
                        tdNode.childNodes.forEach(function (pNode) {
                            pNode.childNodes.forEach(function (weatherNode) {
                                var weatherElement = weatherNode as Element;

                                // Deep insane <table> element : translate every non-trainer (strong) element
                                if (weatherElement.tagName != "STRONG") {
                                    updateWeatherName(weatherElement)
                                }
                            })
                        })
                    })
                })
            }
            // Generic weather
            else {
                updateWeatherName(tooltipContent)
            }
        })
    })
}

function updateSwitchControls(switchControls: Element)
{
    switchControls.childNodes.forEach(function (bottomOptionNode) {
        var bottomOption = bottomOptionNode as Element;

        if (bottomOption.className == "whatdo")
        {
            bottomOptionNode.childNodes.forEach(function (labelOptionNode) {
                var labelOption = labelOptionNode as Element;

                if (labelOption.tagName == "BUTTON")
                {
                    if (labelOption.lastChild?.textContent) {
                        labelOption.lastChild.textContent = translateMenu(labelOption.lastChild.textContent);
                    }
                }
                else {
                    if (labelOption.textContent) {
                        labelOption.textContent = translateMenu(labelOption.textContent);
                    }
                }
            })
        }
        else if (bottomOption.className == "switchcontrols")
        {
            bottomOptionNode.childNodes.forEach(function (switchOptionNode) {
                var switchOption = switchOptionNode as Element;

                if (switchOption.className == "switchselect")
                {
                    if (switchOption.firstChild?.textContent) {
                        switchOption.firstChild.textContent = translateMenu(switchOption.firstChild.textContent);
                    }
                }
                if (switchOption.className == "switchmenu")
                {
                    switchOption.childNodes.forEach(function (pokemonButtonNode) {
                        pokemonButtonNode.childNodes.forEach(function (pokemonButton)
                        {
                            // The Pokémon name is not in the Span tag
                            if ((pokemonButton as Element).tagName != "SPAN" && pokemonButton.textContent) {
                                pokemonButton.textContent = translatePokemonName(pokemonButton.textContent);
                            }
                        })
                    })
                }
            })
        }
    })
}

function updateControlPanel(newElement: Element)
{
    // Main control board (moves, switches)
    newElement.childNodes.forEach(function (selectOptionNode) {
        var selectionOption = selectOptionNode as Element;

        if (selectionOption.className == "whatdo") 
        {
            selectionOption.childNodes.forEach(function (whatToDoNode) {
                var whatToDo = whatToDoNode as Element;

                if (whatToDo.textContent)
                {
                    // Remaining HP
                    if (whatToDo.tagName == "SMALL") {
                        whatToDo.textContent = translateStat(whatToDo.textContent.slice(0,2)) + whatToDo.textContent.slice(2);
                    }
                    // Pokémon name
                    else if (whatToDo.tagName == "STRONG") {
                        whatToDo.textContent = translatePokemonName(whatToDo.textContent);
                    }
                    // Regular text
                    else {
                        whatToDo.textContent = translateMenu(whatToDo.textContent);
                    }
                }
            })
        }
        else if (selectionOption.className == "movecontrols")
        {
            selectionOption.childNodes.forEach(function (moveOptionNode) {
                var moveOption = moveOptionNode as Element;

                if (moveOption.className == "moveselect")
                {
                    // Attack menu name
                    if (moveOption.firstChild?.textContent) {
                        moveOption.firstChild.textContent = translateMenu(moveOption.firstChild.textContent);
                    }
                }
                else if (moveOption.className == "movemenu")
                {
                    moveOption.childNodes.forEach(function (moveMainNode) 
                    {
                        var moveButtonElement = moveMainNode as Element;

                        // Moves are under a submenu
                        if (moveButtonElement.tagName == "DIV") {
                            moveButtonElement.childNodes.forEach(function (subMoveNode) {
                                updateMove(subMoveNode)
                            })
                        }
                        // Moves are directly under movemenu element
                        else if (moveButtonElement.tagName == "BUTTON") {
                            updateMove(moveButtonElement)
                        }
                        
                        
                    })
                }
            })
        }
        else if (selectionOption.className == "switchcontrols")
        {
            selectionOption.childNodes.forEach(function (switchOptionNode) {
                var switchOption = switchOptionNode as Element;

                if (switchOption.className == "switchselect")
                {
                    // Switch menu name
                    if (switchOption.firstChild?.textContent) {
                        switchOption.firstChild.textContent = translateMenu(switchOption.firstChild.textContent);
                    }
                }
                else if (switchOption.className == "switchmenu")
                {
                    switchOption.childNodes.forEach(function (pokemonMainNode) {
                        pokemonMainNode.childNodes.forEach(function (pokemonButtonNode) {
                            var pokemonButton = pokemonButtonNode as Element;

                            // The only non-span element is the Pokémon name
                            if (pokemonButton.tagName != "SPAN" && pokemonButton.textContent) {
                                pokemonButton.textContent = translatePokemonName(pokemonButton.textContent);
                            }
                        })
                    })
                }
            })
        }
    })
}

function updateControlBetweenTurns(controlElement: Element)
{
    // Translate button text
    controlElement.childNodes.forEach(function (buttonNode) {
        buttonNode.childNodes.forEach(function (buttonContentNode) {
            var buttonContent = buttonContentNode as Element;

            // Raw text element
            if (!buttonContent.tagName && buttonContent.textContent) {
                buttonContent.textContent = translateMenu(buttonContent.textContent);
            }
        })
    })
}

function updateMove(moveMainNode: Node)
{
    moveMainNode.childNodes.forEach(function (moveButtonNode) {
        var moveButton = moveButtonNode as Element;

        if (moveButton.textContent)
        {
            // Type
            if (moveButton.tagName == "SMALL")
            {
                if (moveButton.className == "type") {
                    moveButton.textContent = translateType(moveButton.textContent);
                }
            }
            // Move
            else if (moveButton.tagName != "BR") {
                moveButton.textContent = translateMove(moveButton.textContent);
            }
        }
    })
}

function updateOpponentWait(newElement: Element)
{
    // Next action translation
    newElement.childNodes.forEach(function (waitingNode) {
        waitingNode.childNodes.forEach(function (waitingLabelNode) {
            var waitingLabelElement = waitingLabelNode as Element;

            if (waitingLabelElement.tagName == "SMALL")
            {
                waitingLabelElement.childNodes.forEach(function (textElementNode) {
                    var textElement = textElementNode as Element;

                    if (textElement.textContent)
                    {
                        // The text content is in the EM tag
                        if (textElement.tagName == "EM") {
                            textElement.textContent = translateMenu(textElement.textContent);
                        }
                        // Message indicating the following ation
                        else if (!textElement.tagName) {
                            textElement.textContent = translateRegexBattleMessage(textElement.textContent);
                        }
                    }
                })
            }
            else if (waitingLabelElement.tagName == "BUTTON")
            {
                // The text content is always the button last child
                if (waitingLabelElement.lastChild?.textContent) {
                    waitingLabelElement.lastChild.textContent = translateMenu(waitingLabelElement.lastChild.textContent);
                }
            }
            if (waitingLabelElement.tagName == "EM" && waitingLabelElement.textContent)
            {
                // The text content is in the EM tag
                waitingLabelElement.textContent = translateMenu(waitingLabelElement.textContent);
            }
        })
    })
}

function updateBattleEnded(newElement: Element)
{
    newElement.childNodes.forEach(function (pNode) {
        pNode.childNodes.forEach(function (controlPanelMainNode) {
            controlPanelMainNode.childNodes.forEach(function (controlPanelNode) {
                var controlPanel = controlPanelNode as Element;

                // Raw text element
                if (controlPanel.textContent && (!controlPanel.tagName || ["STRONG", "SMALL"].includes(controlPanel.tagName))) {
                    controlPanel.textContent = translateMenu(controlPanel.textContent);
                }
                // Button/Link : find text content
                else if (["BUTTON", "A"].includes(controlPanel.tagName)) {
                    controlPanel.childNodes.forEach(function (buttonContentNode) {
                        var buttonContent = buttonContentNode as Element;

                        if (!buttonContent.tagName && buttonContent.textContent) {
                            buttonContent.textContent = translateMenu(buttonContent.textContent);
                        }
                    })
                }
            })
        })
    })
}

function updateWeather(newElement: Element)
{
    newElement.childNodes.forEach(function (weatherNode) {
        updateWeatherName(weatherNode as Element)
    })
}

function updateWeatherName(weatherElement: Element)
{
    if (weatherElement.textContent)
    {
        // Rayquaza cancels weather, in that case the whole sentence is in one tag
        if (weatherElement.tagName == "S") {
            var weatherSplit =  weatherElement.textContent.split(" (");

            // Both the weather name and its duration
            if (weatherSplit.length > 1) {
                weatherElement.textContent = translateWeather(weatherSplit[0]) + " ("
                    + weatherSplit[1].replace(" or ", " ou ").replace("turn", "tour") + ")";
            }
            // Infinite effects - just the weather name
            else {
                weatherElement.textContent = translateWeather(weatherElement.textContent);
            }
        }
        // Remaining turns element, just translate the english bits
        else if (weatherElement.tagName == "SMALL") {
            weatherElement.textContent = weatherElement.textContent.replace(" or ", " ou ").replace("turn","tour");
        }
        // Every remaining non-line break element is a weather name
        else if (weatherElement.tagName != "BR")
        {
            // Ally or ennemy side
            if (weatherElement.textContent.includes("Foe's ")){
                weatherElement.textContent = translateWeather(weatherElement.textContent.slice(6,-1)) + " adverse ";
            }
            // If effect has a duration
            else if (weatherElement.textContent.slice(-1) == " ") {
                weatherElement.textContent = translateWeather(weatherElement.textContent.slice(0,-1)) + " ";
            }
            // Effet is infinite
            else {
                weatherElement.textContent = translateWeather(weatherElement.textContent);
            }
        }
    }
}

function updatePokemonHealthBar(pokemonMainElement: Element)
{
    pokemonMainElement.childNodes.forEach(function (pokemonNode) {
        var pokemonElement = pokemonNode as Element;

        // Pokémon name
        if (pokemonElement.tagName == "STRONG")
        {
            pokemonElement.childNodes.forEach(function (pokemonIdentityNode) {
                var pokemonIdentityElement = pokemonIdentityNode as Element;

                if (pokemonIdentityElement.textContent)
                {
                    // Level
                    if (pokemonIdentityElement.tagName == "SMALL") {
                        pokemonIdentityElement.textContent = pokemonIdentityElement.textContent.replace("L","N");
                    }
                    // Pokémon name
                    else if (pokemonIdentityElement.tagName != "IMG") {
                        // The Pokémon name might have a space character to make space for the next info
                        if (pokemonIdentityElement.textContent.slice(-1) == " ") {
                            pokemonIdentityElement.textContent = translatePokemonName(pokemonIdentityElement.textContent.slice(0,-1)) + " ";
                        }
                        else {
                            pokemonIdentityElement.textContent = translatePokemonName(pokemonIdentityElement.textContent);
                        }
                    }
                }
            })
        }
        // Pokémon status
        else if (pokemonElement.className == "hpbar")
        {
            pokemonElement.childNodes.forEach(function (statusNode) {
                if ((statusNode as Element).className == "status") {
                    statusNode.childNodes.forEach(function (statusBuffsNode) {
                        updatePokemonCondition(statusBuffsNode as Element);
                    })
                }
            })
        }
    })
}

function updatePokemonCondition(newElement: Element)
{
    if (newElement.textContent)
    {
        // Buffs and debuffs
        if (newElement.textContent.includes("× ")) {
            // Translate stat
            var buffStatSplit = newElement.textContent.split(" ")
            newElement.textContent = buffStatSplit[0] + " " + translateStat(buffStatSplit[1]);
        }
        // Status condition
        else {
            newElement.textContent = translateEffect(newElement.textContent.replace(" ", " "));
        }
    }
}

function updatePokemonResult(newElement: Element)
{
    var textInfoTag = newElement.firstChild as Element;

    if (textInfoTag.tagName == "STRONG" && textInfoTag.textContent) {
        if (newElement.className.includes("abilityresult")){
            textInfoTag.textContent = translateAbility(textInfoTag.textContent);
        }
        else
        {
            // Most likely in EffectDico
            if (isValidEnglishEffect(textInfoTag.textContent)) {
                textInfoTag.textContent = translateEffect(textInfoTag.textContent.replace(" ", " "));
            }
            // If not, the result could be a stolen/recycled item
            else if (isValidEnglishItem(textInfoTag.textContent)) {
                textInfoTag.textContent = translateItem(textInfoTag.textContent);
            }
            // If none of the above, the last possible result should be stat boost/drop
            else if (textInfoTag.textContent.includes("×")) { // "Multiply" character
                var boostedStat = textInfoTag.textContent.split(" ");
                textInfoTag.textContent = boostedStat[0].replace("already ", "déjà ") + " " + translateStat(boostedStat[1]);
            }
            else {
                console.log("Unknown result " + newElement.outerHTML)
            }
        }
    }
}

function updateShowdownMessage(messageElement: Element)
{
    messageElement.childNodes.forEach(function (messagePartNode) {
        var messagePart = messagePartNode as Element;

        if (messagePart.textContent) 
        {
            // Strong tags refer to the main subject of the action : new Pokémon if switched, move if used, etc
            if (messagePart.tagName == "STRONG")
            {
                // Pokémon sent out
                if (isValidEnglishPokemonName(messagePart.textContent)) {
                    messagePart.textContent = translatePokemonName(messagePart.textContent);
                }
                // Move used
                else if (isValidEnglishMove(messagePart.textContent)) {
                    messagePart.textContent = translateMove(messagePart.textContent);
                }
                // Specific case : trainer's team
                else if (messagePart.textContent.endsWith("'s team:")) {
                    messagePart.textContent = translateMenu("'s team:") + messagePart.textContent.replace("'s team:", "") + " :";
                }
                // Could be a trainer name, we don't update it
                else {
                    console.log("Unknown info in strong tag : " + messagePart.outerHTML);
                }
            }
            // <em> tag : Pokémon team
            else if (messagePart.tagName == "EM") {
                var translatedTeam = "";
                var splittedTeam = messagePart.textContent.split(" / ");
                
                // Translate each Pokémon name
                for (var i = 0 ; i < splittedTeam.length ; i++)
                {
                    translatedTeam += translatePokemonName(splittedTeam[i])
                        + (i < splittedTeam.length - 1 ? " / " : "");
                }

                messagePart.textContent = translatedTeam;
            }
            // Small tags or text tags : various battle messages
            else {
                messagePart.textContent = translateRegexBattleMessage(messagePart.textContent);
            }
        }
    })
}

function updateCommand(messageElement: Element)
{
    // Chat message sent by player
    if (isChatMessage(messageElement))
    {
        messageElement.childNodes.forEach(function (chatNode) {
            var chatElement = chatNode as Element;+

            console.log(chatElement.outerHTML);

            if (chatElement.tagName == "EM" && chatElement.textContent && /!.* <".*">/.test(chatElement.textContent)) {
                // '"<>"' is a tag indicating that we can remove the message
                messageElement.parentElement?.removeChild(messageElement);
            }
        })
    }
    // Not a message, check if the message could be a command result
    else if (app.curRoom.chatHistory.lines?.length > 0)
    {
        // Commands are processed on the back-end, so we can't modify the data in order to add french names
        // We could intercept the webSocket message but it seems a bit too hacky
        // Instead we check if an error message is sent in a command result
        // and if the searched content was in french, we launch the command again with the translated name
        // We just need to remove the error message and the potentially wrong info

        var noCommandFound = true;

        // Get last message sent
        var message = app.curRoom.chatHistory.lines[app.curRoom.chatHistory.lines.length - 1];

        // If message was a command
        if (message.startsWith("!") || message.startsWith("/"))
        {
            var commandContent = message.split(" ");

            messageElement.childNodes.forEach(function (chatNode) {
                var chatElement = chatNode as Element;

                if (chatElement.textContent) 
                {
                    // Command "/data" didn't find anything, the provided data could be in french
                    if (commandContent[0].slice(1) == "data" && !chatElement.tagName && chatElement.textContent.includes("No Pokémon, item, move, ability or nature named"))
                    {
                        var commandValue = removeSpecialCharacters(message.replace(commandContent[0], "").toLowerCase()).replace(/ /g, "");
                        var closestMatch: boolean = chatElement.textContent.includes("Showing the data of ");
                        var englishValue = "";

                        const Dicos = [PokemonDico, ItemsDico, MovesDico, AbilitiesDico, NaturesDico];

                        for (var i = 0 ; i < Dicos.length ; i++) {
                            const currentDico = Dicos[i];
                            englishValue = Object.keys(currentDico).find(key => 
                                removeSpecialCharacters(currentDico[key].toLowerCase()) == commandValue) || "";

                            if (englishValue) {
                                // Remove error message and send the message to backend with english value
                                if (closestMatch && messageElement.nextSibling) {
                                    messageElement.parentElement?.removeChild(messageElement.nextSibling)
                                }
                                messageElement.parentElement?.removeChild(messageElement);
                                noCommandFound = false;

                                // We add a "<>" symbol that will be removed by the HTML sanitizer just to indicate that we generated this message
                                app.send(commandContent[0] + ' <"' + englishValue + '">', app.curRoom.id);

                                // Stop the process
                                break;
                            }
                        }
                    }
                    // Command "/weakness" didn't find anything, the provided type/Pokémon could be in french
                    else if (commandContent[0].slice(1) == "weakness" && chatElement.className == "infobox" && chatElement.textContent.includes("isn't a recognized type or Pokemon."))
                    {
                        var multipleValues = message.replace(commandContent[0] + " ", "").split(",");
                        var englishValue = "";

                        const Dicos = [TypesDico, PokemonDico];

                        for (var i = 0 ; i < multipleValues.length ; i++)
                        {
                            var currentEnglishValue = "";
                            var commandValue = removeSpecialCharacters(multipleValues[i]).toLowerCase().replace(/ /g, "");

                            for (var j = 0 ; j < Dicos.length && currentEnglishValue == "" ; j++)
                            {
                                const currentDico = Dicos[j];
                                currentEnglishValue = Object.keys(currentDico).find(key => 
                                    removeSpecialCharacters(currentDico[key].toLowerCase()) == commandValue) || "";

                                if (currentEnglishValue)
                                {
                                    // Add the translated value to the final string
                                    englishValue += currentEnglishValue + ",";
                                    noCommandFound = false;

                                    // Last value to translate, we send the command
                                    if (i == multipleValues.length - 1) {
                                        // Remove error message and send the message to backend with english value
                                        messageElement.parentElement?.removeChild(messageElement);

                                        // We add a <""> symbol that will be removed by the HTML sanitizer just to indicate that we generated this message
                                        app.send(commandContent[0]  + ' <"' + englishValue + '">', app.curRoom.id);
                                    }

                                    break;
                                }
                            }
                        }
                    }
                }
            })
        }
        
        // No command found : translate the message
        if (noCommandFound) {
            updateDefaultChatMessage(messageElement);
        }
    }
    // Default message, translate it
    else {
        updateDefaultChatMessage(messageElement);
    }
}

function updateDefaultChatMessage(messageElement: Element)
{
    // Translate the message
    if (messageElement.textContent) 
    {
        // Error message, player status or raw text
        if (messageElement.classList.contains("message-error") || messageElement.childElementCount == 0) {
            messageElement.textContent = translateRegexBattleMessage(messageElement.textContent);
        }
        // Player status
        else if (messageElement.childElementCount == 1 && messageElement.firstElementChild?.tagName == "SMALL" && messageElement.firstElementChild.textContent) {
            messageElement.firstElementChild.textContent = translateRegexBattleMessage(messageElement.firstElementChild.textContent);
        }
    }
}

function updateBattleRules(messageElement: Element)
{
    messageElement.childNodes.forEach(function (ruleNode) {
        var ruleElement = ruleNode as Element;

        // Small tag may contain the rule name and rule description
        if (ruleElement.tagName == "SMALL") {
            ruleElement.childNodes.forEach(function (ruleContentNode) {
                var ruleContent = ruleContentNode as Element;

                // Don't translate rule names
                if (ruleContent.textContent && ruleContent.tagName != "EM") {
                    ruleContent.textContent = translateMenu(ruleContent.textContent);
                }
            })
        }
    })
}

function translateBattleHomePage()
{
    var battlePage = document.querySelectorAll('*[id^="room-battle-"]');

    if (battlePage.length) {
        battlePage[0].childNodes.forEach(function (battleNode) {
            var battleElement = battleNode as Element;

            if (battleElement.classList?.contains("battle-userlist") || battleElement.classList?.contains("battle-log")) {
                updateBattleElements(battleElement);
            }
        }) 
    }
}

function updateBattleElements(battleElement: Element)
{
    battleElement.childNodes.forEach(function (battleContentNode) {
        var battleContent = battleContentNode as Element;

        // Users in the room
        if (battleContent.className == "userlist-count") {
            var userCount = battleContent.firstElementChild;

            if (userCount?.textContent?.includes(" user")) {
                userCount.textContent = userCount.textContent.replace(" user", translateMenu(" user"));
            }
        }
        // Battle options button
        else if (battleContent.className == "battle-options") {
            updateBattleOptionsButton(battleContent);
        }
    })
}

function updateBattleOptionsButton(battleOptions: Element)
{
    var battleOptionsButton = battleOptions.firstElementChild?.firstElementChild as HTMLButtonElement;

    // Translate button label
    if (battleOptionsButton?.tagName == "BUTTON" && battleOptionsButton.name == "openBattleOptions" && battleOptionsButton.textContent) {
        battleOptionsButton.textContent = translateMenu(battleOptionsButton.textContent);
    }
}

function updateUserCountFromUsername(usernameElement: Element)
{
    var parentElement = usernameElement.parentElement;

    if (parentElement?.classList?.contains("battle-userlist")) {
        updateBattleElements(parentElement);
    }
}

function updateTurnCounter(turnCounterElement: Element)
{
    if (turnCounterElement.textContent?.startsWith("Turn ")
        && turnCounterElement.tagName == "DIV"
        && turnCounterElement.childElementCount == 0)
    {
        // Only translate "Turn"
        turnCounterElement.textContent = translateMenu("Turn ") + turnCounterElement.textContent.replace("Turn ", "");
    }
}

function getCurrentDisplayedInfo(infoTitle: string)
{
    if (infoTitle.includes("HP")) {
        return STATS;
    }
    else if (infoTitle.includes("Ability")) {
        return ABILITY;
    }
    else if (infoTitle.includes("abilities")) {
        return POSSIBLE_ABILITIES;
    }
    else if (infoTitle.includes("Item")) {
        return ITEM;
    }
    else if (infoTitle == "Spe") {
        return SPEED;
    }

    return UNKNOWN;
}

function updatePokemonTypeSprite(spriteImage: HTMLImageElement)
{
	// Check that the alt attribute is a valid type
    if (isValidEnglishType(spriteImage.alt) && !spriteImage.src.includes("French_Type")) {
        // Use the french type sprite
        spriteImage.src = SpriteURL + "French_Type_" + spriteImage.alt + ".png"
    }
}

function isChatMessage(messageElement: Element)
{
    var playerMessage: boolean = false;

    for (var className of messageElement.classList)
    {
        // If the message comes from a player
        if (/chatmessage-.*/.test(className)) {
            playerMessage = true;
            break;
        }
    }

    return playerMessage;
}

function removeSpecialCharacters(text: string) {
	return text.replace(/[^a-z0-9]+/g, "");
}

function removeDiacritics(text: string) {
	return text
	  .normalize('NFD')
	  .replace(/[\u0300-\u036f]/g, '');
}