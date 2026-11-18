-- Minimal DDL mirroring the tables the webhook writes to (with this change applied).
CREATE TABLE customers(customer_id text PRIMARY KEY);
CREATE TABLE subscriptions(subscription_id text PRIMARY KEY,subscription_status text NOT NULL,customer_id text NOT NULL REFERENCES customers(customer_id),event_occurred_at timestamptz);
CREATE FUNCTION skip_stale_subscription_event() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF OLD.event_occurred_at IS NOT NULL AND NEW.event_occurred_at < OLD.event_occurred_at THEN RETURN NULL; END IF; RETURN NEW; END $$;
CREATE TRIGGER skip_stale_subscription_event BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION skip_stale_subscription_event();
