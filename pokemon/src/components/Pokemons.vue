<template>
  <div id="filters-container">
    <div id="favourites-pokemon-filter">
      <input type="checkbox" id="favourites-checkbox" @change="filterFavourites" />
      <label for="favourites-checkbox">Show only favourites</label>
    </div>

    <div id="my-team-pokemon-filter">
      <input type="checkbox" id="my-team-checkbox" @change="filterMyTeam" />
      <label for="my-team-checkbox">Show only my team</label>
    </div>

    <div id="pokemon-types-filter">
      <select id="pokemon-types-select" @change="filterByType">
        <option value="">All types</option>
        <option value="grass">Grass</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="bug">Bug</option>
        <option value="normal">Normal</option>
        <option value="poison">Poison</option>
        <option value="electric">Electric</option>
        <option value="ground">Ground</option>
        <option value="fairy">Fairy</option>
        <option value="fighting">Fighting</option>
        <option value="psychic">Psychic</option>
        <option value="rock">Rock</option>
        <option value="ghost">Ghost</option>
        <option value="ice">Ice</option>
        <option value="dragon">Dragon</option>
        <option value="dark">Dark</option>
        <option value="steel">Steel</option>
        <option value="flying">Flying</option>
      </select>
    </div>

    <div id="sliderFilter">
      <slider-filter @range-updated="updateRange"></slider-filter>
    </div>
  </div>

  <div id="pokemons-cards-container">
    <div v-if="pokemons.length === 0">
      <img src="../images/pixel-spinning-pokeball.gif" alt="" style="width: 50px; height: 50px;">
    </div>

    <div
      v-for="pokemon in filteredPokemons.length > 0 ? filteredPokemons : pokemons"
      :key="pokemon.id"
      :ref="'pokemonCard' + pokemon.id"
      :style="{ backgroundColor: getPokemonCardColor(pokemon.types), boxShadow: isInMyTeam(pokemon.id) ? '0 0 10px 5px #3681d2' : 'none'}"
      class="pokemon-card"
      @click="addToMyTeam(pokemon.id)"
    >
      <div class="pokemon-header">
        <h2 class="pokemon-name">{{ pokemon.name }}
          <button class="favourite-button" 
          :ref="'favouriteButton' + pokemon.id" 
          @click="addFavorite(pokemon.id)" 
          :style="{ opacity: isFavorite(pokemon.id) ? 1 : 0.5, filter: isFavorite(pokemon.id) ? 'drop-shadow(0 0 8px #e2e600)' : 'drop-shadow(none)'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#e2e600" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
          </button>
        </h2>
        <p class="pokemon-id">Number: {{ pokemon.id }}</p>
      </div>
      <img :src="pokemon.img" :alt="pokemon.name" class="pokemon-image" />
      <div class="pokemon-types-container">
        <img
          v-for="type in pokemon.types"
          :key="type.slot"
          :src="getPokemonTypeImage(type.type.name)"
          :alt="type.type.name"
          class="pokemon-type-image"
        />
      </div>
    </div>
  </div>

  <button id="my-team-pill" @click="openMyTeamModal()">
    <h3 id="my-team-heading">Your Team</h3>
  </button>

  <div id="my-team-modal">
    <h2 id="my-team-modal-heading">Your Team</h2>
    <div id="my-team-modal-pokemons"></div>
  </div>
</template>
  
