import { v4 } from 'uuid'
import SubscriptionPlanService from './subscription-plan.service'

export default class CustomerService {

  static throwIfWrongSubscriptionStatus(status) {
    if (!['active', 'inactive', 'cancelled'].includes(status)) {
      throw new Error('not a valid subscription status')
    }
  }

  static async createCustomer(env, { name, email, subscription_plan_id, subscription_status }) {
    CustomerService.throwIfWrongSubscriptionStatus(subscription_status)

    const subscription = await SubscriptionPlanService.getPlanById(env, subscription_plan_id);
    if (!subscription) {
      throw new Error("Subscriptions not found");
    }

    if (subscription.status != 'active') {
      throw new Error("Subscriptions status is not active");
    }

    const customer = {
      id: v4(),
      name, email, subscription_plan_id, subscription_status
    }

    const { meta } = await (env.DB.prepare("insert into Customer(id, name, email, subscription_plan_id, subscription_status) values(?1, ?2, ?3, ?4, ?5)")
      .bind(customer.id, name, email, subscription_plan_id, subscription_status)
      .run());

    const { changes } = meta;

    if (changes != 1) {
      throw new Error("couldn't insert in db")
    }

    return customer;
  }

  static async getCustomers(env) {
    const stmt = env.DB.prepare("SELECT id, name, email, subscription_plan_id, subscription_status FROM Customer");
    const { results } = await stmt.all();
    return results;
  }

  static async getCustomerById(env, id) {
    const stmt = env.DB.prepare("SELECT id, name, email, subscription_plan_id, subscription_status FROM Customer WHERE id = ?1").bind(id);
    const { results } = await stmt.all();
    return results[0];
  }

  static async updateCustomerById(env, id, { name, email } = {}) {
    const bindingArray = [];
    const fieldsNeedToBeUpdated = [];
    let bindingCount = 2
    
    if (name) {
      bindingArray.push(name);
      fieldsNeedToBeUpdated.push(`name = ?${bindingCount++}`)
    }
    
    if (email) {
      bindingArray.push(email);
      fieldsNeedToBeUpdated.push(`email = ?${bindingCount++}`)
    }
    
    const stmt = env.DB.prepare(`UPDATE Customer SET ${fieldsNeedToBeUpdated.join(', ')} WHERE id = ?1`).bind(id, ...bindingArray);
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
