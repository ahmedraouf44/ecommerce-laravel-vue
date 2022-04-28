import { createApp } from 'vue';
import store from './store/index';
import router from './router/index';

import Index from './pages/Index.vue';
import Products from './pages/Products.vue';
import Checkout from './pages/Checkout.vue';
import Success from './pages/Success.vue';

require('./bootstrap');

const emptyCart = store.state.products.length === 0;

createApp({
  components: {
    Index,
    Products,
    Checkout,
    Success,
  },
  created() {
    if (emptyCart) {
      store.dispatch('getProductsFromApi');
    }
  },
})
  .use(store)
  .use(router)
  .mount('#app');
