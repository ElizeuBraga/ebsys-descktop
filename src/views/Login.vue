<template>
  
</template>
<script>
// @ is an alias to /src

export default {
  name: "Login",
  components: {},
  data() {
    return {
        login: [value => !!value || 'Login obrigatorio'],
        senha: [value => !!value || 'Senha é obrigatorio.'],
    };
  }
};
</script>

<style scoped>
  
</style>