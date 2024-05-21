<template>
    <h1 id="inventory-heading">Inventory</h1>

    <div id="inventory-elements">
        <div id="pokeballs-inventory-container">
            <h2>Pokeballs</h2>
            <div id="pokeballs-container">
                <div v-for="pokeball in pokeballs" :key="pokeball.name" class="pokeball">
                    <img :src="pokeball.image" alt="pokeball" />
                    <p>{{ pokeball.name }}</p>
                    <input type="number" v-model="pokeball.quantity" id="quantity-input" min="3" max="15" readonly/>
                    <div class="use-consumible-button-container">
                        <button type="button" @click="useConsumible(pokeball)" id="use-consumible-button">Use</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="potions-shop-container">
            <h2>Potions</h2>
            <div id="potions-container">
                <div v-for="potion in potions" :key="potion.name" class="potion">
                    <img :src="potion.image" alt="potion" />
                    <p>{{ potion.name }}</p>
                    <input type="number" v-model="potion.quantity" id="quantity-input" min="3" max="5" readonly/>
                    <div class="use-consumible-button-container">
                        <button type="button" @click="useConsumible(potion)" id="use-consumible-button">Use</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="berries-shop-container">
            <h2>Berries</h2>
            <div id="berries-container">
                <div v-for="berry in berries" :key="berry.name" class="berry">
                    <img :src="berry.image" alt="berry" />
                    <p>{{ berry.name }}</p>
                    <input type="number" v-model="berry.quantity" id="quantity-input" min="3" max="5" readonly/>
                    <div class="use-consumible-button-container">
                        <button type="button" @click="useConsumible(berry)" id="use-consumible-button">Use</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- <shop></shop> -->
</template>
<script>
import axios from 'axios';
import shop from './Shop.vue';

export default {
    components: {
        shop
    },

    data() {
        return {
            pokeballs: [],
            potions: [],
            berries: []
        };
    },
    created() {
        let promises = [];

        for (let i = 1; i <= 4; i++) {
            promises.push(
            axios.get(`https://pokeapi.co/api/v2/item/${i}`).then(response => {
                this.pokeballs.push({
                    name: response.data.name,
                    image: response.data.sprites.default,
                    quantity: 5,
                });
            })
            );
        }

        for (let i = 23; i <= 26; i++) {
            promises.push(
            axios.get(`https://pokeapi.co/api/v2/item/${i}`).then(response => {
                this.potions.push({
                    name: response.data.name,
                    image: response.data.sprites.default,
                    quantity: 5,
                });
            })
            );
        }

        for (let i = 126; i <= 140; i++) {
            promises.push(
            axios.get(`https://pokeapi.co/api/v2/item/${i}`).then(response => {
                this.berries.push({
                    name: response.data.name,
                    image: response.data.sprites.default,
                    quantity: 5,
                });
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
        useConsumible(consumible) {
            if (consumible.quantity > 3) {
                consumible.quantity--;
            }
        }
    }
}
</script>
<style scoped>
    #inventory-heading {
        text-align: center;
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #inventory-elements {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        margin: 20px;
        margin-top: 150px;
    }

    #pokeballs-container,
    #potions-container,
    #berries-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    }

    .pokeball,
    .potion,
    .berry {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid rgb(236, 236, 236);
        border-radius: 10px;
        padding: 10px;
        margin: 10px;
        width: 150px;
        height: 250px;
        background-color: #f3f3f3;
        transition: 0.7s;
        color: #000;
    }

    .pokeball:hover,
    .potion:hover,
    .berry:hover {
        transform: scale(1.05);
        transition: 0.3s;
    }

    .pokeball img,
    .potion img,
    .berry img {
        width: 120px;
        height: 120px;
        margin-bottom: 10px;
    }

    .pokeball p,
    .potion p,
    .berry p {
        text-align: center;
        margin: 0;
        font-size: 1.2em;
        font-weight: 600;
    }

    #quantity-input {
        width: 50px;
        height: 40px;
        text-align: center;
        font-size: 1.2em;
        border: 2px solid rgb(236, 236, 236);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .use-consumible-button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }

    #use-consumible-button {
        padding: 10px;
        background-color: #3681d2;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    
</style>