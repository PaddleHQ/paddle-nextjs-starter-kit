-- Ensure row level security is enforced on billing tables
alter table "public"."customers" enable row level security;

alter table "public"."subscriptions" enable row level security;

-- Replace the permissive read policies that exposed all rows to any authenticated user
drop policy if exists "Enable read access for authenticated users to customers" on "public"."customers";

drop policy if exists "Enable read access for authenticated users to subscriptions" on "public"."subscriptions";

-- Authenticated users can only read the customer row matching their own email
create policy "Enable users to read their own customer record" on "public"."customers" as PERMISSIVE for SELECT to authenticated using (
  (
    select
      auth.jwt () ->> 'email'
  ) = email
);

-- Authenticated users can only read subscriptions linked to their own customer record
create policy "Enable users to read their own subscriptions" on "public"."subscriptions" as PERMISSIVE for SELECT to authenticated using (
  customer_id in (
    select
      customer_id
    from
      public.customers
    where
      email = (
        select
          auth.jwt () ->> 'email'
      )
  )
);
