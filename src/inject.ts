
const FRENCH = 0;
const ENGLISH = 1;

console.log("Ok injected file worked");
declare var BattleSearchIndex: any;
declare var BattleSearchIndexOffset: any;

let NamesTranslation: Array<any> = [];

for (var pokemon in PokemonDico)
{
	NamesTranslation.push([PokemonDico[pokemon], pokemon]);
}

var newBattleSearchIndex = [];
var newBattleSearchIndexOffset = [];
var newBattleSearchIndexSize = BattleSearchIndex.length + NamesTranslation.length;

var frenchIndex = 0;
var frenchWordsID: Array<number> = [];

for (var englishIndex = 0 ; newBattleSearchIndex.length < newBattleSearchIndexSize ; englishIndex++)
{
	var pokemonTrad = NamesTranslation[frenchIndex];

	if (pokemonTrad[FRENCH] == pokemonTrad[ENGLISH])
	{
		frenchIndex++;
		englishIndex--;
		newBattleSearchIndexSize--;
	}
	else if (frenchIndex < NamesTranslation.length && (englishIndex == BattleSearchIndex.length  || BattleSearchIndex[englishIndex][0] > pokemonTrad[FRENCH]))
	{
		let englishID = getClosestJS(pokemonTrad[ENGLISH]);

		newBattleSearchIndex.push([pokemonTrad[FRENCH],"pokemon",englishID,0])
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
		newBattleSearchIndex[fusionnedIndex][2] += getDecalage(newBattleSearchIndex[fusionnedIndex][2]);
	}
}

BattleSearchIndex = newBattleSearchIndex;
BattleSearchIndexOffset = newBattleSearchIndexOffset;
console.log(BattleSearchIndex);
console.log(BattleSearchIndexOffset);

function getDecalage(id: number)
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

function toJsID(text: string) {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function getClosestJS(query: string) {
	// binary search through the index!
	let left = 0;
	let right = BattleSearchIndex.length - 1;
	while (right > left) {
		let mid = Math.floor((right - left) / 2 + left);
		if (BattleSearchIndex[mid][0] === query && (mid === 0 || BattleSearchIndex[mid - 1][0] !== query)) {
			// that's us
			return mid;
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