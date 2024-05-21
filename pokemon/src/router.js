// router.js
import { createRouter, createWebHistory } from 'vue-router';
import Pokemons from './components/Pokemons.vue';
import Inventory from './components/Inventory.vue';
import Shop from './components/Shop.vue';

const routes = [
  { path: '/', redirect: '/pokemons' },
  { path: '/pokemons', component: Pokemons },
  { path: '/inventory', component: Inventory },
  { path: '/shop', component: Shop },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
