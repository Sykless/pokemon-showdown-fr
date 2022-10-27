import { PokemonDico, AbilitiesDico, MovesDico, ItemsDico, TypesDico, StatsDico, MovesShortDescDico, ItemsShortDescDico, AbilitiesShortDescDico, ItemsLongDescDico, AliasDico } from '../translator';
	
import { isValidFrenchPokemonName, isValidFrenchItem, isValidFrenchAbility, isValidFrenchMove } from '../translator';

import { isValidEnglishPokemonName, isValidEnglishItem, isValidEnglishAbility, isValidEnglishMove, isValidEnglishType} from '../translator';

import { CosmeticForms } from '../translator';

import {translatePokemonName, translateAbility, translateMove, translateItem, translateType, 
	translateHeader, translateFilter, translateMenu,  translateStat, translateNature, translatePokemonTeam } from '../translator';

// TODO
// Don't show duplicate Pokémon/Item (english/french name)
// Don't update multiple times the same node through childNode mutation
// Matching searches in Item/Ability/Move research (Hidden Power small ?)
// Details utilichart
// Translate non-text node with TreeWalker in order to not trigger observer
// Conjuger les objets
// One-gender only (Boréas-Totem)
// For -> mysticwater ???
// Specific to Tapu Koko (item)

// HIDDEN TEXT
// "Couldn't search: You are already searching for a ${formatid} battle." (.popup)
// The battle you're looking for has expired (class ps-overlay)
// Illegal team when entering a battle

console.log("TeambuilderTranslate successfully loaded !");

// Variable defined by Showdown containing every piece of data
// (Pokémon names, moves, abilities) needed in the teambuilder research
declare var BattleSearchIndex: any;
declare var BattleSearchIndexOffset: any;
declare var BattlePokedex: any;
declare var BattleAbilities: any;
declare var BattleItems: any;
declare var BattleMovedex: any;
declare var BattleTeambuilderTable: any;
declare var app: any;

// Backup the BattlePokedex, BattleAbilities and BattleItems variables, we need them
// to erase incorrect entries (see updatePokemonInfo method)
const originalBattlePokedex = structuredClone(BattlePokedex);
const originalBattleAbilities = structuredClone(BattleAbilities);
const originalBattleItems = structuredClone(BattleItems);
const originalBattleMovedex = structuredClone(BattleMovedex);

const FRENCH = 0;
const ENGLISH = 1;
const SEARCH_TYPE = 2;

// If Teambuilder is reloaded, the original code is not counted as a page change
// So we need to translate it if needed
translateTeambuilderHomePage();

// The injected script cannot access chrome.runtime.getURL
// So we need to catch an event from the content script that sends it
var SpriteURL = "";

window.addEventListener('RecieveContent', function(evt: any) {
	SpriteURL = evt.detail;
});

// When Teambuilder first loads, update the BattleSearchIndex
updateBattleSearchIndex();
reorderBattleTeambuilderTable();

// Create a MutationObserver element in order to track every page change
// So we can it dynamically translate new content
var observer = new MutationObserver(onMutation);

observer.observe(document, {
	childList: true, // report added/removed nodes
	subtree: true,   // observe any descendant elements

	// Catch any class modification
	attributes: true,
	attributeFilter: ['class', 'value']
});

// Everytime a new element is added to the page, onMutation method is called
function onMutation(mutations: MutationRecord[])
{
	// If the Teambuilding tab is not visible, stop the mutation observation
	if (!isTeambuilderOpen()) {
		return;
	}

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
				var elementClasses = newElement.classList;

				// console.log(newElement.outerHTML);

				// Teambuilder home : teams list
				// Teampane element is only updated on page init, so we need to check the children mutations
				if (parentElement.className == "teampane")
				{
					updateTeampaneElement(newElement);
				}
				else if (parentElement.className == "teambuilder-import-smogon-sets")
				{
					updateSetImportElement(newElement);
				}

				if (elementClasses)
				{
					// Teambuilder home : folders list
					if (elementClasses.contains("folderlist"))
					{
						updateFolderList(newElement);
					}
					// Whole page has been loaded
					else if (elementClasses.contains("teamwrapper"))
					{
						updateTeamWrapper(newElement);
					}
					// A search field has been updated
					else if (elementClasses.contains("utilichart"))
					{
						// We can't catch input search modification with MutationObserver, however everytime an input
						// is modified in some way, the utilichart component is updated,
						// so we still get a way to catch input modification
						updatePokemonInfo(null);
						updatePokemonTabList(null);

						// Update every search result
						for (var k = 0, result; (result = node.childNodes[k]) ; k++) {
							updateResultTag(result as Element);
						}
					}
					// New results after scrolling or copied element from clipboard
					else if (elementClasses.contains("result"))
					{
						// Clipboard result
						if (newElement.getAttribute("data-id")) {
							updateClipboardResult(newElement);
						}
						// Regular teambuilder result
						else {
							// Update every new result
							updateResultTag(newElement);
						}
						
					}
					// Pokémon info has been updated
					else if (elementClasses.contains("statrow-head"))
					{
						// When the stat block is updated, the element "Remaining EVs" is reset (if present)
						// So we need to re-translate it, but we don't need to update the whole StatForm component
						updateRemainingEVElement(document.querySelector(".graphcol"))
						
						// When a cosmetic form is selected, the stat block is updated (for some reason)
						// So we need to translate the cosmetic form
						updateInputPokemonName();
					}
					// Pokémon stats/nature interface has been loaded
					else if (elementClasses.contains("statform"))
					{
						updatePokemonInfo(null);
						updateStatForm(newElement);
					}
					else if (elementClasses.contains("detailcell"))
					{
						// If a detailcell is updated, just translate it again
						updatePokemonDetails(newElement);
					}
					// Pokémon details page (Level, Gender, etc) has been loaded
					else if (elementClasses.contains("detailsform"))
					{
						updatePokemonDetailsForm(newElement);
					}
					// Clipboard element has been regenerated
					else if (elementClasses.contains("teambuilder-clipboard-container"))
					{
						updateClipboardElement(newElement);
					}
					else
					{
						// console.log("Non-processed nodes : " + newElement.outerHTML);
					}
				}
			}
		}
		else if (mutations[i].type == "attributes")
		{
			var modifiedElement = mutations[i].target as Element;

			// Only update the Input classes
			if (modifiedElement.tagName == "INPUT") {
				removeInputIncompleteClass(modifiedElement as HTMLInputElement);
			}
		}
	}
}

function isTeambuilderOpen()
{
	var teambuilderElement = document.getElementById("room-teambuilder");
	var teambuilderStyle = teambuilderElement?.getAttribute("style");

	if (teambuilderStyle) {
		return !teambuilderStyle.includes("display: none");
	}

	return false;
}

