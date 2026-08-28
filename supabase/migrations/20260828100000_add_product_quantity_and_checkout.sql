alter table public.products
add column if not exists quantity integer;

update public.products
set quantity = 0
where quantity is null;

alter table public.products
alter column quantity set default 0,
alter column quantity set not null;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'products_quantity_nonnegative'
    ) then
        alter table public.products
        add constraint products_quantity_nonnegative check (quantity >= 0);
    end if;
end;
$$;

create or replace function public.complete_sale(
    p_items jsonb,
    p_total numeric,
    p_cash numeric,
    p_change numeric,
    p_cashier text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    sale_item record;
    available_quantity integer;
    product_row public.products%rowtype;
    sale_items jsonb := '[]'::jsonb;
    calculated_total numeric := 0;
    new_transaction public.transactions;
begin
    if auth.uid() is null then
        raise exception 'Authentication is required.';
    end if;

    if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
        raise exception 'Transaction items are required.';
    end if;

    for sale_item in
        select
            (item->>'id')::uuid as product_id,
            sum((item->>'quantity')::integer) as quantity
        from jsonb_array_elements(p_items) as item
        group by (item->>'id')::uuid
        order by (item->>'id')::uuid
    loop
        if sale_item.quantity <= 0 then
            raise exception 'Product quantities must be greater than zero.';
        end if;

        select *
        into product_row
        from public.products
        where id = sale_item.product_id
        for update;

        if not found then
            raise exception 'A product in this order no longer exists.';
        end if;

        available_quantity := product_row.quantity;

        if available_quantity < sale_item.quantity then
            raise exception 'Insufficient stock for this order.';
        end if;

        update public.products
        set quantity = quantity - sale_item.quantity
        where id = sale_item.product_id;

        sale_items := sale_items || jsonb_build_array(jsonb_build_object(
            'id', product_row.id,
            'name', product_row.name,
            'price', product_row.price,
            'category', product_row.category,
            'image_url', product_row.image_url,
            'quantity', sale_item.quantity
        ));
        calculated_total := calculated_total + (product_row.price * sale_item.quantity);
    end loop;

    if p_cash < calculated_total then
        raise exception 'Cash is not enough.';
    end if;

    insert into public.transactions (items, total, cash, change, cashier)
    values (sale_items, calculated_total, p_cash, p_cash - calculated_total, p_cashier)
    returning * into new_transaction;

    return to_jsonb(new_transaction);
end;
$$;

grant execute on function public.complete_sale(jsonb, numeric, numeric, numeric, text) to authenticated;