<script>
  import axios from "axios";
  import sliderFilter from "./SliderFilter.vue";
  
  export default {
    components: {
      sliderFilter,
    },

    data() {
      return {
        filteredPokemons: [],
        minRange: 0,
        maxRange: 151,
        pokemons: [],
        typeColors: {
          grass: "#78C850",
          fire: "#F08030",
          water: "#6890F0",
          bug: "#A8B820",
          normal: "#A8A878",
          poison: "#A040A0",
          electric: "#F8D030",
          ground: "#E0C068",
          fairy: "#EE99AC",
          fighting: "#C03028",
          psychic: "#F85888",
          rock: "#B8A038",
          ghost: "#705898",
          ice: "#98D8D8",
          dragon: "#7038F8",
          dark: "#705848",
          steel: "#B8B8D0",
          flying: "#A890F0",
        },

        typeImages: {
            grass: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl0s-d443a3b4-fa4e-47a6-99b4-d2a769785614.png/v1/fill/w_1280,h_1280/grass_type_symbol_galar_by_jormxdos_dffvl0s-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmwwcy1kNDQzYTNiNC1mYTRlLTQ3YTYtOTliNC1kMmE3Njk3ODU2MTQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.6-S1a0_YYhlP6eXW5QqrJk4jtv6b5a3MRuugxqhJ6EA",
            fire: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffqwy2-a24cae67-cfab-4753-ac92-74d30c736bc8.png/v1/fill/w_1280,h_1280,q_80,strp/fire_type_symbol_sinnoh_by_jormxdos_dffqwy2-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmcXd5Mi1hMjRjYWU2Ny1jZmFiLTQ3NTMtYWM5Mi03NGQzMGM3MzZiYzgucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.RgeWCrkZum5icJa59g7U3xySA_Yv2oBA8H_BzPDL018",
            water: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Pok%C3%A9mon_Water_Type_Icon.svg/1024px-Pok%C3%A9mon_Water_Type_Icon.svg.png",
            bug: "https://tiermaker.com/images/templates/all-bug-type-pokemon-15708217/157082171680791519.png",
            normal: "https://media.baamboozle.com/uploads/images/485141/1633381937_31895.jpeg",
            poison: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Pok%C3%A9mon_Poison_Type_Icon.svg/1024px-Pok%C3%A9mon_Poison_Type_Icon.svg.png",
            electric: "https://i.pinimg.com/originals/3c/dd/17/3cdd17306e51b9ff6c0264241e3e4c4c.png",
            ground: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Pok%C3%A9mon_Ground_Type_Icon.svg/1200px-Pok%C3%A9mon_Ground_Type_Icon.svg.png",
            fairy: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pok%C3%A9mon_Fairy_Type_Icon.svg/2048px-Pok%C3%A9mon_Fairy_Type_Icon.svg.png",
            fighting: "https://www.giantbomb.com/a/uploads/scale_medium/16/164924/3129073-3687239775-tumbl.png",
            psychic: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Pok%C3%A9mon_Psychic_Type_Icon.svg/1200px-Pok%C3%A9mon_Psychic_Type_Icon.svg.png",
            rock: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Pok%C3%A9mon_Rock_Type_Icon.svg/800px-Pok%C3%A9mon_Rock_Type_Icon.svg.png",
            ghost: "https://d2bzx2vuetkzse.cloudfront.net/fit-in/0x450/unshoppable_producs/43a121c2-5536-4a99-ac25-6163a8aae377.jpeg",
            ice: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Pok%C3%A9mon_Ice_Type_Icon.svg/768px-Pok%C3%A9mon_Ice_Type_Icon.svg.png",
            dragon: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/77bf3ba9-0aac-4452-be82-de536b5aab32/dezrx0m-156163e8-ce81-471d-b174-a1bf9c1b9923.png/v1/fill/w_1280,h_1278/dragon_energy_card_vector_symbol_by_biochao_dezrx0m-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI3OCIsInBhdGgiOiJcL2ZcLzc3YmYzYmE5LTBhYWMtNDQ1Mi1iZTgyLWRlNTM2YjVhYWIzMlwvZGV6cngwbS0xNTYxNjNlOC1jZTgxLTQ3MWQtYjE3NC1hMWJmOWMxYjk5MjMucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.jPsLEUZe3sHZn4Z8UCRfVvt_YGc1CCHM3CaLdeIzPn0",
            dark: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Pok%C3%A9mon_Dark_Type_Icon.svg/768px-Pok%C3%A9mon_Dark_Type_Icon.svg.png",
            steel: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/77bf3ba9-0aac-4452-be82-de536b5aab32/dezrx4z-608133ef-0158-48f9-8786-b8a39fd7e97f.png/v1/fill/w_1280,h_1277/steel_energy_card_vector_symbol_by_biochao_dezrx4z-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI3NyIsInBhdGgiOiJcL2ZcLzc3YmYzYmE5LTBhYWMtNDQ1Mi1iZTgyLWRlNTM2YjVhYWIzMlwvZGV6cng0ei02MDgxMzNlZi0wMTU4LTQ4ZjktODc4Ni1iOGEzOWZkN2U5N2YucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.HnQnbDYdY8dawx4dRmwVyYcjTXes-fA7zKEwHyo0wyo",
            flying: "https://d2bzx2vuetkzse.cloudfront.net/unshoppable_producs/bb0122dd-02be-4b95-802e-9f25293e29e4.jpeg",
        }
      };
    },
  
    created() {
      let promises = [];
      for (let i = 1; i <= 151; i++) {
        promises.push(
          axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`).then((response) => {
            return {
              name: response.data.name,
              img: response.data.sprites.front_default,
              id: response.data.id,
              types: response.data.types,
            };
          })
        );
      }
  
      Promise.all(promises)
        .then((results) => {
          this.pokemons = results.sort((a, b) => a.id - b.id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  
    methods: {
      getPokemonCardColor(types) {
          const mainType = types[0].type.name;
          return this.typeColors[mainType] || "#FFFFFF";
      },

      getPokemonTypeImage(type) {
          return this.typeImages[type] || type.name;
      },

      isFavorite(pokemonId) {
        const favoritePokemons = JSON.parse(localStorage.getItem("favoritePokemons")) || [];
        return favoritePokemons.includes(pokemonId);
      },

      addFavorite(pokemonId) {
        const favoritePokemons = JSON.parse(localStorage.getItem("favoritePokemons")) || [];
        const buttonRef = this.$refs[`favouriteButton${pokemonId}`][0];

        if (favoritePokemons.includes(pokemonId)) {
          const index = favoritePokemons.indexOf(pokemonId);
          favoritePokemons.splice(index, 1);
          buttonRef.style.opacity = 0.5;
          buttonRef.style.transition = "0.5s";
          console.log("The pokemon " + pokemonId + " has been removed from favorites");
        } else {
          favoritePokemons.push(pokemonId);
          buttonRef.style.opacity = 1;
          buttonRef.style.filter = "drop-shadow(0 0 5px #e2e600)";
          buttonRef.style.transition = "0.5s";
          console.log("The pokemon " + pokemonId + " has been added to favorites");
        }
        localStorage.setItem("favoritePokemons", JSON.stringify(favoritePokemons));
      },

      openMyTeamModal() {
        const myTeamModal = document.getElementById("my-team-modal");
        if (myTeamModal.style.display === "none" || myTeamModal.style.display === "") {
          myTeamModal.style.display = "flex";
        } else {
          myTeamModal.style.display = "none";
        }
        this.updateMyTeamModal();
      },


      isInMyTeam(pokemonId) {
        const myTeam = JSON.parse(localStorage.getItem("myTeam")) || [];
        return myTeam.includes(pokemonId);
      },

      addToMyTeam(pokemonId) {
        const myTeam = JSON.parse(localStorage.getItem("myTeam")) || [];
        let pokemonCard = this.$refs[`pokemonCard${pokemonId}`][0];

        if (myTeam.includes(pokemonId)) {
          const index = myTeam.indexOf(pokemonId);
          myTeam.splice(index, 1);
          pokemonCard.style.boxShadow = "none";
          console.log("The pokemon " + pokemonId + " has been removed from your team");
        } else {
          if (myTeam.length >= 6) {
            alert("You can only have up to 6 Pokémon in your team.");
            return;
          }
          myTeam.push(pokemonId);
          pokemonCard.style.boxShadow = "0 0 10px 5px #3681d2";
          console.log("The pokemon " + pokemonId + " has been added to your team");
        }

        localStorage.setItem("myTeam", JSON.stringify(myTeam));
        this.updateMyTeamModal();
      },

      updateMyTeamModal() {
        const myTeam = JSON.parse(localStorage.getItem("myTeam")) || [];
        const myTeamModalPokemons = document.getElementById("my-team-modal-pokemons");
        myTeamModalPokemons.innerHTML = "";

        if (myTeam.length === 0) {
          myTeamModalPokemons.innerHTML = "<p>Your Team is empty</p>";
        } else {
          myTeam.forEach(pokemonId => {
            const pokemon = this.pokemons.find(p => p.id === pokemonId);
            const pokemonElement = document.createElement("div");
            pokemonElement.classList.add("pokemon-in-team");
            pokemonElement.innerHTML = `
              <img src="${pokemon.img}" alt="${pokemon.name}" class="pokemon-image-in-team" />
            `;
            myTeamModalPokemons.appendChild(pokemonElement);
          });
        }
      },

      filterFavourites() {
        let favouriteCheckbox = document.getElementById("favourites-checkbox")
        const favouritePokemons = JSON.parse(localStorage.getItem("favoritePokemons")) || [];
        if (favouritePokemons.length === 0) {
          alert("You don't have any favourite Pokémon yet.");
          return;
        }

        if (favouriteCheckbox.checked) {
          this.pokemons.forEach(pokemon => {
            const pokemonCard = this.$refs[`pokemonCard${pokemon.id}`][0];
            if (favouritePokemons.includes(pokemon.id)) {
              pokemonCard.style.display = "flex";
            } else {
              pokemonCard.style.display = "none";
            }
          });
        } else {
          this.pokemons.forEach(pokemon => {
            const pokemonCard = this.$refs[`pokemonCard${pokemon.id}`][0];
            pokemonCard.style.display = "flex";
          });
        }
      },  

      filterMyTeam() {
        let myTeamCheckbox = document.getElementById("my-team-checkbox")
        const myTeam = JSON.parse(localStorage.getItem("myTeam")) || [];
        if (myTeam.length === 0) {
          alert("You don't have any Pokémon in your team yet.");
          return;
        }

        if (myTeamCheckbox.checked) {
          this.pokemons.forEach(pokemon => {
            const pokemonCard = this.$refs[`pokemonCard${pokemon.id}`][0];
            if (myTeam.includes(pokemon.id)) {
              pokemonCard.style.display = "flex";
            } else {
              pokemonCard.style.display = "none";
            }
          });
        } else {
          this.pokemons.forEach(pokemon => {
            const pokemonCard = this.$refs[`pokemonCard${pokemon.id}`][0];
            pokemonCard.style.display = "flex";
          });
        }
      },

      filterByType() {
        let typeSelect = document.getElementById("pokemon-types-select");
        let selectedType = typeSelect.value;

        if (selectedType === "") {
          this.pokemons.forEach(pokemon => {
            const pokemonCard = this.$refs[`pokemonCard${pokemon.id}`][0];
            pokemonCard.style.display = "flex";
          });
        } else {
          this.pokemons.forEach(pokemon => {
            const pokemonCard = this.$refs[`pokemonCard${pokemon.id}`][0];
            const pokemonTypes = pokemon.types.map(type => type.type.name);
            if (pokemonTypes.includes(selectedType)) {
              pokemonCard.style.display = "flex";
            } else {
              pokemonCard.style.display = "none";
            }
          });
        }
      },  

      updateRange(range) {
        this.minRange = range.min;
        this.maxRange = range.max;
        this.filterPokemons();
      },

      filterPokemons() {
        this.filteredPokemons = this.pokemons.filter(pokemon =>
          pokemon.id >= this.minRange && pokemon.id <= this.maxRange
        );
        console.log('this.filteredPokemons', this.filteredPokemons);
      },

      },
  };
  </script>
  
<style scoped>
    #filters-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 20px;
        justify-content: center;
        top: 25%;
        left: 2%;
        width: 15%;
        min-height: 200px;
        padding: 20px;
        border-radius: 15px;
        background-color: rgba(255, 0, 0, 0.623);
        backdrop-filter: blur(10px);
    }

    .filter-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }

    select {
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 100%;
    }

    slider-filter {
      width: 100%;
    }

    #pokemons-cards-container {
      display: flex;
      flex-wrap: wrap;
      width: 75%;
      position: absolute;
      top: 0;
      right: 2%;
      justify-content: center;
      align-items: flex-start;
      margin-top: 100px;
      padding-top: 0;
      padding-bottom: 100px;
    }

    .pokemon-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid rgb(236, 236, 236);
        border-radius: 10px;
        margin: 10px;
        padding: 10px;
        width: 150px;
        height: 250px;
        background-color: #f3f3f3;
        transition: 0.7s;
    }

    .pokemon-card:hover {
        transform: perspective(6.5cm) rotatex(5deg) rotatey(-5deg) scale(1.1);
        transition: 0.3s;
    }

    .pokemon-header {
        text-align: center;
        margin-bottom: 10px;
        color: rgb(255, 255, 255);
        width: 105%;
    }

    .pokemon-name {
      margin: 0;
      font-size: 1.2em;
      font-weight: 600;
      height: 70%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .favourite-button {
      background-color: transparent;
      border: none;
      cursor: pointer;
      filter: drop-shadow(none);
      opacity: 0.5;
    }

    .pokemon-id {
        margin: 5px 0;
        font-size: 0.8em;
    }

    .pokemon-image {
        width: 120px;
        height: 120px;
        margin-bottom: 10px;
    }

    .pokemon-types-container {
        display: flex;
        justify-content: center;
    }

    .pokemon-type-image {
        width: 30px;
        height: 30px;
        margin: 0 5px;
        border-radius: 50%;
        border: 2px solid #242424;
    }

    #my-team-pill {
        position: fixed;
        bottom: 10px;
        left: 45%;
        width: 200px;
        height: 60px;
        display: flex;
        justify-content: center;
        background-color: #3681d29c;
        backdrop-filter: blur(10px);
        border: 3px solid #3681d2;
        border-radius: 50px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: 0.7s
    }

    #my-team-pill:hover {
        background-color: #3681d2;
        transform: scale(1.05);
        transition: 0.3s;
    }

    #my-team-heading {
        color: #a5cefa;
        font-size: 26px;
        font-weight: 600;
    }

    #my-team-modal {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 150px;
        background-color: #3681d2c6;
        backdrop-filter: blur(10px);
        border: 3px solid #3681d2;
        border-radius: 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 999;
        display: none;
    }

    #my-team-modal-pokemons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      flex-direction: row;
    }
</style>