function updateTeampaneElement(newElement: Element)
{
	newElement.childNodes.forEach(function (teampaneNode) {
		var teampaneElement = teampaneNode as Element;

		// Regular text menu
		if ((!teampaneElement.tagName || teampaneElement.className == "storage-warning")
			&& teampaneElement.textContent)
		{
			teampaneElement.textContent = translateMenu(teampaneElement.textContent);

			if (teampaneElement.textContent.startsWith("Score: ")) {
				teampaneElement.textContent = translateMenu("Score: ") + translateMenu(teampaneElement.textContent.replace("Score: ", ""));
			}

			// Rock paper scissors lizard spock result
			if (/(.*) (.*) (.*) (.*), so (.*)/.test(teampaneElement.textContent)) {
				var gameResult = teampaneElement.textContent.split(" ");

				teampaneElement.textContent = translateMenu(gameResult[0]) + " " // And
					 + translateMenu(gameResult[1]) + " " // Winner
					 + translateMenu(gameResult[2]) + " " // Adjective
					 + translateMenu(gameResult[3].replace(",","")) + ", " // Loser
					 + translateMenu(teampaneElement.textContent.replace(gameResult[0] + " " + gameResult[1] + " " + gameResult[2] + " " + gameResult[3] + " ", "")); // Rest of the sentence
			}
		}
		// Button or Strong tags usually have labels in them
		else if (["STRONG", "BUTTON"].includes(teampaneElement.tagName))
		{
			teampaneElement.childNodes.forEach(function (labelNode) {
				if (labelNode.textContent) {
					labelNode.textContent = translateMenu(labelNode.textContent);

					// Translate format team 
					if (labelNode.textContent.startsWith(" New") && labelNode.textContent.endsWith(" Team")) {
						labelNode.textContent = translateMenu(" New Team") + labelNode.textContent.replace(" New", "").replace(" Team", "");
					}
				}
			})
		}
		// Only translate the input placeholder
		else if (teampaneElement.tagName == "INPUT")
		{
			var inputElement = teampaneElement as HTMLInputElement;

			if (inputElement.placeholder) {
				inputElement.placeholder = translateMenu(inputElement.placeholder);
			}
		}
		// Team names
		else if (teampaneElement.tagName == "LI")
		{
			teampaneElement.childNodes.forEach(function (teamNode) {
				var teamElement = teamNode as Element;

				// Menu buttons
				if (teamElement.tagName == "BUTTON")
				{
					var teamButton = teamElement as HTMLButtonElement;
					var buttonChild = teamButton.lastChild as Element;

					// Translate hover label
					if (teamButton.title) {
						teamButton.title = translateMenu(teamButton.title);
					}

					if (buttonChild)
					{
						// Translate button label
						if (buttonChild.textContent) {
							buttonChild.textContent = translateMenu(buttonChild.textContent);
						}
						
						// Translate child hover label
						if (buttonChild.tagName == "I") {
							var childTitle = buttonChild.getAttribute("title");

							if (childTitle) {
								buttonChild.setAttribute("title", translateMenu(childTitle));
							}
						}
					}
				}
				// Team element
				else if (teamElement.classList.contains("team"))
				{
					teamElement.childNodes.forEach(function (teamTitleNode) {
						var teamTitleElement = teamTitleNode as Element;

						// Team name
						if (teamTitleElement.tagName == "STRONG" && teamTitleElement.textContent) {
							// Only translate the default team name
							teamTitleElement.textContent = translatePokemonTeam(teamTitleElement.textContent);
						}
						// Team members
						else if (teamTitleElement.tagName == "SMALL")
						{
							var teamMembers = teamTitleElement.firstChild as Element;

							// Empty team, translate label
							if (teamMembers?.tagName == "EM" && teamMembers.textContent) {
								teamMembers.textContent = translateMenu(teamMembers.textContent);
							}
						}
					})
				}
				// Empty team
				else if (teamElement.tagName == "P")
				{
					var emptyTeamElement = teamElement.firstChild as Element;

					if (emptyTeamElement.tagName == "EM" && emptyTeamElement.textContent)
					{
						emptyTeamElement.textContent = translateMenu(emptyTeamElement.textContent);

						if (emptyTeamElement.textContent.startsWith("you don't have any ") && emptyTeamElement.textContent.endsWith(" teams lol"))
						{
							emptyTeamElement.textContent = translateMenu("you don't have any teams ") 
								+ emptyTeamElement.textContent.replace("you don't have any ", "").replace("teams lol", "")
								+ "lol"
						}
					}
				}
			})
		}
	})
}

function updateFolderList(newElement: Element)
{
	newElement.childNodes.forEach(function (folderMainNode) {
		folderMainNode.childNodes.forEach(function (folderNode) {
			folderNode.childNodes.forEach(function (folderNameNode) {
				var folderElement = folderNameNode as Element;

				// Only the english labels are translated, not the tier names
				if (folderElement.className == "selectFolder" && folderElement.lastChild?.textContent) {
					folderElement.lastChild.textContent = translateMenu(folderElement.lastChild.textContent);
				}
				else if (folderElement.textContent) {
					folderElement.textContent = translateMenu(folderElement.textContent);
				}
			})
		})
	})
}

function updateResultTag(resultElement: Element)
{
	var displayedDataType = getDisplayedDataType(resultElement);

	if (displayedDataType == "pokemon")
	{
		updatePokemonName(resultElement);
		updatePokemonAbility(resultElement);
		updatePokemonType(resultElement);
		updatePokemonStats(resultElement);
	}
	else if (displayedDataType == "ability")
	{
		updateAbility(resultElement);
	}
	else if (displayedDataType == "move")
	{
		updateMove(resultElement);
	}
	else if (displayedDataType == "item")
	{
		updateItem(resultElement);
	}
	else if (displayedDataType == "type")
	{
		updateType(resultElement);
	}
	else if (displayedDataType == "header")
	{
		updateHeader(resultElement);
		updateSortFilters(resultElement);
		updateMoveAbilityFilter(resultElement);
	}
}

function updateClipboardResult(resultElement: Element)
{
	resultElement.childNodes.forEach(function (sectionNode) {
		sectionNode.childNodes.forEach(function (sectionContentNode) {
			var sectionContent = sectionContentNode as Element;

			// Pokémon name
			if (sectionContent.className == "species" && sectionContent.textContent) {
				sectionContent.textContent = translatePokemonName(sectionContent.textContent);
			}
			// Pokémon ability/item
			else if (sectionContent.className == "ability-item") {
				sectionContent.childNodes.forEach(function (moveAbilityNode) {
					var moveAbility = moveAbilityNode as Element;

					if (moveAbility.textContent)
					{
						// No previous sibling element is ability section
						if (!moveAbility.previousSibling) {
							moveAbility.textContent = translateAbility(moveAbility.textContent);
						}
						// No next sibling element is item section
						else if (!moveAbility.nextSibling) {
							moveAbility.textContent = translateItem(moveAbility.textContent);
						}
					}
				})
			}
			// Pokémon moves
			else if (sectionContent.className == "moves") {
				sectionContent.childNodes.forEach(function (moveAbilityNode)
				{
					// Translate move
					if (moveAbilityNode.textContent) {
						moveAbilityNode.textContent = translateMove(moveAbilityNode.textContent);
					}
				})
			}
		})
	})
}

function updateCurElement()
{
	// Cur element is the search result entry of the current selected Pokémon 
	// It is defined by the current Pokémon name, but since the current Pokémon name is in french, cur is bugged
	
	// For now we remove it, maybe we could find a way to retrieve 
	// every piece of information in order to manualy create it

	var curElements = document.getElementsByClassName("cur");

	for (var curID = 0 ; curID < curElements.length ; curID++)
	{
		var cur = curElements.item(curID);
		
		// Only remove the specific Pokemon search cur
		if (cur?.tagName == "A" && cur.parentElement?.tagName == "LI" && !cur.nextSibling)
		{
			var attribute = cur.getAttribute('data-entry');

			if (attribute) {
				var displayedDataType = attribute.split("|")[0];
				var displayedValue = attribute.split("|")[1];
				var regularEnglishName = "";

				var curParent = cur.parentElement;

				// If the input name is a valid english name, cur element is fine, we don't do anything
				if (displayedDataType == "pokemon")
				{
					if (isValidEnglishPokemonName(displayedValue)) {
						return;
					}
					
					for (var englishName in PokemonDico)
					{
						// Check if the displayed Pokémon is a bugged frenchID
						if (removeSpecialCharacters(PokemonDico[englishName].toLowerCase()) === displayedValue) {
							regularEnglishName = removeSpecialCharacters(englishName.toLowerCase());
						}
					}
				}
				else if (displayedDataType == "item")
				{
					if (isValidEnglishItem(displayedValue)) {
						return;
					}
					
					for (var englishName in ItemsDico)
					{
						// Check if the displayed Item is a bugged frenchID
						if (removeSpecialCharacters(ItemsDico[englishName].toLowerCase()) === displayedValue) {
							regularEnglishName = removeSpecialCharacters(englishName.toLowerCase());
						}
					}
				}
				else if (displayedDataType == "ability")
				{
					if (isValidEnglishAbility(displayedValue)) {
						return;
					}
					
					for (var englishName in AbilitiesDico)
					{
						// Check if the displayed Ability is a bugged frenchID
						if (removeSpecialCharacters(AbilitiesDico[englishName].toLowerCase()) === displayedValue) {
							regularEnglishName = removeSpecialCharacters(englishName.toLowerCase());
						}
					}
				}
				else if (displayedDataType == "move")
				{
					if (isValidEnglishMove(displayedValue)) {
						return;
					}
					
					for (var englishName in MovesDico)
					{
						// Check if the displayed Move is a bugged frenchID
						if (removeSpecialCharacters(MovesDico[englishName].toLowerCase()) === displayedValue) {
							regularEnglishName = removeSpecialCharacters(englishName.toLowerCase());
						}
					}
				}

				// The cur element is bugged, so we remove it
				curParent.removeChild(curParent.firstChild as Node);

				// Only replace cur element if we find a valid value
				if (regularEnglishName)
				{
					// Generate the current Pokémon HTML code from its english name
					var htmlCurElement = app.curRoom.search.renderRow(regularEnglishName, displayedDataType, 0, 0, "", ' class="cur"');

					// Convert generated HTML code to Node
					var curTemplate = document.createElement('template');
					curTemplate.innerHTML = htmlCurElement;

					var curNode = curTemplate.content.firstChild;

					if (curNode)
					{
						updateIllegalElement(curNode.firstChild as Element, regularEnglishName);
						curParent.appendChild(curNode);
					}
				}
			}
		}
	}
}

