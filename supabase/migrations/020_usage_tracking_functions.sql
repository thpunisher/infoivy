-- Function to check invoice limit and increment atomically
create or replace function check_invoice_limit(
  p_user_id uuid,
  p_period_start date,
  p_limit integer
) returns boolean
language plpgsql
security definer
as $$
declare
  v_current_count integer;
  v_updated boolean;
begin
  -- First try to insert a new record if it doesn't exist
  insert into public.usage_counters (user_id, period_start, invoices_created)
  values (p_user_id, p_period_start, 1)
  on conflict (user_id, period_start) do nothing;
  
  -- Now update and check the limit in a single atomic operation
  with updated as (
    update public.usage_counters
    set invoices_created = invoices_created + 1
    where user_id = p_user_id 
      and period_start = p_period_start
      and invoices_created < p_limit
    returning 1
  )
  select count(*) > 0 into v_updated
  from updated;
  
  -- If we couldn't update (because limit was reached), get the current count for the error message
  if not v_updated then
    select invoices_created into v_current_count
    from public.usage_counters
    where user_id = p_user_id 
      and period_start = p_period_start;
      
    if v_current_count >= p_limit then
      return false; -- Limit reached
    end if;
  end if;
  
  return true; -- Invoice can be created
end;
$$;

-- Function to safely increment invoice count for non-free plans
create or replace function increment_invoice_count(
  p_user_id uuid,
  p_period_start date
) returns void
language sql
security definer
as $$
  insert into public.usage_counters (user_id, period_start, invoices_created)
  values (p_user_id, p_period_start, 1)
  on conflict (user_id, period_start)
  do update set 
    invoices_created = public.usage_counters.invoices_created + 1;
$$;

-- Function to safely decrement invoice count
create or replace function decrement_invoice_count(
  p_user_id uuid,
  p_period_start date
) returns void
language sql
security definer
as $$
  update public.usage_counters
  set invoices_created = greatest(0, invoices_created - 1)
  where user_id = p_user_id 
    and period_start = p_period_start;
$$;

-- Add RLS policy to allow users to see their own usage
create policy "Users can view their own usage"
on public.usage_counters for select
using (auth.uid() = user_id);

-- Add RLS policy to allow the check_invoice_limit function to update usage
create policy "Allow check_invoice_limit to update usage"
on public.usage_counters for update
using (true)
with check (true);
