import React, {useState, useEffect} from "react"
import "./PokemonList.css"



function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1010")
      .then((response) => response.json())
      /* transform to pokemon data */
      .then((data) => {
        const pokemonData = data.results.map((pokemon, index) => ({
          name: pokemon.name,
          globalIndex: index + 1,
          url: pokemon.url,
        }));

        setPokemons(pokemonData);
      })
  }, []);

  const handleMouseEnter = (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowInfo(true);
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="pokemon-list">
      <div className="search-bar">
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
          <div className="pokemon-image-container">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                pokemon.globalIndex
              }.png`}
              alt={pokemon.name}
            />

            {showInfo && selectedPokemon === pokemon && (
              <a
                href={`https://pokemon.fandom.com/wiki/${pokemon.name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="pokemon-info">
                  <h3>{capitalizeString(pokemon.name)}</h3>
                  <p>Number: {pokemon.globalIndex + 1}</p>
                </div>
              </a>
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

export default PokemonList