function updateIllegalElement(curElement: Element, englishID: string)
{
	curElement.childNodes.forEach(function (infoNode) {
		var infoElement = infoNode as Element;

		// Check if cur element is legal, add illegal class if not
		if (infoElement.classList?.contains("pokemonnamecol")
			|| infoElement.classList?.contains("movenamecol")
			|| infoElement.classList?.contains("namecol"))
		{
			var tierLegalPokemon = app.curRoom.search.engine.typedSearch.illegalReasons;

			if (tierLegalPokemon && tierLegalPokemon[englishID]) {
				// Illegal result, remove very other element
				while (infoElement.nextSibling) {
					curElement.removeChild(infoElement.nextSibling);
				}

				var illegalCol = document.createElement("span");
				var illegalText = document.createElement("em");

				illegalCol.className = "col illegalcol"
				illegalCol.append(illegalText);
				illegalText.append(document.createTextNode("Illégal"));

				curElement.append(illegalCol);
			}
		}
	})
}

function removeInputIncompleteClass(inputElement: HTMLInputElement)
{
	// Whenever a search input does not match a known english word (Pokémon, Item, etc), 
	// an "incomplete" class is added to the input, which turns the text in red
	// So if we detect this class but the word is a valid french word, we remove it

	if (inputElement.classList.contains("incomplete")) {
		switch (inputElement.name)
		{
			case "pokemon":
				if (isValidFrenchPokemonName(inputElement.value)){
					inputElement.classList.remove("incomplete");
				}
				break;

			case "item":
				if (isValidFrenchItem(inputElement.value)) {
					inputElement.classList.remove("incomplete");
				}
				break;

			case "ability":
				if (isValidFrenchAbility(inputElement.value)) {
					inputElement.classList.remove("incomplete");
				}
				break;

			case "move1": case "move2": case "move3": case "move4":
				if (isValidFrenchMove(inputElement.value)) {
					inputElement.classList.remove("incomplete");
				}
				break;
		}
	}
}

function updateTeamWrapper(mainElement: Element)
{
	mainElement.childNodes.forEach(function (teamwrapperNode)
	{
		var teamwrapperElement = teamwrapperNode as Element;
		var classList = teamwrapperElement.classList;

		if (classList)
		{
			// Misc elements
			if (classList.contains("pad"))
			{
				teamwrapperElement.childNodes.forEach(function (padNode) {
					var padElement = padNode as Element;

					// Team name
					if (padElement.tagName == "INPUT")
					{
						var inputElement = padElement as HTMLInputElement;

						// Only translate the default team name
						if (inputElement.value) {
							inputElement.value = translatePokemonTeam(inputElement.value);
						}
					}
					// Multiple menu buttons
					else if (padElement.tagName == "BUTTON" && padElement.lastChild?.textContent)
					{
						// Translate button label
						padElement.lastChild.textContent = translateMenu(padElement.lastChild?.textContent);
					}
					// Teamchart element
					if (padElement.className == "teamchartbox")
					{
						padElement.childNodes.forEach(function (teamchartNode) {
							var teamchartElement = teamchartNode as Element;

							// Pokémon team element
							if (teamchartElement.tagName == "OL")
							{
								updatePokemonInfo(teamchartElement)
							}
							// Pokepaste upload
							else if (teamchartElement.tagName == "FORM")
							{
								teamchartElement.childNodes.forEach(function (pasteFormNode) {
									var pasteFormElement = pasteFormNode as Element;

									// Translate button label
									if (pasteFormElement.tagName == "BUTTON" && pasteFormElement.lastChild?.textContent) {
										pasteFormElement.lastChild.textContent = translateMenu(pasteFormElement.lastChild?.textContent);
									}
								})
							}
						})
					}
				})
			}
			// Import/Export set element
			else if (classList.contains("teambuilder-pokemon-import")) {
				teamwrapperElement.childNodes.forEach(function (importNode) {
					var importElement = importNode as Element;

					// Only translate button menus
					if (importElement.className == "pokemonedit-buttons") {
						importElement.childNodes.forEach(function (buttonNode) {
							var buttonElement = buttonNode as Element;

							if (buttonElement.tagName == "BUTTON") {
								buttonElement.childNodes.forEach(function (buttonContentNode) {
									var buttonContent = buttonContentNode as Element;

									// Raw text element
									if (!buttonContent.tagName && buttonContent.textContent) {
										buttonContent.textContent = translateMenu(buttonContent.textContent);
									}
								})
							}
						})
					}
				})
			}
			// Top teambar with Pokémon names
			else if (classList.contains("teambar")) {
				updatePokemonTabList(teamwrapperElement);
			}
		}
	})
}

function updatePokemonTabList(tabElement: Element | null)
{
	if (!tabElement) {
		tabElement = document.getElementsByClassName("teambar").item(0);
	}

	tabElement?.childNodes.forEach(function (teambarNode) {
		var teambarElement = teambarNode as Element;

		// Translate Pokémon name button
		if (teambarElement.tagName == "BUTTON" && teambarElement.lastChild?.textContent) {
			teambarElement.lastChild.textContent = translatePokemonName(teambarElement.lastChild.textContent);
		}
	})
}

