// Pages
import Index from '../pages/Index.vue';
import Products from '../pages/Products.vue';
import Checkout from '../pages/Checkout.vue';
import Success from '../pages/Success.vue';


const routes = [
  { path: '/', component: Index },
  { path: '/products', component: Products },
  { path: '/checkout', component: Checkout },
  { path: '/success', component: Success },
];

export default routes;
