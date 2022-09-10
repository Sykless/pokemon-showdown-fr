import { PokemonDico, AbilitiesDico, MovesDico, ItemsDico, TypesDico, StatsDico } from '../translator';
	
import { isValidEnglishType, isValidFrenchPokemonName, isValidFrenchItem, isValidFrenchAbility, isValidFrenchMove } from '../translator';

import { CosmeticForms  } from '../translator';

import {translatePokemonName, translateAbility, translateMove, translateItem, translateType, 
	translateHeader, translateFilter, translateMenu,  translateStat, translateNature } from '../translator';

// TODO
// Don't show duplicate Pokémon/Item (english/french name)
// Don't update multiple times the same node through childNode mutation
// Matching searches in Item/Ability/Move research (Hidden Power small ?)
// Details utilichart

// HIDDEN TEXT
// "Couldn't search: You are already searching for a ${formatid} battle." (.popup)
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

// Backup the BattlePokedex, BattleAbilities and BattleItems variables, we need them
// to erase incorrect entries (see updatePokemonInfo method)
const originalBattlePokedex = structuredClone(BattlePokedex);
const originalBattleAbilities = structuredClone(BattleAbilities);
const originalBattleItems = structuredClone(BattleItems);
const originalBattleMovedex = structuredClone(BattleMovedex);

const FRENCH = 0;
const ENGLISH = 1;
const SEARCH_TYPE = 2;

// The injected script cannot access chrome.runtime.getURL
// So we need to catch an event from the content script that sends it
var SpriteURL = "";

window.addEventListener('RecieveContent', function(evt: any) {
	SpriteURL = evt.detail;
});

// Create FrenchNamesDico dictionary, containing every french to english translation alphabetically sorted
const ShowdownTradDictionnaries: Array<{ [englishName: string]: string; }> = [PokemonDico, AbilitiesDico, MovesDico, ItemsDico, TypesDico];
const FrenchNamesDico = populateFrenchDico();

