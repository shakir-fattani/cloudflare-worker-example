import { v4 } from 'uuid'
import CustomerService from './customer.service'

export default class InvoiceService {

  static throwIfWrongPaymentStatus(status) {
    if (!['pending', 'paid', 'failed'].includes(status)) {
      throw new Error('not a valid Payment status')
    }
  }

  static async createCustomer(env, { customer_id, amount, due_date, payment_status = 'pending', payment_date } = {}) {
    InvoiceService.throwIfWrongPaymentStatus(payment_status)

    const customer = await CustomerService.getCustomerById(env, customer_id);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const invoice = {
      id: v4(),
      customer_id, amount, due_date, payment_status, 
      payment_date: payment_date || (new Date()).toUTCString(),
    }

    const { meta } = await (env.DB.prepare("insert into Invoice(id, customer_id, amount, due_date, payment_status, payment_date) values(?1, ?2, ?3, ?4, ?5, ?6)")
      .bind(invoice.id, customer.id, amount, due_date, payment_status, payment_date)
      .run());

    const { changes } = meta;

    if (changes != 1) {
      throw new Error("couldn't insert in db")
    }

    return invoice;
  }

  static async getInvoices(env) {
    const stmt = env.DB.prepare("SELECT id, customer_id, amount, due_date, payment_status, payment_date FROM Invoice");
    const { results } = await stmt.all();
    return results;
  }

  static async getCustomerById(env, id) {
    const stmt = env.DB.prepare("SELECT id, customer_id, amount, due_date, payment_status, payment_date FROM Invoice WHERE id = ?1").bind(id);
    const { results } = await stmt.all();
    return results[0];
  }

  static async updateCustomerById(env, id, { due_date, payment_status, payment_date } = {}) {
    const bindingArray = [];
    const fieldsNeedToBeUpdated = [];
    let bindingCount = 2
    
    if (due_date) {
      bindingArray.push(due_date);
      fieldsNeedToBeUpdated.push(`due_date = ?${bindingCount++}`)
    }
    
    if (payment_status) {
      bindingArray.push(payment_status);
      fieldsNeedToBeUpdated.push(`payment_status = ?${bindingCount++}`)
    }
    
    if (payment_date) {
      bindingArray.push(payment_date);
      fieldsNeedToBeUpdated.push(`payment_date = ?${bindingCount++}`)
    }
    
    const stmt = env.DB.prepare(`UPDATE Invoice SET ${fieldsNeedToBeUpdated.join(', ')} WHERE id = ?1`).bind(id, ...bindingArray);
    const { meta } = await stmt.run();
    if (meta.changes != 1) {
      return null;
    }
    
    return CustomerService.getCustomerById(env, id);
  }
  
  static async deleteCustomerById(env, id) {
    const stmt = env.DB.prepare("DELETE FROM Customer WHERE id = ?1").bind(id);
    const { meta } = await stmt.run();
    return meta.changes === 1;
  }
}
