import { v4 } from 'uuid'
export default class SubscriptionPlanService {
  static throwIfWrongBillingCycle(billing_cycle) {
    if (!['monthly', 'yearly'].includes(billing_cycle)) {
      throw new Error('non a valid billing cycle type')
    }
  }

  static throwIfWrongBillingStatus(status) {
    if (!['active', 'inactive'].includes(status)) {
      throw new Error('non a valid billing status')
    }
  }

  static createPlan(env, { name, billing_cycle, price, status }) {
    SubscriptionPlanService.throwIfWrongBillingCycle(billing_cycle)
    SubscriptionPlanService.throwIfWrongBillingStatus(billing_cycle)

    const plan = {
      id: v4(),
      name, billing_cycle, price, status
    }

    env.billingAppKVdb.put(plan.id, plan);

    if (status == 'active') {
      const planIds = env.billingAppKVdb.get('activePlans') || []
      planIds.push(plan.id);
      env.billingAppKVdb.put('activePlans', plan);
    } else {
      const planIds = env.billingAppKVdb.get('inactivePlans') || []
      planIds.push(plan.id);
      env.billingAppKVdb.put(inactivePlans, planIds);
    }
    return plan;
  }

  static getPlans(env) {
    return env.billingAppKVdb.list();
  }

  static getPlanById(env, id) {
    return env.billingAppKVdb.get(id);
  }
}
