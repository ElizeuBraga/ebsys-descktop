<template>
  <div>
    <h1>Entrega</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import EventBus from "./../EventBus";

export default {
  name: 'Entrega',
  components: {
  },

  mounted(){
    EventBus.$emit('changetitle', 'Entrega');
    EventBus.$emit("logged", true);

  }
}
</script>