function updatePokemonInfo(teamchartElement: Element | null)
{
	// For some reason, when an unknown Pokémon/Item/Ability/Move is present in a search input
	// and the user click on another search input, the unknown name is added to the BattlePokedex, BattleAbilities, BattleItems or BattleMovedex variable,
	// even if the name is incorrect - obviously since we are using french names, the names are always incorrect

	// That causes the name to later be put in lowerCase without special chararacters
	// I think it's a bug, but to compensate I need to load the backup of the original variables
	// everytime the Pokémon search input is updated

	// If a Showdown developer reads this, the line in your code where a specie is added is "window.BattlePokedex[id] = species;"
	BattlePokedex = structuredClone(originalBattlePokedex);
	BattleAbilities = structuredClone(originalBattleAbilities);
	BattleItems = structuredClone(originalBattleItems);
	BattleMovedex = structuredClone(originalBattleMovedex);

	updateCurElement();

	// Since we don't always get the teamchart element from MutationObserver, we need to manually retrieve it
	if (teamchartElement == null) {
		teamchartElement = document.getElementsByClassName("teamchart").item(0);
	}
	
	teamchartElement?.childNodes.forEach(function (liNode)
	{
		var liComponent = liNode as HTMLLIElement;

		// Clipboard (No way to differenciate with the teams element, so we check the first child)
		if ((liComponent.firstChild as Element).className == "teambuilder-clipboard-container") {
			updateClipboardElement(liComponent.firstChild as Element);
		}
		// Button menu (No way to differenciate with the teams element, so we check the first child)
		else if ((liComponent.firstChild as Element).tagName == "BUTTON")
		{
			// Translate button label
			if (liComponent.firstChild?.lastChild?.textContent) {
				liComponent.firstChild.lastChild.textContent = translateMenu(liComponent.firstChild.lastChild.textContent);
			}
		}
		// Label (No way to differenciate with the teams element, so we check the first child)
		else if ((liComponent.firstChild as Element).tagName == "EM")
		{
			// Translate label
			if (liComponent.firstChild?.textContent) {
				liComponent.firstChild.textContent = translateMenu(liComponent.firstChild.textContent);
			}
		}
		// Format selection
		else if (liComponent.className == "format-select")
		{
			liComponent.childNodes.forEach(function (formatNode) {
				var formatElement = formatNode as Element;

				if (formatElement.tagName == "BUTTON")
				{
					// Replace button label
					formatElement.childNodes.forEach(function (formatButtonNode) {
						if (formatButtonNode.textContent) {
							formatButtonNode.textContent = translateMenu(formatButtonNode.textContent);
						}
					})
				}
				// Format label
				else if (formatElement.tagName == "LABEL" && formatElement.textContent) {
					formatElement.textContent = translateMenu(formatElement.textContent.slice(0,-1)) + " :";
				}
			})
		}
		// Teams
		else if (Number(liComponent.value) >= 0)
		{
			// Team element, iterate over every attribute
			liComponent?.childNodes.forEach(function(node)
			{
				var teamchartClasses = (node as Element).classList;
		
				if (teamchartClasses) {
					if (teamchartClasses.contains("setmenu"))
					{
						// Translate team builder menu
						node.childNodes.forEach(function(menuButton) {
							if (menuButton.lastChild?.textContent) {
								menuButton.lastChild.textContent = translateMenu(menuButton.lastChild.textContent);
							}
						})
					}
					else if (teamchartClasses.contains("setchart-nickname"))
					{
						// Translate the nickname
						node.childNodes.forEach(function(nicknameNode) {
							var nicknameElement = nicknameNode as HTMLInputElement;
		
							if (nicknameElement.tagName == "LABEL") {
								nicknameElement.textContent = "Surnom";
							}
							else if (nicknameElement.tagName == "INPUT")
							{
								nicknameElement.placeholder = translatePokemonName(nicknameElement.placeholder);
								nicknameElement.value = translatePokemonName(nicknameElement.value);
							}
						});
					}
					else if (teamchartClasses.contains("setchart"))
					{
						node.childNodes.forEach(function(pokemonInfoNode) {
							var pokemonInfoElement = pokemonInfoNode as Element
							var classList = pokemonInfoElement.classList;
			
							// Pokémon name
							if (classList.contains("setcol-icon"))
							{
								// Translate the name
								pokemonInfoNode.childNodes.forEach(function(spriteNameNode) {
									spriteNameNode.childNodes.forEach(function(nameNode) {
										var nameInput = nameNode as HTMLInputElement;
		
										if (nameInput.tagName == "INPUT" && nameInput.value)
										{
											// Update the Pokémon search input with the french translation
											// (If no translation is found, the original string stays untouched)
											nameInput.value = translatePokemonName(nameInput.value);
										}
									})
								});
							}
							// Item, Ability, Level, Gender, Shiny
							else if (classList.contains("setcol-details"))
							{
								// Using querySelector instead of childNodes because there are a lot of nested nodes with classnames in common
								var detailsElement = pokemonInfoElement.querySelector('.setcell-details');
								var typeSpritesElement = pokemonInfoElement.querySelector('.setcell-typeicons');
								var itemElement = pokemonInfoElement.querySelector('.setcell-item');
								var abilityElement = pokemonInfoElement.querySelector('.setcell-ability');
		
								// Level, Gender, Shiny, Dmax Level
								if (detailsElement)
								{
									detailsElement.childNodes.forEach(function (detailsNode) {
										var detailsTag = (detailsNode as Element).tagName;
		
										// Menu element
										if (detailsTag == "LABEL" && detailsNode.textContent) {
											detailsNode.textContent = translateMenu(detailsNode.textContent);
										}
		
										// Details buttons
										if (detailsTag == "BUTTON")
										{
											// Update every detail element
											detailsNode.childNodes.forEach(function (spanNode) {
												updatePokemonDetails(spanNode as Element);
											});
										}
									});
								}
		
								// Types
								if (typeSpritesElement)
								{
									// Update every type sprite
									typeSpritesElement.childNodes.forEach(function (typeSprite) {
										updatePokemonTypeSprite(typeSprite as HTMLImageElement);
									})
								}
		
								// Item
								if (itemElement)
								{
									itemElement.childNodes.forEach(function (itemNode) {
										var itemTag = (itemNode as Element).tagName;
		
										// Menu element
										if (itemTag == "LABEL" && itemNode.textContent) {
											itemNode.textContent = translateMenu(itemNode.textContent);
										}
		
										// Item name
										if (itemTag == "INPUT")
										{
											var inputItemElement = itemNode as HTMLInputElement;
		
											if (inputItemElement.value) {
												inputItemElement.value = translateItem(inputItemElement.value);
											}
										}
									})
								}
		
								// Ability
								if (abilityElement)
								{
									abilityElement.childNodes.forEach(function (abilityNode) {
										var abilityTag = (abilityNode as Element).tagName;
		
										// Menu element
										if (abilityTag == "LABEL" && abilityNode.textContent) {
											abilityNode.textContent = translateMenu(abilityNode.textContent);
										}
		
										// Ability name
										if (abilityTag == "INPUT")
										{
											var inputAbilityElement = abilityNode as HTMLInputElement;
		
											if (inputAbilityElement.value) {
												inputAbilityElement.value = translateAbility(inputAbilityElement.value);
											}
										}
									})
								}
							}
							// Moves
							else if (classList.contains("setcol-moves"))
							{
								pokemonInfoNode.childNodes.forEach(function (moveDivNode) {
									moveDivNode.childNodes.forEach(function (moveNode) {
										var moveTag = (moveNode as Element).tagName;
		
										// Menu element
										if (moveTag == "LABEL" && moveNode.textContent) {
											moveNode.textContent = translateMenu(moveNode.textContent);
										}
		
										// Ability name
										if (moveTag == "INPUT")
										{
											var inputMoveElement = moveNode as HTMLInputElement;
		
											if (inputMoveElement.value) {
												inputMoveElement.value = translateMove(inputMoveElement.value);
											}
										}
									})
								})
							}
							// Stats
							else if (classList.contains("setcol-stats"))
							{
								pokemonInfoNode.childNodes.forEach(function (statsDivNode) {
									statsDivNode.childNodes.forEach(function (statsNode) {
										var moveTag = (statsNode as Element).tagName;
		
										// Details buttons
										if (moveTag == "BUTTON")
										{
											// Update every detail element
											statsNode.childNodes.forEach(function (spanNode) {
												spanNode.childNodes.forEach(function (statsContentNode) {
													if ((statsContentNode as Element).tagName == "LABEL" && statsContentNode.textContent) {
														statsContentNode.textContent = translateFilter(statsContentNode.textContent);
													}
												})
											});
										}
									})
								})
							}
						})
					}
				}	
			})
		}

	})
}

function updateClipboardElement(clipboardMainElement: Element)
{
	clipboardMainElement.childNodes.forEach(function (clipboardNode) {
		var clipboardElement = clipboardNode as Element;

		// Clipboard title
		if (clipboardElement.className == "teambuilder-clipboard-title" && clipboardElement.textContent) {
			clipboardElement.textContent = translateMenu(clipboardElement.textContent.slice(0,-1)) + " :";
		}
		// Clipboard clear button
		else if (clipboardElement.className == "teambuilder-clipboard-buttons") {
			clipboardElement.childNodes.forEach(function (clipboardButtonNode){
				var clipboardButtonElement = clipboardButtonNode;

				if (clipboardButtonElement.lastChild?.textContent) {
					clipboardButtonElement.lastChild.textContent = translateMenu(clipboardButtonElement.lastChild.textContent);
				}
			})
		}
		// Clipboard copied content
		else if (clipboardElement.className == "teambuilder-clipboard-data") {
			clipboardElement.childNodes.forEach(function(clipboardResult) {
				updateClipboardResult(clipboardResult as Element);
			})
		}
	})
}

