-- Create customers table to map Paddle customer_id to email
create table
  public.customers (
    customer_id text not null,
    email text not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint customers_pkey primary key (customer_id)
  ) tablespace pg_default;

-- Create subscription table to store webhook events sent by Paddle
create table
  public.subscriptions (
    subscription_id text not null,
    subscription_status text not null,
    price_id text null,
    product_id text null,
    scheduled_change text null,
    customer_id text not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint subscriptions_pkey primary key (subscription_id),
    constraint public_subscriptions_customer_id_fkey foreign key (customer_id) references customers (customer_id)
  ) tablespace pg_default;

-- Grant access to authenticated users to read the customers table to get the customer_id based on the email
create policy "Enable read access for authenticated users to customers" on "public"."customers" as PERMISSIVE for SELECT to authenticated using ( true );

-- Grant access to authenticated users to read the subscriptions table
create policy "Enable read access for authenticated users to subscriptions" on "public"."subscriptions" as PERMISSIVE for SELECT to authenticated using ( true );
