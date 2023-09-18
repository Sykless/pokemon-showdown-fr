import { isValidEnglishItem, isValidEnglishMove, isValidEnglishPokemonName, isValidEnglishEffect, isValidEnglishType, translateWeather, PokemonDico, ItemsDico, MovesDico, AbilitiesDico, NaturesDico, TypesDico, translateRegexBattleMessage, MovesLongDescDico, translateMoveEffect, isValidEnglishMoveEffect, MovesShortDescDico, isValidEnglishMenu, isValidEnglishAbility, isValidEnglishWeather, isValidEnglishBoostEffect, translateBoostEffect, DEBUG, filterWhitelistedUsernames } from "../translator";
import { translateAbility, translateEffect, translateItem, translateMenu, translateMove, translatePokemonName, translateStat, translateType }  from "../translator"; 
import { PLAY_SHOWDOWN_HOST, REPLAYS_SHOWDOWN_HOST } from "../translator";

console.log("BattleTranslate successfully loaded !");

const HP = 0, ABILITY = 1, POSSIBLE_ABILITIES = 2, ITEM = 3, STATS = 4, SPEED = 5, UNKNOWN = 6;

// If a Battle is reloaded, the original code is not counted as a page change
// So we need to translate it if needed
if (window.location.host == PLAY_SHOWDOWN_HOST) {
    translateBattleHomePage();
}
else if (window.location.host == REPLAYS_SHOWDOWN_HOST) {
    translateReplayBattlePage();
}

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
	// If the Battle tab is not visible, stop the mutation observation
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
            var oldNodes = mutations[i].removedNodes;

			for (var j = 0, node; (node = newNodes[j]); j++)
			{
				var newElement = node as Element;
                var parentElement = mutations[i].target as Element;

                var elementClasses = newElement.classList;
                var parentClasses = parentElement.classList;

                // Don't want to add a break everytime a match is found
                // so instead we add a boolean that changes when no match is found
                var translatedElement = true;

                if (DEBUG) console.log(newElement.outerHTML);

                if (newElement.id)
                {
                    // New user joined
                    if (newElement.id.match(/^battle-(.*)-userlist-user-(.*)$/))
                    {
                        updateUserCountFromUsername(parentElement);
                        hideUsername(newElement);
                    }
                }

                if (elementClasses)
                {
                    // The whole room has been loaded
                    if (elementClasses.contains("innerbattle"))
                    {
                        // console.log("Whole room, rien d'intéressant : " + newElement.outerHTML);
                    }
                    // Whole replay has been loaded
                    else if (elementClasses.contains("pfx-body")) {
                        var uploadDate = document.getElementsByClassName("uploaddate");

                        if (uploadDate.length > 0) {
                            updateUploadDateLabel(uploadDate[0])
                        }
                    }
                    // Trainer sprite has been loaded
                    else if (elementClasses.contains("trainer"))
                    {
                        updateTrainerElement(newElement);
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
                    // Replays options button (Speed, Music, etc)
                    else if (elementClasses.contains("chooser"))
                    {
                        updateReplayChooser(newElement)
                    }
                    // Replays action button (Play, Go to turn, Download, etc)
                    else if (elementClasses.contains("replayDownloadButton")
                        || (newElement.tagName == "BUTTON" && newElement.getAttribute("data-action")))
                    {
                        updateActionButton(newElement);
                    }
                    // Replays Play buttons
                    else if (elementClasses.contains("playbutton"))
                    {
                        updateReplayPlayButtons(newElement);
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
                        // console.log("battle-log-add : " + newElement.outerHTML)
                        // This room is expired
                        // Connecting...
                        // <form><button name="login">Join chat</button></form>
                    }
                    // Chat message
                    else if (elementClasses.contains("chat"))
                    {
                        updateChatElement(newElement);
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
                    // Rated Battle Label
                    else if (elementClasses.contains("rated"))
                    {
                        updateRatedBattle(newElement);
                    }
                    // Upload date label
                    else if (newElement.tagName == "P" && newElement.firstElementChild?.classList?.contains("uploaddate"))
                    {
                        updateUploadDateLabel(newElement.firstElementChild);
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

            for (var j = 0, node; (node = oldNodes[j]); j++)
            {
                var oldElement = node as Element;
                var parentElement = mutations[i].target as Element;

                if (oldElement.id)
                {
                    // User left
                    if (oldElement.id.match(/^battle-(.*)-userlist-user-(.*)$/))
                    {
                        updateUserCountFromUsername(parentElement)
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
    var replayElement = document.querySelectorAll('.replay-wrapper')

    var battleOpen = false;

    if (replayElement.length > 0) {
        return true;
    }

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

                // Pokemon type sprite
                if (pokemonInfo.tagName == "IMG") {
                    updatePokemonTypeSprite(pokemonInfo as HTMLImageElement);
                }
                // Pokemon type sprite put inside a SPAN tag
                else if (pokemonInfo.tagName == "SPAN" && pokemonInfo.classList.contains("textaligned-typeicons")) {
                    pokemonInfo.childNodes.forEach(function (pokemonTypeNode) {
                        var pokemonType = pokemonTypeNode as Element;

                        if (pokemonType.tagName == "IMG") {
                            updatePokemonTypeSprite(pokemonType as HTMLImageElement);
                        }
                    })
                }
                // Level/Alternate form/Tera Type
                else if (pokemonInfo.tagName == "SMALL")
                {
                    pokemonInfo.childNodes.forEach(function (pokemonSubInfoNode) {
                        var pokemonSubInfo = pokemonSubInfoNode as Element;

                        // Tera Type sprite
                        if (pokemonSubInfo.tagName == "IMG") {
                            updatePokemonTypeSprite(pokemonSubInfo as HTMLImageElement);
                        }
                        // Tera Type sprite put inside a SPAN tag
                        else if (pokemonSubInfo.tagName == "SPAN" && pokemonSubInfo.classList.contains("textaligned-typeicons")) {
                            pokemonSubInfo.childNodes.forEach(function (pokemonTeraTypeNode) {
                                var pokemonTeraType = pokemonTeraTypeNode as Element;

                                if (pokemonTeraType.tagName == "IMG") {
                                    updatePokemonTypeSprite(pokemonTeraType as HTMLImageElement);
                                }
                            })
                        }
                        // Text content
                        else if (pokemonSubInfo.textContent)
                        {
                            if (pokemonSubInfo.textContent.startsWith("(") && pokemonSubInfo.textContent.endsWith(")"))
                            {
                                var parenthesisContent = pokemonSubInfo.textContent.slice(1,-1);

                                // Alternate form
                                if (isValidEnglishPokemonName(parenthesisContent)) {
                                    parenthesisContent = translatePokemonName(parenthesisContent);
                                }
                                // Transformed Pokémon 
                                else if (parenthesisContent.startsWith("Transformed into ")) {
                                    parenthesisContent = translateMenu("Transformed into ")
                                        + translatePokemonName(parenthesisContent.replace("Transformed into ", ""));
                                }
                                // New forme
                                else if (parenthesisContent.startsWith("Changed forme: ")) {
                                    parenthesisContent = translateMenu("Changed forme: ")
                                        + translatePokemonName(parenthesisContent.replace("Changed forme: ", ""));
                                }
                                // Default try to transalte as Menu element
                                else {
                                    parenthesisContent = translateMenu(parenthesisContent);
                                }

                                pokemonSubInfo.textContent = "(" + parenthesisContent + ")";
                            }
                            // Tera Type label
                            else if (pokemonSubInfo.textContent == "(Tera Type: ") {
                                pokemonSubInfo.textContent = "(" + translateMenu("Tera Type") + " : ";
                            }
                            else {
                                pokemonSubInfo.textContent = pokemonSubInfo.textContent.replace("L","N");
                            }
                        }
                    })
                }
                // Pokémon name
                else if (pokemonInfo.tagName != "BR")
                {
                    if (pokemonInfo.textContent)
                    {
                        // If the next element is not a line break, a space has been added at the end of the name
                        if ((pokemonInfo.nextSibling as Element).tagName != "BR") {
                            pokemonInfo.textContent = translatePokemonBattleName(pokemonInfo.textContent.slice(0,-1)) + " ";
                        }
                        else {
                            pokemonInfo.textContent = translatePokemonBattleName(pokemonInfo.textContent);
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
                if (!["BR", "SMALL"].includes(moveElement.tagName) && moveElement.textContent)
                {
                    // Some moves have a • character at the beginning of their name
                    if (moveElement.textContent.startsWith("• ")) {
                        if (moveElement.textContent.endsWith(" ")) {
                            moveElement.textContent = "• " + translateMove(moveElement.textContent.slice(2,-1)) + " ";
                        }
                        else {
                            moveElement.textContent = "• " + translateMove(moveElement.textContent.slice(2));
                        }
                    }
                    // Some moves have the • character in another tag, but the space is still there
                    else if (moveElement.textContent.startsWith(" ")) {
                        if (moveElement.textContent.endsWith(" ")) {
                            moveElement.textContent = " " + translateMove(moveElement.textContent.slice(1,-1)) + " ";
                        }
                        else {
                            moveElement.textContent = " " + translateMove(moveElement.textContent.slice(1));
                        }
                    }
                    // Move-related message (Zoroark)
                    else if (moveElement.textContent.startsWith("(")) {
                        moveElement.textContent = translateMenu(moveElement.textContent);
                    }
                }
            })
        }
        // Sub infos (Item, Ability, etc)
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
                    // Estimated speed
                    else if (currentDisplayedInfo == SPEED) {
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
                        // Changed Ability (through Transform for example)
                        if (tooltipSubInfoElement.textContent.includes(" (base: ")) {
                            var abilities = tooltipSubInfoElement.textContent.split(" (base: ");

                            tooltipSubInfoElement.textContent = " " + translateAbility(abilities[0].slice(1)) // Current Ability
                                + translateMenu(" (base: ") // Separator
                                + translateAbility(abilities[1].slice(0,-1)) + ")"
                        }
                        // Ability is on the same line as Item for the switches tooltips so it ends with " / "
                        // Remove all styling, translate the ability and reformat it
                        else if (tooltipSubInfoElement.textContent.includes(" / ")) { 
                            tooltipSubInfoElement.textContent = " " + translateAbility(
                                tooltipSubInfoElement.textContent.replace(" / ","").slice(1)) + " / ";
                        }
                        // Just remove the space at the beginning
                        else {
                            tooltipSubInfoElement.textContent = " " + translateAbility(tooltipSubInfoElement.textContent.slice(1))
                        }
                    }
                    // Item
                    else if (currentDisplayedInfo == ITEM)
                    {
                        if (tooltipSubInfoElement.textContent.includes(" (")) {
                            var itemInfos = tooltipSubInfoElement.textContent.split(" (");
                            var itemEffect = itemInfos[1].split("was ");

                            if (itemEffect.length > 1)
                            {
                                // Old item
                                if (itemEffect[0] == "") {
                                    tooltipSubInfoElement.textContent = " " + translateItem(itemInfos[0].slice(1))
                                        + " (était " + translateItem(itemEffect[1].slice(0,-1)) + ")"
                                }
                                // Old item + effect
                                else {
                                    tooltipSubInfoElement.textContent = " " + translateItem(itemInfos[0].slice(1))
                                        + " (" + translateItem(itemEffect[0].slice(0,-1)) + " a été " + translateMenu(itemEffect[1].slice(0,-1)) + ")";
                                }
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
                    // HP, don't translate values - however status specific cases could be present
                    else if (currentDisplayedInfo == HP)
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
                        else if (tooltipSubInfoElement.textContent == " (fainted)") {
                            tooltipSubInfoElement.textContent = translateMenu(" (fainted)");
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
                if (!moveHeader.tagName && moveHeader.textContent?.trim())
                {
                    // Get original move if Z-Move
                    if (moveHeader.textContent.startsWith("Z-")) {
                        moveName = moveHeader.textContent.slice(2);
                    }
                    // Regular move
                    else {
                        moveName = moveHeader.textContent;
                    }
                    
                    moveHeader.textContent = translateBattleMove(moveHeader.textContent);
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
                            // In hardcore mode or if there's no long desc, display short desc
                            var frenchDesc = app.curRoom?.battle?.hardcoreMode || !MovesLongDescDico[moveName] ? 
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
                    var baseAccuracy = tooltipElement.textContent.replace("Accuracy: ", "");
                    var baseAccuracyEffect = baseAccuracy.split(" (");

                    if (baseAccuracyEffect.length > 1)
                    {
                        tooltipElement.textContent = translateMenu("Accuracy: ") // Accuracy label
                            + translateMenu(baseAccuracyEffect[0]) + " (" // Accuracy value (could also be a label - can't miss)
                            + updateBoostEffect(baseAccuracyEffect); // Translated boost effect
                    }
                    else {
                        tooltipElement.textContent = translateMenu("Accuracy: ") // Accuracy label
                            + translateMenu(baseAccuracy); // Accuracy value (could also be a label - can't miss)
                    }
                }
                // Base Power, translate title and potential label
                else if (tooltipElement.textContent.startsWith("Base power: ")) {
                    var basePower = tooltipElement.textContent.replace("Base power: ", "");
                    var basePowerEffect = basePower.split(" (");

                    if (basePowerEffect.length > 1)
                    {
                        tooltipElement.textContent = translateMenu("Base power: ") // Base power label
                            + basePowerEffect[0] + " (" // Base power value
                            + updateBoostEffect(basePowerEffect); // Translated boost effect
                    }
                    else {
                        tooltipElement.textContent = translateMenu("Base power: ") // Base power label
                            + basePower // Base power value
                    }
                }
                // Z-Effect, translate title and label
                else if (tooltipElement.textContent.startsWith("Z-Effect: ")) {
                    var zEffect = tooltipElement.textContent.replace("Z-Effect: ", "");
                    var zTranslatedEffect = "";

                    // Predetermined Z-Effect
                    if (isValidEnglishMenu(zEffect)) {
                        zTranslatedEffect = translateMenu(zEffect);
                    }
                    // Stats boost
                    else if (zEffect.includes("+")) {
                        var statsBoosts = zEffect.split(", ");

                        for (var i = 0 ; i < statsBoosts.length ; i++) {
                            zTranslatedEffect += translateStat(statsBoosts[i].slice(0,-3)) // Boosted Stat
                                + statsBoosts[i].slice(-3) // Boost value
                                + (i < statsBoosts.length - 1 ? ", " : "") // Comma, if needed
                        }
                    }
                    // Default : keep the Z-Effect in english
                    else {
                        zTranslatedEffect = zEffect;
                    }

                    tooltipElement.textContent = translateMenu("Z-Effect: ") + zTranslatedEffect;
                }
            }
        }
    })
}

function updateBoostEffect(effectArray: String[])
{
    var translatedBoosts = "";

    for (var i = 1 ; i < effectArray.length ; i++)
    {
        var boostEffect = effectArray[i].split("× from " );

        // Boost value provided
        if (boostEffect.length > 1)
        {
            var translatedBoostEffect = translatePossibleBoostOrigin(boostEffect[1].slice(0,-1)) // Remove parenthesis at the end
            
            translatedBoosts += "×" + boostEffect[0] + " grâce à " + translatedBoostEffect + ")" // Boost effect
                + (i < effectArray.length - 1 ? " (" : ""); // Add parenthesis for next boost if needed
        }
        // No boost value, only the boost effect
        else {
            var translatedBoostEffect = translatePossibleBoostOrigin(effectArray[i].slice(0,-1)) // Remove parenthesis at the end

            translatedBoosts += translatedBoostEffect + ")" // Boost effect
                + (i < effectArray.length - 1 ? " (" : ""); // Add parenthesis for next boost if needed
        }
    }

    return translatedBoosts;
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
                        // Gen mechanic (Mega Evolution, Z-Move, Dynamax) or message
                        else if (["LABEL", "EM"].includes(moveButtonElement.tagName)) {
                            moveButtonElement.childNodes.forEach(function (mechanicNode) {
                                var mechanicElement = mechanicNode as Element;

                                // Only translate raw or strong text element
                                if (mechanicElement.textContent && (!mechanicElement.tagName || mechanicElement.tagName == "STRONG")) {
                                    mechanicElement.textContent = translateMenu(mechanicElement.textContent);
                                }
                                // Terastallize type
                                else if (mechanicElement.tagName == "IMG") {
                                    updatePokemonTypeSprite(mechanicElement as HTMLImageElement);
                                }
                            })
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
                    switchOption.childNodes.forEach(function (switchNode)
                    {
                        var switchElement = switchNode as Element;

                        // Switch option
                        if (switchElement.tagName == "BUTTON") {
                            switchElement.childNodes.forEach(function (pokemonButtonNode) {
                                var pokemonButton = pokemonButtonNode as Element;
    
                                // The only non-span element is the Pokémon name
                                if (pokemonButton.tagName != "SPAN" && pokemonButton.textContent) {
                                    pokemonButton.textContent = translatePokemonName(pokemonButton.textContent);
                                }
                            })
                        }
                        // Trapped message
                        else if (switchElement.tagName == "EM") {
                            switchElement.childNodes.forEach(function (switchMessageNode) {
                                var switchMessage = switchMessageNode as Element;

                                // Only translate raw or strong text element
                                if (switchMessage.textContent && (!switchMessage.tagName || switchMessage.tagName == "STRONG")) {
                                    switchMessage.textContent = translateMenu(switchMessage.textContent);
                                }
                            })
                        }
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
                moveButton.textContent = translateBattleMove(moveButton.textContent);
            }
        }
    })
}

function updateTrainerElement(trainerElement: Element)
{
    trainerElement.childNodes.forEach(function (trainerContentNode) {
        var trainerContent = trainerContentNode as Element;

        // Hide Trainer name
        if (trainerContent.tagName == "STRONG" && trainerContent.textContent) {
            trainerContent.textContent = filterWhitelistedUsernames(trainerContent.textContent);
        }
        // Translate ranking if present
        else if (trainerContent.tagName == "DIV")
        {
            var trainerSprite = trainerContent as HTMLDivElement;

            if (trainerSprite.classList?.contains("trainersprite") && trainerSprite.title?.startsWith("Rating: ")) {
                trainerSprite.title = translateMenu("Rating: ") + trainerSprite.title.replace("Rating: ", "");
            } 
        }
    })
}

function updateReplayChooser(chooserElement: Element)
{
    chooserElement.childNodes.forEach(function (chooserContentNode) {
        var chooserContent = chooserContentNode as Element;

        // Name label
        if (chooserContent.tagName == "EM" && chooserContent.textContent) {
            chooserContent.textContent = translateMenu(chooserContent.textContent);
        }
        // Action buttons node, iterate on children to translate labels
        else if (chooserContent.tagName == "DIV") {
            chooserContent.childNodes.forEach(function (actionButtonNode) {
                var actionButton = actionButtonNode as Element;

                if (actionButton.tagName == "BUTTON" && actionButton.textContent) {
                    actionButton.textContent = translateMenu(actionButton.textContent);
                }
            })
        }
    })
}

function updateActionButton(actionButtonElement: Element)
{
    actionButtonElement.childNodes.forEach(function (actionButtonContentNode) {
        var actionButtonContent = actionButtonContentNode as Element;

        // Only translate raw text (Action label)
        if (!actionButtonContent.tagName && actionButtonContent.textContent) {
            actionButtonContent.textContent = translateMenu(actionButtonContent.textContent);
        }
    })
}

function updateReplayPlayButtons(playButtonElement: Element)
{
    playButtonElement.childNodes.forEach(function (playButtonContentNode) {
        playButtonContentNode.childNodes.forEach(function (buttonNode) {
            var buttonElement = buttonNode as Element;

            // Only translate raw text (Play label)
            if (!buttonElement.tagName && buttonElement.textContent) {
                buttonElement.textContent = translateMenu(buttonElement.textContent);
            }
        })
    })
}

function updateUploadDateLabel(uploadLabel: Element)
{
    uploadLabel.childNodes.forEach(function (uploadDateNode) {
        var uploadDateElement = uploadDateNode as Element;

        if (uploadDateElement.textContent)
        {
            // Raw text label
            if (uploadDateElement.tagName == "EM") {
                uploadDateElement.textContent = translateMenu(uploadDateElement.textContent);
            }
            // Actual upload date
            else if (!uploadDateElement.tagName) {
                var uploadDate = uploadDateElement.textContent.split(" ");

                // Less than 3 spaces is the elo rating, we don't translate that
                if (uploadDate.length > 3) {
                    uploadDateElement.textContent = " " + uploadDate[2].slice(0,-1) // Day (without the comma at the end)
                        + " " + translateMenu(uploadDate[1]) // Translated Month
                        + " " + uploadDate[3] // Year
                        + (uploadDate.length > 4 ? " " + uploadDate[4] + " " : "") // Separator
                }
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
        // Boost from Paradox ability
        else if (newElement.textContent.includes(": ")) {
            // Retrieve content before the ":"
            var buffStatSplit = newElement.textContent.split(": ");
            var supposedAbility = buffStatSplit[0].replace(" ", " ");

            // Status split with ":" could be either an Ability or a regular Effect
            if (isValidEnglishAbility(supposedAbility)) {
                newElement.textContent = translateAbility(supposedAbility) + " : " + translateStat(buffStatSplit[1]);
            }
            else {
                newElement.textContent = translateEffect(supposedAbility) + " : " + buffStatSplit[1];
            }
        }
        // Status condition
        else {
            newElement.textContent = translateEffect(newElement.textContent.replace(/ /g, " "));
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
            if (isValidEnglishEffect(textInfoTag.textContent.replace(" ", " "))) {
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

function translatePossibleBoostOrigin(boostOrigin: string)
{
    if (isValidEnglishBoostEffect(boostOrigin)) {
        return translateBoostEffect(boostOrigin);
    }
    else if (isValidEnglishItem(boostOrigin)) {
        return translateItem(boostOrigin);
    }
    else if (isValidEnglishAbility(boostOrigin)) {
        return translateAbility(boostOrigin);
    }
    else if (isValidEnglishWeather(boostOrigin)) {
        return translateWeather(boostOrigin);
    }
    // Default : keep english translation
    else {
        return boostOrigin;
    }
}

function translatePokemonBattleName(pokemonName: string)
{
    // Alternate form could be hidden in team preview (Urshifu for exemple)
    if (pokemonName.endsWith("-*")) {
        return translatePokemonName(pokemonName.slice(0,-2)) + "-*"
    }
    // Regular Pokémon name
    else {
        return translatePokemonName(pokemonName);
    }
}

function translateBattleMove(moveName: string)
{
    // Could be a Z-move
    if (moveName.startsWith("Z-")) {
        return translateMove(moveName.slice(2)) + " Z"
    }
    // Regular Pokémon name
    else {
        return translateMove(moveName);
    }
}

function isValidEnglishBattleMove(moveName: string)
{
    // Could be a Z-move
    if (moveName.startsWith("Z-")) {
        return isValidEnglishMove(moveName.slice(2))
    }
    // Regular Pokémon name
    else {
        return isValidEnglishMove(moveName);
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
                else if (isValidEnglishBattleMove(messagePart.textContent)) {
                    messagePart.textContent = translateBattleMove(messagePart.textContent);
                }
                // Specific case : trainer's team
                else if (messagePart.textContent.endsWith("'s team:")) {
                    messagePart.textContent = translateMenu("'s team:") + messagePart.textContent.replace("'s team:", "") + " :";
                }
            }
            // <em> tag : Pokémon team
            else if (messagePart.tagName == "EM") {
                var translatedTeam = "";
                var splittedTeam = messagePart.textContent.split(" / ");
                
                // Translate each Pokémon name
                for (var i = 0 ; i < splittedTeam.length ; i++)
                {
                    translatedTeam += translatePokemonBattleName(splittedTeam[i])
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

function updateChatElement(messageElement: Element)
{
    // Chat message sent by player
    if (isChatMessage(messageElement))
    {
        messageElement.childNodes.forEach(function (chatNode) {
            var chatElement = chatNode as Element;

            // Trainer name
            if (chatElement.tagName == "STRONG") {
                chatElement.childNodes.forEach(function (trainerElementNode) {
                    var trainerElement = trainerElementNode as Element;

                    // Hide non-Redemption trainer name
                    if (trainerElement.tagName == "SPAN" && trainerElement.className == "username" && trainerElement.textContent) {
                        trainerElement.textContent = filterWhitelistedUsernames(trainerElement.textContent);
                    }
                })
            }
            // Chat message
            else if (chatElement.tagName == "EM" && chatElement.textContent && /!.* <".*">/.test(chatElement.textContent)) {
                // '"<>"' is a tag indicating that we can remove the message
                messageElement.parentElement?.removeChild(messageElement);
            }
        })
    }
    // Not a message, check if the message could be a command result
    else if (app.curRoom?.chatHistory?.lines?.length > 0)
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
        // Default (Rating) : Translate raw text element
        else {
            messageElement.childNodes.forEach(function (chatNode) {
                var charElement = chatNode as Element;

                if (charElement.textContent && !charElement.tagName) {
                    charElement.textContent = translateRegexBattleMessage(charElement.textContent);
                }
            })
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

function translateReplayBattlePage()
{
    var replayWrapper = document.getElementsByClassName("replay-wrapper");

    if (replayWrapper.length > 0) {
        replayWrapper[0].childNodes.forEach(function (replayWrapperNode) {
            var replayWrapperElement = replayWrapperNode as Element;

            // Download button
            if (replayWrapperElement.classList?.contains("replayDownloadButton")) {
                updateActionButton(replayWrapperElement)
            }
            // Back to Home button
            else if (replayWrapperElement.classList?.contains("pfx-backbutton")) {
                updateActionButton(replayWrapperElement);
            }
            // Upload date label
            else if (replayWrapperElement.tagName == "P" && replayWrapperElement.firstElementChild?.classList?.contains("uploaddate")) {
                updateUploadDateLabel(replayWrapperElement.firstElementChild);
            }
            // Action buttons (Play, Next turn, etc)
            else if (replayWrapperElement.className == "replay-controls") {
                replayWrapperElement.childNodes.forEach(function (actionButtonNode) {
                    var actionButton = actionButtonNode as Element;

                    if (actionButton.tagName == "BUTTON" && actionButton.getAttribute("data-action")) {
                        updateActionButton(actionButton);
                    }
                })
            }
            // Options button (Speed, Music, etc)
            else if (replayWrapperElement.className == "replay-controls-2") {
                replayWrapperElement.childNodes.forEach(function (chooserButtonNode) {
                    var chooserButton = chooserButtonNode as Element;

                    if (chooserButton.classList?.contains("chooser")) {
                        updateReplayChooser(chooserButton);
                    }
                })
            }
            // Battle element
            else if (replayWrapperElement.className == "battle") {
                replayWrapperElement.childNodes.forEach(function (battleNode) {
                    var battleElement = battleNode as Element;

                    // Actual battle, only translate trainer title (rating)
                    if (battleElement.className == "innerbattle") {
                        var trainersElements = battleElement.getElementsByClassName("trainer");

                        for (var i = 0 ; i < trainersElements.length ; i++) {
                            updateTrainerElement(trainersElements[i]);
                        }
                    }
                    // Battle options (Play button)
                    else if (battleElement.className == "playbutton") {
                        updateReplayPlayButtons(battleElement);
                    }
                })
            }
            // Battle logs element
            else if (replayWrapperElement.className == "battle-log") {
                replayWrapperElement.childNodes.forEach(function (battleLogNode) {
                    var battleLogElement = battleLogNode as Element;

                    if (battleLogElement.classList?.contains("message-log")) {
                        battleLogElement.childNodes.forEach(function (originalLogNode) {
                            var originalLog = originalLogNode as Element;

                            // Battle rules
                            if (originalLog.className == "") {
                                updateBattleRules(originalLog);
                            }
                            // Rated battle label
                            else if (originalLog.className == "rated") {
                                updateRatedBattle(originalLog);
                            }
                            // Showdown battle message
                            else if (originalLog.classList?.contains("battle-history")) {
                                updateShowdownMessage(originalLog);
                            }
                            // Default : chat message
                            else {
                                updateChatElement(originalLog);
                            }
                        })
                    }
                })
            }
        })   
    }
}

function translateBattleHomePage()
{
    var battlePage = document.querySelectorAll('*[id^="room-battle-"]');

    if (battlePage.length > 0) {
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
    if (usernameElement.classList?.contains("battle-userlist")) {
        updateBattleElements(usernameElement);
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

function updateRatedBattle(ratedBattleElement: Element)
{
    var ratedTextElement = ratedBattleElement.firstElementChild;

    if (ratedTextElement?.textContent
        && ratedTextElement.tagName == "STRONG"
        && ratedTextElement.childElementCount == 0)
    {
        // Translate strong child
        ratedTextElement.textContent = translateMenu(ratedTextElement.textContent);
    }
}

function hideUsername(trainerElement: Element)
{
    trainerElement.childNodes.forEach(function (trainerInfoNode) {
        var trainerInfo = trainerInfoNode as Element;

        if (trainerInfo.tagName == "BUTTON" && trainerInfo.classList.contains("username")) {
            trainerInfo.childNodes.forEach(function (trainerNameNode) {
                var trainerName = trainerNameNode as Element;

                if (trainerName.tagName == "SPAN" && trainerName.textContent) {
                    trainerName.textContent = filterWhitelistedUsernames(trainerName.textContent);
                }
            })
        }
    })
}

function getCurrentDisplayedInfo(infoTitle: string)
{
    if (infoTitle.includes("HP")) {
        return HP;
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