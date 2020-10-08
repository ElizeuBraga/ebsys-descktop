<template>
  <v-container
    fill-height
    fluid
    :style="{ background: backgroundColor, 'align-items': 'stretch' }"
  >
    <v-row :style="{ background: backgroundColor, height: '93%' }">
      <v-col cols="5">
        <v-autocomplete
          ref="product"
          v-model="product"
          :items="items"
          @click="setNexStep('quantity')"
          :loading="isLoading"
          :color="mainColor"
          hide-no-data
          hide-selected
          :hint="
            product.price
              ? quantity +
                ' X ' +
                product.price.toFixed(2).replace('.', ',') +
                ' = ' +
                (quantity * product.price).toFixed(2).replace('.', ',')
              : ''
          "
          item-text="Description"
          item-value="API"
          label="Buscar um produto"
          placeholder="Digite algo para buscar um produto"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
      </v-col>
      <v-col cols="2">
        <v-text-field
          :color="mainColor"
          label="Quantidade"
          ref="quantity"
          @focus="hasFocus"
          v-model="quantity"
          type="number"
          min="1"
        />
      </v-col>

      <!-- coluna do Pedido inicio-->
      <v-col cols="5" :style="{ background: backgroundColor }">
        <v-card elevation="10" height="95%" :style="{ background: '' }">
          <v-card-title
            :style="{ background: '', color: mainColor }"
            class="justify-center pb-0 pt-0"
          >
            <b>{{ deliveryTitle }}</b>
          </v-card-title>
          <v-alert
            :value="error"
            class="ml-2 mr-2"
            transition="scale-transition"
            type="error"
            >{{ msg }}</v-alert
          >
          <v-alert
            :value="success"
            class="ml-2 mr-2"
            transition="scale-transition"
            type="success"
            >{{ msg }}</v-alert
          >
          <v-row
            v-if="order.items.length == 0"
            :style="{ background: '', height: '600px' }"
            align="center"
            justify="space-around"
          >
            <v-col cols="12" align="center">
              <v-progress-circular
                v-if="value > 0"
                :rotate="180"
                :size="100"
                :width="15"
                :value="value"
                color="pink"
                >{{ value }}</v-progress-circular
              >

              <v-icon
                v-else
                :style="{ opacity: 0.4 }"
                :disabled="true"
                size="200"
                align="center"
                >shopping_cart</v-icon
              >
            </v-col>
          </v-row>
          <v-row
            v-if="delivery && order.customer.name != null"
            align="center"
            class="pb-0 pt-0 ml-0 mr-0"
            :style="{ 'background-color': '#f5f5f5' }"
          >
            <v-col cols="9" align="center">
              <span
                >{{ order.customer.name }} - {{ order.customer.address }} -
                {{ order.customer.phone }}</span
              >
            </v-col>
            <v-col align="center" cols="3" class="pb-0 pt-0">
              <a @click="showModalUpdateCustomer()">
                <v-icon color="blue">edit</v-icon>
              </a>
              <a @click="cancelarForm">
                <v-icon color="red">remove_circle_outline</v-icon>
              </a>
            </v-col>
          </v-row>
          <br />
          <v-row class="pl-6 pr-6">
            <v-row
              class="pl-1 pr-1 text-center"
              v-for="(i, index) in order.items"
              :key="index"
            >
              <v-col cols="1" class="text-left pt-0 pb-0">{{
                index + 1
              }}</v-col>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-col
                    v-bind="attrs"
                    v-on="on"
                    cols="5"
                    class="text-left pt-0 pb-0 text-truncate"
                    >{{ i.name }}</v-col
                  >
                </template>
                <span>{{ i.name }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-col v-bind="attrs" v-on="on" cols="2" class="pt-0 pb-0">{{
                    i.quantity
                  }}</v-col>
                </template>
                <span>Quantidade</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-col v-bind="attrs" v-on="on" cols="2" class="pt-0 pb-0">{{
                    String(i.price).replace(".", ",")
                  }}</v-col>
                </template>
                <span>Preço unitario</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-col v-bind="attrs" v-on="on" cols="2" class="pt-0 pb-0">{{
                    parseFloat(i.price * i.quantity)
                      .toFixed(2)
                      .replace(".", ",")
                  }}</v-col>
                </template>
                <span>Total parcial</span>
              </v-tooltip>
              <v-col
                cols="12"
                :style="{ color: 'gray' }"
                class="text-left pt-0 pb-0"
              >
                <span>{{ i.observation }}</span>
              </v-col>
              <v-col class="pt-0 pr-0 pl-0" cols="12">
                <hr :style="{ color: 'gray' }" />
              </v-col>
            </v-row>
          </v-row>

          <v-card-actions
            :style="{
              'font-size': '20px',
              color: mainColor,
              position: 'absolute',
              bottom: 0,
              width: '100%',
            }"
          >
            <!-- <v-col cols="4" class="text-center">
              <b>Total</b>
            </v-col>-->
            <v-col :style="{ color: 'green' }" cols="12" class="text-right">
              <b>R$ {{ formatMoney(total) }}</b>
            </v-col>
          </v-card-actions>
        </v-card>
        <!-- menu -->
      </v-col>

      <!-- observações -->
      <v-dialog v-model="dialogObs" width="500" :persistent="true">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title
            >Alguma Observação?</v-card-title
          >
          <v-card-text>
            <v-text-field
              :color="mainColor"
              ref="observation"
              v-model="observation"
              label="Observação"
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" ref="btnOkobs" text @click="closeObs"
              >Ok</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal find customer -->
      <v-dialog v-model="modalFindCustomer" width="500" :persistent="true">
        <v-card>
          <v-card-title
            class="headline grey lighten-2 text-center"
            primary-title
            >Buscar cliente</v-card-title
          >
          <v-card-text>
            <v-row justify="center">
              <v-col cols="10">
                <v-text-field
                  ref="phone"
                  type="phone"
                  counter="11"
                  max-length="11"
                  clearable
                  :color="mainColor"
                  v-model="order.customer.phone"
                  label="Telefone"
                />
              </v-col>
              <v-col cols="10">
                <v-btn
                  :style="{ background: mainColor, color: 'white' }"
                  rounded
                  @click="findCustomer(order.customer.phone)"
                  label="Preço"
                  width="100%"
                  :disabled="!order.customer.phone"
                  >Buscar</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="updatingCustomer"
              color="primary"
              ref="btnOk"
              text
              @click="dialog = false"
              >Cancelar</v-btn
            >
            <v-btn v-else color="primary" ref="btnOk" text @click="cancelarForm"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal new  cliente or update cliente -->
      <v-dialog v-model="modalCustomer" width="500" :persistent="true">
        <v-card>
          <v-card-title
            class="headline grey lighten-2 text-center"
            primary-title
            >{{ modalCustomerTitle }}</v-card-title
          >

          <v-card-text>
            <v-row justify="center">
              <v-col v-if="newCustomer || updatingCustomer" cols="10">
                <p class="text-center bold">Novo cliente</p>
                <v-text-field
                  :color="mainColor"
                  v-model="order.customer.phone"
                  label="Telefone"
                />
                <v-text-field
                  :color="mainColor"
                  :disabled="blockInputs"
                  v-model="order.customer.name"
                  label="Nome"
                />
                <v-text-field
                  :color="mainColor"
                  :disabled="blockInputs"
                  v-model="order.customer.address"
                  label="Endereço"
                />
                <v-select
                  :color="mainColor"
                  :items="locality"
                  return-object
                  :disabled="blockInputs"
                  item-text="name"
                  v-model="locObj"
                  label="Localidades"
                ></v-select>
              </v-col>
              <v-col v-else cols="10">
                <v-text-field
                  ref="phone"
                  type="phone"
                  counter="11"
                  max-length="11"
                  clearable
                  :color="mainColor"
                  v-model="order.customer.phone"
                  label="Telefone"
                />
              </v-col>
              <v-col v-if="newCustomer" cols="10">
                <v-btn
                  :style="{ background: color, color: 'white' }"
                  rounded
                  @click="saveCustomer"
                  label="Preço"
                  width="100%"
                  :disabled="inputs"
                  >Salvar</v-btn
                >
              </v-col>
              <v-col v-if="updatingCustomer" cols="10">
                <v-btn
                  :style="{ background: mainColor, color: 'white' }"
                  rounded
                  @click="updateCustomer"
                  label="Preço"
                  width="100%"
                  :disabled="inputs"
                  >Atualizar</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="updatingCustomer"
              color="primary"
              ref="btnOk"
              text
              @click="modalCustomer = false"
              >Cancelar</v-btn
            >
            <v-btn v-else color="primary" ref="btnOk" text @click="cancelarForm"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal Receive-->
      <v-dialog v-model="dialogReceive" width="500" :persistent="true">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            <v-col cols="6">Receber</v-col>
            <v-col :style="{ color: 'green' }" class="text-right" cols="6"
              >R$ {{ formatMoney(total) }}</v-col
            >
          </v-card-title>

          <v-card-text>
            <v-row justify="center">
              <v-col cols="2" class="mb-0 pb-0">
                <v-text-field
                  type="number"
                  min="1"
                  max="4"
                  ref="paymentType"
                  label="Pagamento"
                  :color="mainColor"
                  v-model="paymentType"
                ></v-text-field>
              </v-col>
              <v-col cols="8" class="mb-0 pb-0">
                <v-text-field
                  maxlength="10"
                  v-money="money"
                  ref="amountToReceive"
                  label="A receber"
                  :color="mainColor"
                  v-model="totalReceive"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mb-0 mt-0 pb-0 pt-0">
                <p class="text-center" id="payments">
                  <span ref="money">1-Dinheiro </span>
                  <span ref="debit">2-Débito </span>
                  <span>3-Crédito </span>
                  <span>4-Ticket </span>
                </p>
              </v-col>
              <v-col cols="12">
                <p v-if="order.money > 0" class="mb-0">
                  Dinheiro - {{ formatMoney(order.money) }}
                </p>
                <p v-if="order.debit > 0" class="mb-0">
                  Debito - {{ formatMoney(order.debit) }}
                </p>
                <p v-if="order.credit > 0" class="mb-0">
                  Credito - {{ formatMoney(order.credit) }}
                </p>
                <p v-if="order.ticket > 0" class="mb-0">
                  Ticket - {{ formatMoney(order.ticket) }}
                </p>
                <br />
                <hr />
                <p :style="{ color: 'green' }" class="resume-end-order mb-0">
                  Total - {{ formatMoney(order.total_received) }}
                </p>
                <p
                  :style="{ color: 'red' }"
                  class="resume-end-order mb-0"
                  v-if="this.total - order.total_received > 0"
                >
                  Falta - {{ formatMoney(this.total - order.total_received) }}
                </p>
                <p
                  :style="{ color: 'red' }"
                  class="resume-end-order mb-0"
                  v-else
                >
                  Falta - 0,00
                </p>
                <p
                  :style="{ color: 'red' }"
                  class="resume-end-order mb-0"
                  v-if="order.total_received > total"
                >
                  Troco - {{ formatMoney(order.total_received - this.total) }}
                </p>
                <p
                  :style="{ color: 'red' }"
                  class="resume-end-order mb-0"
                  v-else
                >
                  Troco - 0,00
                </p>
              </v-col>
              <div>
                <!-- <span
                  cols="4"
                  v-for="(p, i) in payments"
                  :key="i"
                >{{p.name}} - {{p.price.toFixed(2).replace('.', ',')}}</span>-->
                <br />
              </div>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :style="{ width: '50%', background: 'green' }"
              color="white"
              ref="btnendorder"
              text
              @click="endOrder(order)"
              >Receber</v-btn
            >
            <v-btn
              :style="{ width: '50%', background: 'red' }"
              color="white"
              ref="cancelReceive"
              text
              @click="cancelReceive"
              >Cancelar(Esc)</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal close cahiser-->
      <v-dialog v-model="modalCloseCashier" width="500" :persistent="false">
        <v-card>
          <v-card-title
            class="headline grey lighten-2 text-center"
            primary-title
            >Fechar caixa</v-card-title
          >

          <v-card-text>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field
                  maxlength="10"
                  :color="mainColor"
                  v-money="money"
                  label="Dinheiro"
                  v-model="cashier.money"
                ></v-text-field>
                <v-text-field
                  maxlength="10"
                  :color="mainColor"
                  v-money="money"
                  label="Débito"
                  v-model="cashier.credit"
                ></v-text-field>
                <v-text-field
                  maxlength="10"
                  :color="mainColor"
                  v-money="money"
                  label="Crédito"
                  v-model="cashier.debit"
                ></v-text-field>
                <v-text-field
                  maxlength="10"
                  :color="mainColor"
                  v-money="money"
                  label="Ticket"
                  v-model="cashier.ticket"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions :style="{'background-color':'red'}">
            <v-spacer></v-spacer>
            <v-btn
              :style="{ width: '100%', background: mainColor }"
              color="white"
              ref="closeCashier"
              text
              @click="closeCashier(cashier)"
              >Ok</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal cashiers closeds -->
      <v-dialog
        scrollable
        v-model="modalClosedsCashiers"
        max-width="800"
        :persistent="false"
        open-delay=3000
        origin="top right"
      >
        <v-card height="80vh">
          <v-card-title class="text-center">
            <v-toolbar flat>
              <v-toolbar-title v-if="!cashierDetail">Meus fechamentos</v-toolbar-title>
              <v-toolbar-title v-else>Data de fechamento <b>{{new Date(cashierDetailObject.updated_at).toLocaleDateString()}}</b></v-toolbar-title>
              <div v-if="cashierDetail">
              <a :style="[detailsType == 'all' ? {color:mainColor} : {color:''}]" class="links-card-title" @click="showCashierDetail(cashierDetailObject, 'all')">Todos</a>
              <a :style="[detailsType == 'deliveries' ? {color:mainColor} : {color:''}]" class="links-card-title" @click="showCashierDetail(cashierDetailObject, 'deliveries')">Deliveries</a>
              <a :style="[detailsType == 'contertop' ? {color:mainColor} : {color:''}]" class="links-card-title" @click="showCashierDetail(cashierDetailObject, 'contertop')">Balcão</a>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                v-if="cashierDetail"
                @click="cashierDetail = false"
                title="Voltar"
                icon
              >
                <v-icon class="heading grey--text text--darken-4"
                  >mdi-arrow-right</v-icon
                >
              </v-btn>
              <v-btn
                v-else
                @click="modalClosedsCashiers = false"
                title="Fechar"
                icon
              >
                <v-icon class="heading grey--text text--darken-4">close</v-icon>
              </v-btn>
              <!-- <v-row>
              <v-col cols="2" v-if="cashierDetail" @click="cashierDetail = false" title="Voltar"><v-icon class="my_cashier">mdi-arrow-right</v-icon></v-col>
              <v-col cols="2" v-else @click="modalClosedsCashiers = false" title="Fechar"><v-icon class="my_cashier">mdi-close</v-icon></v-col>
            </v-row> -->
            </v-toolbar>
          </v-card-title>
          <v-card-text v-if="!cashierDetail">
            <v-row
              class="my_cashier"
              v-for="mc in mycashiers"
              :key="mc.id"
              @click="showCashierDetail(mc, 'all')"
            >
              <v-col class="pt-0" cols="12" v-if="mc.updated_at != null">{{
                new Date(mc.updated_at).toLocaleDateString()
              }}</v-col>
            </v-row>
          </v-card-text>

          <v-card-text v-else>
            <hr />
            <v-row
              class="pb-0"
              v-for="(i, index) in itemsCashierDetails[0]"
              :key="index"
            >
              <v-col class="pb-0" cols="6">{{ i.name }}</v-col>
              <v-col class="pb-0" cols="4">{{ i.quantity }} Und(s)</v-col>
              <v-col class="pb-0 justify-end" cols="2">{{
                formatMoney(i.total_parcial)
              }}</v-col>
            </v-row>
            <hr />
          </v-card-text>
          <v-card-actions class="justify-center" :style="{color:mainColor}" v-if="cashierDetail">
              <b style="color:black">(</b>Dinheiro: <b>{{ formatMoney(itemsCashierDetails[1].money)}}</b><b style="color:black">)</b>
              <b style="color:black">(</b>Débito: <b>{{ formatMoney(itemsCashierDetails[1].debit)}}</b><b style="color:black">)</b>
              <b style="color:black">(</b>Crédito: <b>{{ formatMoney(itemsCashierDetails[1].credit)}}</b><b style="color:black">)</b>
              <b style="color:black">(</b>Ticket: <b>{{ formatMoney(itemsCashierDetails[1].ticket)}}</b><b style="color:black">)</b>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal login -->
      <v-dialog v-model="unlogged" width="500" :persistent="true">
        <v-card>
          <v-card-title
            class="headline grey lighten-2 text-center"
            primary-title
            >Login</v-card-title
          >

          <v-card-text>
            <v-row justify="center">
              <v-col cols="12">
                <v-text-field
                  label="Telefone ou email"
                  :color="mainColor"
                  v-model="username"
                  ref="username"
                ></v-text-field>
                <v-text-field
                  ref="password"
                  type="password"
                  label="Senha"
                  :color="mainColor"
                  v-model="password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-alert
            :value="msgLogin"
            class="ml-2 mr-2"
            transition="scale-transition"
            type="error"
            >{{ msgloginerror }}</v-alert
          >
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :style="{ width: '100%', background: mainColor }"
              color="white"
              ref="btnLogin"
              text
              :disabled="fieldsLogin || loading"
              @click="login(username, password)"
            >
              <v-progress-linear
                v-if="loading"
                indeterminate
                color="white"
              ></v-progress-linear>
              <span v-else>Entrar</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- modal reset password -->
      <v-dialog v-model="resetpassword" width="500" :persistent="true">
        <v-card>
          <v-card-title
            class="headline grey lighten-2 text-center"
            primary-title
            >Trocar senha</v-card-title
          >

          <v-card-text>
            <v-row justify="center">
              <v-col cols="12">
                <v-text-field
                  ref="password"
                  label="Senha"
                  :color="mainColor"
                  v-model="password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  ref="receive"
                  type="password"
                  label="Confirme a senha"
                  :color="mainColor"
                  v-model="confirm_password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-alert
            :value="msgLogin"
            class="ml-2 mr-2"
            transition="scale-transition"
            type="error"
            >{{ msgloginerror }}</v-alert
          >
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :style="{ width: '100%', background: mainColor }"
              color="white"
              ref="btnResetPassword"
              text
              :disabled="password == '' || confirm_password == ''"
              @click="resetPassword(password, confirm_password)"
              >Entrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- rodapé -->
    <v-footer
      :style="{ background: backgroundColor }"
      absolute
      class="font-weight-medium"
    >
      <v-col class="text-center" cols="12">
        <v-row align="center">
          <v-col align="center" cols="4">
            <v-btn
              v-if="!statusCashier"
              @click="openCashier(user)"
              large
              :style="{ color: 'green' }"
              >Abrir</v-btn
            >
            <v-btn
              v-else
              @click="modalCloseCashier = true"
              large
              :style="{ color: 'red' }"
              >Fechar caixa</v-btn
            >
          </v-col>
          <v-col align="center" cols="4">
            <span :style="{ color: mainColor }" v-if="userCashier"
              >Caixa aberto por <b>{{ userCashier.name }}</b></span
            >
            <span :style="{ color: 'red' }" v-else>Caixa fechado</span>
          </v-col>
          <v-col align="center" cols="4">
            <v-btn
              v-if="delivery"
              large
              :style="{ color: lastColor }"
              @click="typeOrderBalcao"
              >Balcão</v-btn
            >
            <v-btn
              v-else
              large
              :style="{ color: lastColor }"
              @click="typeOrderDelivery"
              >Entregas</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
      <v-row class="pt-0 pb-0 text-center">
        <v-col cols="2" class="pt-0 pb-0">F9-Receber</v-col>
        <v-col cols="2" class="pt-0 pb-0">F11-Cancelar tudo</v-col>
        <v-col cols="2" class="pt-0 pb-0">
          F5-
          <span v-if="!delivery">(Entrega)</span>
          <span v-else>(Balcão)</span>
        </v-col>
        <v-col cols="2" class="pt-0 pb-0">F2-Fechar caixa</v-col>
        <v-col cols="2" class="pt-0 pb-0">F1-Observação</v-col>
        <v-col cols="2" class="pt-0 pb-0">Esc-Cancelar tudo</v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>

