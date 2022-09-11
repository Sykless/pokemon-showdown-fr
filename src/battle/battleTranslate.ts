import { isValidEnglishType, translateAbility, translateCondition, translateItem, translateMenu, translateMove, translatePokemonName, translateStat, translateType } from "../translator";

console.log("BattleTranslate successfully loaded !");

const HP = 0, ABILITY = 1, POSSIBLE_ABILITIES = 2, ITEM = 3, STATS = 4, SPEED = 5, UNKNOWN = 6;
const LogInfoDisplayed: Array<string> = ["HP", "ABILITY", "POSSIBLE_ABILITIES", "ITEM", "STATS", "SPEED", "UNKNOWN"];

// The injected script cannot access chrome.runtime.getURL
// So we need to catch an event from the content script that sends it
var SpriteURL = "";

window.addEventListener('RecieveContent', function(evt: any) {
	SpriteURL = evt.detail;
});

// Create a MutationObserver element in order to track every page change
// So we can it dynamically translate new content
var observer = new MutationObserver(onMutation);

observer.observe(document, {
	childList: true, // report added/removed nodes
	subtree: true,   // observe any descendant elements

	// Catch any class modification
	attributes: true,
	attributeFilter: ['class']
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
		if (mutations[i].type == "childList")
		{
			var newNodes = mutations[i].addedNodes;

			for (var j = 0, node; (node = newNodes[j]); j++)
			{
				var newElement = node as Element;
				var elementClasses = newElement.classList;

                // console.log(newElement);

				if (elementClasses)
				{
					// The whole room has been loaded
					if (elementClasses.contains("innerbattle"))
					{
                        // console.log(newElement.outerHTML);
					}
					// Tooltip has been opened
					else if (elementClasses.contains("tooltipinner"))
					{
                        var tooltip = newElement.firstChild as Element;
                        //console.log(tooltip.outerHTML);

                        updatePokemonTooltip(tooltip);

                        // if (tooltip.classList.contains("tooltip-pokemon"))
                        // {
                            
                        // }
                        // else if (tooltip.classList.contains("tooltip-move"))
                        // {
                        //     console.log("Move");
                        //     console.log(tooltip.innerHTML);
                        // }
					}
                    else if (elementClasses.contains("switch-controls"))
                    {
                        updateSwitchControls(newElement);
                    }
                    // Main control interface : Moves, 
                    else if (elementClasses.contains("controls"))
                    {
                        // console.log(newElement);

                        // Waiting and Active control panel use different structures
                        if ((newElement.firstChild as Element).tagName == "P") {
                            updateOpponentWait(newElement);
                        }
                        else {
                            updateControlPanel(newElement);
                        }
                    }
                    // Timer button
                    else if (elementClasses.contains("timerbutton"))
                    {
                        updateTimerButton(newElement);
                    }
                    // Pokémon name and status
                    else if (elementClasses.contains("statbar"))
                    {
                        updatePokemonStatus(newElement);
                    }
                    else 
                    {
                        console.log(newElement);
                    }
				}
			}
		}
		else if (mutations[i].type == "attributes")
		{
			var modifiedElement = mutations[i].target as Element;
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

                if (pokemonInfo.tagName == "IMG")
                {
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

                        if (tooltipSubInfoElement.textContent.includes(":")) {
                            tooltipSubInfoElement.textContent = translateMenu(tooltipSubInfoElement.textContent.slice(0,-1)) + " :";
                        }
                        else {
                            tooltipSubInfoElement.textContent = translateMenu(tooltipSubInfoElement.textContent);
                        }
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
                    }
                }
            })
        }
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
    // Main control board (moves, switches, timer)
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
                    // Timer
                    else if (whatToDo.tagName == "BUTTON") {
                        updateTimerButton(whatToDo);
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
                    moveOption.childNodes.forEach(function (moveMainNode) {
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

function updateOpponentWait(newElement: Element)
{
    // Main control board (moves, switches, timer)
    newElement.childNodes.forEach(function (waitingNode)
    {
        waitingNode.childNodes.forEach(function (waitingLabelNode) {
            var waitingLabelElement = waitingLabelNode as Element;

            if (waitingLabelElement.tagName == "SMALL")
            {
                waitingLabelElement.childNodes.forEach(function (textElementNode) {
                    var textElement = textElementNode as Element;

                    if (textElement.tagName == "EM")
                    {
                        // The text content is in the EM tag
                        if (textElement.firstChild?.textContent) {
                            textElement.firstChild.textContent = translateMenu(textElement.firstChild.textContent);
                        }
                    }
                    else if (textElement.tagName != "BR")
                    {
                        // The remaining non-line break is a regular text node including the Pokémon name
                        if (textElement.textContent)
                        {
                            // Translate the message depending on the selected option
                            if (textElement.textContent.includes(" will be "))
                            {
                                // A Lead has been selected
                                var optionSplit = textElement.textContent.split(" will ");

                                // Separate the Pokémon name and the rest of the sentence, then translate them both
                                textElement.textContent = translatePokemonName(optionSplit[0]) + " "
                                    + translateMenu(textElement.textContent.slice(optionSplit[0].length));
                            }
                            else if (textElement.textContent.includes(" will use "))
                            {
                                // A Move has been selected
                                var optionPokemonSplit = textElement.textContent.split(" will ");
                                var optionMoveSplit = textElement.textContent.split(" use ");

                                console.log(textElement.textContent.slice(optionPokemonSplit[0].length, - optionMoveSplit[1].length - 1));

                                // Separate the Pokémon name, the Move and the rest of the sentence, then translate them all
                                textElement.textContent = translatePokemonName(optionPokemonSplit[0]) + " "
                                    + translateMenu(textElement.textContent.slice(optionPokemonSplit[0].length, - optionMoveSplit[1].length)) + " "
                                    + translateMove(optionMoveSplit[1].slice(0,-1)) + ".";
                            }
                            else if (textElement.textContent.includes(" will switch "))
                            {
                                // A Move has been selected
                                var switchInSplit = textElement.textContent.split(" will ");
                                var switchOutSplit = textElement.textContent.split(" replacing ");

                                console.log(textElement.textContent.slice(switchInSplit[0].length, - switchOutSplit[1].length - 1));

                                // Separate the Pokémon names and the rest of the sentence, then translate them all
                                textElement.textContent = translatePokemonName(switchInSplit[0]) + " "
                                    + translateMenu(textElement.textContent.slice(switchInSplit[0].length, - switchOutSplit[1].length)) + " "
                                    + translatePokemonName(switchOutSplit[1].slice(0,-1)) + ".";
                            }
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
        })
    })
}

function updatePokemonStatus(pokemonMainElement: Element)
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
                        var statusBuffs = statusBuffsNode as Element;

                        if (statusBuffs.textContent)
                        {
                            // Buffs and debuffs
                            if (["bad", "good"].includes(statusBuffs.className)) {
                                // Translate stat
                                var buffStatSplit = statusBuffs.textContent.split(" ")
                                statusBuffs.textContent = buffStatSplit[0] + " " + translateStat(buffStatSplit[1]);
                            }
                            // Status condition
                            else {
                                statusBuffs.textContent = translateCondition(statusBuffs.textContent);
                            }
                        }
                    })
                }
            })
        }
    })
}

function updateTimerButton(timerElement: Element)
{
    // Translate Timer button
    if (timerElement.lastChild?.textContent) {
        timerElement.lastChild.textContent = translateMenu(timerElement.lastChild.textContent);
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
	if (spriteImage.tagName == "IMG")
	{
		// Check that the alt attribute is a valid type
		if (isValidEnglishType(spriteImage.alt)) {
			// Use the french type sprite
			spriteImage.src = SpriteURL + "French_Type_" + spriteImage.alt + ".png"
			spriteImage.className = "";
		}
	}
}