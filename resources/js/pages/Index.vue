<template>
  <div>
    <error />
    <hero />
    <show-all-products />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import Error from '../components/Home/Error.vue';
import ShowAllProducts from '../components/Products/ShowAllProducts.vue';

export default defineComponent({
  components: { ShowAllProducts, Error },
});
</script>