// When Teambuilder first loads, update the BattleSearchIndex
updateBattleSearchIndex();

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
	if (!isTeambuilderOpen()) {
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

				console.log(newElement);

				if (elementClasses)
				{
					// A search field has been updated
					if (elementClasses.contains("utilichart"))
					{
						// We can't catch input search modification with MutationObserver, however everytime an input
						// is modified in some way, the utilichart component is updated,
						// so we still get a way to catch input modification
						updatePokemonInfo();

						// Update every search result
						for (var k = 0, result; (result = node.childNodes[k]) ; k++) {
							updateResultTag(result as Element);
						}
					}
					// New results after scrolling
					else if (elementClasses.contains("result"))
					{
						// Update every new result
						updateResultTag(newElement);
					}
					// Pokémon info has been updated
					else if (elementClasses.contains("statrow-head"))
					{
						// When the stat block is updated, the element "Remaining EVs" is reset (if present)
						// So we need to re-translate it, but we don't need to update the whole StatForm component
						updateRemainingEVElement(document.querySelector(".graphcol"))
					}
					// Pokémon stats/nature interface has been loaded
					else if (elementClasses.contains("statform"))
					{
						updatePokemonInfo();
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

function removeCurElement()
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
			var curParent = cur.parentElement;
			var dataType = getDisplayedDataType(curParent);
			
			if (dataType == "pokemon")
			{
				var nameInputElement = document.getElementsByName("pokemon")[0] as HTMLInputElement;

				// Remove cur parent node only if the provided Pokémon is french
				if (isValidFrenchPokemonName(nameInputElement.value)) {
					curParent.remove();
					break;
				}
			}
			else if (dataType == "item")
			{
				var itemInputElement = document.getElementsByName("item")[0] as HTMLInputElement;

				// Remove cur parent node only if the provided Item is french
				if (isValidFrenchItem(itemInputElement.value)) {
					curParent.remove();
					break;
				}
			}
			else if (dataType == "ability")
			{
				var abilityInputElement = document.getElementsByName("ability")[0] as HTMLInputElement;

				// Remove cur parent node only if the provided Ability is french
				if (isValidFrenchAbility(abilityInputElement.value)) {
					curParent.remove();
					break;
				}
			}
			else if (dataType == "move")
			{
				// Always remove cur element for moves since we can't know which input is currently selected
				curParent.remove();
				break;
			}
		}
	}
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

function updatePokemonInfo()
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

	removeCurElement();

	// Since we don't always get the teamchart element from MutationObserver, we need to manually retrieve it
	var teamchartElement = document.getElementsByClassName("teamchart").item(0);
	var liComponent = teamchartElement?.firstChild;

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

function updatePokemonAbility(element: Element)
{
	var abilityNodeList = element.querySelectorAll('.abilitycol');
	var twoAbilitiesNode = element.querySelector('.twoabilitycol');

	for (var i = 0, node; (node = abilityNodeList[i]) ; i++)
	{
		// The Pokemon might only have one ability, so we check if null before using it
		if (node.textContent) {
			node.textContent = translateAbility(node.textContent);
		}
	}

	// There could be a node with two abilities
	if (twoAbilitiesNode)
	{
		var twoAbilities = twoAbilitiesNode.innerHTML.split("<br>");
		twoAbilitiesNode.textContent = '';
		
		for (var i = 0 ; i < twoAbilities.length ; i++)
		{
			// If two abilities are present, add a br tag to separate them
			if (i == 1) {
				twoAbilitiesNode.appendChild(document.createElement("br"));
			}

			// Use the untranslated ability if no translation is found
			var abilityTextNode = document.createTextNode(translateAbility(twoAbilities[i]))
			twoAbilitiesNode.appendChild(abilityTextNode)
		}
	}
}

function updateAbility(element: Element)
{
	var abilityNode = element.querySelector('.namecol');
	var filterNode = element.querySelector('.filtercol');

	if (abilityNode?.textContent) {
		abilityNode.textContent = translateAbility(abilityNode.textContent);
	}

	// Translate Filter button
	if (filterNode) {
		updateFilterElement(filterNode);
	}
}

function updateMove(resultElement: Element)
{
	resultElement.firstChild?.childNodes.forEach(function (moveNode) {
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
				// Move description
			}
			else if (moveClasses.contains("filtercol"))
			{
				updateFilterElement(moveElement);
			}
		}
	})
}

function updateItem(resultElement: Element)
{
	resultElement.firstChild?.childNodes.forEach(function (itemNode) {
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
				// Item description
			}
		}
	})
}

function updatePokemonType(typesElement: Element)
{
	var twoAbilitiesNode = typesElement.querySelector('.typecol');

	twoAbilitiesNode?.childNodes.forEach(function(typeNode) {
		updatePokemonTypeSprite(typeNode as HTMLImageElement)
	})
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
		console.log("Unknown header element");
		console.log(headerElement)
	}
}

function updatePokemonStats(resultElement: Element)
{
	var statsNodes = resultElement.getElementsByClassName("statcol");

	for (var i = 0 ; i < statsNodes.length ; i++)
	{
		statsNodes[i].childNodes.forEach(function(statNode) {
			var statElement = statNode as Element;
			if (statElement.tagName == "EM" && statElement.textContent) {
				statElement.textContent = translateFilter(statElement.textContent);
			}
		});
	}
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
		console.log("Unknown filter element in results");
		console.log(resultElement)
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
		console.log("Unkown filter element");
		console.log(filterNode);
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
					console.log("No data-entry present in tag ");
					console.log(childResult);
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
		console.log("Unknown result element");
		console.log(element)
	}
	
	return displayedDataType;
}

function updateBattleSearchIndex()
{
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

	// Always log BattleSearchIndex to help debugging
	console.log(BattleSearchIndex);
}

function populateFrenchDico()
{
	let NamesTranslation: Array<any> = [];
	let searchTypeGetter: Array<string> = ["pokemon", "ability", "move", "item", "type"];

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
		if (id < frenchWordsID[i])
		{
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