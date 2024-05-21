<template>
  <main>
    <nav id="navbar-container">
      <img src="./images/International_Pokémon_logo.svg.png" alt="Pokemon Logo" id="pokemon-logo">
      <router-link to="/pokemons"><button>Pokemons</button></router-link>
      <router-link to="/inventory"><button>Inventory</button></router-link>
      <router-link to="/shop"><button>Shop</button></router-link>
    </nav>
    <router-view></router-view>
  </main>
</template>

<style scoped>
#navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  background-color: #3681d2;
  padding: 10px;
  z-index: 999;
}

#pokemon-logo {
  margin-right: auto;
  cursor: pointer;
}

button {
  margin-left: 10px;
  padding: 10px;
  background-color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #ddd;
}
</style>
