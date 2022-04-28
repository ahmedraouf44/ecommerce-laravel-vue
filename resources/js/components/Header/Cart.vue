<template>
  
    <transition name="fade">
      <p class="cartQuantity" 
      style="background: rgb(211, 131, 18);
    width: 2rem;
    margin: auto;
    text-align: center;
    border-radius: 50%;">{{ cartQuantity.quantity ? cartQuantity.quantity : cartQuantity }}</p>
      
    </transition>
    <transition name="fade">
      <div v-if="cartQuantity">
        

        
          
          <span>{{ formatPrice(cartTotal) }}</span>
        

        <span
        v-if="cartQuantity"
        class="text-xl text-white no-underline lg:text-black is-active"
      >
        
          <img
            alt="Cart icon"
            class="h-12 ml-4 lg:ml-2"
            aria-label="Cart"
            src="../../../img/svg/Cart.svg"
          >
        
      </span>
      </div>
    </transition>

    <transition name="fade">
      
      <router-link to="/checkout">
          
          <span>CHECKOUT</span>
        </router-link>
    </transition>
  
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { formatPrice } from '../../utils/functions';

export default {
  setup() {
    const store = useStore();
    const cartQuantity = computed(() => store.getters.cartQuantity);
    const cartTotal = computed(() => store.getters.cartTotal);
// console.log(store.getters);
    return { cartQuantity, cartTotal, formatPrice };
  },
};
</script>

<style scoped>
.cartQuantity {
  @apply absolute w-6 h-6 pb-2 ml-16 -mt-12 text-center text-white bg-black rounded-full lg:ml-14;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
