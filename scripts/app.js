import {grabPokemonAPI, grabPokemonLocationAPI, grabEvolutionChainAPI} from "./fetchAPI.js"

let ability1 = document.getElementById("ability1")
let ability2 = document.getElementById("ability2")
let ability3 = document.getElementById("ability3")

let favoritesButton = document.getElementById("favoritesButton")
let searchBarButton = document.getElementById("searchBarButton")
let searchBarInput = document.getElementById("searchBarInput")
let shinyToggleButton = document.getElementById("shinyToggleButton");
let randomButton = document.getElementById("randomButton");

let pokeIndexNum = document.getElementById("pokeIndexNum")
let pokemonImage = document.getElementById("pokemonImage")
let pokemonName = document.getElementById("pokemonName")

let eve1png = document.getElementById("eve1png")
let eve1 = document.getElementById("eve1")

let eve2png = document.getElementById("eve2png")
let eve2 = document.getElementById("eve2")

let typeList1 = document.getElementById("typeList1")
let typeList2 = document.getElementById("typeList2")

favoritesButton.addEventListener

// Variables
// let userInput = "";
let pokemon = [];
let isShiny = false;

randomButton.addEventListener("click", async () => 
{
    let randomId = Math.floor(Math.random() * 649) + 1; // Generate random ID (1-649)

        // Fetch Pokémon data
        pokemon = await grabPokemonAPI(randomId);        

        console.log(`Random Pokémon ID: ${randomId}`, pokemon);

        let evolutionChain = await grabEvolutionChainAPI(randomId);
        console.log("Evolution Chain:", evolutionChain);

        await grabPokemonLocationAPI(randomId);

        // Update UI
        updatePokemonDisplay(pokemon);
        updateEvolutionUI(evolutionChain, pokemon);
});
// ---------------------------------- Search Button ----------------------------------
searchBarButton.addEventListener("click", async () =>
{
    let searchedPokemon = searchBarInput.value.trim().toLowerCase(); 
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


    updatePokemonDisplay(pokemon);
    updateEvolutionUI(evolutionChain, pokemon);
    await grabPokemonLocationAPI(pokemon.id); 
        //-------------------------- DOM Updates --------------------------
    // pokemonName.innerText = `${pokemon.species.name}`;
    // pokeIndexNum.innerText = `#${pokemon.id}`;
    // pokemonImage.src = pokemon.sprites.other["official-artwork"].front_default;
    // displayPokemonMoves(pokemon.moves);
    // await grabPokemonLocationAPI(pokemon.id); 
    
    // // Get Types 
    // let types = pokemon.types;

    // if (types.length === 1)
    // {
    //     typeList1.innerText = `${pokemon.types[0].type.name}`;
    //     typeList2.innerText = "";
    // }
    // else
    // {
    //     typeList1.innerText = `${pokemon.types[0].type.name}`;
    //     typeList2.innerText = `${pokemon.types[1].type.name}`;
    //     typeList1.parentElement.classList.add("flex", "gap-10");
    // }

    // // Get abilities
    // let abilities = pokemon.abilities;

    // switch (abilities.length) 
    // {
    //     case 3:
    //         ability1.innerText = abilities[0].ability.name;
    //         ability2.innerText = abilities[1].ability.name;
    //         ability3.innerText = abilities[2].ability.name;
    //         break;

    //     case 2:
    //         ability1.innerText = abilities[0].ability.name;
    //         ability2.innerText = abilities[1].ability.name;
    //         ability3.style.display = "none";
    //         break;

    //     case 1:
    //         ability1.innerText = abilities[0].ability.name;
    //         ability2.style.display = "none"; 
    //         ability3.style.display = "none"; 
    //         break;

    //     default:
    //         ability1.innerText = "This Pokémon has no abilities";
    //         ability2.style.display = "none";
    //         ability3.style.display = "none";
    //         break;
    // }
    // updateEvolutionUI(evolutionChain, searchedPokemon);
});
// Search bar 
searchBarInput.addEventListener("click", async () =>
{
    userInput = searchBarInput.value;
    console.log(userInput);
});

//----------------------- favorites from localStorage -----------------------
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

