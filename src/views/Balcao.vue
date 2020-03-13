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
              <tr v-for="item in prodsSect" :key="item.id">
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
import sqlite3 from 'sqlite3';
var db = new sqlite3.Database(':memory:');
var db = new sqlite3.Database('file.db');

db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS products (name, quantity)");

  db.run("INSERT INTO products VALUES (?, ?, ?)", ['product001',  20]);
  db.run("INSERT INTO products VALUES (?, ?, ?)", ['product002',  40]);
  db.run("INSERT INTO products VALUES (?, ?, ?)", ['product003',  60]);

  db.each("SELECT * FROM Products", function (err, row) {
    console.log(row);
  });
});

db.close();
// @ is an alias to /src
import sqlite from '../mixins/sqlite'

export default {
  mixins:[sqlite],
  name: "Balcao",
  components: {},
  data() {
    return {
      alignment: "end",
      prodsSect: [
        {"id": 1, name: "X tudo", qtd: 2, priceUnit: 5, totalPrice: 23 },
        {"id": 2, name: "X tudo", qtd: 2, priceUnit: 5, totalPrice: 23 },
        {"id": 3, name: "X tudo", qtd: 2, priceUnit: 5, totalPrice: 23 }
      ]
    };
  },

  mounted(){
    console.log("Mounted")
    // this.createTables();
    // this.insertPedido("Teste", 23)
  }
};
</script>
