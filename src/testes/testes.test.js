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


  new Payment().create([
    {
      name: "Testa"
    }
  ])



  // await expect(result).resolves.toBe(11);
  console.log(result)
});