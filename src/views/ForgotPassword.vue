<template>
  <div>
    <v-row>
      <v-col>
    <v-card elevation="12" class="mx-auto mt-12" max-width="50%">
      <p class="display-1 text--primary" align="center">Esqueci a senha</p>
      <v-row justify="center">
        <v-col cols="10">
      <v-text-field label="Email" v-model="email" :rounded="true" :disabled="loading" solo></v-text-field>

        </v-col>
        <v-col cols="10">

        <v-btn
          :style="{background:myColor, color:'white'}"
          align="center"
          rounded
          width="100%"
          @click="goToLogin"
          :disabled="loading"
        >Enviar</v-btn>
        </v-col>
      </v-row>
    </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import mixins from './../mixins/mixins'
export default {
  name: 'Entrega',
  props:['email'],
  mixins:[mixins],
  data(){
    return{
      loading:false
    }
  },
  components: {
  },

  mounted(){
  },

  methods:{
    goToLogin(){
      alert('Um email com uma nova senha foi enviado para seu email!!')
      this.$router.push('/')
    }
  }
}
</script>