favoritesButton.addEventListener("click", () => 
{
    if (!pokemon || !pokemon.species) 
    {
        return;
    }

    let favoritePokemon = 
    {
        name: pokemon.species.name,
        id: pokemon.id,
        image: pokemon.sprites.other["official-artwork"].front_default
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

// -------------------------------------- Main UI Update --------------------------------------
function updatePokemonDisplay(pokemon) 
{
    // Shiny
    let normalSprite = pokemon.sprites.other["official-artwork"].front_default;
    let shinySprite = pokemon.sprites.other["official-artwork"].front_shiny;

    pokemonImage.src = isShiny ? shinySprite : normalSprite; // tenerim shiny toggle

    shinyToggleButton.onclick = () => 
    {
        isShiny = !isShiny; 
        pokemonImage.src = isShiny ? shinySprite : normalSprite;
        shinyToggleButton.innerText = isShiny ? "Show Normal" : "Show Shiny";
    };

    // Update Poke 
    pokemonName.innerText = capitalizeWords(pokemon.species.name);
    pokeIndexNum.innerText = `#${pokemon.id}`;

    // Update Types
    function applyBackgroundOpacity(hex, opacity) // for background opacity
    {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Get Pokémon types
    let types = pokemon.types.map(t => t.type.name.toLowerCase());

    typeList1.className = "type";
    typeList2.className = "type";

    // Type Colors
    const typeColors = 
    {
        normal: {bg: "#A8A77A", text: "#FFFFFF"},
        fire: {bg: "#EE8130", text: "#FFFFFF"},
        water: { bg: "#6390F0", text: "#FFFFFF" },
        electric: { bg: "#F7D02C", text: "#000000" },
        grass: { bg: "#7AC74C", text: "#FFFFFF" },
        ice: { bg: "#96D9D6", text: "#000000" },
        fighting: { bg: "#C22E28", text: "#FFFFFF" },
        poison: { bg: "#A33EA1", text: "#FFFFFF" },
        ground: { bg: "#E2BF65", text: "#000000" },
        flying: { bg: "#A98FF3", text: "#000000" },
        psychic: { bg: "#F95587", text: "#FFFFFF" },
        bug: { bg: "#A6B91A", text: "#FFFFFF" },
        rock: { bg: "#B6A136", text: "#FFFFFF" },
        ghost: { bg: "#735797", text: "#FFFFFF" },
        dragon: { bg: "#6F35FC", text: "#FFFFFF" },
        dark: { bg: "#705746", text: "#FFFFFF" },
        steel: { bg: "#B7B7CE", text: "#000000" },
        fairy: { bg: "#D685AD", text: "#000000" },
    };
    let containers = document.querySelectorAll(".container");

    
    let primaryTypeColor = typeColors[types[0]]?.bg || "#a8c1ea"; // Default color
    let transparentBackground = applyBackgroundOpacity(primaryTypeColor, 0.7);

    containers.forEach(container => 
    {
        container.style.backgroundColor = transparentBackground;
    });

    // Apply the first type color ONLY
    if (types.length > 0) 
    {
        let { bg, text } = typeColors[types[0]] || { bg: "#000000", text: "#FFFFFF" };
        typeList1.innerText = capitalizeWords(types[0]);
        typeList1.style.backgroundColor = bg;
        typeList1.style.color = text;
    }
    
    if (types.length > 1) 
    {
        let {bg, text} = typeColors[types[1]] || {bg: "#000000", text: "#FFFFFF"};

        typeList2.innerText = capitalizeWords(types[1]);
        typeList2.style.backgroundColor = bg;
        typeList2.style.color = text;
        typeList2.style.display = "inline-block"; 

        typeList1.parentElement.classList.add("flex", "gap-10");
    } else 
    {
        typeList2.innerText = ""; 
        typeList2.style.display = "none"; 
    }

    // Update Abilities
    let abilities = pokemon.abilities;
    ability1.innerText = abilities.length > 0 ? capitalizeWords(abilities[0].ability.name) : "No abilities";
    ability2.innerText = abilities.length > 1 ? capitalizeWords(abilities[1].ability.name) : "";
    ability3.innerText = abilities.length > 2 ? capitalizeWords(abilities[2].ability.name) : "";

    ability2.style.display = abilities.length > 1 ? "block" : "none";
    ability3.style.display = abilities.length > 2 ? "block" : "none";

    // Evo Chain
    grabEvolutionChainAPI(pokemon.id).then(evolutionChain => 
    {
        updateEvolutionUI(evolutionChain, pokemon.species.name);
    });

    displayPokemonMoves(pokemon.moves);
}

async function updateEvolutionUI(evolutionChain, searchedPokemon) 
{
    eve1.innerText = "";
    eve2.innerText = "";
    eve1png.src = "";
    eve2png.src = "";

    // No evolution data is available
    if (!evolutionChain || evolutionChain.length === 0) 
    {
        eve1.innerText = "NA";
        eve1png.style.display = "none";
        eve2.innerText = "";
        eve2png.style.display = "none";
        return;
    }

    let evoChainFilter = evolutionChain.filter(name => typeof name === "string" && name.toLowerCase() !== searchedPokemon.toLowerCase());

    // Fetch data for the first evolution Pokémon
    if (evoChainFilter.length > 0) 
    {
        const pokemon1 = await grabPokemonAPI(evoChainFilter[0]); 
        eve1.innerText = capitalizeWords(evoChainFilter[0]);
        eve1png.src = pokemon1.sprites.other["official-artwork"].front_default; 
        eve1png.style.display = "block";
        // eve1.parentElement.classList.add("flex", "justify-center", "items-center", "flex-col");
    } else 
    {
        eve1.innerText = "";
        eve1png.style.display = "none";
    }

    // Fetch data for the second evolution Pokémon
    if (evoChainFilter.length > 1) 
    {
        const pokemon2 = await grabPokemonAPI(evoChainFilter[1]); 
        eve2.innerText = capitalizeWords(evoChainFilter[1]);
        eve2png.src = pokemon2.sprites.other["official-artwork"].front_default; 
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