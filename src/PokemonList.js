import React, {useEffect, useState} from "react"
import "./PokemonList.css"


function PokemonList() {
  const [pokemons, setPokemons] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    const pokemonList = localStorage.getItem("pokemons");
    if (pokemonList) {
      setPokemons(JSON.parse(pokemonList));
    } else {
      fetch("https://pokeapi.co/api/v2/pokemon?limit=700")
        .then((response) => response.json())
        .then(async (data) => {
          const pokemonData = data.results.map((pokemon, index) => ({
            name: pokemon.name,
            globalIndex: index + 1,
            url: pokemon.url,
            types: []
          }));
          await Promise.all(pokemonData.map((pokemon) => (
            fetch(pokemon.url)
              .then((response) => response.json())
              .then((data) => {
                pokemon.types = data.types.map((type) => type.type.name);
              })
          )));

          setPokemons(pokemonData);
          localStorage.setItem('pokemons', JSON.stringify(pokemonData));
        });
    }
  }, []);

  const handleMouseEnter = (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowInfo(true)
  }

  const handleMouseLeave = () => setShowInfo(false)
  const handleSearchInputChange = (event) => setSearchValue(event.target.value)

  const filteredPokemons = pokemons.filter((pokemon) => pokemon.name
    .toLowerCase()
    .includes(searchValue.toLowerCase()))

  return (
    <div className="pokemon-list">
      <div className="search-bar">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
             alt={"poke-ball"}/>
        <input
          type="text"
          placeholder="Search by name"
          value={searchValue}
          onChange={handleSearchInputChange}
        />
      </div>
      {filteredPokemons.map((pokemon) => (
        <div
          key={pokemon.globalIndex}
          className="pokemon-item"
          onMouseEnter={() => handleMouseEnter(pokemon)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="pokemon-name">
            <h2>{pokemon.name}</h2>
          </div>

          <div className="pokemon-image-container">

            <a
              href={`https://pokemon.fandom.com/wiki/${pokemon.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={getPokemonImage(pokemon)}
                alt={pokemon.name}
              />
            </a>

            {showInfo && selectedPokemon === pokemon && (
              <div className="pokemon-info">
                <p>Number: {pokemon.globalIndex}</p>
                <p>Type: {capitalizeString(pokemon.types[0])}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function capitalizeString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getPokemonImage(pokemon) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.globalIndex}.png`
}


export default PokemonList