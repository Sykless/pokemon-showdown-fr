const POKEMON = 0;
const ABILITY = 1;
const MOVE = 2;
const ITEM = 3;
const TYPE = 4;
const NATURE = 5;
const STAT = 6;
const CONDITION = 7;
const HEADER = 8;
const MENU = 9;
const BATTLEMESSAGE = 10
const FILTER = 11;

const RegexBattleMessagesMap = new Map();
RegexBattleMessagesMap.set(/Battle started between (.*) and (.*)!/, "Le combat entre {TRAINER1} et {TRAINER2} a commencé !");
RegexBattleMessagesMap.set(/(.*)'s team:/, "Équipe de {TRAINER}");
RegexBattleMessagesMap.set(/Turn (.*)/, "Tour {NUMBER}");

// STATUS
RegexBattleMessagesMap.set(/(.*) was burned!/, "{POKEMON} est brûlé !");
RegexBattleMessagesMap.set(/(.*) was burned by the (.*)!/, "{POKEMON} est brûlé par {ITEM} !");
RegexBattleMessagesMap.set(/(.*) is already burned!/, "{POKEMON} est déjà brûlé.");
RegexBattleMessagesMap.set(/(.*)'s burn was healed!/, "{POKEMON} n'est plus brûlé !");
RegexBattleMessagesMap.set(/(.*)'s (.*) healed its burn!/, "La {SWAP_1_ITEM} du {SWAP_0_POKEMON} le guérit de sa brûlure !");
RegexBattleMessagesMap.set(/(.*) was hurt by its burn!/, "{POKEMON} souffre de sa brûlure !");

RegexBattleMessagesMap.set(/(.*) was frozen solid!/, "{POKEMON}  est gelé !");
RegexBattleMessagesMap.set(/(.*) is already frozen solid!/, "{POKEMON} est déjà gelé.");
RegexBattleMessagesMap.set(/(.*) thawed out!/, "{POKEMON} n'est plus gelé !");
RegexBattleMessagesMap.set(/(.*)'s (.*) defrosted it!/, "La {SWAP_1_ITEM} du {SWAP_0_POKEMON} le dégèle !");
RegexBattleMessagesMap.set(/(.*)'s (.*) melted the ice!/, "La glace a fondu grâce à la capacité {SWAP_1_MOVE} du {SWAP_0_POKEMON} !");
RegexBattleMessagesMap.set(/(.*) is frozen solid!/, "{POKEMON} est gelé ! Il ne peut plus attaquer !");

RegexBattleMessagesMap.set(/(.*) is paralyzed! It may be unable to move!/, "{POKEMON} est paralysé ! Il aura du mal à attaquer !");
RegexBattleMessagesMap.set(/(.*) is already paralyzed!/, "{POKEMON} est déjà paralysé.");
RegexBattleMessagesMap.set(/(.*) was cured of paralysis!/, "{POKEMON} n'est plus paralysé !");
RegexBattleMessagesMap.set(/(.*)'s (.*) cured its paralysis!/, "La {SWAP_1_ITEM} du {SWAP_0_POKEMON} le sort de sa paralysie !");
RegexBattleMessagesMap.set(/(.*) is paralyzed! It can't move!/, "{POKEMON} est paralysé ! Il n'a pas pu attaquer !");

RegexBattleMessagesMap.set(/(.*) was poisoned!/, "{POKEMON} est empoisonné !");
RegexBattleMessagesMap.set(/(.*) is already poisoned!/, "{POKEMON} est déjà empoisonné.");
RegexBattleMessagesMap.set(/(.*) was cured of its poisoning!/, "{POKEMON} n'est plus empoisonné !");
RegexBattleMessagesMap.set(/(.*)'s (.*) cured its poison!/, "La {SWAP_1_ITEM} du {SWAP_0_POKEMON} le guérit de son empoisonnement !");
RegexBattleMessagesMap.set(/(.*) was hurt by poison!/, "{POKEMON} souffre du poison !");

RegexBattleMessagesMap.set(/(.*) was badly poisoned!/, "{POKEMON} est gravement empoisonné !");
RegexBattleMessagesMap.set(/(.*) was badly poisoned by the (.*)!/, "{POKEMON} est gravement empoisonné par {ITEM} !");

RegexBattleMessagesMap.set(/(.*) fell asleep!/, "{POKEMON} s'est endormi !");
RegexBattleMessagesMap.set(/(.*) slept and became healthy!/, "{POKEMON} a récupéré en dormant !");
RegexBattleMessagesMap.set(/(.*) is already asleep!/, "{POKEMON} dort déjà.");
RegexBattleMessagesMap.set(/(.*) woke up!/, "{POKEMON} se réveille !");
RegexBattleMessagesMap.set(/(.*)'s (.*) woke it up!/, "La {SWAP_1_ITEM} du {SWAP_0_POKEMON} le réveille !");
RegexBattleMessagesMap.set(/(.*) is fast asleep./, "{POKEMON} dort profondément.");

RegexBattleMessagesMap.set(/(.*) became confused!/, "Ça rend {POKEMON} confus !");
RegexBattleMessagesMap.set(/(.*) became confused due to fatigue!/, "La fatigue rend {POKEMON} confus !");
RegexBattleMessagesMap.set(/(.*) snapped out of its confusion!/, "{POKEMON} n'est plus confus !");
RegexBattleMessagesMap.set(/(.*)'s (.*) snapped it out of its confusion!/, "La {SWAP_1_ITEM} du {SWAP_0_POKEMON} le tire de sa confusion !");
RegexBattleMessagesMap.set(/(.*) is already confused!/, "{POKEMON} est déjà confus !");
RegexBattleMessagesMap.set(/(.*) is confused!/, "{POKEMON} est confus !");


// STATS
RegexBattleMessagesMap.set(/(.*)'s (.*) rose!/, "{SWAP_1_STATS} du {SWAP_0_POKEMON} augmente !");
RegexBattleMessagesMap.set(/(.*)'s (.*) rose sharply!/, "{SWAP_1_STATS} du {SWAP_0_POKEMON} augmente beaucoup !");
RegexBattleMessagesMap.set(/(.*)'s (.*) rose drastically!/, "{SWAP_1_STATS} du {SWAP_0_POKEMON} augmente énormément !");
RegexBattleMessagesMap.set(/(.*)'s (.*) won't go any higher!/, "{SWAP_1_STATS} du {SWAP_0_POKEMON} ne peut plus augmenter !");
RegexBattleMessagesMap.set(/(.*)'s (.*) fell!/, "{SWAP_1_STATS} du {SWAP_0_POKEMON} baisse !");
RegexBattleMessagesMap.set(/(.*)'s (.*) fell harshly!/, "{SWAP_1_STATS} du {SWAP_0_POKEMON} baisse beaucoup !");
RegexBattleMessagesMap.set(/(.*)'s (.*) fell severely!/, "{SWAP_1_STATS} du {SWAP_0_POKEMON} baisse énormément !");
RegexBattleMessagesMap.set(/(.*)'s (.*) won't go any lower!/, "{SWAP_1_STATS} du {SWAP_0_POKEMON} ne peut plus baisser !");


// POKEMON
RegexBattleMessagesMap.set(/Go! (.*) \(/, "En avant ! {POKEMON} (");
RegexBattleMessagesMap.set(/(.*) sent out (.*) \(/, "{TRAINER} a envoyé {POKEMON} (");
RegexBattleMessagesMap.set(/(.*) sent out /, "{TRAINER} a envoyé ");
RegexBattleMessagesMap.set(/(.*), come back!/, "{POKEMON}, reviens !");
RegexBattleMessagesMap.set(/(.*) withdrew (.*)!/, "{TRAINER} a retiré {POKEMON} !");
RegexBattleMessagesMap.set(/(.*) was dragged out!/, "{POKEMON} est traîné de force au combat !");
RegexBattleMessagesMap.set(/(.*) went back to (.*)!/, "{POKEMON} revient vers {TRAINER} !");
RegexBattleMessagesMap.set(/(.*) fainted!/, "{POKEMON} est K.O. !");
RegexBattleMessagesMap.set(/(.*) avoided the attack!/, "{POKEMON} évite l'attaque !");
RegexBattleMessagesMap.set(/(.*) used /, "{POKEMON} a utilisé ");
RegexBattleMessagesMap.set(/\((.*) lost (.*) of its health!\)/, "({POKEMON} a perdu {PERCENTAGE} de ses points de vie !)");
RegexBattleMessagesMap.set(/(.*)'s HP is full!/, "Les PV de {POKEMON} sont au max !");
RegexBattleMessagesMap.set(/\[(.*)'s (.*)\]/, "[{SWAP_1_ABILITY} de {SWAP_0_POKEMON}]");
RegexBattleMessagesMap.set(/"(.*) and (.*) switched places!"/, "{POKEMON_1} et {POKEMON_2} échangent leur place !");
RegexBattleMessagesMap.set(/It's super effective on (.*)!/, "C'est super efficace sur {POKEMON} !");
RegexBattleMessagesMap.set(/It's not very effective on (.*)\./, "Ce n'est pas très efficace sur {POKEMON}...");
RegexBattleMessagesMap.set(/A critical hit on (.*)!/, "Coup critique infligé à {POKEMON} !");
RegexBattleMessagesMap.set(/It doesn't affect (.*)\.\.\./, "Ça n'affecte pas {POKEMON}...");


// ITEMS
RegexBattleMessagesMap.set(/(.*) restored a little HP using its Leftovers!/, "{POKEMON} a récupéré un peu de PV avec ses Restes !");
RegexBattleMessagesMap.set(/(.*) restored a little HP using its Black Sludge!/, "{POKEMON} a récupéré un peu de PV avec sa Boue Noire !");
RegexBattleMessagesMap.set(/(.*) restored a little HP using its Shell Bell!/, "{POKEMON} a récupéré un peu de PV avec son Grelot Coque !");
RegexBattleMessagesMap.set(/(.*) hung on using its Focus Sash!/, "{POKEMON} tient bon grâce à sa Ceinture Force !");
RegexBattleMessagesMap.set(/(.*) hung on using its Focus Band!/, "{POKEMON} tient bon grâce à son Bandeau !");
RegexBattleMessagesMap.set(/(.*) is switched out by the Eject Pack!/, "{POKEMON} se retire grâce au Sac Fuite !");
RegexBattleMessagesMap.set(/(.*) is switched out by the Button Pack!/, "{POKEMON} se retire grâce au Bouton Fuite !");
RegexBattleMessagesMap.set(/(.*) held up its Red Card against the opposing (.*)!/, "{POKEMON_1} a mis un Carton Rouge au {POKEMON_2} !");
RegexBattleMessagesMap.set(/(.*) floats in the air with its Air Balloon!/, "{POKEMON} flotte grâce à son Ballon !");
RegexBattleMessagesMap.set(/(.*)'s Air Balloon popped!/, "Le Ballon du {POKEMON} a éclaté !");
RegexBattleMessagesMap.set(/(.*) can act faster than normal, thanks to its Custap Berry!/, "La Baie Chérim de {POKEMON} lui permet d'agir en priorité !");
RegexBattleMessagesMap.set(/(.*) can act faster than normal, thanks to its Quick Claw!/, "La Vive Griffe de {POKEMON} lui permet d'agir en priorité !");
RegexBattleMessagesMap.set(/(.*) lost some of its HP!/, "{POKEMON} perd quelques PV !");
RegexBattleMessagesMap.set(/(.*) was hurt by the Rocky Helmet!/, "{POKEMON} est blessé par le Casque Brut !");
RegexBattleMessagesMap.set(/Bright light is about to burst out of (.*)!/, "Une lumière éblouissante émane de {POKEMON} !");
RegexBattleMessagesMap.set(/(.*) regained its true power through Ultra Burst!/, "{POKEMON} a pris une nouvelle forme grâce à l'Ultra-Explosion !");
RegexBattleMessagesMap.set(/(.*) returned its stats to normal using its White Herb!/, "L'Herbe Blanche de {} le fait revenir à la normale.");
RegexBattleMessagesMap.set(/(.*) became fully charged due to its Power Herb!/, "{POKEMON} est complètement chargé grâce à l'Herbe Pouvoir !");
RegexBattleMessagesMap.set(/(.*) restored PP to its move (.*) using its Leppa Berry!/, "La Baie Mepo du {POKEMON} restaure les PP de sa capacité {MOVE} !");
RegexBattleMessagesMap.set(/(.*) restored PP to its (.*) move using Mystery Berry!/, "La Baie Mystère du {POKEMON} restaure les PP de sa capacité {MOVE} !");
RegexBattleMessagesMap.set(/(.*) protected itself with its Protective Pads!/, "{POKEMON} s'est protégé grâce au Pare-Effet !");  // TOFIND : Protection avec Pare-Effet (noacier ?)
RegexBattleMessagesMap.set(/(.*) is not affected by [MOVE] thanks to its Safety Goggles!/, "{POKEMON} n'est pas affecté par {MOVE} grâce aux Lunettes Filtres !"); // TOFIND - Lunettes Filtre en se protégeant


// MOVES
RegexBattleMessagesMap.set(/Pointed stones float in the air around (.*)!/, "Des pierres pointues lévitent autour de {TEAM} !");
RegexBattleMessagesMap.set(/Pointed stones dug into (.*)!/, "Des pierres pointues transpercent {POKEMON} !");
RegexBattleMessagesMap.set(/The pointed stones disappeared from around (.*)!/, "Les pierres pointues autour de {TEAM} ont disparu !");
RegexBattleMessagesMap.set(/(.*) was seeded!/, "{POKEMON} est infecté !");
RegexBattleMessagesMap.set(/(.*)'s health is sapped by Leech Seed!/, "Vampigraine draine l'énergie du {POKEMON} !");
RegexBattleMessagesMap.set(/(.*) was freed from Leech Seed!/, "{POKEMON}"); // TOFIND - Vampigraine end
RegexBattleMessagesMap.set(/(.*) put in a substitute!/, "{POKEMON} a déjà un clone !");
RegexBattleMessagesMap.set(/(.*) already has a substitute!/, "{POKEMON} crée un clone !");
RegexBattleMessagesMap.set(/(.*)'s substitute faded!/, "Le clone du {POKEMON} disparaît...");
RegexBattleMessagesMap.set(/The substitute took damage for (.*)!/, "Le clone prend les dégâts à la place du {POKEMON} !");
RegexBattleMessagesMap.set(/(.*) surrounded itself with a veil of water!/, "{POKEMON} s’entoure d’un voile d’eau !");
RegexBattleMessagesMap.set(/A veil of water restored (.*)'s HP!/, "{POKEMON}");
RegexBattleMessagesMap.set(/(.*) fell in love!/, "{POKEMON} est amoureux !");
RegexBattleMessagesMap.set(/(.*) fell in love because of the (.*)!/, "{SWAP_1_ITEM} rend {SWAP_0_POKEMON} amoureux !");
RegexBattleMessagesMap.set(/(.*) got over its infatuation!/, "{POKEMON} n’est plus amoureux !");
RegexBattleMessagesMap.set(/(.*) cured its infatuation using its [ITEM]!/, "La {SWAP_1_ITEM} du {SWAP_0_POKEMON} fait faner son amour !");
RegexBattleMessagesMap.set(/(.*) is in love with (.*)!/, "{POKEMON_1} est amoureux du {POKEMON_2}");
RegexBattleMessagesMap.set(/(.*) is immobilized by love!/, "L’amour empêche {POKEMON} d’agir !");
RegexBattleMessagesMap.set(/A sea of fire enveloped (.*)!/, "{TEAM} est cernée par une mer de feu !");
RegexBattleMessagesMap.set(/The sea of fire around (.*) disappeared!/, "La mer de feu autour de {TEAM} a disparu !");
RegexBattleMessagesMap.set(/(.*) was hurt by the sea of fire!/, "{POKEMON} est "); // TOFIND - Aire de Feu + Aire de Plante
RegexBattleMessagesMap.set(/(.*) became trapped in the fiery vortex!/, "{POKEMON} est piégé dans le tourbillon de feu !");
RegexBattleMessagesMap.set(/The bursting flame hit (.*)!/, "{POKEMON}"); // TOFIND - Rebondifeu sur combat double
RegexBattleMessagesMap.set(/(.*) flung its (.*)!/, "{POKEMON} lance son objet (.*) !"); // TODO Conjugaison
RegexBattleMessagesMap.set(/(.*) flew up high!/, "{POKEMON} s'envole !");
RegexBattleMessagesMap.set(/(.*) is getting pumped!/, "{POKEMON} se gonfle !");
RegexBattleMessagesMap.set(/(.*) used the (.*) to get pumped!/, "{POKEMON}"); // TOFIND - Item giving Puissance
RegexBattleMessagesMap.set(/(.*) boosted its critical-hit ratio using its Z-Power!/, "{POKEMON}"); // TOFIND - Puissance-Z
RegexBattleMessagesMap.set(/(.*) is tightening its focus!/, "{POKEMON} se concentre au maximum !");
RegexBattleMessagesMap.set(/(.*) lost its focus and couldn't move!/, "{POKEMON} n’est plus concentré. Il ne peut plus attaquer !");
RegexBattleMessagesMap.set(/(.*) became the center of attention!/, "{POKEMON} devient le centre d’attention !");
RegexBattleMessagesMap.set(/(.*) was identified!/, "{POKEMON} est identifié !");
RegexBattleMessagesMap.set(/(.*) became cloaked in a freezing light!/, "{POKEMON} est baigné d’une lumière blafarde !");
RegexBattleMessagesMap.set(/(.*) foresaw an attack!/, "{POKEMON} prévoit une attaque !");
RegexBattleMessagesMap.set(/(.*) took the Future Sight attack!/, "{POKEMON} subit l'attaque Prescience !");
RegexBattleMessagesMap.set(/(.*)'s Ability was suppressed!/, "Le Talent de {POKEMON} a été rendu inactif !");
RegexBattleMessagesMap.set(/(.*) is absorbing power!/, "{POKEMON} concentre son énergie !");
RegexBattleMessagesMap.set(/(.*) got caught in the vortex of water!/, "{PARTY}"); //TOFIND - Canonnade G-Max
RegexBattleMessagesMap.set(/(.*) is hurt by G-Max Cannonade’s vortex!/, "{POKEMON}"); //TOFIND - Canonnade G-Max
RegexBattleMessagesMap.set(/(.*)'s PP was reduced!/, "{POKEMON}"); // TOFIND - G-Max Depletion
RegexBattleMessagesMap.set(/Sharp-pointed pieces of steel started floating around (.*)!/, "{PARTY}"); // TOFIND - G-Max Steelsurge
RegexBattleMessagesMap.set(/The pieces of steel surrounding (.*) disappeared!/, "{PARTY}");  // TOFIND - G-Max Steelsurge
RegexBattleMessagesMap.set(/The sharp steel bit into (.*)!/, "{POKEMON}"); //  // TOFIND - G-Max Steelsurge
RegexBattleMessagesMap.set(/(.*) got trapped with vines!/, "{PARTY}"); // TOFIND - G-Max Vine Lash
RegexBattleMessagesMap.set(/(.*) is hurt by G-Max Vine Lash’s ferocious beating!/, "{POKEMON}"); // TOFIND - G-Max Vine Lash
RegexBattleMessagesMap.set(/(.*) became surrounded by rocks!/, "{PARTY}"); // TOFIND - G-Max Volcalith
RegexBattleMessagesMap.set(/(.*) is hurt by the rocks thrown out by G-Max Volcalith!/, "{POKEMON}"); // TOFIND - G-Max Volcalith
RegexBattleMessagesMap.set(/(.*) were surrounded by fire!/, "{PARTY}"); // TOFIND - G-Max Wildfire
RegexBattleMessagesMap.set(/(.*) is burning up within G-Max Wildfire’s flames!/, "{POKEMON}"); // TOFIND - G-Max Wildfire
RegexBattleMessagesMap.set(/A swamp enveloped (.*)!/, "{TEAM} est cernée par un marécage !");
RegexBattleMessagesMap.set(/The swamp around (.*) disappeared!/, "Le marécage autour de {TEAM} a disparu !");
RegexBattleMessagesMap.set(/(.*)'s (.*) lost all of its PP due to the grudge!/, "La capacité {SWAP_1_MOVE} du {SWAP_0_POKEMON} perd ses PP à cause de la Rancune !");
RegexBattleMessagesMap.set(/(.*) wants its target to bear a grudge!/, "{POKEMON} veut que son adversaire subisse sa Rancune !");
RegexBattleMessagesMap.set(/(.*) shared its guard with the target!/, "{POKEMON} additionne sa garde à celle de sa cible et les redistribue équitablement !");
RegexBattleMessagesMap.set(/(.*) shared its power with the target!/, "{POKEMON} additionne sa force à celle de sa cible et les redistribue équitablement !");
RegexBattleMessagesMap.set(/(.*) was prevented from healing!/, "{POKEMON} ne peut pas guérir !");
RegexBattleMessagesMap.set(/(.*)'s Heal Block wore off!/, "{POKEMON} peut à nouveau guérir !");
RegexBattleMessagesMap.set(/(.*) can't use (.*) because of Heal Block!/, "{POKEMON} ne peut pas utiliser la capacité {MOVE} à cause d'Anti-Soin !");
RegexBattleMessagesMap.set(/But it failed to affect (.*)!/, "{POKEMON} n’est pas affecté !");
RegexBattleMessagesMap.set(/The healing wish came true for (.*)!/, "Le Voeu Soin est exaucé et profite à {POKEMON}");
RegexBattleMessagesMap.set(/(.*) is ready to help (.*)!/, "{POKEMON_1} est prêt à aider {POKEMON_2} !");
RegexBattleMessagesMap.set(/(.*) became cloaked in freezing air!/, "{POKEMON} est entouré d’un air glacial !");
RegexBattleMessagesMap.set(/(.*) sealed any moves its target shares with it!/, "{POKEMON} bloque les capacités en commun avec l’adversaire !");
RegexBattleMessagesMap.set(/(.*) can't use its sealed (.*)!/, "{POKEMON} ne peut pas utiliser la capacité bloquée {MOVE} !");
RegexBattleMessagesMap.set(/(.*)'s (.*) was burned up!/, "{POKEMON}"); // TOFIND - Calcination brûle une baie
RegexBattleMessagesMap.set(/(.*) has been afflicted with an infestation by (.*)!/, "{POKEMON_1} est harcelé par {POKEMON_2}!");
RegexBattleMessagesMap.set(/(.*) planted its roots!/, "{POKEMON} plante ses racines !");
RegexBattleMessagesMap.set(/(.*) is anchored in place with its roots!/, "{POKEMON} s’accroche avec ses racines !");
RegexBattleMessagesMap.set(/(.*) absorbed nutrients with its roots!/, "{POKEMON} absorbe des nutriments avec ses racines !");
RegexBattleMessagesMap.set(/(.*) followed (.*)'s instructions!/, "{POKEMON_1} obéit à la Sommation du {POKEMON_2} !");
RegexBattleMessagesMap.set(/(.*) knocked off (.*)'s (.*)!/, "{SWAP_0_POKEMON_1} fait tomber l'objet {SWAP_2_ITEM} du {SWAP_1_POKEMON_2} !"); // Conjugaison
RegexBattleMessagesMap.set(/(.*) concentrated intensely!/, "{POKEMON} aiguise son esprit !");
RegexBattleMessagesMap.set(/Light Screen made (.*) stronger against special moves!/, "Mur Lumière augmente la résistance de {TEAM} aux capacités spéciales !");
RegexBattleMessagesMap.set(/(.*)'s Light Screen wore off!/, "Mur Lumière n’a plus d’effet sur {TEAM} !");
RegexBattleMessagesMap.set(/(.*) took aim at (.*)!/, "{POKEMON_1} vise {POKEMON_2}");
RegexBattleMessagesMap.set(/Lucky Chant shielded (.*) from critical hits!/, "L’Air Veinard immunise {TEAM} contre les coups critiques !");
RegexBattleMessagesMap.set(/(.*)'s Lucky Chant wore off!/, "L’Air Veinard de {TEAM} prend fin !");
RegexBattleMessagesMap.set(/(.*) became cloaked in mystical moonlight!/, "{POKEMON} est baigné par des rayons de lune !");
RegexBattleMessagesMap.set(/(.*) shrouded itself with Magic Coat!/, "{POKEMON} s’entoure du Reflet Magik !");
RegexBattleMessagesMap.set(/(.*) bounced the (.*) back!/, "{POKEMON} repousse la capacité {MOVE} ! Retour à l’envoyeur !");
RegexBattleMessagesMap.set(/(.*) became trapped by swirling magma!/, "{POKEMON} est piégé dans un tourbillon de magma !");
RegexBattleMessagesMap.set(/(.*) levitated with electromagnetism!/, "{POKEMON} lévite sur un champ magnétique !");
RegexBattleMessagesMap.set(/(.*)'s electromagnetism wore off!/, "Le magnétisme du {POKEMON} se dissipe !");
RegexBattleMessagesMap.set(/Magnitude (.*)!/, "Ampleur {NUMBER} !");
RegexBattleMessagesMap.set(/(.*) intends to flip up a mat and block incoming attacks!/, "{POKEMON} se prépare à utiliser un tatami pour bloquer les attaques !");
RegexBattleMessagesMap.set(/(.*) was blocked by the kicked-up mat!/, "La capacité {MOVE} a été bloquée par un tatami !");
RegexBattleMessagesMap.set(/(.*) protected itself!/, "{POKEMON} se protège !");
RegexBattleMessagesMap.set(/(.*)'s HP was restored by the Z-Power!/, "{POKEMON}"); // TOFIND - Z-Souvenir
RegexBattleMessagesMap.set(/(.*) is overflowing with space power!/, "La puissance du cosmos afflue dans le corps du {POKEMON} !");
RegexBattleMessagesMap.set(/Waggling a finger let it use (.*)!/, "Grâce à Métronome, le Pokémon lance {MOVE} !");
RegexBattleMessagesMap.set(/(.*) learned (.*)!/, "{POKEMON} apprend {MOVE} !");
RegexBattleMessagesMap.set(/\((.*) cut its own HP to power up its move!\)/, "({POKEMON})"); // TOFIND - Caboche-Kaboum
RegexBattleMessagesMap.set(/(.*) became shrouded in mist!/, "{TEAM} s’entoure de Brume !");
RegexBattleMessagesMap.set(/(.*) is no longer protected by mist!/, "La Brume autour de {TEAM} s’est dissipée !");
RegexBattleMessagesMap.set(/(.*) is protected by the mist!"/, "{POKEMON} est protégé par la Brume !");
RegexBattleMessagesMap.set(/Nature Power turned into (.*)!/, "Force-Nature provoque {MOVE}.");
RegexBattleMessagesMap.set(/(.*) began having a nightmare!/, "{POKEMON} commence à cauchemarder !");
RegexBattleMessagesMap.set(/(.*) is locked in a nightmare!/, "{POKEMON} est prisonnier d’un cauchemar !");
RegexBattleMessagesMap.set(/(.*) can no longer escape because it used No Retreat!/, "{POKEMON} ne peut plus fuir à cause d'Ultime Bastion !");
RegexBattleMessagesMap.set(/(.*) can no longer escape because of Octolock!/, "{POKEMON} ne peut plus fuir à cause d'Octoprise !");
RegexBattleMessagesMap.set(/(.*)'s perish count fell to (.*)\./, "Le compte à rebours du Requiem du {POKEMON} descend à {NUMBER} !");
RegexBattleMessagesMap.set(/(.*) is about to be attacked by its (.*)!/, "{POKEMON} {MOVE}"); // TOFIND - Esprit Frappeur
RegexBattleMessagesMap.set(/(.*) is covered in powder!/, "{POKEMON}  est couvert de poudre !");
RegexBattleMessagesMap.set(/(.*) switched its Attack and Defense!/, "{POKEMON} échange son Attaque et sa Défense !");
RegexBattleMessagesMap.set(/\((.*) is being withdrawn\.\.\.\)/, "({POKEMON})"); // TOFIND - Poursuite sur switch
RegexBattleMessagesMap.set(/(.*)'s move was postponed!/, "{POKEMON} doit retourner à la queue !");
RegexBattleMessagesMap.set(/Quick Guard protected (.*)!/, "{POKEMON/TEAM} est protégé par la capacité Prévention !");
RegexBattleMessagesMap.set(/(.*) whipped up a whirlwind!/, "{POKEMON} se prépare à lancer une bourrasque !");
RegexBattleMessagesMap.set(/(.*) found one (.*)!/, "{POKEMON} trouve un {ITEM} !"); // Conjugaison
RegexBattleMessagesMap.set(/Reflect made (.*) stronger against physical moves!/, "Protection augmente la résistance de {TEAM} aux capacités physiques !");
RegexBattleMessagesMap.set(/(.*)'s Reflect wore off!/, "Protection n’a plus d’effet sur {TEAM} !");
RegexBattleMessagesMap.set(/(.*)'s type became the same as (.*)'s type!/, "{POKEMON_1} prend le type du {POKEMON_2} !");
RegexBattleMessagesMap.set(/(.*) copied (.*)'s (.*) Ability!/, "{SWAP_0_POKEMON_1} copie le talent {SWAP_2_ABILITY} du {SWAP_1_POKEMON_1} !");
RegexBattleMessagesMap.set(/\((.*) loses Flying type this turn\.\)/, "({POKEMON} perd le type Vol pour ce tour.)");
RegexBattleMessagesMap.set(/(.*) cloaked itself in a mystical veil!/, "{TEAM} est recouverte par un voile mystérieux !");
RegexBattleMessagesMap.set(/(.*) is no longer protected by Safeguard!/, "{TEAM} n’est plus protégée par le voile mystérieux !");
RegexBattleMessagesMap.set(/(.*) is protected by Safeguard!/, "{POKEMON} est protégé par la capacité Rune Protect !");
RegexBattleMessagesMap.set(/(.*) became trapped by the quicksand!/, "{POKEMON} est piégé par le Tourbi-Sable !");
RegexBattleMessagesMap.set(/It broke through (.*)'s protection!/, "{POKEMON}"); // TOFIND - Hantise à travers d'Abri
RegexBattleMessagesMap.set(/(.*) vanished instantly!/, "{POKEMON} disparaît instantanément !");
RegexBattleMessagesMap.set(/(.*) set a shell trap!/, "{POKEMON} déclenche le Carapiège !");
RegexBattleMessagesMap.set(/(.*)'s shell trap didn't work!/, "{POKEMON}"); // TOFIND - Carapiège pas triggered
RegexBattleMessagesMap.set(/(.*) sketched (.*)!/, "{POKEMON} apprend {MOVE} !");
RegexBattleMessagesMap.set(/(.*) swapped Abilities with its target!/, "{POKEMON} et sa cible échangent leurs talents !");
RegexBattleMessagesMap.set(/(.*) tucked in its head!/, "{POKEMON} baisse la tête !");
RegexBattleMessagesMap.set(/(.*) became cloaked in a harsh light!/, "{POKEMON} est entouré d’une lumière intense !");
RegexBattleMessagesMap.set(/(.*) took (.*) into the sky!/, "{POKEMON_1} emporte {POKEMON_2} haut dans le ciel !");
RegexBattleMessagesMap.set(/(.*) was freed from the Sky Drop!/, "{POKEMON} est lâché en Chute Libre !");
RegexBattleMessagesMap.set(/Sky Drop won't let (.*) go!/, "{POKEMON}"); // TOFIND - Fail switch ?
RegexBattleMessagesMap.set(/(.*) is too heavy to be lifted!/, "{POKEMON}"); // TOFIND - Chute Libre sur > 200kg
RegexBattleMessagesMap.set(/(.*) fell straight down!/, "{POKEMON}"); // TOCHECK - "La cible est touchée en plein vol et s’écrase au sol." ?
RegexBattleMessagesMap.set(/(.*) is waiting for a target to make a move!/, "{POKEMON} attend qu’une cible agisse !");
RegexBattleMessagesMap.set(/(.*) snatched (.*)'s move!/, "{POKEMON_1} saisit la capacité du {POKEMON_2} !");
RegexBattleMessagesMap.set(/(.*) absorbed light!/, "{POKEMON} absorbe la lumière !");
RegexBattleMessagesMap.set(/(.*) stole the target's boosted stats!/, "{POKEMON}"); // TOFIND - Clepto-Mânes
RegexBattleMessagesMap.set(/(.*) switched Speed with its target!/, "{POKEMON} et sa cible échangent leur Vitesse !");
RegexBattleMessagesMap.set(/Spikes were scattered on the ground all around (.*)!/, "Des Picots s’éparpillent autour de {TEAM} !");
RegexBattleMessagesMap.set(/The spikes disappeared from the ground around (.*)!/, "Il n’y a plus de Picots autour de {TEAM} !");
RegexBattleMessagesMap.set(/(.*) was hurt by the spikes!/, "{POKEMON} est blessé par les Picots !");
RegexBattleMessagesMap.set(/It reduced the PP of (.*)'s (.*) by (.*)!/, "Les PP de la capacité {SWAP_1_MOVE} du {SWAP_0_POKEMON} baissent de {SWAP_2_NUMBER} !");
RegexBattleMessagesMap.set(/A sticky web has been laid out on the ground around (.*)!/, "Le terrain est couvert d’une Toile Gluante du côté de {TEAM} !");
RegexBattleMessagesMap.set(/The sticky web has disappeared from the ground around (.*)!/, "La Toile Gluante du côté de {TEAM} a disparu !");
RegexBattleMessagesMap.set(/(.*) was caught in a sticky web!/, "{POKEMON} est pris dans la Toile Gluante !");
RegexBattleMessagesMap.set(/(.*) stockpiled [NUMBER]!/, "{POKEMON} utilise la capacité Stockage {NUMBER} fois !");
RegexBattleMessagesMap.set(/(.*)'s stockpiled effect wore off!/, "Les effets accumulés par {POKEMON} se dissipent !");
RegexBattleMessagesMap.set(/The Tailwind blew from behind (.*)!/, "Un Vent Arrière souffle sur {TEAM} !");
RegexBattleMessagesMap.set(/(.*)'s Tailwind petered out!/, "Le Vent Arrière soufflant sur {TEAM} s’arrête !");
RegexBattleMessagesMap.set(/(.*) became weaker to fire!/, "{POKEMON} est maintenant vulnérable au feu !");
RegexBattleMessagesMap.set(/(.*) fell for the taunt!/, "{POKEMON} répond à la Provoc !");
RegexBattleMessagesMap.set(/(.*) shook off the taunt!/, "{POKEMON} a oublié la Provoc !");
RegexBattleMessagesMap.set(/(.*) can't use (.*) after the taunt!/, "{POKEMON} ne peut pas utiliser\nla capacité {MOVE} après la Provoc !");
RegexBattleMessagesMap.set(/(.*) was hurled into the air!/, "Ça fait léviter {POKEMON} !");
RegexBattleMessagesMap.set(/(.*) was freed from the telekinesis!/, "{POKEMON} est libéré de la capacité Lévikinésie !");
RegexBattleMessagesMap.set(/The effects of Throat Chop prevent (.*) from using certain moves!/, "Exécu-Son empêche {POKEMON} d’utiliser la capacité !");
RegexBattleMessagesMap.set(/(.*) trapped (.*)!/, "{POKEMON_1} emprisonne {POKEMON_1} !");
RegexBattleMessagesMap.set(/(.*) was subjected to torment!/, "{POKEMON} est tourmenté !");
RegexBattleMessagesMap.set(/(.*) is no longer tormented!/, "Les tourments du {POKEMON} sont apaisés !");
RegexBattleMessagesMap.set(/Poison spikes were scattered on the ground all around (.*)!/, "Des pics toxiques se répandent autour de {TEAM} !");
RegexBattleMessagesMap.set(/The poison spikes disappeared from the ground around (.*)!/, "Il n’y a plus de pics toxiques autour de {TEAM} !");
RegexBattleMessagesMap.set(/(.*) transformed into (.*)!/, "{POKEMON_1} prend l’apparence du {POKEMON_2} !");
RegexBattleMessagesMap.set(/(.*) switched items with its target!/, "{POKEMON} échange son objet avec celui de sa cible !");
RegexBattleMessagesMap.set(/(.*) caused an uproar!/, "{POKEMON} provoque un Brouhaha !");
RegexBattleMessagesMap.set(/(.*) calmed down\./, "{POKEMON} se calme.");
RegexBattleMessagesMap.set(/(.*) is making an uproar!/, "{POKEMON} continue son Brouhaha !");
RegexBattleMessagesMap.set(/But the uproar kept (.*) awake!/, "Mais le Brouhaha tient {POKEMON} éveillé !");
RegexBattleMessagesMap.set(/(.*) can't sleep in an uproar!/, "Mais son Brouhaha empêche {POKEMON} de dormir !");
RegexBattleMessagesMap.set(/(.*) is waiting for (.*)'s move\.\.\./, "{POKEMON}"); // TOFIND - Aire d'eau activate
RegexBattleMessagesMap.set(/A rainbow appeared in the sky on (.*)'s side!/, "Un arc-en-ciel apparaît au-dessus de {TEAM} !");
RegexBattleMessagesMap.set(/The rainbow on (.*)'s side disappeared!/, "L’arc-en-ciel au-dessus de {TEAM} a disparu !");
RegexBattleMessagesMap.set(/Breakneck Blitz turned into (.*) due to the weather!/, "La météo change Turbo-Charge Bulldozer en {MOVE} !");
RegexBattleMessagesMap.set(/(.*) became trapped in the vortex!/, "{POKEMON} est piégé dans le tourbillon !");
RegexBattleMessagesMap.set(/Wide Guard protected (.*)!/, "{POKEMON/TEAM} est protégé par la Garde Large !");
RegexBattleMessagesMap.set(/(.*)'s wish came true!/, "Le Voeu du {POKEMON} se réalise !");
RegexBattleMessagesMap.set(/(.*) was wrapped by (.*)!/, "{POKEMON_1} est ligoté par {POKEMON_2} !");
RegexBattleMessagesMap.set(/(.*)'s attack continues!/, "{POKEMON} attaque encore !");
RegexBattleMessagesMap.set(/(.*) grew drowsy!/, "Ça rend {POKEMON} somnolent !");
RegexBattleMessagesMap.set(/(.*) clamped down on (.*)!/, "{POKEMON_1} est pris dans le Claquoir de {POKEMON_2} !");
RegexBattleMessagesMap.set(/(.*)'s fervent wish has reached (.*)!/, "L'esprit de {TRAINER} entre en résonance avec la volonté de {POKEMON} !");


export const BattleMessagesDico:  { [englishName: string]: string; } = {
	"It's not very effective...": "Ce n'est pas très efficace...",
	"It's super effective!": "C'est super efficace !",
	"A critical hit!": "Coup critique !",
	"It hurt itself in its confusion!": "Il se blesse dans sa confusion.",
	"But it does not have enough HP left to make a substitute!": "Trop faible pour créer un clone !",

	"A soothing aroma wafted through the area!": "Une odeur apaisante flotte dans l'air !",
	"The battlefield got weird!": "Le sol se met à réagir de façon bizarre...",
	"The weirdness disappeared from the battlefield!": "Le sol redevient normal !",
	"A deluge of ions showers the battlefield!": "Un déluge de plasma s'abat sur le terrain !",
	"But nothing happened!": "Mais rien ne se passe !",
	"Everyone is caught up in the happy atmosphere!": "L'ambiance est euphorique !",
	"A bell chimed!": "Un grelot sonne !",
	"Coins were scattered everywhere!": "Une pluie de pièces !",
	"All Pok\u00E9mon that heard the song will faint in three turns!": "Tous les Pokémon ayant entendu le Requiem seront K.O. après trois tours.",
	"All STATUS changes are eliminated!": "Les changements de STATUT ont tous été annulés !",
	"All stat changes were eliminated!": "Les changements de stats ont tous été annulés !",
	"The battlers shared their pain!": "Les adversaires partagent leurs PV !",
	"When the flame touched the powder on the Pok\u00E9mon, it exploded!": "La Nuée de Poudre entre en réaction avec la flamme et explose !",
	"But it failed!": "Mais cela échoue !",
	"Go! ": "En avant ! ",
	")!": ") !",
	"!": " !",
}




// the opposing team -> l'équipe ennemie
// your team -> votre équipe



// RegexBattleMessagesMap.set(/(.*)/, "{POKEMON}");
// RegexBattleMessagesMap.set(/(.*)/, "{POKEMON}");
// RegexBattleMessagesMap.set(/(.*)/, "{POKEMON}");
// RegexBattleMessagesMap.set(/(.*)/, "{POKEMON}");

// TODO
// [POKEMON] moved to the center!
// [TRAINER] can dynamax now!"
// Dynamax Energy gathered around [TRAINER]!
// [POKEMON] unleashes its full-force Z-Move!
// [POKEMON]'s [ITEM] is reacting to the Key Stone!
// [POKEMON] is reacting to [TRAINER]'s Key Stone!
// [POKEMON]'s [ITEM] is reacting to [TRAINER]'s Mega Bracelet!
// [POKEMON] has Mega Evolved into [POKEMON]!
// [POKEMON]'s Primal Reversion! It reverted to its primal state!
// [POKEMON] surrounded itself with its Z-Power!
// [POKEMON] couldn't fully protect itself and got hurt!
// [POKEMON] can't use [MOVE]!
// [POKEMON] can't move!
// [POKEMON] transformed!
// [POKEMON]'s type changed to [TYPE]!
// [POKEMON]'s [EFFECT] made it the [TYPE] type!
// [TYPE] type was added to [POKEMON]!
// ([EFFECT] started on [POKEMON]!)
// [POKEMON] was freed from [EFFECT]!
// ([EFFECT] activated!)
// ([EFFECT] started on [TEAM]!)
// ([EFFECT] ended on [TEAM]!)
// ([EFFECT] started!)
// ([EFFECT] ended!)

// [POKEMON] acquired [ABILITY]!
// [POKEMON] obtained one [ITEM]. // Trick, Switcheroo
// [POKEMON] stole [SOURCE]'s [ITEM]! // Thief, Covet, Magician, Pickpocket
// ([POKEMON] ate its [ITEM]!)
// The [ITEM] strengthened [POKEMON]'s power!
// The [ITEM] weakened damage to [POKEMON]!
// [POKEMON] lost its [ITEM]!
// ([POKEMON] used its [ITEM]!)
// The [ITEM] weakened the damage to [POKEMON]!

// ([POKEMON] was hurt!)
// [POKEMON] was hurt by [SOURCE]'s [ITEM]! // Jaboca/Rowap Berry
// [POKEMON] was hurt by its [ITEM]! // Sticky Barb
// [POKEMON] is hurt by [MOVE]!
// [POKEMON] had its HP restored.
// [POKEMON] restored its HP using its Z-Power!
// [POKEMON] restored HP using its [EFFECT]!

// The [ITEM] raised [POKEMON]'s [STAT]!
// The [ITEM] sharply raised [POKEMON]'s [STAT]!
// The [ITEM] drastically raised [POKEMON]'s [STAT]!
// [POKEMON] boosted its [STAT] using its Z-Power!
// [POKEMON] boosted its [STAT] sharply using its Z-Power!
// [POKEMON] boosted its [STAT] drastically using its Z-Power!
// [POKEMON] boosted its stats using its Z-Power!

// The [ITEM] lowered [POKEMON]'s [STAT]!
// The [ITEM] harshly lowered [POKEMON]'s [STAT]!
// The [ITEM] drastically lowered [POKEMON]'s [STAT]!

// [POKEMON] switched stat changes with its target!
// [POKEMON] switched all changes to its Attack and Sp. Atk with its target!
// [POKEMON] switched all changes to its Defense and Sp. Def with its target!
// [POKEMON] copied [TARGET]'s stat changes!
// [POKEMON]'s stat changes were removed!
// [POKEMON] returned its decreased stats to normal using its Z-Power!
// [POKEMON]'s stat changes were inverted!
// All stat changes were eliminated!

// It had no effect! // old gens
// [POKEMON] is unaffected!
// [SOURCE]'s attack missed! // old gens

// Automatic center!
// But there was no target... // gen 5 and earlier
// It's a one-hit KO!
// The two moves have become one! It's a combined move!
// The Pok\u00E9mon was hit [NUMBER] times!
// The Pok\u00E9mon was hit 1 time!

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

// "Heavy Rain "Strong Winds "Intense Sun "Hail "Rain "Sun "Sandstorm"

// [SOURCE] had its energy drained!
// [POKEMON] flinched and couldn't move!
// [POKEMON]'s HP is full!
// [POKEMON] will restore its replacement's HP using its Z-Power!
// [POKEMON] used [MOVE]!\n  But there was no PP left for the move!
// [POKEMON] must recharge!
// [POKEMON] was damaged by the recoil!
// [POKEMON]'s stats were not lowered!
// [POKEMON]'s [STAT] was not lowered!
// [POKEMON] has no moves left!
// [POKEMON] can no longer escape!

// ([POKEMON]'s Dynamax!)
// ([POKEMON] returned to normal!)
// The move was blocked by the power of Dynamax!
// [POKEMON] shook its head. It seems like it can't use this move...

// A sandstorm kicked up!
// The sandstorm subsided.
// (The sandstorm is raging.)
// [POKEMON] is buffeted by the sandstorm!

// The sunlight turned harsh!
// The harsh sunlight faded.
// (The sunlight is strong.)

// It started to rain!
// The rain stopped.
// (Rain continues to fall.)

// It started to hail!
// The hail stopped.
// (The hail is crashing down.)
// [POKEMON] is buffeted by the hail!

// The sunlight turned extremely harsh!
// The extremely harsh sunlight faded.
// The extremely harsh sunlight was not lessened at all!
// The Water-type attack evaporated in the harsh sunlight!

// A heavy rain began to fall!
// The heavy rain has lifted!
// There is no relief from this heavy rain!
// The Fire-type attack fizzled out in the heavy rain!

// Mysterious strong winds are protecting Flying-type Pok\u00E9mon!
// The mysterious strong winds have dissipated!
// The mysterious strong winds weakened the attack!
// The mysterious strong winds blow on regardless!

// An electric current ran across the battlefield!
// The electricity disappeared from the battlefield.
// [POKEMON] is protected by the Electric Terrain!

// Grass grew to cover the battlefield!
// The grass disappeared from the battlefield.
// [POKEMON]'s HP was restored.

// Mist swirled around the battlefield!
// The mist disappeared from the battlefield.
// [POKEMON] surrounds itself with a protective mist!

// The battlefield got weird!
// The weirdness disappeared from the battlefield!
// [POKEMON] is protected by the Psychic Terrain!

// Gravity intensified!
// Gravity returned to normal!
// [POKEMON] can't use [MOVE] because of gravity!
// [POKEMON] fell from the sky due to the gravity!

// It created a bizarre area in which Pok\u00E9mon's held items lose their effects!
// Magic Room wore off, and held items' effects returned to normal!

// Electricity's power was weakened!
// The effects of Mud Sport have faded.

// [POKEMON] twisted the dimensions!
// The twisted dimensions returned to normal!

// Fire's power was weakened!
// The effects of Water Sport have faded.

// It created a bizarre area in which Defense and Sp. Def stats are swapped!
// Wonder Room wore off, and Defense and Sp. Def stats returned to normal!

// [POKEMON] kept going and crashed!



export const PokemonDico: { [englishName: string]: string; } = {
	"Bulbasaur": "Bulbizarre",
	"Ivysaur": "Herbizarre",
	"Venusaur": "Florizarre",
	"Venusaur-Mega": "Florizarre-Méga",
	"Venusaur-Gmax": "Florizarre-Gmax",
	"Charmander": "Salamèche",
	"Charmeleon": "Reptincel",
	"Charizard": "Dracaufeu",
	"Charizard-Mega-X": "Dracaufeu-Méga-X",
	"Charizard-Mega-Y": "Dracaufeu-Méga-Y",
	"Charizard-Gmax": "Dracaufeu-Gmax",
	"Squirtle": "Carapuce",
	"Wartortle": "Carabaffe",
	"Blastoise": "Tortank",
	"Blastoise-Mega": "Tortank-Méga",
	"Caterpie": "Chenipan",
	"Metapod": "Chrysacier",
	"Butterfree": "Papilusion",
	"Butterfree-Gmax": "Papilusion-Gmax",
	"Weedle": "Aspicot",
	"Kakuna": "Coconfort",
	"Beedrill": "Dardargnan",
	"Beedrill-Mega": "Dardargnan-Méga",
	"Pidgey": "Roucool",
	"Pidgeotto": "Roucoups",
	"Pidgeot": "Roucarnage",
	"Pidgeot-Mega": "Roucarnage-Méga",
	"Rattata": "Rattata",
	"Rattata-Alola": "Rattata-Alola",
	"Raticate": "Rattatac",
	"Raticate-Alola": "Rattatac-Alola",
	"Raticate-Alola-Totem": "Rattatac-Alola-Dominant",
	"Spearow": "Piafabec",
	"Fearow": "Rapasdepic",
	"Ekans": "Abo",
	"Arbok": "Arbok",
	"Pikachu": "Pikachu",
	"Pikachu-Original": "Pikachu-Original",
	"Pikachu-Partner": "Pikachu-Partenaire",
	"Pikachu-Hoenn": "Pikachu-Hoenn",
	"Pikachu-Sinnoh": "Pikachu-Sinnoh",
	"Pikachu-Unova": "Pikachu-Unys",
	"Pikachu-Kalos": "Pikachu-Kalos",
	"Pikachu-Alola": "Pikachu-Alola",
	"Pikachu-World": "Pikachu-Monde",
	"Pikachu-Cosplay": "Pikachu-Cosplayeur",
	"Pikachu-Belle": "Pikachu-Lady",
	"Pikachu-Libre": "Pikachu-Catcheur",
	"Pikachu-PhD": "Pikachu-Docteur",
	"Pikachu-Pop-Star": "Pikachu-Star",
	"Pikachu-Rock-Star": "Pikachu-Rockeur",
	"Pikachu-Starter": "Pikachu-Starter",
	"Pikachu-Gmax": "Pikachu-Gmax",
	"Raichu": "Raichu",
	"Raichu-Alola": "Raichu-Alola",
	"Sandshrew": "Sabelette",
	"Sandshrew-Alola": "Sabelette-Alola",
	"Sandslash": "Sablaireau",
	"Sandslash-Alola": "Sablaireau-Alola",
	"Nidoran-F": "Nidoran-F",
	"Nidorina": "Nidorina",
	"Nidoqueen": "Nidoqueen",
	"Nidoran-M": "Nidoran-M",
	"Nidorino": "Nidorino",
	"Nidoking": "Nidoking",
	"Clefairy": "Mélofée",
	"Clefable": "Mélodelfe",
	"Vulpix": "Goupix",
	"Vulpix-Alola": "Goupix-Alola",
	"Ninetales": "Feunard",
	"Ninetales-Alola": "Feunard-Alola",
	"Jigglypuff": "Rondoudou",
	"Wigglytuff": "Grodoudou",
	"Zubat": "Nosferapti",
	"Golbat": "Nosferalto",
	"Oddish": "Mystherbe",
	"Gloom": "Ortide",
	"Vileplume": "Rafflesia",
	"Paras": "Paras",
	"Parasect": "Parasect",
	"Venonat": "Mimitoss",
	"Venomoth": "Aéromite",
	"Diglett": "Taupiqueur",
	"Diglett-Alola": "Taupiqueur-Alola",
	"Dugtrio": "Triopikeur",
	"Dugtrio-Alola": "Triopikeur-Alola",
	"Meowth": "Miaouss",
	"Meowth-Alola": "Miaouss-Alola",
	"Meowth-Galar": "Miaouss-Galar",
	"Meowth-Gmax": "Miaouss-Gmax",
	"Persian": "Persian",
	"Persian-Alola": "Persian-Alola",
	"Psyduck": "Psykokwak",
	"Golduck": "Akwakwak",
	"Mankey": "Férosinge",
	"Primeape": "Colossinge",
	"Growlithe": "Caninos",
	"Growlithe-Hisui": "Caninos-Hisui",
	"Arcanine": "Arcanin",
	"Arcanine-Hisui": "Arcanin-Hisui",
	"Poliwag": "Ptitard",
	"Poliwhirl": "Têtarte",
	"Poliwrath": "Tartard",
	"Abra": "Abra",
	"Kadabra": "Kadabra",
	"Alakazam": "Alakazam",
	"Alakazam-Mega": "Alakazam-Méga",
	"Machop": "Machoc",
	"Machoke": "Machopeur",
	"Machamp": "Mackogneur",
	"Machamp-Gmax": "Mackogneur-Gmax",
	"Bellsprout": "Chétiflor",
	"Weepinbell": "Boustiflor",
	"Victreebel": "Empiflor",
	"Tentacool": "Tentacool",
	"Tentacruel": "Tentacruel",
	"Geodude": "Racaillou",
	"Geodude-Alola": "Racaillou-Alola",
	"Graveler": "Gravalanch",
	"Graveler-Alola": "Gravalanch-Alola",
	"Golem": "Grolem",
	"Golem-Alola": "Grolem-Alola",
	"Ponyta": "Ponyta",
	"Ponyta-Galar": "Ponyta-Galar",
	"Rapidash": "Galopa",
	"Rapidash-Galar": "Galopa-Galar",
	"Slowpoke": "Ramoloss",
	"Slowpoke-Galar": "Ramoloss-Galar",
	"Slowbro": "Flagadoss",
	"Slowbro-Mega": "Flagadoss-Méga",
	"Slowbro-Galar": "Flagadoss-Galar",
	"Magnemite": "Magnéti",
	"Magneton": "Magnéton",
	"Farfetch’d": "Canarticho",
	"Farfetch’d-Galar": "Canarticho-Galar",
	"Doduo": "Doduo",
	"Dodrio": "Dodrio",
	"Seel": "Otaria",
	"Dewgong": "Lamantine",
	"Grimer": "Tadmorv",
	"Grimer-Alola": "Tadmorv-Alola",
	"Muk": "Grotadmorv",
	"Muk-Alola": "Grotadmorv-Alola",
	"Shellder": "Kokiyas",
	"Cloyster": "Crustabri",
	"Gastly": "Fantominus",
	"Haunter": "Spectrum",
	"Gengar": "Ectoplasma",
	"Gengar-Mega": "Ectoplasma-Méga",
	"Gengar-Gmax": "Ectoplasma-Gmax",
	"Onix": "Onix",
	"Drowzee": "Soporifik",
	"Hypno": "Hypnomade",
	"Krabby": "Krabby",
	"Kingler": "Krabboss",
	"Kingler-Gmax": "Krabboss-Gmax",
	"Voltorb": "Voltorbe",
	"Voltorb-Hisui": "Voltorbe-Hisui",
	"Electrode": "Électrode",
	"Electrode-Hisui": "Électrode-Hisui",
	"Exeggcute": "Noeunoeuf",
	"Exeggutor": "Noadkoko",
	"Exeggutor-Alola": "Noadkoko-Alola",
	"Cubone": "Osselait",
	"Marowak": "Ossatueur",
	"Marowak-Alola": "Ossatueur-Alola",
	"Marowak-Alola-Totem": "Ossatueur-Alola-Dominant",
	"Hitmonlee": "Kicklee",
	"Hitmonchan": "Tygnon",
	"Lickitung": "Excelangue",
	"Koffing": "Smogo",
	"Weezing": "Smogogo",
	"Weezing-Galar": "Smogogo-Galar",
	"Rhyhorn": "Rhinocorne",
	"Rhydon": "Rhinoféros",
	"Chansey": "Leveinard",
	"Tangela": "Saquedeneu",
	"Kangaskhan": "Kangourex",
	"Kangaskhan-Mega": "Kangourex-Méga",
	"Horsea": "Hypotrempe",
	"Seadra": "Hypocéan",
	"Goldeen": "Poissirène",
	"Seaking": "Poissoroy",
	"Staryu": "Stari",
	"Starmie": "Staross",
	"Mr. Mime": "M. Mime",
	"Mr. Mime-Galar": "M. Mime-Galar",
	"Scyther": "Insécateur",
	"Jynx": "Lippoutou",
	"Electabuzz": "Élektek",
	"Magmar": "Magmar",
	"Pinsir": "Scarabrute",
	"Pinsir-Mega": "Scarabrute-Méga",
	"Tauros": "Tauros",
	"Magikarp": "Magicarpe",
	"Gyarados": "Léviator",
	"Gyarados-Mega": "Léviator-Méga",
	"Lapras": "Lokhlass",
	"Lapras-Gmax": "Lokhlass-Gmax",
	"Ditto": "Métamorph",
	"Eevee": "Évoli",
	"Eevee-Starter": "Évoli-Starter",
	"Eevee-Gmax": "Évoli-Gmax",
	"Vaporeon": "Aquali",
	"Jolteon": "Voltali",
	"Flareon": "Pyroli",
	"Porygon": "Porygon",
	"Omanyte": "Amonita",
	"Omastar": "Amonistar",
	"Kabuto": "Kabuto",
	"Kabutops": "Kabutops",
	"Aerodactyl": "Ptéra",
	"Aerodactyl-Mega": "Ptéra-Méga",
	"Snorlax": "Ronflex",
	"Snorlax-Gmax": "Ronflex-Gmax",
	"Articuno": "Artikodin",
	"Articuno-Galar": "Artikodin-Galar",
	"Zapdos": "Électhor",
	"Zapdos-Galar": "Électhor-Galar",
	"Moltres": "Sulfura",
	"Moltres-Galar": "Sulfura-Galar",
	"Dratini": "Minidraco",
	"Dragonair": "Draco",
	"Dragonite": "Dracolosse",
	"Mewtwo": "Mewtwo",
	"Mewtwo-Mega-X": "Mewtwo-Méga-X",
	"Mewtwo-Mega-Y": "Mewtwo-Méga-Y",
	"Mew": "Mew",
	"Chikorita": "Germignon",
	"Bayleef": "Macronium",
	"Meganium": "Méganium",
	"Cyndaquil": "Héricendre",
	"Quilava": "Feurisson",
	"Typhlosion": "Typhlosion",
	"Typhlosion-Hisui": "Typhlosion-Hisui",
	"Totodile": "Kaiminus",
	"Croconaw": "Crocrodil",
	"Feraligatr": "Aligatueur",
	"Sentret": "Fouinette",
	"Furret": "Fouinar",
	"Hoothoot": "Hoothoot",
	"Noctowl": "Noarfang",
	"Ledyba": "Coxy",
	"Ledian": "Coxyclaque",
	"Spinarak": "Mimigal",
	"Ariados": "Migalos",
	"Crobat": "Nostenfer",
	"Chinchou": "Loupio",
	"Lanturn": "Lanturn",
	"Pichu": "Pichu",
	"Pichu-Spiky-eared": "Pichu-Troizépi",
	"Cleffa": "Mélo",
	"Igglybuff": "Toudoudou",
	"Togepi": "Togepi",
	"Togetic": "Togetic",
	"Natu": "Natu",
	"Xatu": "Xatu",
	"Mareep": "Wattouat",
	"Flaaffy": "Lainergie",
	"Ampharos": "Pharamp",
	"Ampharos-Mega": "Pharamp-Méga",
	"Bellossom": "Joliflor",
	"Marill": "Marill",
	"Azumarill": "Azumarill",
	"Sudowoodo": "Simularbre",
	"Politoed": "Tarpaud",
	"Hoppip": "Granivol",
	"Skiploom": "Floravol",
	"Jumpluff": "Cotovol",
	"Aipom": "Capumain",
	"Sunkern": "Tournegrin",
	"Sunflora": "Héliatronc",
	"Yanma": "Yanma",
	"Wooper": "Axoloto",
	"Quagsire": "Maraiste",
	"Espeon": "Mentali",
	"Umbreon": "Noctali",
	"Murkrow": "Cornèbre",
	"Slowking": "Roigada",
	"Slowking-Galar": "Roigada-Galar",
	"Misdreavus": "Feuforêve",
	"Unown": "Zarbi",
	"Unown-B": "Zarbi-B",
	"Unown-C": "Zarbi-C",
	"Unown-D": "Zarbi-D",
	"Unown-E": "Zarbi-E",
	"Unown-F": "Zarbi-F",
	"Unown-G": "Zarbi-G",
	"Unown-H": "Zarbi-H",
	"Unown-I": "Zarbi-I",
	"Unown-J": "Zarbi-J",
	"Unown-K": "Zarbi-K",
	"Unown-L": "Zarbi-L",
	"Unown-M": "Zarbi-M",
	"Unown-N": "Zarbi-N",
	"Unown-O": "Zarbi-O",
	"Unown-P": "Zarbi-P",
	"Unown-Q": "Zarbi-Q",
	"Unown-R": "Zarbi-R",
	"Unown-S": "Zarbi-S",
	"Unown-T": "Zarbi-T",
	"Unown-U": "Zarbi-U",
	"Unown-V": "Zarbi-V",
	"Unown-W": "Zarbi-W",
	"Unown-X": "Zarbi-X",
	"Unown-Y": "Zarbi-Y",
	"Unown-Z": "Zarbi-Z",
	"Unown-Exclamation": "Zarbi-Exclamation",
	"Unown-Question": "Zarbi-Question",
	"Wobbuffet": "Qulbutoké",
	"Girafarig": "Girafarig",
	"Pineco": "Pomdepik",
	"Forretress": "Foretress",
	"Dunsparce": "Insolourdo",
	"Gligar": "Scorplane",
	"Steelix": "Steelix",
	"Steelix-Mega": "Steelix-Méga",
	"Snubbull": "Snubbull",
	"Granbull": "Granbull",
	"Qwilfish": "Qwilfish",
	"Qwilfish-Hisui": "Qwilfish-Hisui",
	"Scizor": "Cizayox",
	"Scizor-Mega": "Cizayox-Méga",
	"Shuckle": "Caratroc",
	"Heracross": "Scarhino",
	"Heracross-Mega": "Scarhino-Méga",
	"Sneasel": "Farfuret",
	"Sneasel-Hisui": "Farfuret-Hisui",
	"Teddiursa": "Teddiursa",
	"Ursaring": "Ursaring",
	"Slugma": "Limagma",
	"Magcargo": "Volcaropod",
	"Swinub": "Marcacrin",
	"Piloswine": "Cochignon",
	"Corsola": "Corayon",
	"Corsola-Galar": "Corayon-Galar",
	"Remoraid": "Rémoraid",
	"Octillery": "Octillery",
	"Delibird": "Cadoizo",
	"Mantine": "Démanta",
	"Skarmory": "Airmure",
	"Houndour": "Malosse",
	"Houndoom": "Démolosse",
	"Houndoom-Mega": "Démolosse-Méga",
	"Kingdra": "Hyporoi",
	"Phanpy": "Phanpy",
	"Donphan": "Donphan",
	"Porygon2": "Porygon2",
	"Stantler": "Cerfrousse",
	"Smeargle": "Queulorior",
	"Tyrogue": "Debugant",
	"Hitmontop": "Kapoera",
	"Smoochum": "Lippouti",
	"Elekid": "Élekid",
	"Magby": "Magby",
	"Miltank": "Écrémeuh",
	"Blissey": "Leuphorie",
	"Raikou": "Raikou",
	"Entei": "Entei",
	"Suicune": "Suicune",
	"Larvitar": "Embrylex",
	"Pupitar": "Ymphect",
	"Tyranitar": "Tyranocif",
	"Tyranitar-Mega": "Tyranocif-Méga",
	"Lugia": "Lugia",
	"Ho-Oh": "Ho-Oh",
	"Celebi": "Celebi",
	"Treecko": "Arcko",
	"Grovyle": "Massko",
	"Sceptile": "Jungko",
	"Sceptile-Mega": "Jungko-Méga",
	"Torchic": "Poussifeu",
	"Combusken": "Galifeu",
	"Blaziken": "Braségali",
	"Blaziken-Mega": "Braségali-Méga",
	"Mudkip": "Gobou",
	"Marshtomp": "Flobio",
	"Swampert": "Laggron",
	"Swampert-Mega": "Laggron-Méga",
	"Poochyena": "Medhyèna",
	"Mightyena": "Grahyèna",
	"Zigzagoon": "Zigzaton",
	"Zigzagoon-Galar": "Zigzaton-Galar",
	"Linoone": "Linéon",
	"Linoone-Galar": "Linéon-Galar",
	"Wurmple": "Chenipotte",
	"Silcoon": "Armulys",
	"Beautifly": "Charmillon",
	"Cascoon": "Blindalys",
	"Dustox": "Papinox",
	"Lotad": "Nénupiot",
	"Lombre": "Lombre",
	"Ludicolo": "Ludicolo",
	"Seedot": "Grainipiot",
	"Nuzleaf": "Pifeuil",
	"Shiftry": "Tengalice",
	"Taillow": "Nirondelle",
	"Swellow": "Hélédelle",
	"Wingull": "Goélise",
	"Pelipper": "Bekipan",
	"Ralts": "Tarsal",
	"Kirlia": "Kirlia",
	"Gardevoir": "Gardevoir",
	"Gardevoir-Mega": "Gardevoir-Méga",
	"Surskit": "Arakdo",
	"Masquerain": "Maskadra",
	"Shroomish": "Balignon",
	"Breloom": "Chapignon",
	"Slakoth": "Parecool",
	"Vigoroth": "Vigoroth",
	"Slaking": "Monaflèmit",
	"Nincada": "Ningale",
	"Ninjask": "Ninjask",
	"Shedinja": "Munja",
	"Whismur": "Chuchmur",
	"Loudred": "Ramboum",
	"Exploud": "Brouhabam",
	"Makuhita": "Makuhita",
	"Hariyama": "Hariyama",
	"Azurill": "Azurill",
	"Nosepass": "Tarinor",
	"Skitty": "Skitty",
	"Delcatty": "Delcatty",
	"Sableye": "Ténéfix",
	"Sableye-Mega": "Ténéfix-Méga",
	"Mawile": "Mysdibule",
	"Mawile-Mega": "Mysdibule-Méga",
	"Aron": "Galekid",
	"Lairon": "Galegon",
	"Aggron": "Galeking",
	"Aggron-Mega": "Galeking-Méga",
	"Meditite": "Méditikka",
	"Medicham": "Charmina",
	"Medicham-Mega": "Charmina-Méga",
	"Electrike": "Dynavolt",
	"Manectric": "Élecsprint",
	"Manectric-Mega": "Élecsprint-Méga",
	"Plusle": "Posipi",
	"Minun": "Négapi",
	"Volbeat": "Muciole",
	"Illumise": "Lumivole",
	"Roselia": "Rosélia",
	"Gulpin": "Gloupti",
	"Swalot": "Avaltout",
	"Carvanha": "Carvanha",
	"Sharpedo": "Sharpedo",
	"Sharpedo-Mega": "Sharpedo-Méga",
	"Wailmer": "Wailmer",
	"Wailord": "Wailord",
	"Numel": "Chamallot",
	"Camerupt": "Camérupt",
	"Camerupt-Mega": "Camérupt-Méga",
	"Torkoal": "Chartor",
	"Spoink": "Spoink",
	"Grumpig": "Groret",
	"Spinda": "Spinda",
	"Trapinch": "Kraknoix",
	"Vibrava": "Vibraninf",
	"Flygon": "Libégon",
	"Cacnea": "Cacnea",
	"Cacturne": "Cacturne",
	"Swablu": "Tylton",
	"Altaria": "Altaria",
	"Altaria-Mega": "Altaria-Méga",
	"Zangoose": "Mangriff",
	"Seviper": "Séviper",
	"Lunatone": "Séléroc",
	"Solrock": "Solaroc",
	"Barboach": "Barloche",
	"Whiscash": "Barbicha",
	"Corphish": "Écrapince",
	"Crawdaunt": "Colhomard",
	"Baltoy": "Balbuto",
	"Claydol": "Kaorine",
	"Lileep": "Lilia",
	"Cradily": "Vacilys",
	"Anorith": "Anorith",
	"Armaldo": "Armaldo",
	"Feebas": "Barpau",
	"Milotic": "Milobellus",
	"Castform": "Morphéo",
	"Castform-Rainy": "Morphéo-Eau de Pluie",
	"Castform-Snowy": "Morphéo-Blizzard",
	"Castform-Sunny": "Morphéo-Solaire",
	"Kecleon": "Kecleon",
	"Shuppet": "Polichombr",
	"Banette": "Branette",
	"Banette-Mega": "Branette-Méga",
	"Duskull": "Skelénox",
	"Dusclops": "Téraclope",
	"Tropius": "Tropius",
	"Chimecho": "Éoko",
	"Absol": "Absol",
	"Absol-Mega": "Absol-Méga",
	"Wynaut": "Okéoké",
	"Snorunt": "Stalgamin",
	"Glalie": "Oniglali",
	"Glalie-Mega": "Oniglali-Méga",
	"Spheal": "Obalie",
	"Sealeo": "Phogleur",
	"Walrein": "Kaimorse",
	"Clamperl": "Coquiperl",
	"Huntail": "Serpang",
	"Gorebyss": "Rosabyss",
	"Relicanth": "Relicanth",
	"Luvdisc": "Lovdisc",
	"Bagon": "Draby",
	"Shelgon": "Drackhaus",
	"Salamence": "Drattak",
	"Salamence-Mega": "Drattak-Méga",
	"Beldum": "Terhal",
	"Metang": "Métang",
	"Metagross": "Métalosse",
	"Metagross-Mega": "Métalosse-Méga",
	"Regirock": "Regirock",
	"Regice": "Regice",
	"Registeel": "Registeel",
	"Latias": "Latias",
	"Latias-Mega": "Latias-Méga",
	"Latios": "Latios",
	"Latios-Mega": "Latios-Méga",
	"Kyogre": "Kyogre",
	"Kyogre-Primal": "Kyogre-Primo",
	"Groudon": "Groudon",
	"Groudon-Primal": "Groudon-Primo",
	"Rayquaza": "Rayquaza",
	"Rayquaza-Mega": "Rayquaza-Méga",
	"Jirachi": "Jirachi",
	"Deoxys": "Deoxys",
	"Deoxys-Attack": "Deoxys-Attaque",
	"Deoxys-Defense": "Deoxys-Défense",
	"Deoxys-Speed": "Deoxys-Vitesse",
	"Turtwig": "Tortipouss",
	"Grotle": "Boskara",
	"Torterra": "Torterra",
	"Chimchar": "Ouisticram",
	"Monferno": "Chimpenfeu",
	"Infernape": "Simiabraz",
	"Piplup": "Tiplouf",
	"Prinplup": "Prinplouf",
	"Empoleon": "Pingoléon",
	"Starly": "Étourmi",
	"Staravia": "Étourvol",
	"Staraptor": "Étouraptor",
	"Bidoof": "Keunotor",
	"Bibarel": "Castorno",
	"Kricketot": "Crikzik",
	"Kricketune": "Mélokrik",
	"Shinx": "Lixy",
	"Luxio": "Luxio",
	"Luxray": "Luxray",
	"Budew": "Rozbouton",
	"Roserade": "Roserade",
	"Cranidos": "Kranidos",
	"Rampardos": "Charkos",
	"Shieldon": "Dinoclier",
	"Bastiodon": "Bastiodon",
	"Burmy": "Cheniti",
	"Burmy-Sandy": "Cheniti-Sable",
	"Burmy-Trash": "Cheniti-Déchet",
	"Wormadam": "Cheniselle",
	"Wormadam-Sandy": "Cheniselle-Sable",
	"Wormadam-Trash": "Cheniselle-Déchet",
	"Mothim": "Papilord",
	"Combee": "Apitrini",
	"Vespiquen": "Apireine",
	"Pachirisu": "Pachirisu",
	"Buizel": "Mustébouée",
	"Floatzel": "Mustéflott",
	"Cherubi": "Ceribou",
	"Cherrim": "Ceriflor",
	"Cherrim-Sunshine": "Ceriflor-Ensoleillé",
	"Shellos": "Sancoki",
	"Shellos-East": "Sancoki-Orient",
	"Gastrodon": "Tritosor",
	"Gastrodon-East": "Tritosor-Orient",
	"Ambipom": "Capidextre",
	"Drifloon": "Baudrive",
	"Drifblim": "Grodrive",
	"Buneary": "Laporeille",
	"Lopunny": "Lockpin",
	"Lopunny-Mega": "Lockpin-Méga",
	"Mismagius": "Magirêve",
	"Honchkrow": "Corboss",
	"Glameow": "Chaglam",
	"Purugly": "Chaffreux",
	"Chingling": "Korillon",
	"Stunky": "Moufouette",
	"Skuntank": "Moufflair",
	"Bronzor": "Archéomire",
	"Bronzong": "Archéodong",
	"Bonsly": "Manzaï",
	"Mime Jr.": "Mime Jr.",
	"Happiny": "Ptiravi",
	"Chatot": "Pijako",
	"Spiritomb": "Spiritomb",
	"Gible": "Griknot",
	"Gabite": "Carmache",
	"Garchomp": "Carchacrok",
	"Garchomp-Mega": "Carchacrok-Méga",
	"Munchlax": "Goinfrex",
	"Riolu": "Riolu",
	"Lucario": "Lucario",
	"Lucario-Mega": "Lucario-Méga",
	"Hippopotas": "Hippopotas",
	"Hippowdon": "Hippodocus",
	"Skorupi": "Rapion",
	"Drapion": "Drascore",
	"Croagunk": "Cradopaud",
	"Toxicroak": "Coatox",
	"Carnivine": "Vortente",
	"Finneon": "Écayon",
	"Lumineon": "Luminéon",
	"Mantyke": "Babimanta",
	"Snover": "Blizzi",
	"Abomasnow": "Blizzaroi",
	"Abomasnow-Mega": "Blizzaroi-Méga",
	"Weavile": "Dimoret",
	"Magnezone": "Magnézone",
	"Lickilicky": "Coudlangue",
	"Rhyperior": "Rhinastoc",
	"Tangrowth": "Bouldeneu",
	"Electivire": "Élekable",
	"Magmortar": "Maganon",
	"Togekiss": "Togekiss",
	"Yanmega": "Yanméga",
	"Leafeon": "Phyllali",
	"Glaceon": "Givrali",
	"Gliscor": "Scorvol",
	"Mamoswine": "Mammochon",
	"Porygon-Z": "Porygon-Z",
	"Gallade": "Gallame",
	"Gallade-Mega": "Gallame-Méga",
	"Probopass": "Tarinorme",
	"Dusknoir": "Noctunoir",
	"Froslass": "Momartik",
	"Rotom": "Motisma",
	"Rotom-Fan": "Motisma-Hélice",
	"Rotom-Frost": "Motisma-Froid",
	"Rotom-Heat": "Motisma-Chaleur",
	"Rotom-Mow": "Motisma-Tonte",
	"Rotom-Wash": "Motisma-Lavage",
	"Uxie": "Créhelf",
	"Mesprit": "Créfollet",
	"Azelf": "Créfadet",
	"Dialga": "Dialga",
	"Dialga-Origin": "Dialga-Origine",
	"Palkia": "Palkia",
	"Palkia-Origin": "Palkia-Origine",
	"Heatran": "Heatran",
	"Regigigas": "Regigigas",
	"Giratina": "Giratina",
	"Giratina-Origin": "Giratina-Origine",
	"Cresselia": "Cresselia",
	"Phione": "Phione",
	"Manaphy": "Manaphy",
	"Darkrai": "Darkrai",
	"Shaymin": "Shaymin",
	"Shaymin-Sky": "Shaymin-Céleste",
	"Arceus": "Arceus",
	"Arceus-Bug": "Arceus-Insecte",
	"Arceus-Dark": "Arceus-Ténèbres",
	"Arceus-Dragon": "Arceus-Dragon",
	"Arceus-Electric": "Arceus-Électrik",
	"Arceus-Fairy": "Arceus-Fée",
	"Arceus-Fighting": "Arceus-Combat",
	"Arceus-Fire": "Arceus-Feu",
	"Arceus-Flying": "Arceus-Vol",
	"Arceus-Ghost": "Arceus-Spectre",
	"Arceus-Grass": "Arceus-Plante",
	"Arceus-Ground": "Arceus-Sol",
	"Arceus-Ice": "Arceus-Glace",
	"Arceus-Poison": "Arceus-Poison",
	"Arceus-Psychic": "Arceus-Psy",
	"Arceus-Rock": "Arceus-Roche",
	"Arceus-Steel": "Arceus-Acier",
	"Arceus-Water": "Arceus-Eau",
	"Victini": "Victini",
	"Snivy": "Vipélierre",
	"Servine": "Lianaja",
	"Serperior": "Majaspic",
	"Tepig": "Gruikui",
	"Pignite": "Grotichon",
	"Emboar": "Roitiflam",
	"Oshawott": "Moustillon",
	"Dewott": "Mateloutre",
	"Samurott": "Clamiral",
	"Samurott-Hisui": "Clamiral-Hisui",
	"Patrat": "Ratentif",
	"Watchog": "Miradar",
	"Lillipup": "Ponchiot",
	"Herdier": "Ponchien",
	"Stoutland": "Mastouffe",
	"Purrloin": "Chacripan",
	"Liepard": "Léopardus",
	"Pansage": "Feuillajou",
	"Simisage": "Feuiloutan",
	"Pansear": "Flamajou",
	"Simisear": "Flamoutan",
	"Panpour": "Flotajou",
	"Simipour": "Flotoutan",
	"Munna": "Munna",
	"Musharna": "Mushana",
	"Pidove": "Poichigeon",
	"Tranquill": "Colombeau",
	"Unfezant": "Déflaisan",
	"Blitzle": "Zébribon",
	"Zebstrika": "Zéblitz",
	"Roggenrola": "Nodulithe",
	"Boldore": "Géolithe",
	"Gigalith": "Gigalithe",
	"Woobat": "Chovsourir",
	"Swoobat": "Rhinolove",
	"Drilbur": "Rototaupe",
	"Excadrill": "Minotaupe",
	"Audino": "Nanméouïe",
	"Audino-Mega": "Nanméouïe-Méga",
	"Timburr": "Charpenti",
	"Gurdurr": "Ouvrifier",
	"Conkeldurr": "Bétochef",
	"Tympole": "Tritonde",
	"Palpitoad": "Batracné",
	"Seismitoad": "Crapustule",
	"Throh": "Judokrak",
	"Sawk": "Karaclée",
	"Sewaddle": "Larveyette",
	"Swadloon": "Couverdure",
	"Leavanny": "Manternel",
	"Venipede": "Venipatte",
	"Whirlipede": "Scobolide",
	"Scolipede": "Brutapode",
	"Cottonee": "Doudouvet",
	"Whimsicott": "Farfaduvet",
	"Petilil": "Chlorobule",
	"Lilligant": "Fragilady",
	"Lilligant-Hisui": "Fragilady-Hisui",
	"Basculin": "Bargantua",
	"Basculin-Blue-Striped": "Bargantua-Bleu",
	"Basculin-White-Striped": "Bargantua-Blanc",
	"Sandile": "Mascaïman",
	"Krokorok": "Escroco",
	"Krookodile": "Crocorible",
	"Darumaka": "Darumarond",
	"Darumaka-Galar": "Darumarond-Galar",
	"Darmanitan": "Darumacho",
	"Darmanitan-Zen": "Darumacho-Transe",
	"Darmanitan-Galar": "Darumacho-Galar",
	"Darmanitan-Galar-Zen": "Darumacho-Galar-Transe",
	"Maractus": "Maracachi",
	"Dwebble": "Crabicoque",
	"Crustle": "Crabaraque",
	"Scraggy": "Baggiguane",
	"Scrafty": "Baggaïd",
	"Sigilyph": "Cryptéro",
	"Yamask": "Tutafeh",
	"Yamask-Galar": "Tutafeh-Galar",
	"Cofagrigus": "Tutankafer",
	"Tirtouga": "Carapagos",
	"Carracosta": "Mégapagos",
	"Archen": "Arkéapti",
	"Archeops": "Aéroptéryx",
	"Trubbish": "Miamiasme",
	"Garbodor-Gmax": "Miasmax-Gmax",
	"Garbodor": "Miasmax",
	"Zorua": "Zorua",
	"Zorua-Hisui": "Zorua-Hisui",
	"Zoroark": "Zoroark",
	"Zoroark-Hisui": "Zoroark-Hisui",
	"Minccino": "Chinchidou",
	"Cinccino": "Pashmilla",
	"Gothita": "Scrutella",
	"Gothorita": "Mesmérella",
	"Gothitelle": "Sidérella",
	"Solosis": "Nucléos",
	"Duosion": "Méios",
	"Reuniclus": "Symbios",
	"Ducklett": "Couaneton",
	"Swanna": "Lakmécygne",
	"Vanillite": "Sorbébé",
	"Vanillish": "Sorboul",
	"Vanilluxe": "Sorbouboul",
	"Deerling": "Vivaldaim",
	"Deerling-Autumn": "Vivaldaim-Automne",
	"Deerling-Summer": "Vivaldaim-Été",
	"Deerling-Winter": "Vivaldaim-Hiver",
	"Sawsbuck": "Haydaim",
	"Sawsbuck-Autumn": "Haydaim-Automne",
	"Sawsbuck-Summer": "Haydaim-Été",
	"Sawsbuck-Winter": "Haydaim-Hiver",
	"Emolga": "Emolga",
	"Karrablast": "Carabing",
	"Escavalier": "Lançargot",
	"Foongus": "Trompignon",
	"Amoonguss": "Gaulet",
	"Frillish": "Viskuse",
	"Jellicent": "Moyade",
	"Alomomola": "Mamanbo",
	"Joltik": "Statitik",
	"Galvantula": "Mygavolt",
	"Ferroseed": "Grindur",
	"Ferrothorn": "Noacier",
	"Klink": "Tic",
	"Klang": "Clic",
	"Klinklang": "Cliticlic",
	"Tynamo": "Anchwatt",
	"Eelektrik": "Lampéroie",
	"Eelektross": "Ohmassacre",
	"Elgyem": "Lewsor",
	"Beheeyem": "Neitram",
	"Litwick": "Funécire",
	"Lampent": "Mélancolux",
	"Chandelure": "Lugulabre",
	"Axew": "Coupenotte",
	"Fraxure": "Incisache",
	"Haxorus": "Tranchodon",
	"Cubchoo": "Polarhume",
	"Beartic": "Polagriffe",
	"Cryogonal": "Hexagel",
	"Shelmet": "Escargaume",
	"Accelgor": "Limaspeed",
	"Stunfisk": "Limonde",
	"Stunfisk-Galar": "Limonde-Galar",
	"Mienfoo": "Kungfouine",
	"Mienshao": "Shaofouine",
	"Druddigon": "Drakkarmin",
	"Golett": "Gringolem",
	"Golurk": "Golemastoc",
	"Pawniard": "Scalpion",
	"Bisharp": "Scalproie",
	"Bouffalant": "Frison",
	"Rufflet": "Furaiglon",
	"Braviary": "Gueriaigle",
	"Braviary-Hisui": "Gueriaigle-Hisui",
	"Vullaby": "Vostourno",
	"Mandibuzz": "Vaututrice",
	"Heatmor": "Aflamanoir",
	"Durant": "Fermite",
	"Deino": "Solochi",
	"Zweilous": "Diamat",
	"Hydreigon": "Trioxhydre",
	"Larvesta": "Pyronille",
	"Volcarona": "Pyrax",
	"Cobalion": "Cobaltium",
	"Terrakion": "Terrakium",
	"Virizion": "Viridium",
	"Tornadus": "Boréas",
	"Tornadus-Therian": "Boréas-Totem",
	"Thundurus": "Fulguris",
	"Thundurus-Therian": "Fulguris-Totem",
	"Reshiram": "Reshiram",
	"Zekrom": "Zekrom",
	"Landorus": "Démétéros",
	"Landorus-Therian": "Démétéros-Totem",
	"Kyurem": "Kyurem",
	"Kyurem-Black": "Kyurem-Noir",
	"Kyurem-White": "Kyurem-Blanc",
	"Keldeo": "Keldeo",
	"Keldeo-Resolute": "Keldeo-Décidé",
	"Meloetta": "Meloetta",
	"Meloetta-Pirouette": "Meloetta-Danse",
	"Genesect": "Genesect",
	"Genesect-Burn": "Genesect-Pyro",
	"Genesect-Chill": "Genesect-Cryo",
	"Genesect-Douse": "Genesect-Aqua",
	"Genesect-Shock": "Genesect-Choc",
	"Chespin": "Marisson",
	"Quilladin": "Boguérisse",
	"Chesnaught": "Blindépique",
	"Fennekin": "Feunnec",
	"Braixen": "Roussil",
	"Delphox": "Goupelin",
	"Froakie": "Grenousse",
	"Frogadier": "Croâporal",
	"Greninja": "Amphinobi",
	"Greninja-Ash": "Amphinobi-Sacha",
	"Bunnelby": "Sapereau",
	"Diggersby": "Excavarenne",
	"Fletchling": "Passerouge",
	"Fletchinder": "Braisillon",
	"Talonflame": "Flambusard",
	"Scatterbug": "Lépidonille",
	"Spewpa": "Pérégrain",
	"Vivillon": "Prismillon",
	"Vivillon-Archipelago": "Prismillon-Archipel",
	"Vivillon-Continental": "Prismillon-Continent",
	"Vivillon-Elegant": "Prismillon-Monarchie",
	"Vivillon-Garden": "Prismillon-Verdure",
	"Vivillon-High Plains": "Prismillon-Sécheresse",
	"Vivillon-Icy Snow": "Prismillon-Blizzard",
	"Vivillon-Jungle": "Prismillon-Jungle",
	"Vivillon-Marine": "Prismillon-Rivage",
	"Vivillon-Modern": "Prismillon-Métropole",
	"Vivillon-Monsoon": "Prismillon-Cyclone",
	"Vivillon-Ocean": "Prismillon-Soleil Levant",
	"Vivillon-Polar": "Prismillon-Banquise",
	"Vivillon-River": "Prismillon-Delta",
	"Vivillon-Sandstorm": "Prismillon-Sable",
	"Vivillon-Savanna": "Prismillon-Mangrove",
	"Vivillon-Sun": "Prismillon-Zénith",
	"Vivillon-Tundra": "Prismillon-Glace",
	"Vivillon-Fancy": "Prismillon-Fantaisie",
	"Vivillon-Pokeball": "Prismillon-Pokéball",
	"Litleo": "Hélionceau",
	"Pyroar": "Némélios",
	"Flabe\u0301be\u0301": "Flabébé",
	"Flabe\u0301be\u0301-Blue": "Flabébé-Bleu",
	"Flabe\u0301be\u0301-Orange": "Flabébé-Orange",
	"Flabe\u0301be\u0301-White": "Flabébé-Blanc",
	"Flabe\u0301be\u0301-Yellow": "Flabébé-Jaune",
	"Floette": "Floette",
	"Floette-Blue": "Floette-Bleu",
	"Floette-Orange": "Floette-Orange",
	"Floette-White": "Floette-Blanc",
	"Floette-Yellow": "Floette-Jaune",
	"Floette-Eternal": "Floette-Éternelle",
	"Florges": "Florges",
	"Florges-Blue": "Florges-Bleu",
	"Florges-Orange": "Florges-Orange",
	"Florges-White": "Florges-Blanc",
	"Florges-Yellow": "Florges-Jaune",
	"Skiddo": "Cabriolaine",
	"Gogoat": "Chevroum",
	"Pancham": "Pandespiègle",
	"Pangoro": "Pandarbare",
	"Furfrou": "Couafarel",
	"Furfrou-Dandy": "Couafarel-Monsieur",
	"Furfrou-Debutante": "Couafarel-Demoiselle",
	"Furfrou-Heart": "Couafarel-Coeur",
	"Furfrou-Diamond": "Couafarel-Diamant",
	"Furfrou-Kabuki": "Couafarel-Kabuki",
	"Furfrou-La Reine": "Couafarel-Reine",
	"Furfrou-Matron": "Couafarel-Madame",
	"Furfrou-Pharaoh": "Couafarel-Pharaon",
	"Furfrou-Star": "Couafarel-Étoile",
	"Espurr": "Psystigri",
	"Meowstic": "Mistigrix",
	"Meowstic-F": "Mistigrix-F",
	"Honedge": "Monorpale",
	"Doublade": "Dimoclès",
	"Aegislash": "Exagide",
	"Aegislash-Blade": "Exagide-Épée",
	"Spritzee": "Fluvetin",
	"Aromatisse": "Cocotine",
	"Swirlix": "Sucroquin",
	"Slurpuff": "Cupcanaille",
	"Inkay": "Sepiatop",
	"Malamar": "Sepiatroce",
	"Binacle": "Opermine",
	"Barbaracle": "Golgopathe",
	"Skrelp": "Venalgue",
	"Dragalge": "Kravarech",
	"Clauncher": "Flingouste",
	"Clawitzer": "Gamblast",
	"Helioptile": "Galvaran",
	"Heliolisk": "Iguolta",
	"Tyrunt": "Ptyranidur",
	"Tyrantrum": "Rexillius",
	"Amaura": "Amagara",
	"Aurorus": "Dragmara",
	"Sylveon": "Nymphali",
	"Hawlucha": "Brutalibré",
	"Dedenne": "Dedenne",
	"Carbink": "Strassie",
	"Goomy": "Mucuscule",
	"Sliggoo": "Colimucus",
	"Sliggoo-Hisui": "Colimucus-Hisui",
	"Goodra": "Muplodocus",
	"Goodra-Hisui": "Muplodocus-Hisui",
	"Klefki": "Trousselin",
	"Phantump": "Brocélôme",
	"Trevenant": "Desséliande",
	"Pumpkaboo": "Pitrouille",
	"Pumpkaboo-Large": "Pitrouille-Maxi",
	"Pumpkaboo-Small": "Pitrouille-Mini",
	"Pumpkaboo-Super": "Pitrouille-Ultra",
	"Gourgeist": "Banshitrouye",
	"Gourgeist-Large": "Banshitrouye-Maxi",
	"Gourgeist-Small": "Banshitrouye-Mini",
	"Gourgeist-Super": "Banshitrouye-Ultra",
	"Bergmite": "Grelaçon",
	"Avalugg": "Séracrawl",
	"Avalugg-Hisui": "Séracrawl-Hisui",
	"Noibat": "Sonistrelle",
	"Noivern": "Bruyverne",
	"Xerneas": "Xerneas",
	"Xerneas-Neutral": "Xerneas-Paisible",
	"Yveltal": "Yveltal",
	"Zygarde": "Zygarde",
	"Zygarde-10%": "Zygarde-10%",
	"Zygarde-Complete": "Zygarde-Parfait",
	"Diancie": "Diancie",
	"Diancie-Mega": "Diancie-Méga",
	"Hoopa": "Hoopa",
	"Hoopa-Unbound": "Hoopa-Déchaîné",
	"Volcanion": "Volcanion",
	"Rowlet": "Brindibou",
	"Dartrix": "Efflèche",
	"Decidueye": "Archéduc",
	"Decidueye-Hisui": "Archéduc-Hisui",
	"Litten": "Flamiaou",
	"Torracat": "Matoufeu",
	"Incineroar": "Félinferno",
	"Popplio": "Otaquin",
	"Brionne": "Otarlette",
	"Primarina": "Oratoria",
	"Pikipek": "Picassaut",
	"Trumbeak": "Piclairon",
	"Toucannon": "Bazoucan",
	"Yungoos": "Manglouton",
	"Gumshoos": "Argouste",
	"Gumshoos-Totem": "Argouste-Dominant",
	"Grubbin": "Larvibule",
	"Charjabug": "Chrysapile",
	"Vikavolt": "Lucanon",
	"Vikavolt-Totem": "Lucanon-Dominant",
	"Crabrawler": "Crabagarre",
	"Crabominable": "Crabominable",
	"Oricorio": "Plumeline",
	"Oricorio-Pa'u": "Plumeline-Hula",
	"Oricorio-Pom-Pom": "Plumeline-Pom-Pom",
	"Oricorio-Sensu": "Plumeline-Buyō",
	"Cutiefly": "Bombydou",
	"Ribombee": "Rubombelle",
	"Ribombee-Totem": "Rubombelle-Dominant",
	"Rockruff": "Rocabot",
	"Lycanroc": "Lougaroc",
	"Lycanroc-Dusk": "Lougaroc-Crépuscule",
	"Lycanroc-Midnight": "Lougaroc-Nocturne",
	"Wishiwashi": "Froussardine",
	"Wishiwashi-School": "Froussardine-Banc",
	"Mareanie": "Vorastérie",
	"Toxapex": "Prédastérie",
	"Mudbray": "Tiboudet",
	"Mudsdale": "Bourrinos",
	"Dewpider": "Araqua",
	"Araquanid": "Tarenbulle",
	"Araquanid-Totem": "Tarenbulle-Dominant",
	"Fomantis": "Mimantis",
	"Lurantis": "Floramantis",
	"Lurantis-Totem": "Floramantis-Dominant",
	"Morelull": "Spododo",
	"Shiinotic": "Lampignon",
	"Salandit": "Tritox",
	"Salazzle": "Malamandre",
	"Salazzle-Totem": "Malamandre-Dominant",
	"Stufful": "Nounourson",
	"Bewear": "Chelours",
	"Bounsweet": "Croquine",
	"Steenee": "Candine",
	"Tsareena": "Sucreine",
	"Comfey": "Guérilande",
	"Oranguru": "Gouroutan",
	"Passimian": "Quartermac",
	"Wimpod": "Sovkipou",
	"Golisopod": "Sarmuraï",
	"Sandygast": "Bacabouh",
	"Palossand": "Trépassable",
	"Pyukumuku": "Concombaffe",
	"Type: Null": "Type:0",
	"Silvally": "Silvallié",
	"Silvally-Bug": "Silvallié-Insecte",
	"Silvally-Dark": "Silvallié-Ténèbres",
	"Silvally-Dragon": "Silvallié-Dragon",
	"Silvally-Electric": "Silvallié-Électrik",
	"Silvally-Fairy": "Silvallié-Fée",
	"Silvally-Fighting": "Silvallié-Combat",
	"Silvally-Fire": "Silvallié-Feu",
	"Silvally-Flying": "Silvallié-Vol",
	"Silvally-Ghost": "Silvallié-Spectre",
	"Silvally-Grass": "Silvallié-Plante",
	"Silvally-Ground": "Silvallié-Sol",
	"Silvally-Ice": "Silvallié-Glace",
	"Silvally-Poison": "Silvallié-Poison",
	"Silvally-Psychic": "Silvallié-Psy",
	"Silvally-Rock": "Silvallié-Roche",
	"Silvally-Steel": "Silvallié-Acier",
	"Silvally-Water": "Silvallié-Eau",
	"Minior": "Météno",
	"Minior-Meteor": "Météno-Météore",
	"Minior-Orange": "Météno-Orange",
	"Minior-Yellow": "Météno-Jaune",
	"Minior-Green": "Météno-Vert",
	"Minior-Blue": "Météno-Bleu",
	"Minior-Indigo": "Météno-Indigo",
	"Minior-Violet": "Météno-Violet",
	"Komala": "Dodoala",
	"Turtonator": "Boumata",
	"Togedemaru": "Togedemaru",
	"Togedemaru-Totem": "Togedemaru-Dominant",
	"Mimikyu": "Mimiqui",
	"Mimikyu-Busted": "Mimiqui-Démasqué",
	"Mimikyu-Totem": "Mimiqui-Dominant",
	"Mimikyu-Busted-Totem": "Mimiqui-Dominant-Démasqué",
	"Bruxish": "Denticrisse",
	"Drampa": "Draïeul",
	"Dhelmise": "Sinistrail",
	"Jangmo-o": "Bébécaille",
	"Hakamo-o": "Écaïd",
	"Kommo-o": "Ékaïser",
	"Kommo-o-Totem": "Ékaïser-Dominant",
	"Tapu Koko": "Tokorico",
	"Tapu Lele": "Tokopiyon",
	"Tapu Bulu": "Tokotoro",
	"Tapu Fini": "Tokopisco",
	"Cosmog": "Cosmog",
	"Cosmoem": "Cosmovum",
	"Solgaleo": "Solgaleo",
	"Lunala": "Lunala",
	"Nihilego": "Zéroïd",
	"Buzzwole": "Mouscoto",
	"Pheromosa": "Cancrelove",
	"Xurkitree": "Câblifère",
	"Celesteela": "Bamboiselle",
	"Kartana": "Katagami",
	"Guzzlord": "Engloutyran",
	"Necrozma": "Necrozma",
	"Necrozma-Dawn-Wings": "Necrozma-Aurore",
	"Necrozma-Dusk-Mane": "Necrozma-Couchant",
	"Necrozma-Ultra": "Necrozma-Ultra",
	"Magearna": "Magearna",
	"Magearna-Original": "Magearna-Passé",
	"Marshadow": "Marshadow",
	"Poipole": "Vémini",
	"Naganadel": "Mandrillon",
	"Stakataka": "Ama-Ama",
	"Blacephalon": "Pierroteknik",
	"Zeraora": "Zeraora",
	"Meltan": "Meltan",
	"Melmetal": "Melmetal",
	"Melmetal-Gmax": "Melmetal-Gmax",
	"Grookey": "Ouistempo",
	"Thwackey": "Badabouin",
	"Rillaboom": "Gorythmic",
	"Rillaboom-Gmax": "Gorythmic-Gmax",
	"Scorbunny": "Flambino",
	"Raboot": "Lapyro",
	"Cinderace": "Pyrobut",
	"Cinderace-Gmax": "Pyrobut-Gmax",
	"Sobble": "Larméléon",
	"Drizzile": "Arrozard",
	"Inteleon": "Lézargus",
	"Inteleon-Gmax": "Lézargus-Gmax",
	"Skwovet": "Rongourmand",
	"Greedent": "Rongrigou",
	"Rookidee": "Minisange",
	"Corvisquire": "Bleuseille",
	"Corviknight": "Corvaillus",
	"Corviknight-Gmax": "Corvaillus-Gmax",
	"Blipbug": "Larvadar",
	"Dottler": "Coléodôme",
	"Orbeetle": "Astronelle",
	"Orbeetle-Gmax": "Astronelle-Gmax",
	"Nickit": "Goupilou",
	"Thievul": "Roublenard",
	"Gossifleur": "Tournicoton",
	"Eldegoss": "Blancoton",
	"Wooloo": "Moumouton",
	"Dubwool": "Moumouflon",
	"Chewtle": "Khélocrok",
	"Drednaw": "Torgamord",
	"Drednaw-Gmax": "Torgamord-Gmax",
	"Yamper": "Voltoutou",
	"Boltund": "Fulgudog",
	"Rolycoly": "Charbi",
	"Carkol": "Wagomine",
	"Coalossal": "Monthracite",
	"Coalossal-Gmax": "Monthracite-Gmax",
	"Applin": "Verpom",
	"Flapple": "Pomdrapi",
	"Flapple-Gmax": "Pomdrapi-Gmax",
	"Appletun": "Dratatin",
	"Appletun-Gmax": "Dratatin-Gmax",
	"Silicobra": "Dunaja",
	"Sandaconda": "Dunaconda",
	"Sandaconda-Gmax": "Dunaconda-Gmax",
	"Cramorant": "Nigosier",
	"Cramorant-Gorging": "Nigosier-Gobe-Chu",
	"Cramorant-Gulping": "Nigosier-Gobe-Tout",
	"Arrokuda": "Embrochet",
	"Barraskewda": "Hastacuda",
	"Toxel": "Toxizap",
	"Toxtricity": "Salarsen",
	"Toxtricity-Low-Key": "Salarsen-Grave",
	"Toxtricity-Gmax": "Salarsen-Gmax",
	"Toxtricity-Low-Key-Gmax": "Salarsen-Grave-Gmax",
	"Sizzlipede": "Grillepattes",
	"Centiskorch": "Scolocendre",
	"Centiskorch-Gmax": "Scolocendre-Gmax",
	"Clobbopus": "Poulpaf",
	"Grapploct": "Krakos",
	"Sinistea": "Théffroi",
	"Sinistea-Antique": "Théffroi-Antique",
	"Polteageist": "Polthégeist",
	"Polteageist-Antique": "Polthégeist-Antique",
	"Hatenna": "Bibichut",
	"Hattrem": "Chapotus",
	"Hattrem-Gmax": "Chapotus-Gmax",
	"Hatterene": "Sorcilence",
	"Impidimp": "Grimalin",
	"Morgrem": "Fourbelin",
	"Grimmsnarl": "Angoliath",
	"Grimmsnarl-Gmax": "Angoliath-Gmax",
	"Obstagoon": "Ixon",
	"Perrserker": "Berserkatt",
	"Cursola": "Corayôme",
	"Sirfetch’d": "Palarticho",
	"Mr. Rime": "M. Glaquette",
	"Runerigus": "Tutétékri",
	"Milcery": "Crèmy",
	"Alcremie": "Charmilly",
	"Alcremie-Ruby-Cream": "Charmilly-Lait Ruby",
	"Alcremie-Matcha-Cream": "Charmilly-Lait Matcha",
	"Alcremie-Mint-Cream": "Charmilly-Lait Menthe",
	"Alcremie-Lemon-Cream": "Charmilly-Lait Citron",
	"Alcremie-Salted-Cream": "Charmilly-Lait Salé",
	"Alcremie-Ruby-Swirl": "Charmilly-Mélange-Ruby",
	"Alcremie-Caramel-Swirl": "Charmilly-Mélange-Caramel",
	"Alcremie-Rainbow-Swirl": "Charmilly-Mélange-Tricolore",
	"Alcremie-Gmax": "Charmilly-Gmax",
	"Falinks": "Hexadron",
	"Pincurchin": "Wattapik",
	"Snom": "Frissonille",
	"Frosmoth": "Beldeneige",
	"Stonjourner": "Dolman",
	"Eiscue": "Bekaglaçon",
	"Eiscue-Noice": "Bekaglaçon-Tête Dégel",
	"Indeedee": "Wimessir",
	"Indeedee-F": "Wimessir-F",
	"Morpeko": "Morpeko",
	"Morpeko-Hangry": "Morpeko-Affamé",
	"Cufant": "Charibari",
	"Copperajah": "Pachyradjah",
	"Copperajah-Gmax": "Pachyradjah-Gmax",
	"Dracozolt": "Galvagon",
	"Arctozolt": "Galvagla",
	"Dracovish": "Hydragon",
	"Arctovish": "Hydragla",
	"Duraludon": "Duralugon",
	"Duraludon-Gmax": "Duralugon-Gmax",
	"Dreepy": "Fantyrm",
	"Drakloak": "Dispareptil",
	"Dragapult": "Lanssorien",
	"Zacian": "Zacian",
	"Zacian-Crowned": "Zacian-Épée",
	"Zamazenta": "Zamazenta",
	"Zamazenta-Crowned": "Zamazenta-Bouclier",
	"Eternatus": "Éthernatos",
	"Eternatus-Eternamax": "Éthernatos-Infinimax",
	"Kubfu": "Wushours",
	"Urshifu": "Shifours",
	"Urshifu-Rapid-Strike": "Shifours-Mille Poings",
	"Urshifu-Gmax": "Shifours-Gmax",
	"Urshifu-Rapid-Strike-Gmax": "Shifours-Mille Poings-Gmax",
	"Zarude": "Zarude",
	"Zarude-Dada": "Zarude-Papa",
	"Regieleki": "Regieleki",
	"Regidrago": "Regidrago",
	"Glastrier": "Blizzeval",
	"Spectrier": "Spectreval",
	"Calyrex": "Sylveroy",
	"Calyrex-Ice": "Sylveroy-Froid",
	"Calyrex-Shadow": "Sylveroy-Effroi",
	"Wyrdeer": "Cerbyllin",
	"Kleavor": "Hachécateur",
	"Ursaluna": "Ursaking",
	"Basculegion": "Paragruel",
	"Basculegion-F": "Paragruel-F",
	"Sneasler": "Farfurex",
	"Overqwil": "Qwilpik",
	"Enamorus": "Amovénus",
	"Enamorus-Therian": "Amovénus-Totem"
};

export const AbilitiesDico: { [englishName: string]: string; } = {
	"No Ability": "Pas de Talent",
    "Stench": "Puanteur",
    "Drizzle": "Crachin",
    "Speed Boost": "Turbo",
    "Battle Armor": "Armurbaston",
    "Sturdy": "Fermeté",
    "Damp": "Moiteur",
    "Limber": "Échauffement",
    "Sand Veil": "Voile Sable",
    "Static": "Statik",
    "Volt Absorb": "Absorb Volt",
    "Water Absorb": "Absorb Eau",
    "Oblivious": "Benêt",
    "Cloud Nine": "Ciel Gris",
    "Compound Eyes": "Oeil Composé",
    "Insomnia": "Insomnia",
    "Color Change": "Déguisement",
    "Immunity": "Vaccin",
    "Flash Fire": "Torche",
    "Shield Dust": "Écran Poudre",
    "Own Tempo": "Tempo Perso",
    "Suction Cups": "Ventouse",
    "Intimidate": "Intimidation",
    "Shadow Tag": "Marque Ombre",
    "Rough Skin": "Peau Dure",
    "Wonder Guard": "Garde Mystik",
    "Levitate": "Lévitation",
    "Effect Spore": "Pose Spore",
    "Synchronize": "Synchro",
    "Clear Body": "Corps Sain",
    "Natural Cure": "Médic Nature",
    "Lightning Rod": "Paratonnerre",
    "Serene Grace": "Sérénité",
    "Swift Swim": "Glissade",
    "Chlorophyll": "Chlorophyle",
    "Illuminate": "Lumiattirance",
    "Trace": "Calque",
    "Huge Power": "Coloforce",
    "Poison Point": "Point Poison",
    "Inner Focus": "Attention",
    "Magma Armor": "Armumagma",
    "Water Veil": "Ignifu-Voile",
    "Magnet Pull": "Magnépiège",
    "Soundproof": "Anti-Bruit",
    "Rain Dish": "Cuvette",
    "Sand Stream": "Sable Volant",
    "Pressure": "Pression",
    "Thick Fat": "Isograisse",
    "Early Bird": "Matinal",
    "Flame Body": "Corps Ardent",
    "Run Away": "Fuite",
    "Keen Eye": "Regard Vif",
    "Hyper Cutter": "Hyper Cutter",
    "Pickup": "Ramassage",
    "Truant": "Absentéisme",
    "Hustle": "Agitation",
    "Cute Charm": "Joli Sourire",
    "Plus": "Plus",
    "Minus": "Minus",
    "Forecast": "Météo",
    "Sticky Hold": "Glue",
    "Shed Skin": "Mue",
    "Guts": "Cran",
    "Marvel Scale": "Écaille Spéciale",
    "Liquid Ooze": "Suintement",
    "Overgrow": "Engrais",
    "Blaze": "Brasier",
    "Torrent": "Torrent",
    "Swarm": "Essaim",
    "Rock Head": "Tête de Roc",
    "Drought": "Sécheresse",
    "Arena Trap": "Piège Sable",
    "Vital Spirit": "Esprit Vital",
    "White Smoke": "Écran Fumée",
    "Pure Power": "Force Pure",
    "Shell Armor": "Coque Armure",
    "Air Lock": "Air Lock",
    "Tangled Feet": "Pieds Confus",
    "Motor Drive": "Motorisé",
    "Rivalry": "Rivalité",
    "Steadfast": "Impassible",
    "Snow Cloak": "Rideau Neige",
    "Gluttony": "Gloutonnerie",
    "Anger Point": "Colérique",
    "Unburden": "Délestage",
    "Heatproof": "Ignifugé",
    "Simple": "Simple",
    "Dry Skin": "Peau Sèche",
    "Download": "Télécharge",
    "Iron Fist": "Poing de Fer",
    "Poison Heal": "Soin Poison",
    "Adaptability": "Adaptabilité",
    "Skill Link": "Multi-Coups",
    "Hydration": "Hydratation",
    "Solar Power": "Force Soleil",
    "Quick Feet": "Pied Véloce",
    "Normalize": "Normalise",
    "Sniper": "Sniper",
    "Magic Guard": "Garde Magik",
    "No Guard": "Annule Garde",
    "Stall": "Frein",
    "Technician": "Technicien",
    "Leaf Guard": "Feuille Garde",
    "Klutz": "Maladresse",
    "Mold Breaker": "Brise Moule",
    "Super Luck": "Chanceux",
    "Aftermath": "Boom Final",
    "Anticipation": "Anticipation",
    "Forewarn": "Prédiction",
    "Unaware": "Inconscient",
    "Tinted Lens": "Lentiteintée",
    "Filter": "Filtre",
    "Slow Start": "Début Calme",
    "Scrappy": "Querelleur",
    "Storm Drain": "Lavabo",
    "Ice Body": "Corps Gel",
    "Solid Rock": "Solide Roc",
    "Snow Warning": "Alerte Neige",
    "Honey Gather": "Cherche Miel",
    "Frisk": "Fouille",
    "Reckless": "Téméraire",
    "Multitype": "Multi-Type",
    "Flower Gift": "Don Floral",
    "Bad Dreams": "Mauvais Rêve",
    "Pickpocket": "Pickpocket",
    "Sheer Force": "Sans Limite",
    "Contrary": "Contestation",
    "Unnerve": "Tension",
    "Defiant": "Acharné",
    "Defeatist": "Défaitiste",
    "Cursed Body": "Corps Maudit",
    "Healer": "Coeur Soin",
    "Friend Guard": "Garde Amie",
    "Weak Armor": "Armurouillée",
    "Heavy Metal": "Heavy Metal",
    "Light Metal": "Light Metal",
    "Multiscale": "Multiécaille",
    "Toxic Boost": "Rage Poison",
    "Flare Boost": "Rage Brûlure",
    "Harvest": "Récolte",
    "Telepathy": "Télépathe",
    "Moody": "Lunatique",
    "Overcoat": "Envelocape",
    "Poison Touch": "Toxitouche",
    "Regenerator": "Régé-Force",
    "Big Pecks": "Coeur de Coq",
    "Sand Rush": "Baigne Sable",
    "Wonder Skin": "Peau Miracle",
    "Analytic": "Analyste",
    "Illusion": "Illusion",
    "Imposter": "Imposteur",
    "Infiltrator": "Infiltration",
    "Mummy": "Momie",
    "Moxie": "Impudence",
    "Justified": "Coeur Noble",
    "Rattled": "Phobique",
    "Magic Bounce": "Miroir Magik",
    "Sap Sipper": "Herbivore",
    "Prankster": "Farceur",
    "Sand Force": "Force Sable",
    "Iron Barbs": "Épine de Fer",
    "Zen Mode": "Mode Transe",
    "Victory Star": "Victorieux",
    "Turboblaze": "TurboBrasier",
    "Teravolt": "Téra-Voltage",
    "Aroma Veil": "Aroma-Voile",
    "Flower Veil": "Flora-Voile",
    "Cheek Pouch": "Bajoues",
    "Protean": "Protéen",
    "Fur Coat": "Toison Épaisse",
    "Magician": "Magicien",
    "Bulletproof": "Pare-Balles",
    "Competitive": "Battant",
    "Strong Jaw": "Prognathe",
    "Refrigerate": "Peau Gelée",
    "Sweet Veil": "Gluco-Voile",
    "Stance Change": "Déclic Tactique",
    "Gale Wings": "Ailes Bourrasque",
    "Mega Launcher": "Méga Blaster",
    "Grass Pelt": "Toison Herbue",
    "Symbiosis": "Symbiose",
    "Tough Claws": "Griffe Dure",
    "Pixilate": "Peau Féérique",
    "Gooey": "Poisseux",
    "Parental Bond": "Amour Filial",
    "Aerilate": "Peau Céleste",
    "Dark Aura": "Aura Ténébreuse",
    "Fairy Aura": "Aura Féérique",
    "Aura Break": "Aura Inversée",
    "As One (Glastrier)": "Osmose Équine (Blizzeval)",
    "As One (Spectrier)": "Osmose Équine (Spectreval)",
    "Libero": "Libéro",
    "Gorilla Tactics": "Entêtement",
    "Desolate Land": "Terre Finale",
    "Primordial Sea": "Mer Primaire",
    "Shadow Shield": "Spectro-Bouclier",
    "Soul-Heart": "Animacoeur",
    "Beast Boost": "Boost Chimère",
    "Prism Armor": "Prisme-Armure",
    "Neuroforce": "Cérébro-Force",
    "Delta Stream": "Souffle Delta",
    "Full Metal Body": "Métallo-Garde",
    "Grim Neigh": "Sombre Ruade",
    "Chilling Neigh": "Blanche Ruade",
    "Unseen Fist": "Poing Invisible",
    "Intrepid Sword": "Lame Indomptable",
    "Dauntless Shield": "Égide Inflexible",
    "Power Construct": "Rassemblement",
    "(Power Construct)": "(Rassemblement)",
    "Mirror Armor": "Armure Miroir",
    "Battle Bond": "Synergie",
    "(Battle Bond)": "(Synergie)",
    "Grassy Surge": "Créa-Herbe",
    "Misty Surge": "Créa-Brume",
    "Electric Surge": "Créa-Élec",
    "Psychic Surge": "Créa-Psy",
    "Berserk": "Dracolère",
    "Transistor": "Transistor",
    "Liquid Voice": "Hydrata-Son",
    "Water Bubble": "Aquabulle",
    "Slush Rush": "Chasse-Neige",
    "Propeller Tail": "Propulseur",
    "Gulp Missile": "Dégobage",
    "Perish Body": "Corps Condamné",
    "Long Reach": "Longue Portée",
    "Steelworker": "Expert Acier",
    "Stalwart": "Nerfs d’Acier",
    "Ice Face": "Tête de Gel",
    "Ice Scales": "Écailles Glacées",
    "Galvanize": "Peau Électrique",
    "Emergency Exit": "Repli Tactique",
    "Comatose": "Hypersommeil",
    "Disguise": "Fantômasque",
    "Shields Down": "Bouclier-Carcan",
    "Hunger Switch": "Déclic Fringale",
    "Power of Alchemy": "Osmose",
    "Dancer": "Danseuse",
    "Water Compaction": "Sable Humide",
    "Receiver": "Receveur",
    "Steely Spirit": "Boost Acier",
    "Innards Out": "Expuls'Organes",
    "Surge Surfer": "Surf Caudal",
    "Dragon's Maw": "Dent de Dragon",
    "Wandering Spirit": "Âme Vagabonde",
    "Corrosion": "Corrosion",
    "RKS System": "Système Alpha",
    "Power Spot": "Cercle d’Énergie",
    "Mimicry": "Mimétisme",
    "Stakeout": "Filature",
    "Schooling": "Banc",
    "Battery": "Batterie",
    "Wimp Out": "Escampette",
    "Ball Fetch": "Ramasse Ball",
    "Merciless": "Cruauté",
    "Curious Medicine": "Breuvage Suspect",
    "Quick Draw": "Tir Vif",
    "Ripen": "Mûrissement",
    "Fluffy": "Boule de Poils",
    "Dazzling": "Corps Coloré",
    "Steam Engine": "Turbine",
    "Triage": "Prioguérison",
    "Tangling Hair": "Mèche Rebelle",
    "Cotton Down": "Effilochage",
    "Screen Cleaner": "Brise-Barrière",
    "Stamina": "Endurance",
    "Pastel Veil": "Voile Pastel",
    "Sand Spit": "Expul’Sable",
    "Punk Rock": "Punk Rock",
    "Queenly Majesty": "Prestance Royale",
    "Neutralizing Gas": "Gaz Inhibiteur"
}

export const MovesDico: { [englishName: string]: string; } = {
	"Pound": "Écras'Face",
	"Karate Chop": "Poing Karaté",
	"Double Slap": "Torgnoles",
	"Comet Punch": "Poing Comète",
	"Mega Punch": "Ultimapoing",
	"Pay Day": "Jackpot",
	"Fire Punch": "Poing Feu",
	"Ice Punch": "Poing Glace",
	"Thunder Punch": "Poing Éclair",
	"Scratch": "Griffe",
	"Vise Grip": "Force Poigne",
	"Guillotine": "Guillotine",
	"Razor Wind": "Coupe-Vent",
	"Swords Dance": "Danse Lames",
	"Cut": "Coupe",
	"Gust": "Tornade",
	"Wing Attack": "Cru-Ailes",
	"Whirlwind": "Cyclone",
	"Fly": "Vol",
	"Bind": "Étreinte",
	"Slam": "Souplesse",
	"Vine Whip": "Fouet Lianes",
	"Stomp": "Écrasement",
	"Double Kick": "Double Pied",
	"Mega Kick": "Ultimawashi",
	"Jump Kick": "Pied Sauté",
	"Rolling Kick": "Mawashi Geri",
	"Sand Attack": "Jet de Sable",
	"Headbutt": "Coup d'Boule",
	"Horn Attack": "Koud'Korne",
	"Fury Attack": "Furie",
	"Horn Drill": "Empal'Korne",
	"Tackle": "Charge",
	"Body Slam": "Plaquage",
	"Wrap": "Ligotage",
	"Take Down": "Bélier",
	"Thrash": "Mania",
	"Double-Edge": "Damoclès",
	"Tail Whip": "Mimi-Queue",
	"Poison Sting": "Dard-Venin",
	"Twineedle": "Double Dard",
	"Pin Missile": "Dard-Nuée",
	"Leer": "Groz'Yeux",
	"Bite": "Morsure",
	"Growl": "Rugissement",
	"Roar": "Hurlement",
	"Sing": "Berceuse",
	"Supersonic": "Ultrason",
	"Sonic Boom": "Sonic Boom",
	"Disable": "Entrave",
	"Acid": "Acide",
	"Ember": "Flammèche",
	"Flamethrower": "Lance-Flammes",
	"Mist": "Brume",
	"Water Gun": "Pistolet à O",
	"Hydro Pump": "Hydrocanon",
	"Surf": "Surf",
	"Ice Beam": "Laser Glace",
	"Blizzard": "Blizzard",
	"Psybeam": "Rafale Psy",
	"Bubble Beam": "Bulles d'O",
	"Aurora Beam": "Onde Boréale",
	"Hyper Beam": "Ultralaser",
	"Peck": "Picpic",
	"Drill Peck": "Bec Vrille",
	"Submission": "Sacrifice",
	"Low Kick": "Balayage",
	"Counter": "Riposte",
	"Seismic Toss": "Frappe Atlas",
	"Strength": "Force",
	"Absorb": "Vole-Vie",
	"Mega Drain": "Méga-Sangsue",
	"Leech Seed": "Vampigraine",
	"Growth": "Croissance",
	"Razor Leaf": "Tranch'Herbe",
	"Solar Beam": "Lance-Soleil",
	"Poison Powder": "Poudre Toxik",
	"Stun Spore": "Para-Spore",
	"Sleep Powder": "Poudre Dodo",
	"Petal Dance": "Danse Fleurs",
	"String Shot": "Sécrétion",
	"Dragon Rage": "Draco-Rage",
	"Fire Spin": "Danse Flammes",
	"Thunder Shock": "Éclair",
	"Thunderbolt": "Tonnerre",
	"Thunder Wave": "Cage Éclair",
	"Thunder": "Fatal-Foudre",
	"Rock Throw": "Jet-Pierres",
	"Earthquake": "Séisme",
	"Fissure": "Abîme",
	"Dig": "Tunnel",
	"Toxic": "Toxik",
	"Confusion": "Choc Mental",
	"Psychic": "Psyko",
	"Hypnosis": "Hypnose",
	"Meditate": "Yoga",
	"Agility": "Hâte",
	"Quick Attack": "Vive-attaque",
	"Rage": "Frénésie",
	"Teleport": "Téléport",
	"Night Shade": "Ombre Nocturne",
	"Mimic": "Copie",
	"Screech": "Grincement",
	"Double Team": "Reflet",
	"Recover": "Soin",
	"Harden": "Armure",
	"Minimize": "Lilliput",
	"Smokescreen": "Brouillard",
	"Confuse Ray": "Onde Folie",
	"Withdraw": "Repli",
	"Defense Curl": "Boul'Armure",
	"Barrier": "Bouclier",
	"Light Screen": "Mur Lumière",
	"Haze": "Buée Noire",
	"Reflect": "Protection",
	"Focus Energy": "Puissance",
	"Bide": "Patience",
	"Metronome": "Métronome",
	"Mirror Move": "Mimique",
	"Self-Destruct": "Destruction",
	"Egg Bomb": "Bombe Oeuf",
	"Lick": "Léchouille",
	"Smog": "Purédpois",
	"Sludge": "Détritus",
	"Bone Club": "Massd'Os",
	"Fire Blast": "Déflagration",
	"Waterfall": "Cascade",
	"Clamp": "Claquoir",
	"Swift": "Météores",
	"Skull Bash": "Coud'Krâne",
	"Spike Cannon": "Picanon",
	"Constrict": "Constriction",
	"Amnesia": "Amnésie",
	"Kinesis": "Télékinésie",
	"Soft-Boiled": "E-Coque",
	"High Jump Kick": "Pied Voltige",
	"Glare": "Regard Médusant",
	"Dream Eater": "Dévorêve",
	"Poison Gas": "Gaz Toxik",
	"Barrage": "Pilonnage",
	"Leech Life": "Vampirisme",
	"Lovely Kiss": "Grobisou",
	"Sky Attack": "Piqué",
	"Transform": "Morphing",
	"Bubble": "Écume",
	"Dizzy Punch": "Uppercut",
	"Spore": "Spore",
	"Flash": "Flash",
	"Psywave": "Vague Psy",
	"Splash": "Trempette",
	"Acid Armor": "Acidarmure",
	"Crabhammer": "Pince-Masse",
	"Explosion": "Explosion",
	"Fury Swipes": "Combo-Griffe",
	"Bonemerang": "Osmerang",
	"Rest": "Repos",
	"Rock Slide": "Éboulement",
	"Hyper Fang": "Croc de Mort",
	"Sharpen": "Affûtage",
	"Conversion": "Conversion",
	"Tri Attack": "Triplattaque",
	"Super Fang": "Croc Fatal",
	"Slash": "Tranche",
	"Substitute": "Clonage",
	"Struggle": "Lutte",
	"Sketch": "Gribouille",
	"Triple Kick": "Triple Pied",
	"Thief": "Larcin",
	"Spider Web": "Toile",
	"Mind Reader": "Lire-Esprit",
	"Nightmare": "Cauchemar",
	"Flame Wheel": "Roue de Feu",
	"Snore": "Ronflement",
	"Curse": "Malédiction",
	"Flail": "Gigotage",
	"Conversion 2": "Conversion2",
	"Aeroblast": "Aéroblast",
	"Cotton Spore": "Spore Coton",
	"Reversal": "Contre",
	"Spite": "Dépit",
	"Powder Snow": "Poudreuse",
	"Protect": "Abri",
	"Mach Punch": "Mach Punch",
	"Scary Face": "Grimace",
	"Feint Attack": "Feinte",
	"Sweet Kiss": "Doux Baiser",
	"Belly Drum": "Cognobidon",
	"Sludge Bomb": "Bombe Beurk",
	"Mud-Slap": "Coud'Boue",
	"Octazooka": "Octazooka",
	"Spikes": "Picots",
	"Zap Cannon": "Élecanon",
	"Foresight": "Clairvoyance",
	"Destiny Bond": "Lien du Destin",
	"Perish Song": "Requiem",
	"Icy Wind": "Vent Glace",
	"Detect": "Détection",
	"Bone Rush": "Charge Os",
	"Lock-On": "Verrouillage",
	"Outrage": "Colère",
	"Sandstorm": "Tempête de Sable",
	"Giga Drain": "Giga-Sangsue",
	"Endure": "Ténacité",
	"Charm": "Charme",
	"Rollout": "Roulade",
	"False Swipe": "Faux-Chage",
	"Swagger": "Vantardise",
	"Milk Drink": "Lait à Boire",
	"Spark": "Étincelle",
	"Fury Cutter": "Taillade",
	"Steel Wing": "Ailes d'Acier",
	"Mean Look": "Regard Noir",
	"Attract": "Attraction",
	"Sleep Talk": "Blabla Dodo",
	"Heal Bell": "Glas de Soin",
	"Return": "Retour",
	"Present": "Cadeau",
	"Frustration": "Frustration",
	"Safeguard": "Rune Protect",
	"Pain Split": "Balance",
	"Sacred Fire": "Feu Sacré",
	"Magnitude": "Ampleur",
	"Dynamic Punch": "Dynamo-Poing",
	"Megahorn": "Mégacorne",
	"Dragon Breath": "Draco-Souffle",
	"Baton Pass": "Relais",
	"Encore": "Encore",
	"Pursuit": "Poursuite",
	"Rapid Spin": "Tour Rapide",
	"Sweet Scent": "Doux Parfum",
	"Iron Tail": "Queue de Fer",
	"Metal Claw": "Griffe Acier",
	"Vital Throw": "Corps Perdu",
	"Morning Sun": "Aurore",
	"Synthesis": "Synthèse",
	"Moonlight": "Rayon Lune",
	"Hidden Power": "Puissance Cachée",
	"Hidden Power Bug": "Puissance Cachée Insecte",
	"Hidden Power Dark": "Puissance Cachée Ténèbres",
	"Hidden Power Dragon": "Puissance Cachée Dragon",
	"Hidden Power Electric": "Puissance Cachée Électrik",
	"Hidden Power Fairy": "Puissance Cachée Fée",
	"Hidden Power Fighting": "Puissance Cachée Combat",
	"Hidden Power Fire": "Puissance Cachée Feu",
	"Hidden Power Flying": "Puissance Cachée Vol",
	"Hidden Power Ghost": "Puissance Cachée Spectre",
	"Hidden Power Grass": "Puissance Cachée Plante",
	"Hidden Power Ground": "Puissance Cachée Sol",
	"Hidden Power Ice": "Puissance Cachée Glace",
	"Hidden Power Poison": "Puissance Cachée Poison",
	"Hidden Power Psychic": "Puissance Cachée Psy",
	"Hidden Power Rock": "Puissance Cachée Roche",
	"Hidden Power Steel": "Puissance Cachée Acier",
	"Hidden Power Water": "Puissance Cachée Eau",
	"Cross Chop": "Coup Croix",
	"Twister": "Ouragan",
	"Rain Dance": "Danse Pluie",
	"Sunny Day": "Zénith",
	"Crunch": "Mâchouille",
	"Mirror Coat": "Voile Miroir",
	"Psych Up": "Boost",
	"Extreme Speed": "Vitesse Extrême",
	"Ancient Power": "Pouvoir Antique",
	"Shadow Ball": "Ball'Ombre",
	"Future Sight": "Prescience",
	"Rock Smash": "Éclate-Roc",
	"Whirlpool": "Siphon",
	"Beat Up": "Baston",
	"Fake Out": "Bluff",
	"Uproar": "Brouhaha",
	"Stockpile": "Stockage",
	"Spit Up": "Relâche",
	"Swallow": "Avale",
	"Heat Wave": "Canicule",
	"Hail": "Grêle",
	"Torment": "Tourmente",
	"Flatter": "Flatterie",
	"Will-O-Wisp": "Feu Follet",
	"Memento": "Souvenir",
	"Facade": "Façade",
	"Focus Punch": "Mitra-Poing",
	"Smelling Salts": "Stimulant",
	"Follow Me": "Par Ici",
	"Nature Power": "Force Nature",
	"Charge": "Chargeur",
	"Taunt": "Provoc",
	"Helping Hand": "Coup d'Main",
	"Trick": "Tour de Magie",
	"Role Play": "Imitation",
	"Wish": "Voeu",
	"Assist": "Assistance",
	"Ingrain": "Racines",
	"Superpower": "Surpuissance",
	"Magic Coat": "Reflet Magik",
	"Recycle": "Recyclage",
	"Revenge": "Vendetta",
	"Brick Break": "Casse-Brique",
	"Yawn": "Bâillement",
	"Knock Off": "Sabotage",
	"Endeavor": "Effort",
	"Eruption": "Éruption",
	"Skill Swap": "Échange",
	"Imprison": "Possessif",
	"Refresh": "Régénération",
	"Grudge": "Rancune",
	"Snatch": "Saisie",
	"Secret Power": "Force Cachée",
	"Dive": "Plongée",
	"Arm Thrust": "Cogne",
	"Camouflage": "Camouflage",
	"Tail Glow": "Lumi-Queue",
	"Luster Purge": "Lumi-Éclat",
	"Mist Ball": "Ball'Brume",
	"Feather Dance": "Danse Plumes",
	"Teeter Dance": "Danse Folle",
	"Blaze Kick": "Pied Brûleur",
	"Mud Sport": "Lance-Boue",
	"Ice Ball": "Ball'Glace",
	"Needle Arm": "Poing Dard",
	"Slack Off": "Paresse",
	"Hyper Voice": "Mégaphone",
	"Poison Fang": "Crochet Venin",
	"Crush Claw": "Éclate Griffe",
	"Blast Burn": "Rafale Feu",
	"Hydro Cannon": "Hydroblast",
	"Meteor Mash": "Poing Météore",
	"Astonish": "Étonnement",
	"Weather Ball": "Ball'Météo",
	"Aromatherapy": "Aromathérapie",
	"Fake Tears": "Croco Larme",
	"Air Cutter": "Tranch'Air",
	"Overheat": "Surchauffe",
	"Odor Sleuth": "Flair",
	"Rock Tomb": "Tomberoche",
	"Silver Wind": "Vent Argenté",
	"Metal Sound": "Strido-Son",
	"Grass Whistle": "Siffl'Herbe",
	"Tickle": "Chatouille",
	"Cosmic Power": "Force Cosmique",
	"Water Spout": "Giclédo",
	"Signal Beam": "Rayon Signal",
	"Shadow Punch": "Poing Ombre",
	"Extrasensory": "Extrasenseur",
	"Sky Uppercut": "Stratopercut",
	"Sand Tomb": "Tourbi-Sable",
	"Sheer Cold": "Glaciation",
	"Muddy Water": "Ocroupi",
	"Bullet Seed": "Balle Graine",
	"Aerial Ace": "Aéropique",
	"Icicle Spear": "Stalagtite",
	"Iron Defense": "Mur de Fer",
	"Block": "Barrage",
	"Howl": "Grondement",
	"Dragon Claw": "Draco-Griffe",
	"Frenzy Plant": "Végé-Attaque",
	"Bulk Up": "Gonflette",
	"Bounce": "Rebond",
	"Mud Shot": "Tir de Boue",
	"Poison Tail": "Queue-Poison",
	"Covet": "Implore",
	"Volt Tackle": "Électacle",
	"Magical Leaf": "Feuille Magik",
	"Water Sport": "Tourniquet",
	"Calm Mind": "Plénitude",
	"Leaf Blade": "Lame Feuille",
	"Dragon Dance": "Danse Draco",
	"Rock Blast": "Boule Roc",
	"Shock Wave": "Onde de Choc",
	"Water Pulse": "Vibraqua",
	"Doom Desire": "Voeu Destructeur",
	"Psycho Boost": "Psycho-Boost",
	"Roost": "Atterrissage",
	"Gravity": "Gravité",
	"Miracle Eye": "Oeil Miracle",
	"Wake-Up Slap": "Réveil Forcé",
	"Hammer Arm": "Marto-Poing",
	"Gyro Ball": "Gyroballe",
	"Healing Wish": "Voeu Soin",
	"Brine": "Saumure",
	"Natural Gift": "Don Naturel",
	"Feint": "Ruse",
	"Pluck": "Picore",
	"Tailwind": "Vent Arrière",
	"Acupressure": "Acupression",
	"Metal Burst": "Fulmifer",
	"U-turn": "Demi-Tour",
	"Close Combat": "Close Combat",
	"Payback": "Représailles",
	"Assurance": "Assurance",
	"Embargo": "Embargo",
	"Fling": "Dégommage",
	"Psycho Shift": "Échange Psy",
	"Trump Card": "Atout",
	"Heal Block": "Anti-Soin",
	"Wring Out": "Essorage",
	"Power Trick": "Astuce Force",
	"Gastro Acid": "Suc Digestif",
	"Lucky Chant": "Air Veinard",
	"Me First": "Moi d'Abord",
	"Copycat": "Photocopie",
	"Power Swap": "Permuforce",
	"Guard Swap": "Permugarde",
	"Punishment": "Punition",
	"Last Resort": "Dernier Recours",
	"Worry Seed": "Soucigraine",
	"Sucker Punch": "Coup Bas",
	"Toxic Spikes": "Pics Toxik",
	"Heart Swap": "Permucoeur",
	"Aqua Ring": "Anneau Hydro",
	"Magnet Rise": "Vol Magnétik",
	"Flare Blitz": "Boutefeu",
	"Force Palm": "Forte-Paume",
	"Aura Sphere": "Aurasphère",
	"Rock Polish": "Poliroche",
	"Poison Jab": "Direct Toxik",
	"Dark Pulse": "Vibrobscur",
	"Night Slash": "Tranche-Nuit",
	"Aqua Tail": "Hydro-Queue",
	"Seed Bomb": "Canon Graine",
	"Air Slash": "Lame d'Air",
	"X-Scissor": "Plaie Croix",
	"Bug Buzz": "Bourdon",
	"Dragon Pulse": "Draco-Choc",
	"Dragon Rush": "Draco-Charge",
	"Power Gem": "Rayon Gemme",
	"Drain Punch": "Vampi-Poing",
	"Vacuum Wave": "Onde Vide",
	"Focus Blast": "Exploforce",
	"Energy Ball": "Éco-Sphère",
	"Brave Bird": "Rapace",
	"Earth Power": "Telluriforce",
	"Switcheroo": "Passe-Passe",
	"Giga Impact": "Giga Impact",
	"Nasty Plot": "Machination",
	"Bullet Punch": "Pisto-Poing",
	"Avalanche": "Avalanche",
	"Ice Shard": "Éclats Glace",
	"Shadow Claw": "Griffe Ombre",
	"Thunder Fang": "Crocs Éclair",
	"Ice Fang": "Crocs Givre",
	"Fire Fang": "Crocs Feu",
	"Shadow Sneak": "Ombre Portée",
	"Mud Bomb": "Boue-Bombe",
	"Psycho Cut": "Coupe Psycho",
	"Zen Headbutt": "Psykoud'Boul",
	"Mirror Shot": "Miroi-Tir",
	"Flash Cannon": "Luminocanon",
	"Rock Climb": "Escalade",
	"Defog": "Anti-Brume",
	"Trick Room": "Distorsion",
	"Draco Meteor": "Draco-Météore",
	"Discharge": "Coup d'Jus",
	"Lava Plume": "Ébullilave",
	"Leaf Storm": "Tempête Verte",
	"Power Whip": "Mégafouet",
	"Rock Wrecker": "Roc-Boulet",
	"Cross Poison": "Poison Croix",
	"Gunk Shot": "Détricanon",
	"Iron Head": "Tête de Fer",
	"Magnet Bomb": "Bombe Aimant",
	"Stone Edge": "Lame de Roc",
	"Captivate": "Séduction",
	"Stealth Rock": "Piège de Roc",
	"Grass Knot": "Noeud Herbe",
	"Chatter": "Babil",
	"Judgment": "Jugement",
	"Bug Bite": "Piqûre",
	"Charge Beam": "Rayon Chargé",
	"Wood Hammer": "Martobois",
	"Aqua Jet": "Aqua-Jet",
	"Attack Order": "Appel Attak",
	"Defend Order": "Appel Défense",
	"Heal Order": "Appel Soins",
	"Head Smash": "Fracass'Tête",
	"Double Hit": "Coup Double",
	"Roar of Time": "Hurle-Temps",
	"Spacial Rend": "Spatio-Rift",
	"Lunar Dance": "Danse Lune",
	"Crush Grip": "Presse",
	"Magma Storm": "Vortex Magma",
	"Dark Void": "Trou Noir",
	"Seed Flare": "Fulmigraine",
	"Ominous Wind": "Vent Mauvais",
	"Shadow Force": "Revenant",
	"Hone Claws": "Aiguisage",
	"Wide Guard": "Garde Large",
	"Guard Split": "Partage Garde",
	"Power Split": "Partage Force",
	"Wonder Room": "Zone Étrange",
	"Psyshock": "Choc Psy",
	"Venoshock": "Choc Venin",
	"Autotomize": "Allègement",
	"Rage Powder": "Poudre Fureur",
	"Telekinesis": "Lévikinésie",
	"Magic Room": "Zone Magique",
	"Smack Down": "Anti-Air",
	"Storm Throw": "Yama Arashi",
	"Flame Burst": "Rebondifeu",
	"Sludge Wave": "Cradovague",
	"Quiver Dance": "Papillodanse",
	"Heavy Slam": "Tacle Lourd",
	"Synchronoise": "Synchropeine",
	"Electro Ball": "Boule Élek",
	"Soak": "Détrempage",
	"Flame Charge": "Nitrocharge",
	"Coil": "Enroulement",
	"Low Sweep": "Balayette",
	"Acid Spray": "Bombe Acide",
	"Foul Play": "Tricherie",
	"Simple Beam": "Rayon Simple",
	"Entrainment": "Ten-Danse",
	"After You": "Après Vous",
	"Round": "Chant Canon",
	"Echoed Voice": "Écho",
	"Chip Away": "Attrition",
	"Clear Smog": "Bain de Smog",
	"Stored Power": "Force Ajoutée",
	"Quick Guard": "Prévention",
	"Ally Switch": "Interversion",
	"Scald": "Ébullition",
	"Shell Smash": "Exuviation",
	"Heal Pulse": "Vibra Soin",
	"Hex": "Châtiment",
	"Sky Drop": "Chute Libre",
	"Shift Gear": "Chgt Vitesse",
	"Circle Throw": "Projection",
	"Incinerate": "Calcination",
	"Quash": "À la Queue",
	"Acrobatics": "Acrobatie",
	"Reflect Type": "Copie-Type",
	"Retaliate": "Vengeance",
	"Final Gambit": "Tout ou Rien",
	"Bestow": "Passe-Cadeau",
	"Inferno": "Feu d'Enfer",
	"Water Pledge": "Aire d'Eau",
	"Fire Pledge": "Aire de Feu",
	"Grass Pledge": "Aire d'Herbe",
	"Volt Switch": "Change Éclair",
	"Struggle Bug": "Survinsecte",
	"Bulldoze": "Piétisol",
	"Frost Breath": "Souffle Glacé",
	"Dragon Tail": "Draco-Queue",
	"Work Up": "Rengorgement",
	"Electroweb": "Toile Élek",
	"Wild Charge": "Éclair Fou",
	"Drill Run": "Tunnelier",
	"Dual Chop": "Double Baffe",
	"Heart Stamp": "Crèvecoeur",
	"Horn Leech": "Encornebois",
	"Sacred Sword": "Lame Sainte",
	"Razor Shell": "Coqui-Lame",
	"Heat Crash": "Tacle Feu",
	"Leaf Tornado": "Phytomixeur",
	"Steamroller": "Bulldoboule",
	"Cotton Guard": "Cotogarde",
	"Night Daze": "Explonuit",
	"Psystrike": "Frappe Psy",
	"Tail Slap": "Plumo-Queue",
	"Hurricane": "Vent Violent",
	"Head Charge": "Peignée",
	"Gear Grind": "Lancécrou",
	"Searing Shot": "Incendie",
	"Techno Blast": "Techno-Buster",
	"Relic Song": "Chant Antique",
	"Secret Sword": "Lame Ouinte",
	"Glaciate": "Ère Glaciaire",
	"Bolt Strike": "Charge Foudre",
	"Blue Flare": "Flamme Bleue",
	"Fiery Dance": "Danse du Feu",
	"Freeze Shock": "Éclair Gelé",
	"Ice Burn": "Feu Glacé",
	"Snarl": "Aboiement",
	"Icicle Crash": "Chute Glace",
	"V-create": "Coup Victoire",
	"Fusion Flare": "Flamme Croix",
	"Fusion Bolt": "Éclair Croix",
	"Flying Press": "Flying Press",
	"Mat Block": "Tatamigaeshi",
	"Belch": "Éructation",
	"Rototiller": "Fertilisation",
	"Sticky Web": "Toile Gluante",
	"Fell Stinger": "Dard Mortel",
	"Phantom Force": "Hantise",
	"Trick-or-Treat": "Halloween",
	"Noble Roar": "Râle Mâle",
	"Ion Deluge": "Déluge Plasmique",
	"Parabolic Charge": "Parabocharge",
	"Forest's Curse": "Maléfice Sylvain",
	"Petal Blizzard": "Tempête Florale",
	"Freeze-Dry": "Lyophilisation",
	"Disarming Voice": "Voix Enjôleuse",
	"Parting Shot": "Dernier Mot",
	"Topsy-Turvy": "Renversement",
	"Draining Kiss": "Vampibaiser",
	"Crafty Shield": "Vigilance",
	"Flower Shield": "Garde Florale",
	"Grassy Terrain": "Champ Herbu",
	"Misty Terrain": "Champ Brumeux",
	"Electrify": "Électrisation",
	"Play Rough": "Câlinerie",
	"Fairy Wind": "Vent Féérique",
	"Moonblast": "Pouvoir Lunaire",
	"Boomburst": "Bang Sonique",
	"Fairy Lock": "Verrou Enchanté",
	"King's Shield": "Bouclier Royal",
	"Play Nice": "Camaraderie",
	"Confide": "Confidence",
	"Diamond Storm": "Orage Adamantin",
	"Steam Eruption": "Jet de Vapeur",
	"Hyperspace Hole": "TrouDimensionnel",
	"Water Shuriken": "Sheauriken",
	"Mystical Fire": "Feu Ensorcelé",
	"Spiky Shield": "Pico-Défense",
	"Aromatic Mist": "Brume Capiteuse",
	"Eerie Impulse": "Ondes Étranges",
	"Venom Drench": "Piège de Venin",
	"Powder": "Nuée de Poudre",
	"Geomancy": "Géo-Contrôle",
	"Magnetic Flux": "Magné-Contrôle",
	"Happy Hour": "Étrennes",
	"Electric Terrain": "Champ Électrifié",
	"Dazzling Gleam": "Éclat Magique",
	"Celebrate": "Célébration",
	"Hold Hands": "Mains Jointes",
	"Baby-Doll Eyes": "Regard Touchant",
	"Nuzzle": "Frotte-Frimousse",
	"Hold Back": "Retenue",
	"Infestation": "Harcèlement",
	"Power-Up Punch": "Poing Boost",
	"Oblivion Wing": "Mort'Ailes",
	"Thousand Arrows": "Myria-Flèches",
	"Thousand Waves": "Myria-Vagues",
	"Land's Wrath": "Force Chtonienne",
	"Light of Ruin": "Lumière du Néant",
	"Origin Pulse": "Onde Originelle",
	"Precipice Blades": "Lame Pangéenne",
	"Dragon Ascent": "Draco-Ascension",
	"Hyperspace Fury": "Furie Dimension",
	"Shore Up": "Amass'Sable",
	"First Impression": "Escarmouche",
	"Baneful Bunker": "Blockhaus",
	"Spirit Shackle": "Tisse Ombre",
	"Darkest Lariat": "Dark Lariat",
	"Sparkling Aria": "Aria de l'Écume",
	"Ice Hammer": "Marteau de Glace",
	"Floral Healing": "Soin Floral",
	"High Horsepower": "Cavalerie Lourde",
	"Strength Sap": "Vole-Force",
	"Solar Blade": "Lame Solaire",
	"Leafage": "Feuillage",
	"Spotlight": "Projecteur",
	"Toxic Thread": "Fil Toxique",
	"Laser Focus": "Affilage",
	"Gear Up": "Engrenage",
	"Throat Chop": "Exécu-Son",
	"Pollen Puff": "Boule Pollen",
	"Anchor Shot": "Ancrage",
	"Psychic Terrain": "Champ Psychique",
	"Lunge": "Furie-Bond",
	"Fire Lash": "Fouet de Feu",
	"Power Trip": "Arrogance",
	"Burn Up": "Flamme Ultime",
	"Speed Swap": "Permuvitesse",
	"Smart Strike": "Estocorne",
	"Purify": "Purification",
	"Revelation Dance": "Danse Éveil",
	"Core Enforcer": "Sanction Suprême",
	"Trop Kick": "Botte Sucrette",
	"Instruct": "Sommation",
	"Beak Blast": "Bec-Canon",
	"Clanging Scales": "Vibrécaille",
	"Dragon Hammer": "Draco-Marteau",
	"Brutal Swing": "Centrifugifle",
	"Aurora Veil": "Voile Aurore",
	"Shell Trap": "Carapiège",
	"Fleur Cannon": "Canon Floral",
	"Psychic Fangs": "Psycho-Croc",
	"Stomping Tantrum": "Trépignement",
	"Shadow Bone": "Os Ombre",
	"Accelerock": "Vif Roc",
	"Liquidation": "Aqua-Brèche",
	"Prismatic Laser": "Laser Prisme",
	"Spectral Thief": "Clepto-Mânes",
	"Sunsteel Strike": "Choc Météore",
	"Moongeist Beam": "Rayon Spectral",
	"Tearful Look": "Larme à l'Oeil",
	"Zing Zap": "Électrikipik",
	"Nature's Madness": "Ire de la Nature",
	"Multi-Attack": "Coup Varia-Type",
	"Mind Blown": "Caboche-Kaboum",
	"Plasma Fists": "Plasma Punch",
	"Photon Geyser": "Photo-Geyser",
	"Zippy Zap": "Pika-Sprint",
	"Splishy Splash": "Pika-Splash",
	"Floaty Fall": "Pika-Piqué",
	"Pika Papow": "Pika-Fracas",
	"Bouncy Bubble": "Évo-Thalasso",
	"Buzzy Buzz": "Évo-Dynamo",
	"Sizzly Slide": "Évo-Flambo",
	"Glitzy Glow": "Évo-Psycho",
	"Baddy Bad": "Évo-Ténébro",
	"Sappy Seed": "Évo-Écolo",
	"Freezy Frost": "Évo-Congélo",
	"Sparkly Swirl": "Évo-Fabulo",
	"Veevee Volley": "Évo-Chardasso",
	"Double Iron Bash": "Écrous d'Poing",
	"Max Guard": "Gardomax",
	"Dynamax Cannon": "Canon Dynamax",
	"Snipe Shot": "Tir de Précision",
	"Jaw Lock": "Croque Fort",
	"Stuff Cheeks": "Garde-à-Joues",
	"No Retreat": "Ultime Bastion",
	"Tar Shot": "Goudronnage",
	"Magic Powder": "Poudre Magique",
	"Dragon Darts": "Draco-Flèches",
	"Teatime": "Thérémonie",
	"Octolock": "Octoprise",
	"Bolt Beak": "Prise de Bec",
	"Fishious Rend": "Branchicrok",
	"Court Change": "Change-Côté",
	"Max Flare": "Pyromax",
	"Max Flutterby": "Insectomax",
	"Max Lightning": "Fulguromax",
	"Max Strike": "Normalomax",
	"Max Knuckle": "Pugilomax",
	"Max Phantasm": "Spectromax",
	"Max Hailstorm": "Cryomax",
	"Max Ooze": "Toxinomax",
	"Max Geyser": "Hydromax",
	"Max Airstream": "Aéromax",
	"Max Starfall": "Enchantomax",
	"Max Wyrmwind": "Dracomax",
	"Max Mindstorm": "Psychomax",
	"Max Rockfall": "Lithomax",
	"Max Quake": "Sismomax",
	"Max Darkness": "Sinistromax",
	"Max Overgrowth": "Phytomax",
	"Max Steelspike": "Métallomax",
	"Clangorous Soul": "Dracacophonie",
	"Body Press": "Big Splash",
	"Decorate": "Nappage",
	"Drum Beating": "Tambour Battant",
	"Snap Trap": "Troquenard",
	"Pyro Ball": "Ballon Brûlant",
	"Behemoth Blade": "Gladius Maximus",
	"Behemoth Bash": "Aegis Maxima",
	"Aura Wheel": "Roue Libre",
	"Breaking Swipe": "Abattage",
	"Branch Poke": "Tapotige",
	"Overdrive": "Overdrive",
	"Apple Acid": "Acide Malique",
	"Grav Apple": "Force G",
	"Spirit Break": "Choc Émotionnel",
	"Strange Steam": "Vapeur Féérique",
	"Life Dew": "Fontaine de Vie",
	"Obstruct": "Blocage",
	"False Surrender": "Fourbette",
	"Meteor Assault": "Joute Astrale",
	"Eternabeam": "Laser Infinimax",
	"Steel Beam": "Métalaser",
	"Expanding Force": "Vaste Pouvoir",
	"Steel Roller": "Métalliroue",
	"Scale Shot": "Rafale Écailles",
	"Meteor Beam": "Laser Météore",
	"Shell Side Arm": "Kokiyarme",
	"Misty Explosion": "Explo-Brume",
	"Grassy Glide": "Gliss'Herbe",
	"Rising Voltage": "Monte-Tension",
	"Terrain Pulse": "Champlification",
	"Skitter Smack": "Ravage Rampant",
	"Burning Jealousy": "Feu Envieux",
	"Lash Out": "Cent Rancunes",
	"Poltergeist": "Esprit Frappeur",
	"Corrosive Gas": "Gaz Corrosif",
	"Coaching": "Coaching",
	"Flip Turn": "Eau Revoir",
	"Triple Axel": "Triple Axel",
	"Dual Wingbeat": "Double Volée",
	"Scorching Sands": "Sable Ardent",
	"Jungle Healing": "Selve Salvatrice",
	"Wicked Blow": "Poing Obscur",
	"Surging Strikes": "Torrent de Coups",
	"Thunder Cage": "Voltageôle",
	"Dragon Energy": "Draco-Énergie",
	"Freezing Glare": "Regard Glaçant",
	"Fiery Wrath": "Fureur Ardente",
	"Thunderous Kick": "Coup Fulgurant",
	"Glacial Lance": "Lance de Glace",
	"Astral Barrage": "Éclat Spectral",
	"Eerie Spell": "Sort Sinistre",
	"Dire Claw": "Griffes Funestes",
	"Psyshield Bash": "Sprint Bouclier",
	"Power Shift": "Échange Force",
	"Stone Axe": "Hache de Pierre",
	"Springtide Storm": "Typhon Passionné",
	"Mystical Power": "Force Mystique",
	"Raging Fury": "Grand Courroux",
	"Wave Crash": "Aquatacle",
	"Chloroblast": "Herblast",
	"Mountain Gale": "Bise Glaciaire",
	"Victory Dance": "Danse Victoire",
	"Headlong Rush": "Assaut Frontal",
	"Barb Barrage": "Multitoxik",
	"Esper Wing": "Ailes Psycho",
	"Bitter Malice": "Coeur de Rancoeur",
	"Shelter": "Mur Fumigène",
	"Triple Arrows": "Triple Flèche",
	"Infernal Parade": "Cortège Funèbre",
	"Ceaseless Edge": "Vagues à Lames",
	"Bleakwind Storm": "Typhon Hivernal",
	"Wildbolt Storm": "Typhon Fulgurant",
	"Sandsear Storm": "Typhon Pyrosable",
	"Lunar Blessing": "Prière Lunaire",
	"Take Heart": "Extravaillance",
	"Breakneck Blitz": "Turbo-Charge Bulldozer",
	"All-Out Pummeling": "Combo Hyper-Furie",
	"Supersonic Skystrike": "Piqué Supersonique",
	"Acid Downpour": "Déluge Causti-Toxique",
	"Tectonic Rage": "Éruption Géo-Sismique",
	"Continental Crush": "Apocalypse Gigalithique",
	"Savage Spin-Out": "Cocon Fatal",
	"Never-Ending Nightmare": "Appel des Ombres Éternelles",
	"Corkscrew Crash": "Vrille Maximum",
	"Inferno Overdrive": "Pyro-Explosion Cataclysmique",
	"Hydro Vortex": "Super Tourbillon Abyssal",
	"Bloom Doom": "Pétalexplosion Éblouissante",
	"Gigavolt Havoc": "Fulguro-Lance Gigavolt",
	"Shattered Psyche": "Psycho-Pulvérisation EX",
	"Subzero Slammer": "Laser Cryogénique",
	"Devastating Drake": "Chaos Draconique",
	"Black Hole Eclipse": "Trou Noir des Ombres",
	"Twinkle Tackle": "Impact Choupinova",
	"Catastropika": "Pikachute Foudroyante",
	"Sinister Arrow Raid": "Fureur des Plumes Spectrales",
	"Malicious Moonsault": "Dark Body Press",
	"Oceanic Operetta": "Symphonie des Ondines",
	"Guardian of Alola": "Colère du Gardien d'Alola",
	"Soul-Stealing 7-Star Strike": "Fauche-Âme des Sept Étoiles",
	"Stoked Sparksurfer": "Électro-Surf Survolté",
	"Pulverizing Pancake": "Gare au Ronflex",
	"Extreme Evoboost": "Neuf pour Un",
	"Genesis Supernova": "Supernova Originelle",
	"10,000,000 Volt Thunderbolt": "Giga-Tonnerre",
	"Light That Burns the Sky": "Apocalypsis Luminis",
	"Searing Sunraze Smash": "Hélio-Choc Dévastateur",
	"Menacing Moonraze Maelstrom": "Rayons Séléno-Explosifs",
	"Let's Snuggle Forever": "Patati-Patattrape",
	"Splintered Stormshards": "Hurlement des Roches-Lames",
	"Clangorous Soulblaze": "Dracacophonie Flamboyante",
	"G-Max Vine Lash": "Fouet G-Max",
	"G-Max Wildfire": "Fournaise G-Max",
	"G-Max Cannonade": "Canonnade G-Max",
	"G-Max Befuddle": "Illusion G-Max",
	"G-Max Volt Crash": "Foudre G-Max",
	"G-Max Gold Rush": "Pactole G-Max",
	"G-Max Chi Strike": "Frappe G-Max",
	"G-Max Terror": "Hantise G-Max",
	"G-Max Foam Burst": "Bulles G-Max",
	"G-Max Resonance": "Résonance G-Max",
	"G-Max Cuddle": "Câlin G-Max",
	"G-Max Replenish": "Récolte G-Max",
	"G-Max Malodor": "Pestilence G-Max",
	"G-Max Meltdown": "Fonte G-Max",
	"G-Max Drum Solo": "Percussion G-Max",
	"G-Max Fireball": "Pyroball G-Max",
	"G-Max Hydrosnipe": "Gâchette G-Max",
	"G-Max Wind Rage": "Rafale G-Max",
	"G-Max Gravitas": "Ondes G-Max",
	"G-Max Stonesurge": "Récif G-Max",
	"G-Max Volcalith": "Téphra G-Max",
	"G-Max Tartness": "Corrosion G-Max",
	"G-Max Sweetness": "Nectar G-Max",
	"G-Max Sandblast": "Enlisement G-Max",
	"G-Max Stun Shock": "Choc G-Max",
	"G-Max Centiferno": "Combustion G-Max",
	"G-Max Smite": "Sentence G-Max",
	"G-Max Snooze": "Torpeur G-Max",
	"G-Max Finale": "Cure G-Max",
	"G-Max Steelsurge": "Percée G-Max",
	"G-Max Depletion": "Usure G-Max",
	"G-Max One Blow": "Coup Final G-Max",
	"G-Max Rapid Flow": "Multicoup G-Max"
}

export const ItemsDico: { [englishName: string] : string; } = {
	"Abomasite": "Blizzarite",
	"Absolite": "Absolite",
	"Absorb Bulb": "Bulbe",
	"Adamant Orb": "Orbe Adamant",
	"Adrenaline Orb": "Orbe Frousse",
	"Aerodactylite": "Ptéraïte",
	"Aggronite": "Galekingite",
	"Aguav Berry": "Baie Gowav",
	"Air Balloon": "Ballon",
	"Alakazite": "Alakazamite",
	"Aloraichium Z": "Aloraïzélite",
	"Altarianite": "Altarite",
	"Ampharosite": "Pharampite",
	"Apicot Berry": "Baie Abriko",
	"Armor Fossil": "Fossile Armure",
	"Aspear Berry": "Baie Willia",
	"Assault Vest": "Veste de Combat",
	"Audinite": "Nanméouïte",
	"Babiri Berry": "Baie Babiri",
	"Banettite": "Branettite",
	"Beast Ball": "Ultra Ball",
	"Beedrillite": "Dardargnite",
	"Belue Berry": "Baie Myrte",
	"Berry Juice": "Jus de Baie",
	"Berry Sweet": "Baie en Sucre",
	"Big Root": "Grosse Racine",
	"Binding Band": "Bande Étreinte",
	"Black Belt": "Ceinture Noire",
	"Black Sludge": "Boue Noire",
	"Black Glasses": "Lunettes Noires",
	"Blastoisinite": "Tortankite",
	"Blazikenite": "Braségalite",
	"Blue Orb": "Gemme Bleue",
	"Bluk Berry": "Baie Remu",
	"Blunder Policy": "Assurance Échec",
	"Bottle Cap": "Capsule d'Argent",
	"Bright Powder": "Poudre Claire",
	"Bug Gem": "Joyau Insecte",
	"Bug Memory": "ROM Insecte",
	"Buginium Z": "Insectozélite",
	"Burn Drive": "Module Pyro",
	"Cameruptite": "Caméruptite",
	"Cell Battery": "Pile",
	"Charcoal": "Charbon",
	"Charizardite X": "Dracaufite X",
	"Charizardite Y": "Dracaufite Y",
	"Charti Berry": "Baie Charti",
	"Cheri Berry": "Baie Ceriz",
	"Cherish Ball": "Mémoire Ball",
	"Chesto Berry": "Baie Maron",
	"Chilan Berry": "Baie Zalis",
	"Chill Drive": "Module Cryo",
	"Chipped Pot": "Théière Ébréchée",
	"Choice Band": "Bandeau Choix",
	"Choice Scarf": "Mouchoir Choix",
	"Choice Specs": "Lunettes Choix",
	"Chople Berry": "Baie Pomroz",
	"Claw Fossil": "Fossile Griffe",
	"Clover Sweet": "Trèfle en Sucre",
	"Coba Berry": "Baie Cobaba",
	"Colbur Berry": "Baie Lampou",
	"Cornn Berry": "Baie Siam",
	"Cover Fossil": "Fossile Plaque",
	"Cracked Pot": "Théière Fêlée",
	"Custap Berry": "Baie Chérim",
	"Damp Rock": "Roche Humide",
	"Dark Gem": "Joyau Ténèbres",
	"Dark Memory": "ROM Ténèbres",
	"Darkinium Z": "Ténébrozélite",
	"Dawn Stone": "Pierre Aube",
	"Decidium Z": "Archézélite",
	"Deep Sea Scale": "Écaille Océan",
	"Deep Sea Tooth": "Dent Océan",
	"Destiny Knot": "Noeud Destin",
	"Diancite": "Diancite",
	"Dive Ball": "Scuba Ball",
	"Dome Fossil": "Fossile Dôme",
	"Douse Drive": "Module Aqua",
	"Draco Plate": "Plaque Draco",
	"Dragon Fang": "Croc Dragon",
	"Dragon Gem": "Joyau Dragon",
	"Dragon Memory": "ROM Dragon",
	"Dragon Scale": "Écaille Draco",
	"Dragonium Z": "Dracozélite",
	"Dread Plate": "Plaque Ombre",
	"Dream Ball": "Rêve Ball",
	"Dubious Disc": "CD Douteux",
	"Durin Berry": "Baie Durin",
	"Dusk Ball": "Sombre Ball",
	"Dusk Stone": "Pierre Nuit",
	"Earth Plate": "Plaque Terre",
	"Eevium Z": "Évolizélite",
	"Eject Button": "Bouton Fuite",
	"Eject Pack": "Sac Fuite",
	"Electirizer": "Électiriseur",
	"Electric Gem": "Joyau Électr",
	"Electric Memory": "ROM Électrik",
	"Electric Seed": "Graine Électrik",
	"Electrium Z": "Voltazélite",
	"Energy Powder": "Poudrénergie",
	"Enigma Berry": "Baie Enigma",
	"Eviolite": "Évoluroc",
	"Expert Belt": "Ceinture Pro",
	"Fairium Z": "Nymphézélite",
	"Fairy Gem": "Joyau Fée",
	"Fairy Memory": "ROM Fée",
	"Fast Ball": "Speed Ball",
	"Fighting Gem": "Joyau Combat",
	"Fighting Memory": "ROM Combat",
	"Fightinium Z": "Combazélite",
	"Figy Berry": "Baie Figuy",
	"Fire Gem": "Joyau Feu",
	"Fire Memory": "ROM Feu",
	"Fire Stone": "Pierre Feu",
	"Firium Z": "Pyrozélite",
	"Fist Plate": "Plaque Poing",
	"Flame Orb": "Orbe Flamme",
	"Flame Plate": "Plaque Flam",
	"Float Stone": "Pierrallégée",
	"Flower Sweet": "Fleur en Sucre",
	"Flying Gem": "Joyau Vol",
	"Flying Memory": "ROM Vol",
	"Flyinium Z": "Aérozélite",
	"Focus Band": "Bandeau",
	"Focus Sash": "Ceinture Force",
	"Fossilized Bird": "Fossile Oiseau",
	"Fossilized Dino": "Fossile Aileron",
	"Fossilized Drake": "Fossile Dragon",
	"Fossilized Fish": "Fossile Poisson",
	"Friend Ball": "Copain Ball",
	"Full Incense": "Encens Plein",
	"Galarica Cuff": "Bracelet Galanoa",
	"Galarica Wreath": "Couronne Galanoa",
	"Galladite": "Gallamite",
	"Ganlon Berry": "Baie Lingan",
	"Garchompite": "Carchacrokite",
	"Gardevoirite": "Gardevoirite",
	"Gengarite": "Ectoplasmite",
	"Ghost Gem": "Joyau Spectre",
	"Ghost Memory": "ROM Spectre",
	"Ghostium Z": "Spectrozélite",
	"Glalitite": "Oniglalite",
	"Gold Bottle Cap": "Capsule d'Or",
	"Grass Gem": "Joyau Plante",
	"Grass Memory": "ROM Plante",
	"Grassium Z": "Florazélite",
	"Grassy Seed": "Graine Herbe",
	"Great Ball": "Super Ball",
	"Grepa Berry": "Baie Résin",
	"Grip Claw": "Accro Griffe",
	"Griseous Orb": "Orbe Platiné",
	"Ground Gem": "Joyau Sol",
	"Ground Memory": "ROM Sol",
	"Groundium Z": "Terrazélite",
	"Gyaradosite": "Léviatorite",
	"Haban Berry": "Baie Fraigo",
	"Hard Stone": "Pierre Dure",
	"Heal Ball": "Soin Ball",
	"Heat Rock": "Roche Chaude",
	"Heavy Ball": "Masse Ball",
	"Heavy-Duty Boots": "Grosses Bottes",
	"Helix Fossil": "Fossile Nautile",
	"Heracronite": "Scarhinoïte",
	"Hondew Berry": "Baie Lonme",
	"Houndoominite": "Démolossite",
	"Iapapa Berry": "Baie Papaya",
	"Ice Gem": "Joyau Glace",
	"Ice Memory": "ROM Glace",
	"Ice Stone": "Pierre Glace",
	"Icicle Plate": "Plaque Glace",
	"Icium Z": "Cryozélite",
	"Icy Rock": "Roche Glace",
	"Incinium Z": "Félinozélite",
	"Insect Plate": "Plaquinsect",
	"Iron Ball": "Balle Fer",
	"Iron Plate": "Plaque Fer",
	"Jaboca Berry": "Baie Jacoba",
	"Jaw Fossil": "Fossile Mâchoire",
	"Kasib Berry": "Baie Sédra",
	"Kebia Berry": "Baie Kébia",
	"Kee Berry": "Baie Éka",
	"Kelpsy Berry": "Baie Alga",
	"Kangaskhanite": "Kangourexite",
	"King's Rock": "Roche Royale",
	"Kommonium Z": "Ékaïzélite",
	"Lagging Tail": "Ralentiqueue",
	"Lansat Berry": "Baie Lansat",
	"Latiasite": "Latiasite",
	"Latiosite": "Latiosite",
	"Lax Incense": "Encens Doux",
	"Leaf Stone": "Pierre Plante",
	"Leek": "Poireau",
	"Leftovers": "Restes",
	"Leppa Berry": "Baie Mepo",
	"Level Ball": "Niveau Ball",
	"Liechi Berry": "Baie Lichii",
	"Life Orb": "Orbe Vie",
	"Light Ball": "Ballelumiere",
	"Light Clay": "Lumargile",
	"Lopunnite": "Lockpinite",
	"Love Ball": "Love Ball",
	"Love Sweet": "Coeur en Sucre",
	"Lucarionite": "Lucarite",
	"Lucky Punch": "Poing Chance",
	"Lum Berry": "Baie Prine",
	"Luminous Moss": "Lichen Lumineux",
	"Lunalium Z": "Lunazélite",
	"Lure Ball": "Appât Ball",
	"Lustrous Orb": "Orbe Perlé",
	"Luxury Ball": "Luxe Ball",
	"Lycanium Z": "Lougarozélite",
	"Macho Brace": "Bracelet Macho",
	"Magmarizer": "Magmariseur",
	"Magnet": "Aimant",
	"Mago Berry": "Baie Mago",
	"Magost Berry": "Baie Mangou",
	"Manectite": "Élecsprintite",
	"Maranga Berry": "Baie Rangma",
	"Marshadium Z": "Marshadozélite",
	"Master Ball": "Master Ball",
	"Mawilite": "Mysdibulite",
	"Meadow Plate": "Plaque Herbe",
	"Medichamite": "Charminite",
	"Mental Herb": "Herbe Mental",
	"Metagrossite": "Métalossite",
	"Metal Coat": "Peau Metal",
	"Metal Powder": "Poudre Metal",
	"Metronome": "Métronome",
	"Mewnium Z": "Mewzélite",
	"Mewtwonite X": "Mewtwoïte X",
	"Mewtwonite Y": "Mewtwoïte Y",
	"Micle Berry": "Baie Micle",
	"Mimikium Z": "Mimiquizélite",
	"Mind Plate": "Plaque Esprit",
	"Miracle Seed": "Grain Miracle",
	"Misty Seed": "Graine Brume",
	"Moon Ball": "Lune Ball",
	"Moon Stone": "Pierre Lune",
	"Muscle Band": "Bandeau Muscle",
	"Mystery Berry": "Baie Mystère",
	"Mystic Water": "Eau Mystique",
	"Nanab Berry": "Baie Nanab",
	"Nest Ball": "Faiblo Ball",
	"Net Ball": "Filet Ball",
	"Never-Melt Ice": "Glace Éternelle",
	"Nomel Berry": "Baie Tronci",
	"Normal Gem": "Joyau Normal",
	"Normalium Z": "Normazélite",
	"Occa Berry": "Baie Chocco",
	"Odd Incense": "Encens Bizarre",
	"Old Amber": "Vieil Ambre",
	"Oran Berry": "Baie Oran",
	"Oval Stone": "Pierre Ovale",
	"Pamtre Berry": "Baie Palma",
	"Park Ball": "Parc Ball",
	"Passho Berry": "Baie Pocpoc",
	"Payapa Berry": "Baie Yapap",
	"Pecha Berry": "Baie Pêcha",
	"Persim Berry": "Baie Kika",
	"Petaya Berry": "Baie Pitaye",
	"Pidgeotite": "Roucarnagite",
	"Pikanium Z": "Pikazélite",
	"Pikashunium Z": "Pikachazélite",
	"Pinap Berry": "Baie Nanana",
	"Pinsirite": "Scarabruite",
	"Pixie Plate": "Plaque Pixie",
	"Plume Fossil": "Fossile Plume",
	"Poison Barb": "Pic Venin",
	"Poison Gem": "Joyau Poison",
	"Poison Memory": "ROM Poison",
	"Poisonium Z": "Toxizélite",
	"Poke Ball": "Poké Ball",
	"Pomeg Berry": "Baie Grena",
	"Power Anklet": "Chaîne Pouvoir",
	"Power Band": "Bandeau Pouvoir",
	"Power Belt": "Ceinture Pouvoir",
	"Power Bracer": "Poignée Pouvoir",
	"Power Herb": "Herbe Pouvoir",
	"Power Lens": "Lentille Pouvoir",
	"Power Weight": "Poids Pouvoir",
	"Premier Ball": "Honor Ball",
	"Primarium Z": "Oratozélite",
	"Prism Scale": "Bel'Écaille",
	"Protective Pads": "Pare-Effet",
	"Protector": "Protecteur",
	"Psychic Gem": "Joyau Psy",
	"Psychic Memory": "ROM Psy",
	"Psychic Seed": "Graine Psychique",
	"Psychium Z": "Psychézélite",
	"Qualot Berry": "Baie Qualot",
	"Quick Ball": "Rapide Ball",
	"Quick Claw": "Vive Griffe",
	"Quick Powder": "Poudre Vite",
	"Rabuta Berry": "Baie Rabuta",
	"Rare Bone": "Os Rare",
	"Rawst Berry": "Baie Fraive",
	"Razor Claw": "Griffe Rasoir",
	"Razor Fang": "Croc Rasoir",
	"Razz Berry": "Baie Framby",
	"Reaper Cloth": "Tissu Fauche",
	"Red Card": "Carton Rouge",
	"Red Orb": "Gemme Rouge",
	"Repeat Ball": "Bis Ball",
	"Ribbon Sweet": "Ruban en Sucre",
	"Rindo Berry": "Baie Ratam",
	"Ring Target": "Point de Mire",
	"Rock Gem": "Joyau Roche",
	"Rock Incense": "Encens Roc",
	"Rock Memory": "ROM Roche",
	"Rockium Z": "Rocazélite",
	"Rocky Helmet": "Casque Brut",
	"Room Service": "Chariot Distordu",
	"Root Fossil": "Fossile Racine",
	"Rose Incense": "Encens Fleur",
	"Roseli Berry": "Baie Selro",
	"Rowap Berry": "Baie Pommo",
	"Rusted Shield": "Bouclier Rouillé",
	"Rusted Sword": "Épée Rouillée",
	"Sablenite": "Ténéfixite",
	"Sachet": "Sachet Senteur",
	"Safari Ball": "Safari Ball",
	"Safety Goggles": "Lunettes Filtre",
	"Sail Fossil": "Fossile Nageoire",
	"Salac Berry": "Baie Sailak",
	"Salamencite": "Drattakite",
	"Sceptilite": "Jungkite",
	"Scizorite": "Cizayoxite",
	"Scope Lens": "Lentilscope",
	"Sea Incense": "Encens Mer",
	"Sharp Beak": "Bec Pointu",
	"Sharpedonite": "Sharpedite",
	"Shed Shell": "Carapace Mue",
	"Shell Bell": "Grelot Coque",
	"Shiny Stone": "Pierre Éclat",
	"Shock Drive": "Module Choc",
	"Shuca Berry": "Baie Jouca",
	"Silk Scarf": "Mouchoir Soie",
	"Silver Powder": "Poudre Argentée",
	"Sitrus Berry": "Baie Sitrus",
	"Skull Fossil": "Fossile Crâne",
	"Sky Plate": "Plaque Ciel",
	"Slowbronite": "Flagadossite",
	"Smooth Rock": "Roche Lisse",
	"Snorlium Z": "Ronflézélite",
	"Snowball": "Boule de Neige",
	"Soft Sand": "Sable Doux",
	"Solganium Z": "Solgazélite",
	"Soul Dew": "Rosée Âme",
	"Spell Tag": "Rune Sort",
	"Spelon Berry": "Baie Kiwan",
	"Splash Plate": "Plaque Hydro",
	"Spooky Plate": "Plaque Fantô",
	"Sport Ball": "Compét'Ball",
	"Starf Berry": "Baie Frista",
	"Star Sweet": "Étoile en Sucre",
	"Steelixite": "Steelixite",
	"Steel Gem": "Joyau Acier",
	"Steel Memory": "ROM Acier",
	"Steelium Z": "Métallozélite",
	"Sticky Barb": "Piquants",
	"Stone Plate": "Plaque Roc",
	"Strawberry Sweet": "Fraise en Sucre",
	"Sun Stone": "Pierre Soleil",
	"Swampertite": "Laggronite",
	"Sweet Apple": "Pomme Sucrée",
	"Tamato Berry": "Baie Tamato",
	"Tanga Berry": "Baie Panga",
	"Tapunium Z": "Tokozélite",
	"Tart Apple": "Pomme Acidulée",
	"Terrain Extender": "Champ'Duit",
	"Thick Club": "Masse Os",
	"Throat Spray": "Spray Gorge",
	"Thunder Stone": "Pierre Foudre",
	"Timer Ball": "Chrono Ball",
	"Toxic Orb": "Orbe Toxique",
	"Toxic Plate": "Plaque Toxic",
	"TR00": "DT00",
	"TR01": "DT01",
	"TR02": "DT02",
	"TR03": "DT03",
	"TR04": "DT04",
	"TR05": "DT05",
	"TR06": "DT06",
	"TR07": "DT07",
	"TR08": "DT08",
	"TR09": "DT09",
	"TR10": "DT10",
	"TR11": "DT11",
	"TR12": "DT12",
	"TR13": "DT13",
	"TR14": "DT14",
	"TR15": "DT15",
	"TR16": "DT16",
	"TR17": "DT17",
	"TR18": "DT18",
	"TR19": "DT19",
	"TR20": "DT20",
	"TR21": "DT21",
	"TR22": "DT22",
	"TR23": "DT23",
	"TR24": "DT24",
	"TR25": "DT25",
	"TR26": "DT26",
	"TR27": "DT27",
	"TR28": "DT28",
	"TR29": "DT29",
	"TR30": "DT30",
	"TR31": "DT31",
	"TR32": "DT32",
	"TR33": "DT33",
	"TR34": "DT34",
	"TR35": "DT35",
	"TR36": "DT36",
	"TR37": "DT37",
	"TR38": "DT38",
	"TR39": "DT39",
	"TR40": "DT40",
	"TR41": "DT41",
	"TR42": "DT42",
	"TR43": "DT43",
	"TR44": "DT44",
	"TR45": "DT45",
	"TR46": "DT46",
	"TR47": "DT47",
	"TR48": "DT48",
	"TR49": "DT49",
	"TR50": "DT50",
	"TR51": "DT51",
	"TR52": "DT52",
	"TR53": "DT53",
	"TR54": "DT54",
	"TR55": "DT55",
	"TR56": "DT56",
	"TR57": "DT57",
	"TR58": "DT58",
	"TR59": "DT59",
	"TR60": "DT60",
	"TR61": "DT61",
	"TR62": "DT62",
	"TR63": "DT63",
	"TR64": "DT64",
	"TR65": "DT65",
	"TR66": "DT66",
	"TR67": "DT67",
	"TR68": "DT68",
	"TR69": "DT69",
	"TR70": "DT70",
	"TR71": "DT71",
	"TR72": "DT72",
	"TR73": "DT73",
	"TR74": "DT74",
	"TR75": "DT75",
	"TR76": "DT76",
	"TR77": "DT77",
	"TR78": "DT78",
	"TR79": "DT79",
	"TR80": "DT80",
	"TR81": "DT81",
	"TR82": "DT82",
	"TR83": "DT83",
	"TR84": "DT84",
	"TR85": "DT85",
	"TR86": "DT86",
	"TR87": "DT87",
	"TR88": "DT88",
	"TR89": "DT89",
	"TR90": "DT90",
	"TR91": "DT91",
	"TR92": "DT92",
	"TR93": "DT93",
	"TR94": "DT94",
	"TR95": "DT95",
	"TR96": "DT96",
	"TR97": "DT97",
	"TR98": "DT98",
	"TR99": "DT99",
	"Twisted Spoon": "Cuiller Tordue",
	"Tyranitarite": "Tyranocivite",
	"Up-Grade": "Améliorator",
	"Ultra Ball": "Hyper Ball",
	"Ultranecrozium Z": "Ultranécrozélite",
	"Utility Umbrella": "Parapluie Solide",
	"Venusaurite": "Florizarrite",
	"Wacan Berry": "Baie Parma",
	"Water Gem": "Joyau Eau",
	"Water Memory": "ROM Eau",
	"Water Stone": "Pierre Eau",
	"Waterium Z": "Aquazélite",
	"Watmel Berry": "Baie Stekpa",
	"Wave Incense": "Encens Vague",
	"Weakness Policy": "Vulné-Assurance",
	"Wepear Berry": "Baie Repoi",
	"Whipped Dream": "Chantibonbon",
	"White Herb": "Herbe Blanche",
	"Wide Lens": "Loupe",
	"Wiki Berry": "Baie Wiki",
	"Wise Glasses": "Lunettes Sages",
	"Yache Berry": "Baie Nanone",
	"Zap Plate": "Plaque Volt",
	"Zoom Lens": "Lentille Zoom",
	"Berserk Gene": "ADN Berzerk",
	"Berry": "Baie",
	"Bitter Berry": "Baie Amere",
	"Burnt Berry": "Baie Brulure",
	"Gold Berry": "Baie Doree",
	"Ice Berry": "Baie Gel",
	"Mint Berry": "Baie Menthe",
	"Pink Bow": "Ruban Rose",
	"Polkadot Bow": "Ruban à Pois",
	"None": "Aucun"
}

export const TypesDico: { [englishName: string]: string; } = {
	"(automatic type)": "(Type automatique)",
    "Bug": "Insecte",
	"Dark": "Ténèbres",
	"Dragon": "Dragon",
	"Electric": "Électrik",
	"Fairy": "Fée",
	"Fighting": "Combat",
	"Fire": "Feu",
	"Flying": "Vol",
	"Ghost": "Spectre",
	"Grass": "Plante",
	"Ground": "Sol",
	"Ice": "Glace",
    "Normal": "Normal",
	"Poison": "Poison",
	"Psychic": "Psy",
	"Rock": "Roche",
	"Steel": "Acier",
	"Water": "Eau"
}

export const NaturesDico: { [englishName: string]: string; } = {
	"Adamant": "Rigide",
	"Bashful": "Pudique",
	"Bold": "Assuré",
	"Brave": "Brave",
	"Calm": "Calme",
	"Careful": "Prudent",
	"Docile": "Docile",
	"Gentle": "Gentil",
	"Hardy": "Hardi",
	"Hasty": "Pressé",
	"Impish": "Malin",
	"Jolly": "Jovial",
	"Lax": "Lâche",
	"Lonely": "Solo",
	"Mild": "Doux",
	"Modest": "Modeste",
	"Naive": "Naïf",
	"Naughty": "Mauvais",
	"Quiet": "Discret",
	"Quirky": "Bizarre",
	"Rash": "Foufou",
	"Relaxed": "Relax",
	"Sassy": "Malpoli",
	"Serious": "Sérieux",
	"Timid": "Timide"
}

export const StatsDico: { [englishName: string]: string; } = {
	"HP": "PV",
	"Attack": "Attaque",
	"Atk": "Atq",
	"Defense": "Défense",
	"Def": "Déf",
	"Sp. Atk.": "Atq. Spé",
	"Sp. Atk": "Atq. Spé.",
	"SpA": "SpA",
	"Sp. Def.": "Déf. Spé",
	"Sp. Def": "Déf. Spé.",
	"SpD": "SpD",
	"Speed": "Vitesse",
	"Spe": "Vit",
	"Accuracy": "Précision",
	"Evasion": "Esquive",
	"evasiveness": "Esquive",
	"Spc": "Spé"
}

export const ConditionsDico: { [englishName: string]: string; } = {
	"PAR": "PAR",
	"BRN": "BRU",
	"PSN": "PSN",
	"TOX": "TOX",
	"SLP": "SOM",
	"FRZ": "GEL",
	"Confused": "Confus",
	"Must recharge": "Doit se recharger"
}

export const HeadersDico: { [englishName: string]: string; } = {
	"Uber": "Uber",
	"OU": "OU",
	"UUBL": "UUBL",
	"UU": "UU",
	"RUBL": "RUBL",
	"RU": "RU",
	"NUBL": "NUBL",
	"NU": "NU",
	"PUBL": "PUBL",
	"PU": "PU",
	"LC": "LC",
	"Pokémon": "Pokémon",
    "Abilities": "Talents",
    "Hidden Ability": "Talent caché",
    "Special Event Ability": "Talent événementiel",
    "Situational Abilities": "Talents situationnels",
    "Unviable Abilities": "Talents non viables",
	"Moves": "Capacités",
    "Physical moves": "Capacités physiques",
    "Special moves": "Capacités spéciales",
    "Status moves": "Capacités de statut",
    "Usually useless moves": "Capacités généralement inutiles",
    "Sketched moves": "Capacités gribouillées",
    "Useless sketched moves": "Capacités gribouillées inutiles",
	"Items": "Objets",
    "Popular items": "Objets populaires",
    "Pokémon-specific items": "Objets spécifiques à un Pokémon",
    "Usually useless items": "Objets généralement inutiles",
    "Useless items": "Objets inutiles",
    "Restricted Legendary": "Légendaires restreints",
    "Regular": "Standard",
    "Mythical": "Fabuleux",
    "New": "Nouveau",
    "Below PU": "Sous le PU",
    "Below DUU": "Sous le DUU",
    "NFEs not in a higher tier": "NFEs non présents dans un tier supérieur",
    "Illegal results": "Résultats illégaux",
    "CAP moves": "Capacités CAP",
	"EVs": "Evs"
}

export const MenuDico: { [englishName: string]: string; } = {
    "Copy": "Copie",
	"Import": "Import",
    "Import/Export": "Import/Export",
    "Move": "Déplacement",
    "Delete": "Suppression",
	" Undo Delete": " Annuler Suppression",
	"Filter": "Filtrer",
	"Filters: ": "Filtres : ",
	"Details": "Détails",
	"Item": "Objet",
	"Ability": "Talent",
	"Moves": "Capacités",
	"Stats": "Stats",
	"Level": "Niveau",
	"Gender": "Genre",
	"Female": "Femelle",
	"Male": "Mâle",
	"Random": "Aléatoire",
	"Shiny": "Shiny",
	"Yes": "Oui",
	"No": "Non",
	"Happiness": "Bonheur",
	"Dmax Level": "Niveau de Dmax",
	"HP Type": "Type PC",
	"Hidden Power": "Pui. Cachée",
	"Pokeball": "Ball",
	"Remaining:": "Restant :",
	"IV spreads": "Répartition d'IVs",
	"min Atk": "Atq mini",
	"min Atk, min Spe": "Atq mini, Vit mini",
	"max all": "Tout au max",
	"min Spe": "Vit mini",
	"Protip:": "Astuce de pro :",
	' You can also set natures by typing "+" and "-" next to a stat.': ' Vous pouvez également choisir une nature en tapant "+" et "-" à côté d\'une stat',
	"(backspace = delete filter)": "(retour arrière = suppression filtre)",
	"Guessed spread: ": "Répartition conseillée : ",
	"Guessed spread: (Please choose 4 moves to get a guessed spread) (": "Répartition conseillée : (Veuillez choisir 4 capacités pour avoir une répartition conseillée) (",
	"Smogon analysis": "Analyse de Smogon",
	"Bulky Band": "Band Bulky",
	"Fast Band": "Band rapide",
	"Bulky Specs": "Specs Bulky",
	"Fast Specs": "Specs rapide",
	"Special Scarf": "Scarf Spécial",
	"Physical Scarf": "Scarf Physique",
	"Physical Biased Mixed Scarf": "Scarf Mixed orienté Physique",
	"Special Biased Mixed Scarf": "Scarf Mixed orienté Spécial",
	"Specially Defensive": "Défensif Spécial",
	"Physically Defensive": "Défensif Physique",
	"Fast Physical Sweeper": "Sweeper Physique rapide",
	"Fast Special Sweeper": "Sweeper Spécial rapide",
	"Fast Bulky Support": "Support Bulky rapide",
	"Bulky Physical Sweeper": "Sweeper Physique Bulky",
	"Possible abilities": "Talents possibles",
	"Bulky Special Sweeper": "Sweeper Spécial Bulky",
	"HP": "PV",
	"Atk ": "Atq ",
	" / Def ": " / Déf ",
	" / SpA ": " / SpA ",
	" / SpD ": " / SpD ",
	" / Spe ": " / Vit ",
	"Spe": "Vit",
	"(After stat modifiers:": "(Après altération de stats)",
	"(before items/abilities/modifiers)": "(avant objets/talents/modifications)",
	"stolen": "volé",
	"eaten": "mangé",
	"flung": "dégommé",
	"knocked off": "saboté",
	"consumed": "utilisé",
	"incinerated": "calciné",
	"popped": "éclaté",
	"held up": "utilisé",
	"found": "trouvé",
	"frisked": "fouillé",
	"harvested": "récolté",
	"bestowed": "offert",
	"tricked": "échangé",
	"disturbed": "possédé",
	"How will you start the battle?": "Comment commencerez-vous le combat ?",
	" Timer": " Temps",
	"Choose Lead": "Choisir un Lead",
	" will be sent out first.": " sera envoyé en premier.",
	" will use ": "va utiliser ",
	" will switch in, replacing ": " va être envoyé et remplacera ",
	"Waiting for opponent...": "En attente de l'adversaire...",
	"Cancel": "Annuler",
	" What will ": "Que va faire ",
	" do? ": " ? ",
	"Attack": "Attaquer",
	"Switch": "Switcher"
}



export const FiltersDico:  { [englishName: string]: string; } = {
    "HP": "PV",
    "Atk": "Atq",
    "Def": "Def",
    "SpA": "SpA",
	"SpD": "SpD",
	"Spe": "Vit",
	"BST": "BST",
	"Cat": "Cat",
	"Pow": "Pui",
	"Acc": "Pre",
	"Power": "Puissance",
	"Accuracy": "Précision",
	"PP": "PP",
	"Sort: ": "Tri :",
	"Name": "Nom",
	"Type": "Type",
	"Types" : "Types",
	"Abilities": "Talents",
	"Number" : "Numéro",
}

export const CosmeticForms: Array<string> = [
	"Unown-B",
	"Unown-C",
	"Unown-D",
	"Unown-E",
	"Unown-F",
	"Unown-G",
	"Unown-H",
	"Unown-I",
	"Unown-J",
	"Unown-K",
	"Unown-L",
	"Unown-M",
	"Unown-N",
	"Unown-O",
	"Unown-P",
	"Unown-Q",
	"Unown-R",
	"Unown-S",
	"Unown-T",
	"Unown-U",
	"Unown-V",
	"Unown-W",
	"Unown-X",
	"Unown-Y",
	"Unown-Z",
	"Unown-Exclamation",
	"Unown-Question",
	"Burmy-Sandy",
	"Burmy-Trash",
	"Shellos-East",
	"Gastrodon-East",
	"Deerling-Autumn",
	"Deerling-Summer",
	"Deerling-Winter",
	"Sawsbuck-Autumn",
	"Sawsbuck-Summer",
	"Sawsbuck-Winter",
	"Vivillon-Archipelago",
	"Vivillon-Continental",
	"Vivillon-Elegant",
	"Vivillon-Garden",
	"Vivillon-High Plains",
	"Vivillon-Icy Snow",
	"Vivillon-Jungle",
	"Vivillon-Marine",
	"Vivillon-Modern",
	"Vivillon-Monsoon",
	"Vivillon-Ocean",
	"Vivillon-Polar",
	"Vivillon-River",
	"Vivillon-Sandstorm",
	"Vivillon-Savanna",
	"Vivillon-Sun",
	"Vivillon-Tundra",
	"Flabe\u0301be\u0301-Blue",
	"Flabe\u0301be\u0301-Orange",
	"Flabe\u0301be\u0301-White",
	"Flabe\u0301be\u0301-Yellow",
	"Floette-Blue",
	"Floette-Orange",
	"Floette-White",
	"Floette-Yellow",
	"Florges-Blue",
	"Florges-Orange",
	"Florges-White",
	"Florges-Yellow",
	"Furfrou-Dandy",
	"Furfrou-Debutante",
	"Furfrou-Heart",
	"Furfrou-Diamond",
	"Furfrou-Kabuki",
	"Furfrou-La Reine",
	"Furfrou-Matron",
	"Furfrou-Pharaoh",
	"Furfrou-Star",
	"Minior-Orange",
	"Minior-Yellow",
	"Minior-Green",
	"Minior-Blue",
	"Minior-Indigo",
	"Minior-Violet",
	"Alcremie-Ruby-Cream",
	"Alcremie-Matcha-Cream",
	"Alcremie-Mint-Cream",
	"Alcremie-Lemon-Cream",
	"Alcremie-Salted-Cream",
	"Alcremie-Ruby-Swirl",
	"Alcremie-Caramel-Swirl",
	"Alcremie-Rainbow-Swirl"
]

const MainDico: Array<{ [englishName: string]: string; }>  = [
	PokemonDico, AbilitiesDico, MovesDico, ItemsDico, TypesDico, NaturesDico, StatsDico, ConditionsDico, HeadersDico, MenuDico, BattleMessagesDico, FiltersDico
]

const LogTranslationType: Array<string> = [
	"pokémon", "ability", "move", "item", "type", "nature", "stat", "condition", "header", "menu", "battlemessage" ,"filter"
]

function translateToFrench(englishWord: string, translationType: number)
{
	// Don't try to translate null, empty, undefined or numbers
	if (!englishWord || !isNaN(+englishWord)) {
		return englishWord;
	}

	var Dico = MainDico[translationType];
	var frenchWord = Dico[englishWord];

	if (frenchWord) {
		return frenchWord;
	}
	else {
		if (!isValidFrenchWord_NoLog(englishWord, translationType)){
			console.log("Unable to translate english " + LogTranslationType[translationType] + " : " + englishWord);
		}
		
		return englishWord;
	}
}

function translateToEnglish(frenchWord: string, translationType: number)
{
	// Don't try to translate null, empty, undefined or numbers
	if (!frenchWord || !isNaN(+frenchWord)) {
		return frenchWord;
	}

	var Dico = MainDico[translationType];
	var englishWord = Object.keys(Dico).find(key => Dico[key] === frenchWord)

	if (englishWord) {
		return englishWord;
	}
	else {
		if (!isValidEnglishWord(frenchWord, translationType)) {
			console.log("Unable to translate french " + LogTranslationType[translationType] + " : " + frenchWord);
		}
		
		return frenchWord;
	}
}

function isValidFrenchWord(frenchWord: string, translationType: number) {
	return translateToEnglish(frenchWord, translationType) != frenchWord
}

function isValidFrenchWord_NoLog(frenchWord: string, translationType: number) {
	return Object.keys(MainDico[translationType]).find(key => MainDico[translationType][key] === frenchWord) != frenchWord
}

function isValidEnglishWord(englishWord: string, translationType: number) {
	return MainDico[translationType][englishWord];
}


// Easy-to-use methods to translate english to french words
export function translatePokemonName(englishPokemonName: string) {
	return translateToFrench(englishPokemonName, POKEMON);
}

export function translateAbility(englishAbility: string) {
	return translateToFrench(englishAbility, ABILITY);
}

export function translateMove(englishMove: string) {
	return translateToFrench(englishMove, MOVE);
}

export function translateItem(englishItem: string) {
	return translateToFrench(englishItem, ITEM);
}

export function translateType(englishType: string) {
	return translateToFrench(englishType, TYPE);
}

export function translateNature(englishNature: string) {
	return translateToFrench(englishNature, NATURE);
}

export function translateStat(englishStat: string) {
	return translateToFrench(englishStat, STAT);
}

export function translateCondition(englishCondition: string) {
	return translateToFrench(englishCondition, CONDITION);
}

export function translateHeader(englishHeader: string) {
	return translateToFrench(englishHeader, HEADER);
}

export function translateMenu(englishMenu: string) {
	return translateToFrench(englishMenu, MENU);
}

export function translateBattleMessage(englishBattleMessage: string) {
	return translateToFrench(englishBattleMessage, BATTLEMESSAGE);
}

export function translateFilter(englishFilter: string) {
	return translateToFrench(englishFilter, FILTER);
}


// Easy-to-use methods to translate french to english words
export function translatePokemonNameToEnglish(frenchPokemonName: string) {
	return translateToEnglish(frenchPokemonName, POKEMON);
}

export function translateAbilityToEnglish(frenchAbility: string) {
	return translateToEnglish(frenchAbility, ABILITY);
}

export function translateMoveToEnglish(frenchMove: string) {
	return translateToEnglish(frenchMove, MOVE);
}

export function translateItemToEnglish(frenchItem: string) {
	return translateToEnglish(frenchItem, ITEM);
}

export function translateTypeToEnglish(frenchType: string) {
	return translateToEnglish(frenchType, TYPE);
}

export function translateNatureToEnglish(frenchNature: string) {
	return translateToEnglish(frenchNature, NATURE);
}

export function translateStatToEnglish(frenchStat: string) {
	return translateToEnglish(frenchStat, STAT);
}

export function translateConditionToEnglish(frenchCondition: string) {
	return translateToEnglish(frenchCondition, CONDITION);
}

export function translateHeaderToEnglish(frenchHeader: string) {
	return translateToEnglish(frenchHeader, HEADER);
}

export function translateMenuToEnglish(frenchMenu: string) {
	return translateToEnglish(frenchMenu, MENU);
}

export function translateBattleMessageToEnglish(frenchBattleMessage: string) {
	return translateToEnglish(frenchBattleMessage, BATTLEMESSAGE);
}

export function translateFilterToEnglish(frenchFilter: string) {
	return translateToEnglish(frenchFilter, FILTER);
}


// Easy-to-use methods to check the validity of french words
export function isValidFrenchPokemonName(frenchPokemonName: string) {
	return translateToEnglish(frenchPokemonName, POKEMON) != frenchPokemonName;
}

export function isValidFrenchAbility(frenchAbility: string) {
	return translateToEnglish(frenchAbility, ABILITY) != frenchAbility;
}

export function isValidFrenchMove(frenchMove: string) {
	return translateToEnglish(frenchMove, MOVE) != frenchMove;
}

export function isValidFrenchItem(frenchItem: string) {
	return translateToEnglish(frenchItem, ITEM) != frenchItem;
}

export function isValidFrenchType(frenchType: string) {
	return translateToEnglish(frenchType, TYPE) != frenchType;
}

export function isValidFrenchNature(frenchNature: string) {
	return translateToEnglish(frenchNature, NATURE) != frenchNature;
}

export function isValidFrenchStat(frenchStat: string) {
	return translateToEnglish(frenchStat, STAT) != frenchStat;
}

export function isValidFrenchCondition(frenchCondition: string) {
	return translateToEnglish(frenchCondition, CONDITION) != frenchCondition;
}

export function isValidFrenchHeader(frenchHeader: string) {
	return translateToEnglish(frenchHeader, HEADER) != frenchHeader;
}

export function isValidFrenchMenu(frenchMenu: string) {
	return translateToEnglish(frenchMenu, MENU) != frenchMenu;
}

export function isValidFrenchBattleMessage(frenchBattleMessage: string) {
	return translateToEnglish(frenchBattleMessage, BATTLEMESSAGE) != frenchBattleMessage;
}

export function isValidFrenchFilter(frenchFilter: string) {
	return translateToEnglish(frenchFilter, FILTER) != frenchFilter;
}


// Easy-to-use methods to check the validity of english words
export function isValidEnglishPokemonName(englishPokemonName: string) {
	return PokemonDico[englishPokemonName];
}

export function isValidEnglishAbility(englishAbility: string) {
	return AbilitiesDico[englishAbility];
}

export function isValidEnglishMove(englishMove: string) {
	return MovesDico[englishMove];
}

export function isValidEnglishItem(englishItem: string) {
	return ItemsDico[englishItem];
}

export function isValidEnglishType(englishType: string) {
	return TypesDico[englishType];
}

export function isValidEnglishNature(englishNature: string) {
	return NaturesDico[englishNature];
}

export function isValidEnglishStat(englishStat: string) {
	return StatsDico[englishStat];
}

export function isValidEnglishCondition(englishCondition: string) {
	return ConditionsDico[englishCondition];
}

export function isValidEnglishHeader(englishHeader: string) {
	return HeadersDico[englishHeader];
}

export function isValidEnglishMenu(englishMenu: string) {
	return MenuDico[englishMenu];
}

export function isValidEnglishBattleMessage(englishBattleMessage: string) {
	return BattleMessagesDico[englishBattleMessage];
}

export function isValidEnglishFilter(englishFilter: string) {
	return FiltersDico[englishFilter];
}


// Methods used to get Regex matches in battle messages templates
export function translateMessage(originalString: string)
{
    // If the message can be directly translated (no Pokémon name, move, etc)
    if (isValidEnglishBattleMessage(originalString)) {
        return translateBattleMessage(originalString);
    }
    // The message probably contains a variable english name (Pokémon name, move, etc)
    else  {
        console.log("Regex message : " + originalString);

        // Use a Regex match in order to translate the message
        var translated = translateRegexBattleMessage(originalString);

        if (translated.length > 0)
        {
            var englishMessage = translated[0].source.split("(.*)");
            var variablesToTranslate = translated[1].match(/{(.*?)}/g);

            console.log(englishMessage);

            // If a SWAP parameter is present in the template variable, order them by swap id
            if (variablesToTranslate[0].includes("SWAP")) 
			{
                // Alphabetically sort the swaps
                variablesToTranslate.sort();

                // Remove the SWAP_i_ in the tags
                for (var i = 0 ; i < variablesToTranslate.length ; i++) {
                    translated[1] = translated[1].replace("SWAP_" + i + "_", "");
                    variablesToTranslate[i] = variablesToTranslate[i].replace("SWAP_" + i + "_","");
                }
            }

            for (var i = 0 ; i < englishMessage.length - 1 ; i++)
            {
                // Remove escaped escaped character
                if (i == 0) { englishMessage[0] = englishMessage[0].replace("\\","");}
                englishMessage[i + 1] = englishMessage[i + 1].replace("\\","");
                
                // Get english variable from the original string
                var variableName = originalString.slice((i == 0 && englishMessage[i] == "" ? 0 : originalString.indexOf(englishMessage[i]) + englishMessage[i].length),
                                                              (englishMessage[i + 1] == "" ? originalString.length : originalString.indexOf(englishMessage[i + 1])));

                console.log(variableName);

                // Replace the template variable by the translated value
                if (variablesToTranslate[i].includes("{POKEMON"))
                {
                    // Display the Pokémon name differently depending on if it's the opponent one, or its position in the word, 
                    if (variableName.includes("he opposing ")) {
                        if (isFirstWord("{POKEMON}", translated[1])) {
                            translated[1] = translated[1].replace("{POKEMON}",
								"Le " + translatePokemonName(variableName.replace("The opposing ", "").replace("the opposing ", "")) + " adverse");
                        }
                        else {
                            translated[1] = translated[1].replace("{POKEMON}",
								translatePokemonName(variableName.replace("the opposing ", "").replace("The opposing ", "")) + " adverse");
                        }
                    }
                    else {
                        translated[1] = translated[1].replace("{POKEMON}", translatePokemonName(variableName));
                    }
                }
				else if (variablesToTranslate[i] == "{STATS}") {
					if (["Attack", "Sp. Atk", "evasiveness"].includes(variableName)) {
						translated[1] = translated[1].replace("{STATS}", "L'" + translateStat(variableName));
					}
					else {
						translated[1] = translated[1].replace("{STATS}", "La " + translateStat(variableName));
					}
				}
                else if (variablesToTranslate[i] == "{ABILITY}") {
                    translated[1] = translated[1].replace("{ABILITY}", translateAbility(variableName));
                }
                else if (variablesToTranslate[i] == "{MOVE}") {
                    translated[1] = translated[1].replace("{MOVE}", translateMove(variableName));
                }
				else if (variablesToTranslate[i] == "{ITEM}") {
                    translated[1] = translated[1].replace("{ITEM}", translateItem(variableName));
                }
                else {
                    translated[1] = translated[1].replace(variablesToTranslate[i], variableName); // Default,just replace the template variable
                }
            }

            return translated[1];
        }
        else {
            // No translation found, return the original string
            return originalString;
        }
    }
}

function translateRegexBattleMessage(messageString: string)
{
	for (let RegexTranslation of RegexBattleMessagesMap)
	{
		if (RegexTranslation[0].test(messageString)) {
			return RegexTranslation;
		}
	}

	return [];
}

function isFirstWord(word: string, sentence: string) {
    var wordPosition = sentence.indexOf(word) - 1;

    while (wordPosition >= 0)
    {
        // Check if the character is a letter
        if (sentence[wordPosition].toLowerCase() == sentence[wordPosition].toUpperCase()) {
            return false;
        }

        wordPosition--;
    }

    return true;
}