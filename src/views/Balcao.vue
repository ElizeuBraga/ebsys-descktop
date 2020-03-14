<template>
  <div>
    <v-row justify="center">
      <v-col cols="6" sm="12" md="8">
        <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Calories</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in products" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.priceUnit }}</td>
                <td>{{ item.totalPrice }}</td>
              </tr>
            </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="6" sm="12" md="4">
        <v-text-field label="Solo" placeholder="Placeholder" solo></v-text-field>
        <v-btn align="end" cols="6" sm="12" md="4">Buscar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import sqlite from '../mixins/sqlite'

export default {
  mixins:[sqlite],
  name: "Balcao",
  components: {},
  data() {
    return {
      alignment: "end",
      products:[]
    };
  },

  mounted(){
    // this.insertPedido("Teste", 23)
  }
};
</script>
