import {grabPokemonAPI, grabPokemonLocationAPI, grabEvolutionChainAPI} from "./fetchAPI.js"

let ability1 = document.getElementById("ability1")
let ability2 = document.getElementById("ability2")
let ability3 = document.getElementById("ability3")

let favoritesButton = document.getElementById("favoritesButton")
let searchBarButton = document.getElementById("searchBarButton")
let searchBarInput = document.getElementById("searchBarInput")
let shinyToggleButton = document.getElementById("shinyToggleButton");

let pokeIndexNum = document.getElementById("pokeIndexNum")
let pokemonImage = document.getElementById("pokemonImage")
let pokemonName = document.getElementById("pokemonName")

let eve1png = document.getElementById("eve1png")
let eve1 = document.getElementById("eve1")

let eve2png = document.getElementById("eve2png")
let eve2 = document.getElementById("eve2")

let typeList1 = document.getElementById("typeList1")
let typeList2 = document.getElementById("typeList2")
let favoritesList = document.getElementById("favoritesList")

favoritesButton.addEventListener

// Variables
let userInput = "";
let pokemon = [];
let isShiny = false;


// UI Change
searchBarButton.addEventListener("click", async () =>
{
    let searchedPokemon = searchBarInput.value.trim().toLowerCase().toUpperCase(); 
    pokemon = await grabPokemonAPI(searchedPokemon);
    console.log(searchedPokemon);
    
    let evolutionChain = await grabEvolutionChainAPI(searchedPokemon);
    console.log("This is evo chain" + evolutionChain);

    let gen = pokemon.id

    if (gen > 649) // Validation
    {
        alert("Please enter a pokemon from gen 1-5 (1-649)")
        return;
    }
        //---------------------------------------------------------------- DOM Updates ----------------------------------------------------------------
        
    // Id Updates
    pokemonName.innerText = `${pokemon.species.name}`;
    pokeIndexNum.innerText = `#${pokemon.id}`;
    pokemonImage.src = `${pokemon.sprites.front_default}`;
    displayPokemonMoves(pokemon.moves);
    await grabPokemonLocationAPI(pokemon.id); 

    // Get Types 
    let types = pokemon.types;

    if (types.length === 1)
    {
        typeList1.innerText = `${pokemon.types[0].type.name}`;
        typeList2.innerText = "";

    }
    else
    {
        typeList1.innerText = `${pokemon.types[0].type.name}`;
        typeList2.innerText = `${pokemon.types[1].type.name}`;
        typeList1.parentElement.classList.add("flex", "gap-10");

    }

    // Get abilities
    let abilities = pokemon.abilities;

    switch (abilities.length) 
    {
        case 3:
            ability1.innerText = abilities[0].ability.name;
            ability2.innerText = abilities[1].ability.name;
            ability3.innerText = abilities[2].ability.name;
            break;

        case 2:
            ability1.innerText = abilities[0].ability.name;
            ability2.innerText = abilities[1].ability.name;
            ability3.style.display = "none";
            break;

        case 1:
            ability1.innerText = abilities[0].ability.name;
            ability2.style.display = "none"; 
            ability3.style.display = "none"; 
            break;

        default:
            ability1.innerText = "This Pokémon has no abilities";
            ability2.style.display = "none";
            ability3.style.display = "none";
            break;
    }
    updateEvolutionUI(evolutionChain, searchedPokemon);
});

searchBarInput.addEventListener("click", async () =>
{
    userInput = searchBarInput.value;
    console.log(userInput);
});

//----------------------- Load favorites from localStorage -----------------------
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

favoritesButton.addEventListener("click", () => 
{
    if (!pokemon || !pokemon.species) return;

    let favoritePokemon = {
        name: pokemon.species.name,
        id: pokemon.id,
        image: pokemon.sprites.front_default
    };

    if (!favorites.some(p => p.id === favoritePokemon.id)) 
    {
        favorites.push(favoritePokemon);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${favoritePokemon.name} added to favorites`);
        displayFavorites();
    } else 
    {
        favorites = favorites.filter(p => p.id !== favoritePokemon.id);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${favoritePokemon.name} removed from favorites`);
    }
    displayFavorites();
});
//---------------------------------------------- Functions ----------------------------------------------

// display favorites list
function displayFavorites() 
{
    let favoritesList = document.getElementById("favoritesList");

    favoritesList.innerHTML = "";

    favorites.forEach(pokemon => 
    {
        let listItem = document.createElement("li");
        listItem.classList.add("p-2", "hover:bg-gray-200", "cursor-pointer", "flex", "items-center", "gap-2");

        let img = document.createElement("img");
        img.src = pokemon.image;
        img.alt = pokemon.name;
        img.classList.add("w-8", "h-8");

        let name = document.createElement("span");
        name.textContent = pokemon.name;

        listItem.appendChild(img);
        listItem.appendChild(name);

        listItem.addEventListener("click", async () => 
        {
            await loadFavoritePokemon(pokemon.id);
        });

        favoritesList.appendChild(listItem);
    });
}

