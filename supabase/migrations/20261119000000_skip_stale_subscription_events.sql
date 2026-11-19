-- Paddle can deliver webhook events out of order. Store when each event occurred and
-- ignore an update that is older than the one already stored.
alter table public.subscriptions add column if not exists event_occurred_at timestamp with time zone null;

create or replace function public.skip_stale_subscription_event() returns trigger
language plpgsql as $$
begin
  if old.event_occurred_at is not null and new.event_occurred_at < old.event_occurred_at then
    return null;
  end if;
  return new;
end
$$;

drop trigger if exists skip_stale_subscription_event on public.subscriptions;
create trigger skip_stale_subscription_event before update on public.subscriptions
  for each row execute function public.skip_stale_subscription_event();