function updatePokemonName(element: Element)
{
	var pokemonElement = element.querySelector('.pokemonnamecol');
	
	if (pokemonElement)
	{
		var pokemonShowdownName = pokemonElement.textContent;

		if (pokemonShowdownName == null)
			return;

		var pokemonTranslatedName = translatePokemonName(pokemonShowdownName);
		
		// Don't update HTML if no translation is found
		if (pokemonTranslatedName != pokemonShowdownName)
		{
			// Convert the Pokémon french name to [baseName, alternateForm]
			var pokemonTranslatedNameArray = convertPokemonNameToArray(pokemonTranslatedName);

			// Remove current Pokémon name so we can replace it
			pokemonElement.textContent = '';

			// Retrieve the searched content
			var inputElement = document.getElementsByName("pokemon")[0] as HTMLInputElement;
			var searchInput = inputElement.value;
			
			if (searchInput.length > 0)
			{
				var searchString = removeDiacritics(searchInput.toLowerCase());
				var searchedPokemon: Array<string> = [];

				if (searchString.includes("-")) {
					// Split the search result in an array [baseName, formName]
					searchedPokemon = convertPokemonNameToArray(searchString);
				}
				else {
					// No "-" means the result could be a base name or a form name, so we try to match both
					searchedPokemon = [searchString, searchString];
				}

				// Search for the baseName in the translatedBaseName
				var baseNameSearchIndex = removeDiacritics(pokemonTranslatedNameArray[0].toLowerCase()).indexOf(searchedPokemon[0]);
				var fullNameBolded = false;

				if (baseNameSearchIndex >= 0)
				{
					var boldBaseName = document.createElement("b");

					// Make only the searched part bold
					var boldName = pokemonTranslatedNameArray[0].slice(baseNameSearchIndex, baseNameSearchIndex + searchedPokemon[0].length);
					var regularName = pokemonTranslatedNameArray[0].slice(baseNameSearchIndex + searchedPokemon[0].length, pokemonTranslatedNameArray[0].length);

					boldBaseName.appendChild(document.createTextNode(boldName));

					if (baseNameSearchIndex > 0) { // Searched content is in the middle of the name
						pokemonElement.appendChild(document.createTextNode(pokemonTranslatedNameArray[0].slice(0,baseNameSearchIndex)));
					}

					// Add the bold searched part
					pokemonElement.appendChild(boldBaseName);

					if (regularName) {
						// If the whole name is not bold, add the rest in a regular text node
						pokemonElement.appendChild(document.createTextNode(regularName));
					}
					else {
						// Useful for alternate form styling process
						fullNameBolded = true;
					}
				}
				else
				{
					// No name match, add the raw name
					pokemonElement.appendChild(document.createTextNode(pokemonTranslatedNameArray[0]));
				}

				// If an altername form is present, add it in a small tag
				if (pokemonTranslatedNameArray[1])
				{
					var alternateForm = document.createElement("small");

					// Search for the formName in the translatedFormName
					var formNameSearchIndex = removeDiacritics(pokemonTranslatedNameArray[1].toLowerCase()).indexOf(searchedPokemon[1]);

					if (formNameSearchIndex >= 0)
					{
						var boldFormName = document.createElement("b");

						// A part of the alternate form is in the searched content
						var boldForm = pokemonTranslatedNameArray[1].slice(formNameSearchIndex, formNameSearchIndex + searchedPokemon[1].length);
						var regularForm = pokemonTranslatedNameArray[1].slice(formNameSearchIndex + searchedPokemon[1].length, pokemonTranslatedNameArray[1].length);

						if (formNameSearchIndex > 0) { // Searched content is in the middle of the form name
							alternateForm.appendChild(document.createTextNode("-" + pokemonTranslatedNameArray[1].slice(0,formNameSearchIndex)));
							boldFormName.appendChild(document.createTextNode(boldForm));
						}
						else { // Searched content is at the start of 
							if (fullNameBolded) {
								boldFormName.appendChild(document.createTextNode("-" + boldForm));
							}
							else {
								alternateForm.appendChild(document.createTextNode("-"));
								boldFormName.appendChild(document.createTextNode(boldForm));
							}
						}

						alternateForm.appendChild(boldFormName);

						if (regularForm) {
							// If the whole form is not bold, add the rest in a regular text node
							alternateForm.appendChild(document.createTextNode(regularForm));
						}
					}
					else
					{
						// No form match, add the raw altername form in the small tag
						alternateForm.appendChild(document.createTextNode("-" + pokemonTranslatedNameArray[1]));
					}

					pokemonElement.appendChild(alternateForm);	
				}
			}
			else
			{
				// Add Pokémon base name in a text node
				pokemonElement.appendChild(document.createTextNode(pokemonTranslatedNameArray[0]));

				// If an alterate name is present, add it in a node with a small tag
				if (pokemonTranslatedNameArray[1]) {
					var smallNode = document.createElement("small");
					smallNode.appendChild(document.createTextNode("-" + pokemonTranslatedNameArray[1]));

					pokemonElement.appendChild(smallNode);
				}
			}
		}	
	}
}

function updatePokemonAbility(resultElement: Element)
{
	resultElement.firstChild?.childNodes.forEach(function (resultNode) {
		var result = resultNode as Element;
		
		if (result.classList)
		{
			if (result.classList.contains("abilitycol")
				|| result.classList.contains("twoabilitycol"))
			{
				result.childNodes.forEach(function (abilityNode) {
					if (abilityNode.textContent)
					{
						// A Special Event Ability will be put in parenthesis
						if (abilityNode.textContent.slice(0,1) == "(") {
							abilityNode.textContent = "(" + translateAbility(abilityNode.textContent.slice(1,-1)) + ")";
						}
						else {
							abilityNode.textContent = translateAbility(abilityNode.textContent);
						}
						
					}
				})
			}
		}
	})
}

function updateAbility(resultElement: Element)
{
	var dataEntry = resultElement.firstChild as Element;
	var attribute = dataEntry.getAttribute('data-entry');

	if (dataEntry && attribute)
	{
		var abilityName = attribute.split("|")[1];

		dataEntry.childNodes.forEach(function (abilityNode) {
			var abilityElement = abilityNode as Element;
			var abilityClasses = abilityElement.classList;
	
			if (abilityClasses)
			{
				if (abilityClasses.contains("namecol")) {
					if (abilityElement.textContent) {
						abilityElement.textContent = translateAbility(abilityElement.textContent);
					}
				}
				else if (abilityClasses.contains("abilitydesccol")) {
					if (abilityElement.textContent) {
						var frenchDesc = AbilitiesShortDescDico[abilityName];
	
						if (frenchDesc) {
							abilityElement.textContent = frenchDesc;
						}
					}
				}
				if (abilityClasses.contains("filtercol")) {
					updateFilterElement(dataEntry);
				}
			}
		})
	}
}

function updateMove(resultElement: Element)
{
	var dataEntry = resultElement.firstChild as Element;
	var attribute = dataEntry.getAttribute('data-entry');

	if (dataEntry && attribute)
	{
		var moveName = attribute.split("|")[1];

		dataEntry.childNodes.forEach(function (moveNode) {
			var moveElement = moveNode as Element;
			var moveClasses = moveElement.classList;
	
			if (moveClasses)
			{
				if (moveClasses.contains("movenamecol"))
				{
					if (moveElement.textContent) {
						moveNode.textContent = translateMove(moveElement.textContent);
					}
				}
				else if (moveClasses.contains("typecol"))
				{
					moveNode.childNodes.forEach(function (typeSprite) {
						updatePokemonTypeSprite(typeSprite as HTMLImageElement);
					})
				}
				else if (moveClasses.contains("labelcol") || moveClasses.contains("widelabelcol"))
				{
					// Power and Accuracy translation
					moveElement.childNodes.forEach(function (child) {
						var moveAttribute = child as Element;
	
						if (moveAttribute.tagName == "EM" && moveAttribute.textContent) {
							moveAttribute.textContent = translateFilter(moveAttribute.textContent);
						}
					})
					
				}
				else if (moveClasses.contains("movedesccol"))
				{
					// Retrieve french description from move name and replace it
					if (moveElement.textContent) {
						var frenchDesc = MovesShortDescDico[moveName];
	
						if (frenchDesc) {
							moveElement.textContent = frenchDesc;
						}
					}
				}
				else if (moveClasses.contains("filtercol"))
				{
					updateFilterElement(moveElement);
				}
			}
		})
	}
}

function updateItem(resultElement: Element)
{
	var dataEntry = resultElement.firstChild as Element;
	var attribute = dataEntry.getAttribute('data-entry');

	if (dataEntry && attribute)
	{
		var itemName = attribute.split("|")[1];

		dataEntry.childNodes.forEach(function (itemNode) {
			var itemElement = itemNode as Element;
			var itemClasses = itemElement.classList;
	
			if (itemClasses)
			{
				if (itemClasses.contains("namecol"))
				{
					if (itemElement.textContent) {
						itemNode.textContent = translateItem(itemElement.textContent);
					}
				}
				else if (itemClasses.contains("itemdesccol"))
				{
					if (itemElement.textContent) {
						var frenchDesc = ItemsShortDescDico[itemName];
	
						if (frenchDesc) {
							itemElement.textContent = frenchDesc;
						}
						else {
							// Item description could be in short or long descDico
							frenchDesc = ItemsLongDescDico[itemName];

							if (frenchDesc) {
								itemElement.textContent = frenchDesc;
							}
						}
					}
				}
			}
		})
	}
}

function updatePokemonType(typesElement: Element)
{
	var mainTypeNode = typesElement.querySelector('.typecol');

	mainTypeNode?.childNodes.forEach(function(typeNode) {
		updatePokemonTypeSprite(typeNode as HTMLImageElement)
	})
}

