import { D1Database, ExecutionContext } from "@cloudflare/workers-types/experimental";

interface Env {
  DB: D1Database;
}

interface RequestObject {
  request: Request,
  params: Record<string, any>,
  env: Env,
  ctx: ExecutionContext,
}

interface SubscriptionPlan {
  id: string;
  name: string;
  billing_cycle: 'monthly' | 'yearly';
  price: number;
  status: 'active' | 'inactive';
}

interface Customer {
  id: string;
  name: string;
  email: string;
  subscription_plan_id: string;
  subscription_status: 'active' | 'inactive' | 'cancelled';
}

interface Invoice {
  id: string;
  customer_id: string;
  amount: number;
  due_date: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_date?: string;
}

interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: 'credit card' | 'paypal';
  payment_date: string;
}


declare class URLPattern {
  constructor(init?: URLPatternInit | string, baseURL?: string);
  test(input: URLPatternInput, baseURL?: string): boolean;
  exec(input: URLPatternInput, baseURL?: string): URLPatternResult | null;
}

interface URLPatternInit {
  protocol?: string;
  username?: string;
  password?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
}

type URLPatternInput = string | { protocol?: string; username?: string; password?: string; hostname?: string; port?: string; pathname?: string; search?: string; hash?: string };

interface URLPatternResult {
  inputs: [URLPatternInput, ...URLPatternInput[]];
  protocol: URLPatternComponentResult;
  username: URLPatternComponentResult;
  password: URLPatternComponentResult;
  hostname: URLPatternComponentResult;
  port: URLPatternComponentResult;
  pathname: URLPatternComponentResult;
  search: URLPatternComponentResult;
  hash: URLPatternComponentResult;
}

interface URLPatternComponentResult {
  input: string;
  groups: { [key: string]: string | undefined };
}