async function loadFavoritePokemon(pokemonId) 
{

    pokemon = await grabPokemonAPI(pokemonId); 
    updatePokemonDisplay(pokemon); 
}

document.addEventListener("DOMContentLoaded", displayFavorites);

function updatePokemonDisplay(pokemon) 
{
    if (!pokemon || !pokemon.species) 
    {
        return;
    }

    if (!pokemon || !pokemon.sprites)
    {
        return;
    } 
    // Shiny
    let normalSprite = pokemon.sprites.front_default;
    let shinySprite = pokemon.sprites.front_shiny;

    pokemonImage.src = isShiny ? shinySprite : normalSprite;

    shinyToggleButton.onclick = () => 
    {
        isShiny = !isShiny; // Toggle state
        pokemonImage.src = isShiny ? shinySprite : normalSprite;
        shinyToggleButton.innerText = isShiny ? "Show Normal" : "Show Shiny";
    };

    // Update Poke 
    pokemonName.innerText = capitalizeWords(pokemon.species.name);
    pokeIndexNum.innerText = `#${pokemon.id}`;
    pokemonImage.src = pokemon.sprites.front_default;

    // Update Types
    if (pokemon.types.length === 1) 
    {
        typeList1.innerText = capitalizeWords(pokemon.types[0].type.name);
        typeList2.innerText = "";
    } else 
    {
        typeList1.innerText = capitalizeWords(pokemon.types[0].type.name);
        typeList2.innerText = capitalizeWords(pokemon.types[1].type.name);
        typeList1.parentElement.classList.add("flex", "gap-10");
    }

    // Update Abilities
    let abilities = pokemon.abilities;
    ability1.innerText = abilities.length > 0 ? capitalizeWords(abilities[0].ability.name) : "No abilities";
    ability2.innerText = abilities.length > 1 ? capitalizeWords(abilities[1].ability.name) : "";
    ability3.innerText = abilities.length > 2 ? capitalizeWords(abilities[2].ability.name) : "";

    ability2.style.display = abilities.length > 1 ? "block" : "none";
    ability3.style.display = abilities.length > 2 ? "block" : "none";

    grabEvolutionChainAPI(pokemon.id).then(evolutionChain => 
    {
        updateEvolutionUI(evolutionChain, pokemon.species.name);
    });

    displayPokemonMoves(pokemon.moves);
}

async function updateEvolutionUI(evolutionChain, searchedPokemon) 
{

    pokemon = await grabPokemonAPI(searchedPokemon);

    eve1.innerText = "";
    eve2.innerText = "";
    eve1png.src = "";
    eve2png.src = "";

    if (!evolutionChain || evolutionChain.length === 0) 
    {
        eve1.innerText = "No evolution data available";
        eve1png.style.display = "none";
        eve2.innerText = "";
        eve2png.style.display = "none";
        return;
    }

    // Prevent dupe
    let evoChainFilter = evolutionChain.filter(name => name !== searchedPokemon.toLowerCase());

    if (evoChainFilter.length > 0) 
    {
        eve1.innerText = capitalizeWords(evoChainFilter[0]);
        eve1png.src = `https://img.pokemondb.net/sprites/home/normal/${evoChainFilter[0]}.png`;
        eve1png.style.display = "block";
    } else 
    {
        eve1.innerText = "";
        eve1png.style.display = "none";
    }

    if (evoChainFilter.length > 1) 
    {
        eve2.innerText = capitalizeWords(evoChainFilter[1]);
        eve2png.src = `https://img.pokemondb.net/sprites/home/normal/${evoChainFilter[1]}.png`;
        eve2png.style.display = "block";
    } else 
    {
        eve2.innerText = "";
        eve2png.style.display = "none";
    }
}

function displayPokemonMoves(moves) 
{
    moveList1.innerHTML = "";
    moveList2.innerHTML = "";

    let moveNames = moves.map(move => move.move.name);

    let middleIndex = Math.ceil(moveNames.length / 2);
    let moveSet1 = moveNames.slice(0, middleIndex);
    let moveSet2 = moveNames.slice(middleIndex);    

    // Function add moves to a list
    const addMovesToList = (moveSet, moveList) => 
    {
        moveSet.forEach(move => {
            let li = document.createElement("li");
            li.innerText = move;
            moveList.appendChild(li);
        });
    };

    addMovesToList(moveSet1, moveList1);
    addMovesToList(moveSet2, moveList2);
}

function capitalizeWords(str) 
{
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// For search bar
document.getElementById("searchForm").addEventListener("submit", function (event) 
{
    event.preventDefault();
    let query = document.getElementById("searchBarInput").value;
    console.log("Searching for:", query);
});