function updatePokemonTypeSprite(spriteImage: HTMLImageElement)
{
	if (spriteImage.tagName == "IMG" && !spriteImage.src.includes("French_Type"))
	{
		spriteImage.alt = spriteImage.alt.replace("???", "Unknown");

		// Check that the alt attribute is a valid type
		if (isValidEnglishType(spriteImage.alt)) {
			// Use the french type sprite
			spriteImage.src = SpriteURL + "French_Type_" + spriteImage.alt + ".png"
		}
	}
}

function updateHeader(headerElement: Element)
{
	var headerTag = headerElement.firstChild as Element;

	if (headerTag.tagName == "H3" && headerTag.textContent)
	{
		// Get all header words
		var headerWords = headerTag.textContent.split(" ");

		if (headerWords.length > 1)
		{
			// Either ability of type filter
			if (headerWords.at(-1) == "Pokémon")
			{
				var filterData = headerTag.textContent.replace(" Pokémon","");
				var possibleType = TypesDico[filterData.replace("-type", "")];

				// Type
				if (possibleType) {
					headerTag.textContent = "Pokémon de type " + possibleType;
				}
				// Ability
				else
				{
					// Translate ability and insert it with the header french translation
					headerTag.textContent = "Pokémon avec " + translateAbility(filterData);;
				}
			}
			else if (headerWords.at(-1) == "technicality") {
				headerTag.textContent = headerWords[0] + " par technicalité";
			}
			else if (headerWords[0] == "Generation") {
				headerTag.textContent = "Génération " + headerWords[1];
			}
			else
			{
				var possiblePokemonName = PokemonDico[headerWords.at(-1) as string];

				if (possiblePokemonName) {
					headerTag.textContent = "Spécifique à " + possiblePokemonName;
				}
				else {
					// Default : the header should be in HeadersDico
					headerTag.textContent = translateHeader(headerTag.textContent);
				}
			}
		}
		else
		{
			// One-word headers, we can translate directly
			headerTag.textContent = translateHeader(headerTag.textContent);
		}
	}
	else if (!headerElement.classList.contains("result"))
	{
		// console.log("Unknown header element : " + headerElement.outerHTML);
	}
}

function updatePokemonStats(resultElement: Element)
{
	resultElement.firstChild?.childNodes.forEach(function (resultNode) {
		var result = resultNode as Element;
		
		if (result.classList?.contains("statcol")) {
			result.childNodes.forEach(function (statsNode)
			{
				var statElement = statsNode as Element;
				if (statElement.tagName == "EM" && statElement.textContent) {
					statElement.textContent = translateStat(statElement.textContent);
				}
			})
		}
	})
}

function updateSortFilters(resultElement: Element)
{
	var sortRowElement = resultElement.firstChild as Element;

	if (sortRowElement.className == "sortrow")
	{
		sortRowElement.childNodes.forEach(function (sortButton) {
			var sortButtonElement = sortButton as Element;

			if (sortButtonElement.tagName == "BUTTON" && sortButtonElement.textContent) {
				sortButtonElement.textContent = translateFilter(sortButtonElement.textContent);
			}
		})
	}
}

function updateMoveAbilityFilter(resultElement: Element)
{
	var filterTag = resultElement.firstChild as Element;

	if (filterTag.tagName == "P")
	{
		filterTag.childNodes.forEach(function (filterNode) {
			var filterElement = filterNode as Element;

			if (filterElement.tagName == "BUTTON")
			{
				var buttonElement = filterElement as HTMLButtonElement;

				buttonElement.childNodes.forEach(function(buttonSubNode) {
					// Don't want to update the cross icon, only the label
					if ((buttonSubNode as Element).tagName != "I" && buttonSubNode.textContent) {
						var buttonInfo = buttonElement.value.split(":");

						// Translate the button text, remove the last character since it's a space
						switch (buttonInfo[0])
						{
							case "type":
								buttonSubNode.textContent = translateType(buttonSubNode.textContent.slice(0,-1)) + " ";
								break;

							case "ability":
								buttonSubNode.textContent = translateAbility(buttonSubNode.textContent.slice(0,-1)) + " ";
								break;

							case "move":
								buttonSubNode.textContent = translateMove(buttonSubNode.textContent.slice(0,-1)) + " ";
								break;
						}
					}
				})
			}
			else if (filterElement.textContent) {
				filterElement.textContent = translateMenu(filterElement.textContent);
			}
		})
	}
	else if (!resultElement.classList.contains("result"))
	{
		// console.log("Unknown filter element in results : " + resultElement.outerHTML);
	}
}

function updateType(resultElement: Element)
{
	var typeNameNode = resultElement.querySelector('.namecol');
	var typeSpriteNode = resultElement.querySelector('.typecol');
	var filterNode = resultElement.querySelector('.filtercol');

	// Directly update the textContent, no style needed
	if (typeNameNode?.textContent) {
		typeNameNode.textContent = translateType(typeNameNode.textContent);
	}

	// Replace english type sprite by french ones
	updatePokemonTypeSprite(typeSpriteNode?.firstChild as HTMLImageElement);

	// Translate Filter button
	if (filterNode) {
		updateFilterElement(filterNode);
	}
}

function updateFilterElement(filterNode: Element)
{
	var filterButtonTag = filterNode.firstChild as Element;

	if (filterButtonTag.tagName == "EM" && filterButtonTag.textContent) {
		filterButtonTag.textContent = translateMenu(filterButtonTag.textContent);
	}
	else {
		// console.log("Unkown filter element : " + filterNode.outerHTML);
	}
}

function updateStatForm(statFormNode: Element)
{
	statFormNode.childNodes.forEach(function (statsNode) {
		var statsElement = statsNode as Element;
		var statsClasses = statsElement.classList;

		if (statsClasses.length > 0)
		{
			if (statsClasses.contains("labelcol"))
			{
				statsNode.childNodes.forEach(function (statName) {
					if (statName.textContent) {
						statName.textContent = translateStat(statName.textContent);
					}
				})
			}
			else if (statsClasses.contains("ivcol"))
			{
				// Only last child needs to be translated
				statsNode.lastChild?.firstChild?.childNodes.forEach(function (ivSpreadOption) {
					var ivSpreadElement = ivSpreadOption as Element;

					if (ivSpreadElement.textContent)
					{
						// Translate the option select title
						if (ivSpreadElement.tagName == "OPTION")
						{
							// The spread could be a custom Hidden Power spread
							if (ivSpreadElement.textContent.includes("HP ")) {
								ivSpreadElement.textContent = "PC " + translateType(ivSpreadElement.textContent.split(" ")[1]) + " IVs";
							}
							else  {
								ivSpreadElement.textContent = translateMenu(ivSpreadElement.textContent);
							}
							
						}
						else if (ivSpreadElement.tagName == "OPTGROUP")
						{
							var optgroupElement = ivSpreadElement as HTMLOptGroupElement;
							optgroupElement.label = translateMenu(optgroupElement.label);
						}
					}
				});
			}
			else if (statsClasses.contains("graphcol"))
			{
				// Translate the "Remaining EV" component
				updateRemainingEVElement(statsElement);
			}
			else if (statsClasses.contains("suggested"))
			{
				statsNode.childNodes.forEach(function (suggestedNode) {
					var suggestedElement = suggestedNode as Element;

					if (suggestedElement.tagName == "BUTTON")
					{
						var guessedSpread = suggestedElement.textContent?.split(":");

						if (guessedSpread?.length && guessedSpread.length > 1)
						{
							var frenchGuessedSet = translateMenu(guessedSpread[0]);
							var frenchGuessedSpread = guessedSpread[1];

							// Iterate on all possible stats and translate them if present in the english spread
							for (var stat in StatsDico) {
								// Use Regex since we want to update all occurrences
								frenchGuessedSpread = frenchGuessedSpread.replace(new RegExp(stat, 'g'), StatsDico[stat]);
							}

							suggestedElement.textContent = frenchGuessedSet + " :" + frenchGuessedSpread;
						}
					}
					else
					{
						// Just a regular text element
						suggestedElement.childNodes.forEach(function(suggestedTextNode) {
							if (suggestedTextNode.textContent) {
								suggestedTextNode.textContent = translateMenu(suggestedTextNode.textContent);
							}
						})
					}
				})
			}
		}
		else if (statsElement.tagName == "P")
		{
			// Nature setter
			if (statsElement.getAttribute("style")) {
				statsElement.childNodes.forEach(function (natureSetter)
				{
					var frenchNaturesList: Array<Array<string>> = [];
					var natureSelect = natureSetter as HTMLSelectElement;
					
					if (natureSelect.tagName == "SELECT")
					{
						var natureNumber = natureSelect.options.length - 1;

						for (var i = natureNumber ; i >= 0 ; i--)
						{
							// Translate every word of the nature option
							// Should be under the form "Nature" or "Nature (+Stat, -Stat)"
							var natureWords = natureSelect.options[i].textContent?.split(" ");
							var translatedNature = "";

							if (natureWords?.length == 1)
							{
								translatedNature = translateNature(natureWords[0])
							}
							else if (natureWords?.length == 3)
							{
								// Reform the nature layout and translate every word
								translatedNature = translateNature(natureWords[0]) + " (+";
								translatedNature += translateStat(natureWords[1]
									.replace("(","").replace("+","").replace(",","")) + ", -"
								translatedNature += translateStat(natureWords[2]
									.replace(")","").replace("-","")) + ")"
							}

							// Empty the natures list in order to insert the sorted french natures later
							frenchNaturesList.push([translatedNature, natureSelect.options[i].value]);
							natureSelect.remove(i);
						}

						// Alphabetically sort the french natures
						frenchNaturesList.sort();

						for (var i = 0 ; i < frenchNaturesList.length ; i++) {
							natureSelect.options[i] = new Option(frenchNaturesList[i][0], frenchNaturesList[i][1]);;
						}
					}
				})
			}
			// Protip
			else
			{
				// Translate every part of the protip
				statsElement.childNodes.forEach(function (proTipOption) {
					if (proTipOption.textContent) {
						proTipOption.textContent = translateMenu(proTipOption.textContent);
					}
				});
			}
		}
	})
}

