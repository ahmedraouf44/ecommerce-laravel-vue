<template>
  <form>
    <div class="row">
      <div class="form-group col-6 mb-2">
        <label>First name</label>
        <input
          type="text"
          class="form-control"
          id="firstName"
          v-model="firstName"
          name="firstName"
        />
        <span class="text-lg text-red-500">{{ errors.firstName }}</span>
      </div>
      <div class="form-group col-6 mb-2">
        <label>Last name</label>
        <input
          type="text"
          class="form-control"
          id="lastName"
          v-model="lastName"
          name="lastName"
        />
        <span class="text-lg text-red-500">{{ errors.lastName }}</span>
      </div>
    </div>

    <div class="row">
      <div class="form-group col-6 mb-2">
        <label>Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="email"
          name="email"
        />
        <span class="text-lg text-red-500">{{ errors.email }}</span>
      </div>
      <div class="form-group col-6 mb-2">
        <label>Address</label>
        <input
          type="text"
          class="form-control"
          id="address"
          v-model="address"
          name="address"
        />
        <span class="text-lg text-red-500">{{ errors.address }}</span>
      </div>
    </div>

    <div class="row">
      <div class="form-group col-4 mb-2">
        <label>City</label>
        <input
          type="text"
          class="form-control"
          id="city"
          v-model="city"
          name="city"
        />
        <span class="text-lg text-red-500">{{ errors.city }}</span>
      </div>
      <div class="form-group col-4 mb-2">
        <label>State</label>
        <input
          type="text"
          class="form-control"
          id="state"
          v-model="state"
          name="state"
        />
        <span class="text-lg text-red-500">{{ errors.state }}</span>
      </div>
      <div class="form-group col-4 mb-2">
        <label>Zip code</label>
        <input
          type="text"
          class="form-control"
          id="zipcode"
          v-model="zipcode"
          name="zipcode"
        />
        <span class="text-lg text-red-500">{{ errors.zipcode }}</span>
      </div>
    </div>

    <div class="mt-3 mb-3 text-center">
      <button type="submit" class="btn btn-primary" @click="onSubmit">
        Save Details
      </button>
    </div>
  </form>
</template>

<script>
import { defineComponent, computed } from "vue";

import { useStore } from "vuex";
import { useForm, useField } from "vee-validate";
import { object, string } from "yup";

export default defineComponent({
  setup() {
    const store = useStore();

    const schema = object({
      firstName: string().required(),
      lastName: string().required(),
      address: string().required(),
      city: string().required(),
      state: string().required(),
      zipcode: string().required(),
      email: string().required().email(),
    });

    // Create a form context with the validation schema
    const { meta, errors, handleSubmit } = useForm({
      validationSchema: schema,
    });

    const onSubmit = handleSubmit((values) => {
      store.dispatch("saveCustomerDetails", values);
      if (meta.value.valid) {
        store.dispatch("setCheckoutFormToValid", true);
      } else {
        store.dispatch("setCheckoutFormToValid", false);
      }
    });

    const { value: firstName } = useField("firstName");
    const { value: lastName } = useField("lastName");
    const { value: address } = useField("address");
    const { value: city } = useField("city");
    const { value: state } = useField("state");
    const { value: zipcode } = useField("zipcode");
    const { value: email } = useField("email");

    const customerDetails = computed(() => store.getters.customerDetails);

    return {
      firstName,
      lastName,
      address,
      city,
      state,
      zipcode,
      email,
      errors,
      onSubmit,
      customerDetails,
      meta,
    };
  },
});
</script>

<style scoped>
.text-input {
  @apply w-full p-2 text-gray-800 placeholder-gray-800 border border-gray-400 rounded shadow-md;
}

.submitButton {
  @apply p-2 mt-4 mx-auto mb-4 text-lg font-bold text-white bg-blue-700;
  @apply rounded hover:bg-blue-700 cursor-pointer;
}
</style>
