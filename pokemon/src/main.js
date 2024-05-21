import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import sliderFilter from './components/SliderFilter.vue'
import shop from './components/Shop.vue'

createApp(App).use(router).mount('#app');
createApp(sliderFilter).mount('#sliderFilter')
createApp(shop).mount('#shop')