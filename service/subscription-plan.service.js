import { v4 } from 'uuid'

export default class SubscriptionPlanService {
  static throwIfWrongBillingCycle(billing_cycle) {
    if (!['monthly', 'yearly'].includes(billing_cycle)) {
      throw new Error('not a valid billing cycle type')
    }
  }

  static throwIfWrongBillingStatus(status) {
    if (!['active', 'inactive'].includes(status)) {
      throw new Error('not a valid billing status')
    }
  }

  static async createPlan(env, { name, billing_cycle, price, status }) {
    SubscriptionPlanService.throwIfWrongBillingCycle(billing_cycle)
    SubscriptionPlanService.throwIfWrongBillingStatus(status)

    const plan = {
      id: v4(),
      name, billing_cycle, price, status
    }

    const { meta } = await (env.DB.prepare("insert into SubscriptionPlan(id, name, billing_cycle, price, status) values(?1, ?2, ?3, ?4, ?5)")
      .bind(plan.id, name, billing_cycle, price, status)
      .run());

      const { changes } = meta;

    if (changes != 1) {
      throw new Error("couldn't insert in db")
    }

    return plan;
  }

  static async getPlans(env) {
    const stmt = env.DB.prepare("SELECT id, name, billing_cycle, price, status FROM SubscriptionPlan");
    const { results } = await stmt.all();
    return results;
  }

  static async getPlanById(env, id) {
    const stmt = env.DB.prepare("SELECT id, name, billing_cycle, price, status FROM SubscriptionPlan WHERE id = ?1").bind(id);
    const { results } = await stmt.all();
    return results[0];
  }

  static async updatePlanById(env, id, { name, billing_cycle, price, status } = {}) {
    const bindingArray = [];
    const fieldsNeedToBeUpdated = [];
    let bindingCount = 2
    
    if (name) {
      bindingArray.push(name);
      fieldsNeedToBeUpdated.push(`name = ?${bindingCount++}`)
    }
    
    if (billing_cycle) {
      SubscriptionPlanService.throwIfWrongBillingCycle(billing_cycle)
      bindingArray.push(billing_cycle);
      fieldsNeedToBeUpdated.push(`billing_cycle = ?${bindingCount++}`)
    }
    
    if (price) {
      bindingArray.push(price);
      fieldsNeedToBeUpdated.push(`price = ?${bindingCount++}`)
    }
    
    if (status) {
      SubscriptionPlanService.throwIfWrongBillingStatus(status)
      bindingArray.push(status);
      fieldsNeedToBeUpdated.push(`status = ?${bindingCount++}`)
    }


    const stmt = env.DB.prepare(`UPDATE SubscriptionPlan SET ${fieldsNeedToBeUpdated.join(', ')} WHERE id = ?1`).bind(id, ...bindingArray);
    const { meta } = await stmt.run();
    if (meta.changes != 1) {
      return null;
    }
    
    return SubscriptionPlanService.getPlanById(env, id);
  }
  
  static async deletePlanById(env, id) {
    const stmt = env.DB.prepare("DELETE FROM SubscriptionPlan WHERE id = ?1").bind(id);
    const { meta } = await stmt.run();
    return meta.changes === 1;
  }
}
