let grabPokemonAPI = async (pokemonName) =>
{
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    // console.log(data);
    return data;
}

// let grabEvolveAPI = async (id) =>
// {
//     const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/`)
//     const data = await response.json();
//     // console.log(data);
//     return data;
// }

let grabPokemonLocationAPI = async (id) =>{
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`)
    const data = await promise.json()
    // console.log(data)

    if (data.length === 0)
    {
        pokeLoction.innerText = "This Pokemon cannot be caught in the wild!"
    }
    else
    {
        pokeLoction.innerText = data[0].location_area.name
    }
}

let grabEvolutionChainAPI = async (pokemonName) =>
{
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
    const speciesData = await speciesResponse.json();

    const evolutionUrl = speciesData.evolution_chain.url;

    const evolutionResponse = await fetch(evolutionUrl);
    const evolutionData = await evolutionResponse.json();

    function extractEvolutions(chain) 
    {
        if (!chain)
        {
            return []; 
        } 

        let evolutionList = [chain.species.name]; 
    
        if (chain.evolves_to.length > 0) 
        {
            let nextEvolution = extractEvolutions(chain.evolves_to[0]); // Get the next evolution
            evolutionList = evolutionList.concat(nextEvolution); // Add it to the list
        }
        return extractEvolutions(evolutionData.chain);
    }
}



// Evolve test
// let testApi = async (id) =>
//     {
//         const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/venusaur`)
//         const data = await response.json();
//         console.log( data.evolves_from_species);
//         return data;

//         // if statement 
//     }
//     testApi();

//     let testEvoChain = async (id) =>
//         {
//             const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/1/`)
//             const data = await response.json();
//             console.log(data);
//             console.log(data)
//             return data;
//         }
//         testEvoChain();

// let getEvolveChain = async (id) =>
// {
//     const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/1/`)
//         const data = await response.json();
//         console.log("This is Chain" + data);
//         return data;
// }
// getEvolveChain();

// species into evo chain into into evol details for next is baby to former



export {grabPokemonAPI, grabPokemonLocationAPI, grabEvolutionChainAPI}