<script src="https://js.pusher.com/7.0/pusher.min.js"></script>
<script>
import { Section } from "../models/Section";
import mixins from "../mixins/mixins";
import axios from "axios";
import { VMoney } from "v-money";
import sqlite3 from "sqlite3";
import { Product } from "../models/Product";
import { Locality } from "../models/Locality";
import { ProductController } from "../controllers/ProductController";
import { LocalityController } from "../controllers/LocalityController";
import { OrderController } from "../controllers/OrderController";
import { ItemController } from "../controllers/ItemController";
import { CashierController } from "../controllers/CashierController";
import { PaymentController } from "../controllers/PaymentController";
import { CustomerController } from "../controllers/CustomerController";
import { UserController } from "../controllers/UserController";
import bcryptjs from "bcryptjs";
import { Cashier } from "../models/Cashier";
import { User } from "../models/User";
import { Customer } from "../models/Customer";
import { Helper } from "../models/Helper";
import { Order } from "../models/Order";
import Swal from "sweetalert2";

const db = new sqlite3.Database(
  "/home/basis/Downloads/app-descktop/src/database/database.db"
);

var pusher = new Pusher("a885cc143df63df6146a", {
  cluster: "us2",
});

var helper = new Helper();
var section = new Section();
const user = new User();
const cashier = new Cashier();
export default {
  mixins: [mixins],
  directives: { money: VMoney },
  data() {
    return {
      money: {
        decimal: ",",
        thousands: ".",
        // precision: 2,
        // masked: false, // doesn't work with directive
        // Waiting on https://github.com/vuejs-tips/v-money/pull/51 to be merged
        allowBlank: true,
      },

      //cashier variables
      itemsCashierDetails:[],
      detailsType: 'all',
      cashierDetailObject: {
        items: [],
      },
      cashierDetail: false,
      mycashiers: [],
      modalClosedsCashiers: false,
      totalReceive: "0,00",
      statusCashier: false,
      total: 0,
      totalMissing: "",
      totalToReceive: 0,
      amountToChange: 0,
      cashier: {
        debit: "0,00",
        credit: "0,00",
        ticket: "0,00",
        money: "0,00",
      },
      modalCloseCashier: false,
      userCashier: undefined,

      //payment variables
      payment: {},
      payments: [],
      paymentsFormats: ["Dinheiro", "Débito", "Crédito", "Ticket"],
      paymentType: 1,
      dialogReceive: false,
      amountMoney: 0.0,
      type: "",
      //user variables
      username: "user0@gmail.com",
      password: "123456",
      confirm_password: "",
      dialog: false,
      unlogged: true,
      resetpassword: false,

      //messages variable
      error: false,
      success: false,
      msg: "",
      msgloginerror: "",
      msgLogin: false,

      //order variables
      interval: {},
      value: 0,
      hasFocusQuantity: true,
      order: {
        cashier_id: null,
        customer_id: null,
        order_type: 0,
        payments: [],
        items: [],
        debit: 0,
        credit: 0,
        ticket: 0,
        money: 0,
        customer: {
          name: "",
          phone: "",
          address: "",
          locality_id: null,
        },
        total_received: 0.0,
      },
      locObj: {},
      locality: [],
      product: {},
      products: [],
      quantity: 1,
      deliveryTitle: "Balcão",
      delivery: false,
      fluxEnter: "quantity",
      donQuestionAgain: false,
      nexStep: "selectProduct",
      lastColor: "red",
      deliveryColor: "red",
      countertopColor: "green",

      // obs variables
      observation: "",
      observations: [
        { name: "Suco", rowid: 1 },
        { name: "Coca", rowid: 2 },
      ],
      dialogObs: false,
      descriptionLimit: 60,
      productInEditMode: {},

      // customer variables
      customer: {},
      dialogCustomer: false,
      btnDesc: "Delivery",
      newCustomer: false,
      updatingCustomer: false,
      dialog: false,
      modalFindCustomer: false,
      modalCustomer: false,
      modalCustomerTitle: "",

      isLoading: false,
      blockInputs: false,
      falta: 0,
      chargingData: false,
      loading: true,
    };
  },

  async mounted() {
    if ((await user.count()) > 0) {
      this.loading = false;
    }

    let statusCashier = await this.cashierStatus();
    setTimeout(() => {
      this.$refs.username.focus();
      this.lastColor = this.deliveryColor;
    }, 600);

    this.loadSectionsFromServer();
    this.loadProductsFromServer();
    this.loadLocalitiesFromServer();
    this.loadUsersFromServer();
    var channel = pusher.subscribe("my-channel");
    channel.bind("App\\Events\\ProductEvent", (data) => {
      // this.updateProducts(data.product);
      console.log(data);
    });

    channel.bind("App\\Events\\UserEvent", (data) => {
      this.updateUsers(data.user);
    });
    this.checkUserOpenedCashier();
    this.typeOrderBalcao();

    this.$root.$on("logout", (e) => {
      this.unlogged = e;
      this.password = "";
    });

    this.$root.$on("cashiers_closeds", async (e) => {
      this.cashierDetail = false;
      this.modalClosedsCashiers = true;
      this.mycashiers = await cashier.all(this.user.id);
    });

    this.$root.$on("update_products", async (e) => {
      this.updateProducts();
    });

    //cashier status
    this.cashierStatus();

    //load products
    var p = new ProductController();
    this.products = await p.index();

    // load localities
    var l = new LocalityController();
    this.locality = await l.index();

    //keyboard events
    document.onkeydown = async (e) => {
      // iniciar o recebimento
      if (e.key == "F5") {
        if (!this.unlogged) {
          if (this.delivery) {
            this.typeOrderBalcao();
          } else {
            this.typeOrderDelivery();
          }
        }
      }

      if (e.key == "F9") {
        this.totalReceive = this.formatMoney(this.total);
        if (this.dialogReceive) {
          return;
        }
        if (this.order.items.length > 0) {
          this.dialogReceive = true;
          // this.totalReceive = this.total;
          // this.amountToChange = this.totalReceive
          // this.type = 'Dinheiro'
          setTimeout(() => {
            var p = document.getElementById("payments");
            p.childNodes[this.paymentType - 1].style.color = this.mainColor;
            this.$refs.paymentType.focus();
          }, 200);

          this.setNexStep("amountToReceive");
          // this.totalReceive.toFixed(2)
          // this.falta = this.totalReceive
        }
      }

      if (e.key == "F1") {
        if (this.order.items.length > 0) {
          this.dialogObs = true;
        }
      }

      if (e.key == "F11") {
        this.clearForm();
        this.order.items = [];
        this.total = 0;
      }

      if (e.key == "Escape") {
        // cancelando o recebimento
        if (this.dialogReceive) {
          this.cancelReceive();
          return;
        }
      }

      if (e.key == "F2" && !this.unlogged) {
        this.modalCloseCashier = true;
        return;
      }

      if (e.key == "F10" && !this.unlogged) {
        const { value: index } = await Swal.fire({
          title: "Qual item deseja remover?",
          icon: "question",
          input: "number",
          inputPlaceholder: "informe o item",
        });

        if (index) {
          this.order.items.splice(parseInt(index - 1), 1);
          console.log(index);
          Swal.fire({
            title: `Item ${index} foi removido!`,
            icon: "success",
          });
        }
        return;
      }

      if (e.key == "Enter") {
        if (this.nexStep == "quantity") {
          this.$refs.quantity.focus();

          this.setNexStep("insertInOrderItems");
          return;
        }

        if (this.dialogObs) {
          this.closeObs();
          return;
        }

        if (this.unlogged) {
          this.login(this.username, this.password);
          return;
        }
        if (this.modalFindCustomer) {
          this.findCustomer(this.order.customer.phone);
          return;
        }
        if (this.nexStep == "insertInOrderItems") {
          this.insertInOrderItems(this.product);
          return;
        }

        if (this.nexStep == "amountToChange") {
          if (this.paymentType == 1) {
            this.$refs.amountToChange.focus();
          }
          this.setNexStep("insertInPayment");

          return;
        }

        if (this.nexStep == "insertPayment") {
          this.insertPayment();

          this.setNexStep("amountToReceive");
          return;
        }

        if (this.nexStep == "endOrder") {
          alert("Finalizando o pedido");
          return;
        }

        if (this.nexStep == "paymentType") {
          this.$refs.paymentType.focus();
          this.setNexStep("amountToReceive");
          return;
        }

        if (this.nexStep == "amountToReceive") {
          this.$refs.amountToReceive.focus();

          let inputEl = this.$refs.amountToReceive.$el.querySelector("input");

          setTimeout(() => {
            inputEl.select();
          }, 150);
          // this.$refs.amountToReceive.select()
          this.setNexStep("insertPayment");

          // if(this.paymentType == 1){
          //   this.setNexStep('amountToChange')
          // }else{
          // }
          return;
        }
      }
    };
  },

  computed: {
    // flux of the key enter
    computProductForQuantity() {
      return this.product != Object.keys(this.product).length > 0;
    },

    fieldsLogin() {
      return this.username == "" || this.password == "";
    },

    inputs() {
      return (
        !this.order.customer.phone ||
        !this.order.customer.name ||
        !this.order.customer.address ||
        this.blockInputs ||
        Object.keys(this.locObj).length === 0
      );
    },
    items() {
      return this.products.map((product) => {
        const Description =
          product.name.length > this.descriptionLimit
            ? product.name.slice(0, this.descriptionLimit) + "..."
            : product.name;
        return Object.assign({}, product, { Description });
      });
    },

    obs() {
      return this.observations.map((obs) => {
        const Description =
          obs.name.length > this.descriptionLimit
            ? obs.name.slice(0, this.descriptionLimit) + "..."
            : obs.name;

        return Object.assign({}, obs, { Description });
      });
    },
  },

  watch: {
    chargingData(e) {
      if (e == true) {
        console.log("Comecei a carregar");
      } else {
      }
    },

    donQuestionAgain(e) {
      console.log(e);
    },
    product(e) {
      this.quantity = 1;
      this.setNexStep("selectQuantity");
      if (Object.keys(e).length > 0) {
        setTimeout(() => {
          this.setNexStep("insertInOrderItems");
          this.$refs.quantity.focus();
        }, 100);
      }
    },

    paymentType(e) {
      if (parseInt(e) > 4) {
        setTimeout(() => {
          this.paymentType = 1;
        }, 200);
      } else {
        var p = document.getElementById("payments");
        p.childNodes.forEach((element) => {
          element.style.color = "";
        });
        p.childNodes[this.paymentType - 1].style.color = this.mainColor;
      }
      this.setNexStep("amountToReceive");
    },

    payment(e) {
      if (e.name != "Dinheiro") {
        this.amountMoney = 1.0;
      } else {
        this.amountMoney = 0.0;
      }

      console.log(this.amountMoney);
    },
  },

  methods: {
    async showCashierDetail(c, type) {
      this.cashierDetailObject = c
      this.detailsType = type
      this.itemsCashierDetails = await cashier.items(c.id, type);
      this.cashierDetail = true;
    },

    preventLoadUsersForInitApp() {
      this.$root.$emit("loading", false);
      this.loading = false;
    },

    async loadSectionsFromServer() {
      let maxid = await helper.max("sections");
      axios
        .get("sections/getGreaterThen/" + maxid)
        .then(async (response) => {
          await section.create(response.data);
        })
        .catch((e) => {
          console.log(e.message);
        });
    },

    async loadProductsFromServer() {
      let maxid = await helper.max("products");
      axios.get("products/getGreaterThen/" + maxid).then(async (response) => {
        let product = new Product();
        let res = await product.create(response.data);
        if (response.data.length == 50) {
          // this.loadProductsFromServer()
        }
      });
    },

    async loadLocalitiesFromServer() {
      let maxid = await helper.max("localities");
      axios.get("localities/getGreaterThen/" + maxid).then(async (response) => {
        let locality = new Locality();
        await locality.create(response.data);
      });
    },

    async loadUsersFromServer() {
      let maxid = await helper.max("users");
      axios.get("users/getGreaterThen/" + maxid).then((response) => {
        let user = new User();
        user.create(response.data);

        this.preventLoadUsersForInitApp();
      });
    },

    setNexStep(value) {
      this.nexStep = value;
      return;
    },

    async insertPayment() {
      this.$refs.paymentType.focus();

      if (this.paymentType == 1) {
        this.order.money += parseFloat(
          helper.formatMonetaryForDB(this.totalReceive)
        );
      } else if (this.paymentType == 2) {
        this.order.debit += parseFloat(
          helper.formatMonetaryForDB(this.totalReceive)
        );
      } else if (this.paymentType == 3) {
        this.order.credit = parseFloat(
          helper.formatMonetaryForDB(this.totalReceive)
        );
      } else {
        this.order.ticket += parseFloat(
          helper.formatMonetaryForDB(this.totalReceive)
        );
      }

      this.order.total_received =
        this.order.money +
        this.order.debit +
        this.order.credit +
        this.order.ticket;

      let totalMissing =
        parseFloat(helper.formatMonetaryForDB(this.total)) -
        this.order.total_received;

      const input = this.$refs.amountToReceive.$el.querySelector("input");

      if (totalMissing <= 0) {
        input.value = "0,00";
        this.totalReceive = "0,00";
        this.amountToChange = "0,00";
      } else {
        this.totalReceive = this.formatMoney(totalMissing);
        input.value = this.formatMoney(totalMissing);
        this.amountToChange = this.formatMoney(totalMissing);
      }
    },

    closeObs() {
      this.productInEditMode.observation = this.observation;
      this.observation = "";
      this.dialogObs = false;

      this.$nextTick(() => {
        let input = this.$refs.product.$el.querySelector("input");
        input.focus();
      });
    },

    setObs(p) {
      this.productInEditMode = p;
      this.dialogObs = true;
      this.observation = this.productInEditMode.observation;

      setTimeout(() => {
        this.$refs.observation.focus();
      }, 200);
    },

    clearForm() {
      this.product = {};
      this.quantity = 1;
      this.$refs.product.focus();
      this.locObj = {};
    },

    cancelReceive() {
      this.$fire({
        title: "Cancelar recebimento!",
        text: "Deseja realmente cancelar o recebimento?",
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
      }).then((r) => {
        if (r.value === true) {
          this.payments = [];
          this.paymentType = 1;
          this.dialogReceive = false;
        }
      });
    },

    async updateUsers(u) {
      let user = new User();
      let res = await user.find(u.id);
      if (res) {
        await user.update(u);
      } else {
        await user.create(u);
      }
    },

    async updateProducts(p) {
      let product = new Product();
      let res = await product.find(p.id);

      if (res) {
        await product.update(p);
      } else {
        await product.create(p);
      }
      this.products = await product.all();
    },

    setFluxEnter(val) {
      setTimeout(() => {
        this.fluxEnter = val;
      }, 300);
    },
    async checkUserOpenedCashier() {
      let cashier = new Cashier();
      let response = await cashier.checkUserOpenedCashier();
      this.userCashier = response;
    },

    async cashierStatus() {
      var cashier = new CashierController();
      let response = await cashier.show();
      this.cashier = response;
      if (this.cashier.created_at) {
        this.statusCashier = true;
        return true;
      } else {
        this.statusCashier = false;
        return false;
      }
    },

    resetPassword(password, confirm_password) {
      if (password != confirm_password) {
        this.showMessageErrorLogin("Senhas não conferem");
        return;
      }

      this.user.password = password;
      let user = new UserController();
      user.update(this.user, true);
      this.resetpassword = false;
      this.$fire({
        title: "Feito!",
        text: "Senha alterada com sucesso!",
        type: "success",
      });
    },

    async login(username, password) {
      this.lastColor = this.deliveryColor;
      let user = new UserController();
      let result = await user.login(username, password);

      if (result) {
        this.username = "";
        this.password = "";
        let user = new User();
        this.user = await user.find(username);
        this.unlogged = false;
        this.$root.$emit("logged_user", this.user);
        this.user.change_password
          ? (this.resetpassword = true)
          : (this.resetpassword = false);

        this.$nextTick(() => {
          const input = this.$refs.product.$el.querySelector("input");
          input.focus();
        });
      } else {
        this.showMessageErrorLogin("Usuario e/ou senha estão incorretos");
        // return;
      }
    },

    openCashier(user) {
      this.$fire({
        title: "Abrir o caixa?",
        text: "Você será responsavel pelas movimentações até o fechamento.",
        type: "question",
        showCloseButton: true,
        showCancelButton: true,
      }).then((r) => {
        if (r.value === true) {
          let cashier = new CashierController();
          cashier.store(user);
          this.cashierStatus();
          this.checkUserOpenedCashier();
        }
      });
    },

    closeCashier(c) {
      if (this.cashierStatus()) {
        this.$fire({
          title: "Fechar caixa?",
          text: "Esta ação não pode ser desfeita",
          type: "question",
          showCloseButton: true,
          showCancelButton: true,
        }).then((r) => {
          if (r.value === true) {
            let cashier = new CashierController();
            cashier.update(c);
            this.checkUserOpenedCashier();
            this.modalCloseCashier = false;
            this.statusCashier = false;

            setTimeout(() => {
              this.$fire({
                title: "Caixa fechado com sucesso",
                // text: "Esta ação não pode ser desfeita",
                type: "success",
              });
            });
          }
        });
      }
    },

    removeFromOrderItems(i) {
      this.$fire({
        title: "Remover",
        text: "Deseja realmente remover este item?",
        type: "warning",
        showCancelButton: true,
        showCloseButton: true,
        focusConfirm: true,
        focusCancel: false,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
      }).then((r) => {
        if (r.value === true) {
          this.total = this.total - parcialPrice;
          this.order.items.splice(i, 1);
        }
      });
    },

    async endOrder(order) {
      order.cashier_id = this.cashier.id;

      let o = new Order();
      let response = await o.create(order);
      return;
      o.store(order, items, payments);
      this.dialogReceive = false;
      this.order.items = [];
      this.order.customer = {};
      this.amountMoney = 0;
      this.payments = [];
      this.typeOrderBalcao();
    },

    typeOrderDelivery() {
      this.order.order_type = 1;
      this.lastColor = this.mainColor;
      this.delivery = true;
      this.deliveryTitle = "Entregas";
      this.btnDesc = "Balcão";
      this.order.items = [];
      this.total = 0;
      this.mainColor = this.deliveryColor;
      this.modalFindCustomer = true;

      this.$root.$emit("change_color", this.mainColor);

      setTimeout(() => {
        this.$refs.phone.focus();
      }, 200);
    },

    typeOrderBalcao() {
      this.order.order_type = 0;
      this.lastColor = this.mainColor;
      this.cancelOrder();
      this.order.customer = {};
      this.delivery = false;
      this.deliveryTitle = "Balcão";
      this.btnDesc = "Delivery";
      this.mainColor = this.countertopColor;
      this.$root.$emit("change_color", this.mainColor);
      this.modalFindCustomer = false;

      this.$nextTick(() => {
        this.$refs.product.focus();
      });
    },

    cancelOrder() {
      this.order.items = [];
      this.total = 0;
      this.product = {};
      this.dialogObs = false;
    },
    cancelarForm() {
      this.typeOrderBalcao();
      this.locObj = {};
      this.order.customer = {};
      this.modalFindCustomer = false;
      this.modalCustomer = false;
    },

    async saveCustomer() {
      setTimeout(() => {
        this.success = false;
        this.error = false;
      }, 3000);
      this.order.customer.locality_id = this.locObj.id;
      let customer = new CustomerController();
      let result = await customer.store(this.order.customer);

      if (result === true) {
        Swal.fire({
          icon: "success",
          title: "Feito!",
          text: "Novo cliente inserido com sucesso!",
        });
        let p = new Product();
        let deliveryRate = await p.deliveryRate(this.order.customer.phone);
        this.order.customer = await customer.show(this.order.customer.phone);
        this.insertInOrderItems(deliveryRate);
      } else {
        this.error = true;
        if (result == 19) {
          this.msg = "Usuario já existe!";
        } else {
          this.msg = "Erro inesperado. Codigo " + result;
        }
      }
      this.modalCustomer = false;
      this.clearForm();
    },

    async updateCustomer() {
      this.order.customer.locality_id = this.locObj.id;
      let customer = new Customer();
      let res = await customer.update(this.order.customer);

      let p = new Product();
      let deliveryRate = await p.deliveryRate(this.order.customer.phone);

      this.order.items.shift();
      this.insertInOrderItems(deliveryRate);
      this.modalCustomer = false;

      Swal.fire({
        title: "Feito!",
        text: "Cliente atualizado",
        icon: "success",
        timer: 1500,
      });
    },

    hasFocus() {
      setTimeout(() => {
        this.hasFocusQuantity = false;
      }, 300);
    },

    insertInOrderItems(product) {
      if (!this.statusCashier) {
        this.$fire({
          title: "Caixa fechado",
          text: "Deseja abri-lo?",
          type: "question",
          // timer: 3000,
          showCloseButton: true,
          showCancelButton: true,
        }).then((r) => {
          if (r.value === true) {
            this.openCashier(this.user);
          }
        });
      }
      if (this.donQuestionAgain) {
        let p = new Product();
        p.dontAskAgain(product.id);
      }
      product.observation = this.observation;
      product.quantity = this.quantity;

      let prod = JSON.stringify(product);
      if (this.updatingCustomer) {
        this.order.items.unshift(JSON.parse(prod));
      } else {
        this.order.items.push(JSON.parse(prod));
      }

      let total = 0;
      this.order.items.forEach((element) => {
        total += element.price * parseInt(element.quantity);
      });

      this.total = total;
      this.setNexStep("selectProduct");
      this.clearForm();
    },

    async findCustomer(phone) {
      let customer = new Customer();
      let customerresult = await customer.find(phone);

      if (customerresult != undefined) {
        this.order.customer = customerresult;
        this.modalFindCustomer = false;
        let p = new Product();
        let deliveryRate = await p.deliveryRate(customerresult.phone);
        this.insertInOrderItems(deliveryRate);

        return;
      }

      this.modalFindCustomer = false;
      this.updatingCustomer = false;
      this.modalCustomer = true;
      this.newCustomer = true;
    },

    async showModalUpdateCustomer() {
      this.modalCustomer = true;
      this.updatingCustomer = true;
      this.modalFindCustomer = false;
      this.newCustomer = false;
      this.modalCustomerTitle = "Atualizar Cliente";
      let locality = new Locality();
      this.locObj = await locality.find(this.order.customer.locality_id);
    },
  },
};
</script>
<style scoped>
.resume-end-order {
  font-weight: bold;
  font-size: 50;
}

.my_cashier {
  cursor: pointer;
}

.my_cashier:hover {
  background: #f5f5f5;
}

.links-card-title{
  /* padding-left: 20px; */
  margin-left: 20px;
}
</style>