function updatePokemonDetails(buttonDetailsElement: Element)
{
	buttonDetailsElement.childNodes.forEach(function (detailsContentNode) {
		if (detailsContentNode.textContent) {
			detailsContentNode.textContent = translateMenu(detailsContentNode.textContent);

			// Translate Hidden Power type
			if (detailsContentNode.textContent == "Type PC") {
				var hiddenPowerType = detailsContentNode.nextSibling;
				
				if (hiddenPowerType?.textContent) {
					hiddenPowerType.textContent = translateType(hiddenPowerType.textContent);
				}
			}
		}
	})
}

function updatePokemonDetailsForm(resultElement: Element)
{
	resultElement.childNodes.forEach(function (detailsContentNode)
	{
		var detailsContentResult = detailsContentNode as Element;
		
		// Some details might not be displayed
		if (detailsContentResult.getAttribute("style") != "display:none")
		{
			detailsContentResult.childNodes.forEach(function (detailsNode)
			{
				var detailsElement = detailsNode as Element;

				if (detailsElement.tagName == "LABEL")
				{
					if (detailsNode.textContent)
					{
						if ("Dmax Level:" == detailsNode.textContent) {
							// The regular translation is too long
							detailsNode.textContent = "Niv. Dmax :"
						}
						else {
							// Labels have a ":" character at the end, so we remove it and put it back again
							detailsNode.textContent = translateMenu(detailsNode.textContent.slice(0,-1)) + " :"
						}
					}
				}
				else if (detailsElement.tagName == "DIV")
				{
					detailsNode.childNodes.forEach(function (detailsValue)
					{
						var detailsValueElement = detailsValue as Element;

						if (detailsValueElement.tagName == "LABEL")
						{
							// Labels are in fact composed of radio button and text, so we still need to iterate on children
							detailsValue.childNodes.forEach(function (detailsLabel)
							{
								// Only translate the text
								if ((detailsLabel as Element).tagName != "INPUT" && detailsLabel.textContent) {
									detailsLabel.textContent = " " + translateMenu(detailsLabel.textContent.slice(1))
								}
							})
						}
						else if (detailsValueElement.tagName == "SELECT")
						{
							var detailsSelect = detailsValueElement as HTMLSelectElement;

							// Iterate on all options, could be a pokeball variant or a type selection
							for (var i = 0 ; i < detailsSelect.options.length ; i++)
							{
								if (detailsSelect.name == "pokeball") {
									detailsSelect.options[i].text = translateItem(detailsSelect.options[i].text);
								}
								else if (detailsSelect.name == "hptype") {
									detailsSelect.options[i].text = translateType(detailsSelect.options[i].text);
								}
							}
						}
					})
				}
			})
		}
	})
}

function updateRemainingEVElement(remainingNode: Element | null)
{
	// The node might not be on the page
	if (remainingNode)
	{
		// Only last child needs to be translated
		var remainingElement = remainingNode?.lastChild?.firstChild as Element;

		if (remainingElement.tagName == "EM" && remainingElement.textContent) {
			remainingElement.textContent = translateMenu(remainingElement.textContent);
		}
	}
}

function updateSetImportElement(setElement: Element)
{
	// Raw text element
	if (!setElement.tagName && setElement.textContent) {
		setElement.textContent = translateMenu(setElement.textContent);
	}
	// Smogon Analysis element, find the link in the children
	else if (setElement.tagName == "SMALL") {
		setElement.childNodes.forEach(function (smallContentNode) {
			var smallContent = smallContentNode as Element;

			// Link to Smogon sets
			if (smallContent.tagName == "A" && smallContent.textContent) {
				smallContent.textContent = translateMenu(smallContent.textContent);
			}
		})
	}
}

function updateInputPokemonName()
{
	var inputElements = document.getElementsByName("pokemon");

	if (inputElements.length > 0) {
		var pokemonNameInput = inputElements[0] as HTMLInputElement;
		
		if (pokemonNameInput.value) {
			pokemonNameInput.value = translatePokemonName(pokemonNameInput.value);
		}
	}
}

function convertPokemonNameToArray(pokemonName: string)
{
	const HyphenPokemonName = ["nidoran-f", "nidoran-d", "ho-oh", "porygon-z", "jangmo-o", "hakamo-o", "kommo-o", "ama-ama"]
	var pokemonRawName = pokemonName.split("-");

	if (pokemonRawName.length == 1)
	{
		// No "-" in the name so no alternate form
		return [pokemonRawName[0], ""];
	}
	else
	{
		// Check if the "-" is present because there was one in the base name
		var possibleHyphenPokemon = pokemonRawName[0] + "-" + pokemonRawName[1];
		var basePokemonName = "";

		if (HyphenPokemonName.includes(removeDiacritics(possibleHyphenPokemon.toLowerCase()))) {
			// There is a "-" in the base Pokémon name
			basePokemonName = possibleHyphenPokemon;

			// If the only "-" in the whole name was in the raw name, there is no alternate form
			if (pokemonRawName.length == 2) {
				return [basePokemonName, ""];
			}
		}
		else {
			// No "-" in the base Pokémon name, so the first element is the english Pokémon name
			basePokemonName = pokemonRawName[0];
		}

		// Remove the pokemon name from the whole name to get the alternate form
		var alternatePokemonFormName = pokemonName.replace(basePokemonName + "-", "");

		// Return the translated Pokémon name and its form
		return [basePokemonName, alternatePokemonFormName]
	}
}

function getDisplayedDataType(element: Element)
{
	var displayedDataType = "";

	// Element should be a li tag with a result class
	if (element.tagName == "LI" && element.classList.contains("result"))
	{
		var childResult = element.firstChild as Element;

		if (childResult)
		{
			// If result child is a tag name, it should have a data-entry
			// attribute telling what the displayed data is
			if (childResult.tagName == "A")
			{
				var attribute = childResult.getAttribute('data-entry');

				if (attribute) {
					displayedDataType = attribute.split("|")[0];
				}
				else {
					// console.log("No data-entry present in tag : " + childResult.outerHTML);
				}
			}
			// The result child is a header
			else {
				displayedDataType = "header";
			}
		}
	}
	else
	{
		// console.log("Unknown result element : " + element.outerHTML);
	}
	
	return displayedDataType;
}

