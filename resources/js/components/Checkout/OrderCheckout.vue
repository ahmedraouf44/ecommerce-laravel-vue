<template>
  <div>
    <h1 class="h-10 p-6 text-4xl font-bold text-center">Checkout</h1>
    <section class="mt-10">
      <div v-if="orderError" class="h-10 p-4">
        <span class="text-lg text-center text-red-500"
          >Error during order. Please retry</span
        >
      </div>

      <table v-if="cartLength" class="table table-dark table-bordered" style="text-align: center">
        <thead>
          <tr>
            <th scope="col">Remove</th>
            <th scope="col">Item</th>
            <th scope="col">Unit Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Line Total</th>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="products in cartContent" :key="products.id">
            <th>
              <a tabindex="0" @click="removeProductFromCart(products)">
             <span :class="{ removing: localState.removingCartItem }"><i class="fa-solid fa-xmark"></i></span>
            </a>
            </th>
            <td>{{ products.name }}</td>
            <td>{{ formatPrice(products.price) }}</td>
            <td>{{ products.quantity }}</td>
            <td v-if="cartLength">{{ formatPrice(products.price * products.quantity) }}</td>
            <!-- <td v-if="cartLength">{{ formatPrice(cartTotal) }}</td> -->
          </tr>
          <tr>
            <th colspan="4">Sub Total</th>
            <td>{{ formatPrice(cartTotal) }}</td>
          </tr>
          <tr>
            <th colspan="4">Tax 20%</th>
            <td>{{ formatPrice(cartTotal * 0.2) }}</td>
          </tr>
          <tr>
            <th colspan="4">Total</th>
            <td>{{ formatPrice(cartTotal * 1.2) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <hr>
    <h2 v-if="!cartLength" class="m-4 text-3xl text-center">
      Cart is currently empty
    </h2>
    <div v-if="cartLength">
      <h2 class="h-10 m-2 text-2xl font-bold text-center">Customer Details</h2>
      <div class="flex justify-center w-full align-center">
        <customer-details-form />
      </div>
      <transition name="fade" class="text-center">
        <div v-show="customerDetails.firstName && checkoutFormIsValid">
          <div class="flex justify-center w-full align-center">
            <span>Use the following card details for testing:
              <br />4242424242424242 <br />
              CVC any 3 digits <br />
              Any future date <br />
              Any zip code
            </span>
          </div>
          <h2 class="font-bold text-center">
            Stripe payment
          </h2>
          <div class="flex justify-center w-full p-4 align-center">
            <br />
            <div id="card-element" class="w-full h-16 mt-4 lg:w-5/12 xl:w-5/12" style="width: 50%; margin: auto;">
              Stripe
            </div>
          </div>
          <div class="mt-3 mb-3 text-center">
            <button type="submit" class="btn btn-primary"             
              :class="{ disabledButton: paymentIsProcessing }"
              :disabled="paymentIsProcessing"
              @click="checkout(products)"
            >
              Checkout
            </button>
            </div>
          
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, computed, toRefs } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";
import { useGetters } from "vuex-composition-helpers";

import { formatPrice } from "../../utils/functions";

import CustomerDetailsForm from "./CustomerDetailsForm.vue";

export default defineComponent({
  components: { CustomerDetailsForm },
  setup() {
    const store = useStore();
    const router = useRouter();
    const localState = reactive({
      removingCartItem: false,
      paymentIsProcessing: false,
      stripe: {},
      cardElement: {},
      customer: {},
      orderError: false,
    });

    const cartLength = computed(() => store.state.cart.length);
    const cartContent = computed(() => store.state.cart);
    const { cartTotal, customerDetails, checkoutFormIsValid } = useGetters([
      "cartTotal",
      "customerDetails",
      "checkoutFormIsValid",
    ]);

    const removeProductFromCart = (product) => {
      localState.removingCartItem = true;
      store.dispatch("removeProductFromCart", product);
      localState.removingCartItem = false;
    };

    const checkout = async () => {
      const { customer } = store.state;
      const { paymentMethod, error } =
        await localState.stripe.createPaymentMethod(
          "card",
          localState.cardElement,
          {
            billing_details: {
              name: `${customer.firstName} ${customer.lastName}`,
              email: customer.email,
              address: {
                line1: customer.address,
                city: customer.city,
                state: customer.state,
                postal_code: customer.zipcode,
              },
            },
          }
        );

      if (error) {
        localState.paymentIsProcessing = false;
        return;
      }
      localState.paymentIsProcessing = true;
      localState.customer = { ...customer };

      const stripeAmount = Math.ceil(store.getters.cartTotal * 1.2);
      localState.customer.amount = stripeAmount;
      localState.customer.cart = JSON.stringify(store.state.cart);
      localState.customer.payment_method_id = paymentMethod.id;

      if (stripeAmount > 300) {
        axios
          .post("/api/purchase", localState.customer)
          .then((response) => {
            localState.paymentIsProcessing = false;
            if (response.statusText === "Created") {
              fetch(`api/send-mail/${response.data.transaction_id}`, {
                method: 'get'
              }).catch(err => console.log(err));
              store.dispatch("emptyCart");
              store.dispatch("deleteCustomer");
              store.commit("UPDATE_ORDER", response.data);
              router.push("/success");
            }
          })
          .catch(() => {
            localState.paymentIsProcessing = false;
            localState.orderError = true;
          });
      }
    };

    onMounted(async () => {
      localState.stripe = await loadStripe(process.env.MIX_STRIPE_KEY);
      const elements = localState.stripe.elements();
      localState.cardElement = elements.create("card", {
        classes: {
          base: "bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 p-3 leading-8 transition-colors duration-200 ease-in-out",
        },
      });
      localState.cardElement.mount("#card-element");
    });


    return {
      ...toRefs(localState),
      localState,
      store,
      cartLength,
      cartTotal,
      cartContent,
      removeProductFromCart,
      checkout,
      formatPrice,
      checkoutFormIsValid,
      customerDetails,
    };
  },
});
</script>

<style scoped>
.disabledButton {
  @apply cursor-not-allowed opacity-50;
}

.checkoutButton {
  @apply p-2 mt-4 mb-4 text-lg font-bold text-white bg-blue-500 rounded hover:bg-blue-700;
}

.flex-container {
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  max-width: 1380px;

  @apply flex border border-gray-300 rounded-lg shadow;
}

.flex-container-total {
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  align-content: center;
  max-width: 1380px;

  @apply flex;
}

.item {
  @apply lg:m-2 xl:m-4 xl:w-1/6 lg:w-1/6 sm:m-2 w-auto;
}

.item-content {
  @apply inline-block mt-4 lg:h-12 h-20 w-32 md:w-full lg:w-full xl:w-full;
}

.removing {
  @apply animate-spin cursor-not-allowed;
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
