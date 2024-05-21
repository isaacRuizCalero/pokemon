<template>
    <h1 id="shop-heading">Shop</h1>

    <div v-if="pokeballs.length === 0 || potions.length === 0 || berries.length === 0">
        <img src="../images/pixel-spinning-pokeball.gif" alt="" style="width: 50px; height: 50px;">
    </div>

    <div id="buy-products-container">
        <h2>Buy Products</h2>
        <button type="button" id="buy-button" @click="buyProducts()">Buy</button>
    </div>

    <div class="shop-container">
        <div id="pokeballs-shop-container">
            <h2>Pokeballs</h2>
            <div class="pokeballs-container">
                <div v-for="pokeball in pokeballs" :key="pokeball.name" class="pokeball">
                    <img :src="pokeball.image" alt="pokeball" />
                    <p>{{ pokeball.name }}</p>
                    <div id="select-quantity-container">
                        <button type="button" id="minus-button" @click="decrementQuantity(pokeball)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="black" d="M19 12.998H5v-2h14z"/></svg>
                        </button>
                        <input type="number" v-model="pokeball.quantity" id="quantity-input" min="0" readonly/>
                        <button type="button" id="plus-button" @click="incrementQuantity(pokeball)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="black" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="potions-shop-container">
            <h2>Potions</h2>
            <div class="potions-container">
                <div v-for="potion in potions" :key="potion.name" class="potion">
                    <img :src="potion.image" alt="potion" />
                    <p>{{ potion.name }}</p>
                    <div id="select-quantity-container">
                        <button type="button" id="minus-button" @click="decrementQuantity(potion)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="black" d="M19 12.998H5v-2h14z"/></svg>
                        </button>
                        <input type="number" v-model="potion.quantity" id="quantity-input" min="0" readonly/>
                        <button type="button" id="plus-button" @click="incrementQuantity(potion)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="black" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="berries-shop-container">
            <h2>Berries</h2>
            <div class="berries-container">
                <div v-for="berry in berries" :key="berry.name" class="berry">
                    <img :src="berry.image" alt="berry" />
                    <p>{{ berry.name }}</p>
                    <div id="select-quantity-container">
                        <button type="button" id="minus-button" @click="decrementQuantity(berry)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="black" d="M19 12.998H5v-2h14z"/></svg>
                        </button>
                        <input type="number" v-model="berry.quantity" id="quantity-input" min="0" readonly/>
                        <button type="button" id="plus-button" @click="incrementQuantity(berry)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="black" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
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
                    quantity: '',
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
                    quantity: '',
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
                    quantity: '',
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
        incrementQuantity(item) {
            item.quantity++;
        },
        decrementQuantity(item) {
            if (item.quantity > 0) {
                item.quantity--;
            }
        },

        buyProducts() {
            let total = 0;
            let totalPokeballs = 0;
            let totalPotions = 0;
            let totalBerries = 0;

            this.pokeballs.forEach(pokeball => {
                total += pokeball.quantity;
                totalPokeballs += pokeball.quantity;
                pokeball.quantity = '';
            });

            this.potions.forEach(potion => {
                total += potion.quantity;
                totalPotions += potion.quantity;
                potion.quantity = '';
            });

            this.berries.forEach(berry => {
                total += berry.quantity;
                totalBerries += berry.quantity;
                berry.quantity = '';
            });

            
            alert(`You bought ${totalPokeballs} pokeballs, ${totalPotions} potions, and ${totalBerries} berries!`);

            // this.$emit('inventory-updated', {
            //     pokeballs: this.pokeballs,
            //     potions: this.potions,
            //     berries: this.berries
            // });
        },
    }
};
</script>

<style scoped>
    #shop-heading {
        text-align: center;
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #buy-products-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 15%;
        left: 2%;
        background-color: rgba(0, 166, 0, 0.637);
        padding: 10px;
        border-radius: 10px;
        width: 150px;
        height: 100px;
    }

    #buy-button {
        width: 100px;
        height: 40px;
        background-color: #f3f3f3;
        border: 2px solid rgb(236, 236, 236);
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.2em;
        margin-top: 10px;
    }

    .shop-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        margin: 20px;
        margin-top: 150px;
    }

    .pokeballs-container,
    .potions-container,
    .berries-container {
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

    #select-quantity-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
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

    #minus-button,
    #plus-button {
        width: 30px;
        height: 30px;
        border: none;
        background-color: #d2d2d2;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #minus-button svg,
    #plus-button svg {
        width: 20px;
        height: 20px;
    }
</style>
