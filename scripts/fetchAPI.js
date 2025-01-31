let grabPokemonAPI = async (pokemonName) =>
{
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    // console.log(data);
    return data;
}

let grabPokemonLocationAPI = async (id) =>
{
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

        function grabEvolutions(chain)
        {
            let evolutionList = [];
        
            let currentStage = [chain];
        
            while (currentStage.length > 0)
             {
                let nextStage = [];
        
                for (let evolution of currentStage)
                {
                    evolutionList.push(evolution.species.name);
        
                    for (let nextEvo of evolution.evolves_to)
                    {
                        nextStage.push(nextEvo);
                    }
                }
        
                currentStage = nextStage; 
            }
            return evolutionList;
        }
        const evolutionChain = grabEvolutions(evolutionData.chain);
        console.log(evolutionChain); 
        return evolutionChain; 
};
export {grabPokemonAPI, grabPokemonLocationAPI, grabEvolutionChainAPI}