function translateTeambuilderHomePage()
{
	var teamSearchBar = document.getElementById("teamSearchBar") as HTMLInputElement;

	// If teamSearchBar is not present, the MutationObserver will handle the page creation
	if (!teamSearchBar) {
		return;
	}

	// If for some reason the teamSearchBar has already been translated, don't translate the page
	if (translateMenu(teamSearchBar.placeholder) != teamSearchBar.placeholder) {
		var teambuilderRoom = document.getElementById("room-teambuilder") as Element;

		teambuilderRoom.childNodes.forEach(function(teambuilderNode) {
			var teambuilderElement = teambuilderNode as Element;

			if (teambuilderElement.className == "folderpane") {
				updateFolderList(teambuilderElement.firstChild as Element);
			}
			else if (teambuilderElement.className == "teampane") {
				teambuilderElement.childNodes.forEach(function (teampaneNode) {
					updateTeampaneElement(teampaneNode as Element);
				})
			}
		})
	}
}

function reorderBattleTeambuilderTable()
{
	// "tiers" object is an array separated by tier names
	// It is used to sort the Pokémon in each tier, sorted by english name when generated
	// We need to sort each tier by french name
	var tierOrderArray = BattleTeambuilderTable["tiers"] as Array<string>;
	var frenchOrderArray: any = {};

	var header = "";

	// Iterate on every Pokémon
	for (var i = 0 ; i < tierOrderArray.length ; i++)
	{
		var englishID = tierOrderArray[i];
		
		// Pokémon ID
		if (typeof englishID === 'string')
		{
			var frenchWord = "";

			// Find the french translation from the english ID (only lowercase letters)
			for (var englishName in PokemonDico)
			{
				if (removeSpecialCharacters(englishName.toLowerCase()) === englishID) {
					frenchWord = removeDiacritics(PokemonDico[englishName]);
				}
			}

			// If a translation is found, use it, else just insert the english name
			if (frenchWord) {
				frenchOrderArray[header].push({"englishID": englishID, "frenchWord": frenchWord})
			}
			else {
				frenchOrderArray[header].push({"englishID": englishID, "frenchWord": englishID})
			}
		}
		// If the objet is not a string (Pokémon ID), that mean the object is an array containing the header name
		else
		{
			// Create a sub-array containing every Pokémon in this tier
			header = englishID[1];
			frenchOrderArray[header] = [];
		}
	}

	// Iterate on each tier and sort by french name
	for (var tierID in frenchOrderArray)
	{
		var tierList = frenchOrderArray[tierID] as Array<{"englishID": string, "frenchWord": string}>;

		tierList.sort(function(a, b) {
			return ((a.frenchWord < b.frenchWord) ? -1 : ((a.frenchWord == b.frenchWord) ? 0 : 1));
		})
	}

	var header = "";
	var updatedID = 0;

	// Iterate on BattleTeambuilderTable and replace each value with the sorted english ID
	for (var i = 0 ; i < tierOrderArray.length ; i++)
	{
		var englishID = tierOrderArray[i];
		
		// Pokémon ID
		if (typeof englishID === 'string') {
			tierOrderArray[i] = frenchOrderArray[header][updatedID]["englishID"];
			updatedID++;
		}
		// Header
		else {
			header = englishID[1];
			updatedID = 0;
		}
	}
}

function updateBattleSearchIndex()
{
	// Create FrenchNamesDico dictionary, containing every french to english translation alphabetically sorted
	const FrenchNamesDico = populateFrenchDico();

	var newBattleSearchIndex = [];
	var newBattleSearchIndexOffset = [];
	var newBattleSearchIndexSize = BattleSearchIndex.length + FrenchNamesDico.length;

	var frenchIndex = 0;
	var frenchWordsID: Array<number> = [];

	for (var englishIndex = 0 ; newBattleSearchIndex.length < newBattleSearchIndexSize ; englishIndex++)
	{
		if (frenchIndex == FrenchNamesDico.length)
		{
			newBattleSearchIndex.push(BattleSearchIndex[englishIndex]);
			newBattleSearchIndexOffset.push(BattleSearchIndexOffset[englishIndex]);
		}
		else if (FrenchNamesDico[frenchIndex][FRENCH] == FrenchNamesDico[frenchIndex][ENGLISH])
		{
			frenchIndex++;
			englishIndex--;
			newBattleSearchIndexSize--;
		}
		else if (englishIndex == BattleSearchIndex.length || BattleSearchIndex[englishIndex][0] > FrenchNamesDico[frenchIndex][FRENCH])
		{
			let englishID = binarySearch(FrenchNamesDico[frenchIndex][ENGLISH]);

			newBattleSearchIndex.push([FrenchNamesDico[frenchIndex][FRENCH],FrenchNamesDico[frenchIndex][SEARCH_TYPE],englishID,0])
			newBattleSearchIndexOffset.push('');

			frenchWordsID.push(englishIndex);
			frenchIndex++;
			englishIndex--;
		}
		else
		{
			newBattleSearchIndex.push(BattleSearchIndex[englishIndex]);
			newBattleSearchIndexOffset.push(BattleSearchIndexOffset[englishIndex]);
		}
	}

	for (var fusionnedIndex = 0 ; fusionnedIndex < newBattleSearchIndexSize ; fusionnedIndex++)
	{
		if (newBattleSearchIndex[fusionnedIndex].length > 2)
		{
			newBattleSearchIndex[fusionnedIndex][2] += getDecalage(frenchWordsID, newBattleSearchIndex[fusionnedIndex][2]);
		}
	}

	BattleSearchIndex = newBattleSearchIndex;
	BattleSearchIndexOffset = newBattleSearchIndexOffset;
}

function populateFrenchDico()
{
	const ShowdownTradDictionnaries: Array<{ [englishName: string]: string; }> = [PokemonDico, AliasDico, AbilitiesDico, MovesDico, ItemsDico, TypesDico];

	let NamesTranslation: Array<any> = [];
	let searchTypeGetter: Array<string> = ["pokemon", "pokemon", "ability", "move", "item", "type"];

	for (var i = 0 ; i < searchTypeGetter.length ; i++)
	{
		var dico = ShowdownTradDictionnaries[i];
		var searchType = searchTypeGetter[i];

		for (var englishName in dico)
		{
			if (searchType == "pokemon" && CosmeticForms.includes(englishName)) {
				// Don't include cosmetic forms in BattleSearchIndex
				continue;
			}

			var frenchName = dico[englishName].toLowerCase();

			// Remove everything that is not a regular letter or number
			var formattedFrenchName = removeSpecialCharacters(frenchName);
			var formattedEnglishName = removeSpecialCharacters(englishName.toLowerCase());

			// Remove diacritics (é -> e) from a name and see if it changes anything
			// If so, add this copy in BattleSearchIndex in order to match accented characters with regular letters
			var notAccented = removeDiacritics(frenchName);

			if (notAccented != frenchName) { // Add the copy
				NamesTranslation.push([notAccented, formattedEnglishName, searchType]);
			}

			// Add the regular translated name
			NamesTranslation.push([formattedFrenchName, formattedEnglishName, searchType]);
		}
	}
	
	// BattleSearchIndex is alphabatically sorted in order to perform a binary search
	// so we absolutely need to sort our dictionary so we can insert the names in the right spot
	var sortedNamesTranslation = NamesTranslation.sort(function(a, b) {
		if (a[0] < b[0]) return -1;
		   if (a[0] > b[0]) return 1;
		   return 0;
	});

	return sortedNamesTranslation;
}

function removeSpecialCharacters(text: string) {
	return text.replace(/[^a-z0-9]+/g, "");
}

function removeDiacritics(text: string) {
	return text
	  .normalize('NFD')
	  .replace(/[\u0300-\u036f]/g, '');
}

function getDecalage(frenchWordsID:Array<number>, id: number)
{
	for (var i = 0 ; i < frenchWordsID.length ; i++)
	{
		if (id < frenchWordsID[i]) {
			return i;
		}
	}

	return frenchWordsID.length;
}

function binarySearch(query: string) {
	// Binary search through BattleSearchIndex, better performances than regular search
	let left = 0;
	let right = BattleSearchIndex.length - 1;
	while (right > left) {
		let mid = Math.floor((right - left) / 2 + left);
		if (BattleSearchIndex[mid][0] === query && (mid === 0 || BattleSearchIndex[mid - 1][0] !== query)) {
			return mid; // Exact match
		} else if (BattleSearchIndex[mid][0] < query) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	if (left >= BattleSearchIndex.length - 1) left = BattleSearchIndex.length - 1;
	else if (BattleSearchIndex[left + 1][0] && BattleSearchIndex[left][0] < query) left++;
	if (left && BattleSearchIndex[left - 1][0] === query) left--;
	return left;
}