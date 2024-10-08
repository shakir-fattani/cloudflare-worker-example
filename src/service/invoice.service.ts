import { v4 } from 'uuid'
import CustomerService from './customer.service'
import { Env, Invoice } from '../types';

export default class InvoiceService {

  static throwIfWrongPaymentStatus(status: string) {
    if (!['pending', 'paid', 'failed'].includes(status)) {
      throw new Error('not a valid Payment status')
    }
  }

  static async createInvoice(env: Env, { customer_id, amount, due_date, payment_status = 'pending', payment_date }: Omit<Invoice, 'id'>): Promise<Invoice> {
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

  static async getInvoices(env: Env): Promise<Array<Invoice>>{
    const stmt = env.DB.prepare("SELECT id, customer_id, amount, due_date, payment_status, payment_date FROM Invoice");
    const { results } = await stmt.all();
    return results as unknown as Array<Invoice>;
  }

  static async getInvoiceById(env: Env, id: string): Promise<Invoice|null|undefined>{
    const stmt = env.DB.prepare("SELECT id, customer_id, amount, due_date, payment_status, payment_date FROM Invoice WHERE id = ?1").bind(id);
    const { results } = await stmt.all();
    return results[0] as unknown as Invoice;
  }

  static async getInvoicesByCustomerId(env: Env, customerId: string): Promise<Array<Invoice>>{
    const stmt = env.DB.prepare("SELECT id, customer_id, amount, due_date, payment_status, payment_date FROM Invoice WHERE customer_id = ?1").bind(customerId);
    const { results } = await stmt.all();
    return results as unknown as Array<Invoice>;
  }

  static async updateInvoiceById(env: Env, id: string, { due_date, payment_status, payment_date }: Pick<Invoice, 'due_date'|'payment_status'|'payment_date'>): Promise<Invoice|null|undefined> {
    const bindingArray = [];
    const fieldsNeedToBeUpdated = [];
    let bindingCount = 2
    
    if (due_date) {
      bindingArray.push(due_date);
      fieldsNeedToBeUpdated.push(`due_date = ?${bindingCount++}`)
    }
    
    if (payment_status) {
      InvoiceService.throwIfWrongPaymentStatus(payment_status);
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
    
    return await InvoiceService.getInvoiceById(env, id);
  }
}
