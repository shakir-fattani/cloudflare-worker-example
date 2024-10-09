import { v4 } from 'uuid'
import { Env, SubscriptionPlan } from '../types'

export default class SubscriptionPlanService {
  static throwIfWrongBillingCycle(billing_cycle: string) {
    if (!['monthly', 'yearly'].includes(billing_cycle))
      throw new Error('not a valid billing cycle type')
  }

  static throwIfWrongBillingStatus(status: string) {
    if (!['active', 'inactive'].includes(status))
      throw new Error('not a valid billing status')
  }

  static async createPlan(env: Env, { name, billing_cycle, price, status }: SubscriptionPlan): Promise<SubscriptionPlan> {
    SubscriptionPlanService.throwIfWrongBillingCycle(billing_cycle)
    SubscriptionPlanService.throwIfWrongBillingStatus(status)

    const plan: SubscriptionPlan = { id: v4(), name, billing_cycle, price, status }

    const { meta } = await (env.DB.prepare("insert into SubscriptionPlan(id, name, billing_cycle, price, status) values(?1, ?2, ?3, ?4, ?5)")
      .bind(plan.id, name, billing_cycle, price, status)
      .run());

    const { changes } = meta;

    if (changes != 1) {
      throw new Error("couldn't insert in db")
    }

    return plan;
  }

  static async getPlans(env: Env): Promise<Array<SubscriptionPlan>> {
    const stmt = env.DB.prepare("SELECT id, name, billing_cycle, price, status FROM SubscriptionPlan");
    const { results } = await stmt.all();
    return results as unknown as Array<SubscriptionPlan>;
  }

  static async getPlanById(env: Env, id: string): Promise<SubscriptionPlan | null>{
    const stmt = env.DB.prepare("SELECT id, name, billing_cycle, price, status FROM SubscriptionPlan WHERE id = ?1").bind(id);
    const { results } = await stmt.all();
    return results[0] as unknown as SubscriptionPlan;
  }

  static async updatePlanById(env: Env, id: string, { name, billing_cycle, price, status }: SubscriptionPlan): Promise<SubscriptionPlan | null> {
    // await throwIfCustomersAreSubscribe(env: Env, id);

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
    
    return await SubscriptionPlanService.getPlanById(env, id);
  }

  static async throwIfCustomersAreSubscribe(env: Env, id: string): Promise<void> {
    const { results } = await (env.DB.prepare('SELECT count(id) as customerSubscriptionCount from Customer where subscription_plan_id = ?1 ').bind(id)).all()
    if (!results[0]) {
      throw new Error("something went wrong");
    }
    
    if ((results[0] as { customerSubscriptionCount: number }).customerSubscriptionCount > 0)
      throw new Error("can't delete, because customers are subscribe to it");
  }
  
  static async deletePlanById(env: Env, id: string): Promise<boolean>{
    await SubscriptionPlanService.throwIfCustomersAreSubscribe(env, id);

    const stmt = env.DB.prepare("DELETE FROM SubscriptionPlan WHERE id = ?1").bind(id);
    const { meta } = await stmt.run();
    return meta.changes === 1;
  }
}
