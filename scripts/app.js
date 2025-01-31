import {grabPokemonAPI, grabPokemonLocationAPI, grabEvolutionChainAPI} from "./fetchAPI.js"

let ability1 = document.getElementById("ability1")
let ability2 = document.getElementById("ability2")
let ability3 = document.getElementById("ability3")

let favoritesButton = document.getElementById("favoritesButton")
let searchBarButton = document.getElementById("searchBarButton")
let searchBarInput = document.getElementById("searchBarInput")
let testButton = document.getElementById("testButton")

let pokeIndexNum = document.getElementById("pokeIndexNum")
let pokemonImage = document.getElementById("pokemonImage")
let pokemonName = document.getElementById("pokemonName")
let pokeLoction = document.getElementById("pokeLoction")

let eve1png = document.getElementById("eve1png")
let eve1 = document.getElementById("eve1")

let eve2png = document.getElementById("eve2png")
let eve2 = document.getElementById("eve2")

let typeList1 = document.getElementById("typeList1")
let typeList2 = document.getElementById("typeList2")

let moveList = document.getElementById("moveList")

favoritesButton.addEventListener

// Variables
let userInput = "";
let pokemon = [];
let evo = [];

// UI Change
searchBarButton.addEventListener("click", async () =>
{
    let searchedPokemon = searchBarInput.value.trim().toLowerCase().toUpperCase(); 
    pokemon = await grabPokemonAPI(searchedPokemon);
    console.log(searchedPokemon);
    
    let evolutionChain = await grabEvolutionChainAPI(searchedPokemon);
    console.log("Evolution Chain:", evolutionChain);

    let gen = pokemon.id

    if (gen > 649) // Validation
    {
        alert("Please enter a pokemon from gen 1-5 (1-649)")
    }
        //---------------------------------------------------------------- DOM Updates ----------------------------------------------------------------
        
        // Id Updates
        pokemonName.innerText = `${pokemon.species.name}`;
        pokeIndexNum.innerText = `#${pokemon.id}`;
        pokemonImage.src = `${pokemon.sprites.front_default}`;
        displayPokemonMoves(pokemon.moves);
        await grabPokemonLocationAPI(pokemon.id); 
        

        // add background change on type
        // // updateEvolutionUI(evolutionChain); For dynamic background

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
});

searchBarInput.addEventListener("click", async () =>
{
    userInput = searchBarInput.value;
    console.log(userInput);
});

// -------------------------------------------------------------- functions --------------------------------------------------------------

function updateEvolutionUI(evolutionChain) 
{
    // Check if evolution data exists before updating UI
    if (evolutionChain.length >= 1) {
        eve1.innerText = evolutionChain[0]; // First evolution name
        eve1png.src = `https://img.pokemondb.net/sprites/home/normal/${evolutionChain[0]}.png`; // First evolution image
        eve1png.style.display = "block"; // Ensure visibility
    } else {
        eve1.innerText = "";
        eve1png.style.display = "none"; // Hide if no data
    }

    if (evolutionChain.length >= 2) {
        eve2.innerText = evolutionChain[1]; // Second evolution name
        eve2png.src = `https://img.pokemondb.net/sprites/home/normal/${evolutionChain[1]}.png`; // Second evolution image
        eve2png.style.display = "block"; // Ensure visibility
    } else {
        eve2.innerText = "";
        eve2png.style.display = "none"; // Hide if no data
    }
}


function displayPokemonMoves(moves) 
{
    moveList1.innerHTML = "";
    moveList2.innerHTML = "";
    moveList3.innerHTML = "";

    let moveNames = moves.map(move => move.move.name);

    let moveSet1 = moveNames.slice(0, 83);
    let moveSet2 = moveNames.slice(83, 166);
    let moveSet3 = moveNames.slice(166, 249);

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
    addMovesToList(moveSet3, moveList3);
}

function capitalizeWords(str) 
{
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// async function getEvolutionChain(pokemonName) 
// {
//     const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
//     const speciesData = await speciesResponse.json();

//     const evolutionUrl = speciesData.evolution_chain.url;

//     const evolutionResponse = await fetch(evolutionUrl);
//     const evolutionData = await evolutionResponse.json();

//     function extractEvolutions(chain) 
//     {
//         return chain
//             ? [chain.species.name, ...(chain.evolves_to.length ? extractEvolutions(chain.evolves_to[0]) : [])]
//             : [];
//     }

//     const evolutionList = extractEvolutions(evolutionData.chain);
    
//     console.log("Evolution Chain:", evolutionList);
//     return evolutionList;
// }

// // Example usage
// getEvolutionChain("bulbasaur").then(chain => console.log("Evolution Order:", chain));

// // Example usage
// getEvolutionChain("bulbasaur").then(chain => console.log("Evolution Order:", chain));

// For search bar
document.getElementById("searchForm").addEventListener("submit", function (event) 
{
    event.preventDefault();
    let query = document.getElementById("searchBarInput").value;
    console.log("Searching for:", query);
});