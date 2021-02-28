import {Profile} from '../models/Profile';
import {User} from '../models/User';
import {Cashier} from '../models/Cashier';
import {OrderType} from '../models/OrderType';
import {Customer} from '../models/Customer';
import {Order} from '../models/Order';
import {Section} from '../models/Section';
import {Product} from '../models/Product';
import {Item} from '../models/Item';
import {City} from '../models/City';
import {Address} from '../models/Address';
import {PaymentCashier} from '../models/PaymentCashier';
import {PaymentOrder} from '../models/PaymentOrder';
import {Payment} from '../models/Payment';
test('', async() => {
  let result = await


  new Customer().update([
    {
      id: 1,
      name: "Testa S2"
    },
    {
      id: 6,
      name: "Chana"
    }
  ])



  // await expect(result).resolves.toBe(11);
  // console.log(result)
});