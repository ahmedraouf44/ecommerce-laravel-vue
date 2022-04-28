<template>
  <div>
    <h2 class="m-3">Products</h2>

    <div
      class="container-fluid row"
      style="
        background: #444;
        border-radius: 0.5rem;
        margin: auto;
        padding: 25px;
        width: 100vw;
        position: relative;
        margin-left: -50vw;
        left: 50%;
      "
    >
      <div class="col-10 row row-cols-1 row-cols-md-3 g-4">
        <div
          class="col card text-white bg-dark m-3"
          style="max-width: 20rem"
          v-for="product in products"
          v-bind:key="product.id"
        >
          <div class="card-header">
            <div class="row">
              <p class="col-8" style="color: #d38312">{{ product.name }}</p>

              <p class="col-4">
                <button
                  style="
                    float: right;
                    border: 2px solid #d38312;
                    line-height: 12px;
                    padding-bottom: 3px;
                    background: none;
                    color: #fff;
                  "
                  class="productButton"
                  @click="addProductToCart(product)"
                >
                  +
                </button>

                <span style="float: right; color: #ac3768; margin-right: 8px">
                  {{ formatPrice(product.price) }}
                </span>
              </p>
            </div>
          </div>
          <div class="card-body">
            <p class="card-text">{{ product.description }}</p>
          </div>
        </div>
      </div>

      <div
        class="col-2 col offset-10 px-1 bg-dark position-fixed"
        style="text-align: center; color: #fff; border-radius: 10%"
        id="sticky-sidebar"
      >
        <h5 style="text-align: center; margin: revert">
          <div name="fade">
            <p
              class="cartQuantity"
              style="
                background: rgb(211, 131, 18);
                width: 2rem;
                margin: auto;
                text-align: center;
                border-radius: 50%;
              "
            >
              {{ cartQuantity.quantity ? cartQuantity.quantity : cartQuantity }}
            </p>
          </div>
          <div class="mb-2 mt-2" name="fade">
            <span>{{ formatPrice(cartTotal) }} &nbsp</span>

            <span><i class="fa-solid fa-cart-shopping"></i></span>
          </div>

          <div name="fade">
            <router-link to="/checkout">
              <button
                type="button"
                class="btn"
                style="
                  background-image: linear-gradient(to left, #ac3768, #d38312);
                  color: #fff;
                  font-weight: 600;
                "
              >
                CHECKOUT
              </button>
            </router-link>
          </div>
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";

import { computed } from "vue";

import { defineComponent, reactive, toRefs, onBeforeMount } from "vue";

import { useRouter } from "vue-router";
import { formatPrice } from "../../utils/functions";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.vue";
import store1 from "./../../store/index.js";

export default defineComponent({
  components: { LoadingSpinner},
  setup() {
    const store = useStore();
    const router = useRouter();
    var cartQuantity = computed(() => store1.getters.cartQuantity);
    var cartTotal = computed(() => store1.getters.cartTotal);
    const localState = reactive({
      loading: true,
      products: null,
    });

    const placeholderImage = process.env.MIX_PLACEHOLDER_SMALL_IMAGE_URL;

    const fetchProducts = () => {
      localState.products = store.state.products;
      localState.loading = false;
    };

    const addProductToCart = (product) => {
      store.dispatch("addProductToCart", product);
      cartQuantity = computed(() => store1.getters.cartQuantity);
      cartTotal = computed(() => store1.getters.cartTotal);
    };

    onBeforeMount(fetchProducts);

    return {
      ...toRefs(localState),
      cartQuantity,
      cartTotal,
      addProductToCart,
      formatPrice,
      placeholderImage,
    };
  },
});
</script>

<style scoped>
.productButton {
  @apply w-full p-2 mt-4 mb-4 text-lg font-bold text-white bg-blue-700 rounded hover:bg-blue-800;
}
</style>
