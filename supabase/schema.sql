-- =========================================
-- SECURIDAD: emails que pueden administrar el panel
-- =========================================
-- Las políticas de escritura (insert/update/delete) de remeras, categorías,
-- pedidos y fotos solo permiten operar a ESTOS emails. Todo lo demás es
-- solo lectura pública.
--
-- ADEMÁS de esto, conviene desactivar el registro público en Supabase:
-- Authentication → Sign In / Providers → "Allow new users to sign up" OFF
-- (y "Allow anonymous sign-ins" OFF si estuviera encendido). Si alguien se
-- registra igual, no va a poder tocar nada porque RLS se lo bloquea.

-- =========================================
-- Tabla de categorías (editable desde el admin)
-- =========================================
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  etiqueta text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

-- Categorías iniciales (no hace nada si ya existen)
insert into public.categorias (slug, etiqueta, orden) values
  ('jugador_clubes', 'Jugador · Clubes', 1),
  ('jugador_selecciones', 'Jugador · Selecciones', 2),
  ('fan', 'Fan (clubes y selecciones)', 3),
  ('temporada_pasada', 'Jugador · Temporada pasada', 4)
on conflict (slug) do nothing;

alter table public.categorias enable row level security;

drop policy if exists "Lectura pública de categorías" on public.categorias;
drop policy if exists "Insertar categorías solo autenticado" on public.categorias;
drop policy if exists "Insertar categorías solo admins" on public.categorias;
drop policy if exists "Actualizar categorías solo autenticado" on public.categorias;
drop policy if exists "Actualizar categorías solo admins" on public.categorias;
drop policy if exists "Eliminar categorías solo autenticado" on public.categorias;
drop policy if exists "Eliminar categorías solo admins" on public.categorias;

create policy "Lectura pública de categorías"
  on public.categorias for select
  using (true);

create policy "Insertar categorías solo admins"
  on public.categorias for insert
  to authenticated
  with check (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

create policy "Actualizar categorías solo admins"
  on public.categorias for update
  to authenticated
  using (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']))
  with check (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

create policy "Eliminar categorías solo admins"
  on public.categorias for delete
  to authenticated
  using (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

-- =========================================
-- Tabla de remeras
-- =========================================
create table if not exists public.remeras (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric not null,
  categoria text not null,
  imagenes text[] not null default '{}',
  tallas jsonb not null default '{"P": true, "M": true, "G": true, "XL": true, "XXL": true}',
  created_at timestamptz not null default now()
);

-- Si la tabla ya existía de una versión anterior del proyecto, agregá las
-- columnas nuevas (no rompe nada si ya existen):
alter table public.remeras add column if not exists descripcion text;
alter table public.remeras add column if not exists categoria text;
alter table public.remeras add column if not exists imagenes text[] not null default '{}';
alter table public.remeras add column if not exists tallas jsonb not null default '{"P": true, "M": true, "G": true, "XL": true, "XXL": true}';
alter table public.remeras add column if not exists activa boolean not null default true;
-- Destacadas: las que el admin elige para mostrarse en el carrusel de la página de inicio
alter table public.remeras add column if not exists destacada boolean not null default false;
alter table public.categorias add column if not exists activa boolean not null default true;

notify pgrst, 'reload schema';

-- La versión anterior tenía un check fijo de categorías; lo sacamos porque
-- ahora las categorías son dinámicas (tabla categorias) y la relación se
-- controla con una foreign key en su lugar.
alter table public.remeras drop constraint if exists remeras_categoria_check;
alter table public.remeras drop constraint if exists remeras_categoria_fkey;
alter table public.remeras
  add constraint remeras_categoria_fkey
  foreign key (categoria) references public.categorias (slug)
  on update cascade;

alter table public.remeras enable row level security;

drop policy if exists "Lectura pública de remeras" on public.remeras;
drop policy if exists "Insertar solo autenticado" on public.remeras;
drop policy if exists "Insertar remeras solo admins" on public.remeras;
drop policy if exists "Actualizar solo autenticado" on public.remeras;
drop policy if exists "Actualizar remeras solo admins" on public.remeras;
drop policy if exists "Eliminar solo autenticado" on public.remeras;
drop policy if exists "Eliminar remeras solo admins" on public.remeras;

create policy "Lectura pública de remeras"
  on public.remeras for select
  using (true);

create policy "Insertar remeras solo admins"
  on public.remeras for insert
  to authenticated
  with check (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

create policy "Actualizar remeras solo admins"
  on public.remeras for update
  to authenticated
  using (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']))
  with check (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

create policy "Eliminar remeras solo admins"
  on public.remeras for delete
  to authenticated
  using (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

-- =========================================
-- Storage: bucket público para las fotos
-- =========================================
insert into storage.buckets (id, name, public)
values ('remeras-fotos', 'remeras-fotos', true)
on conflict (id) do nothing;

drop policy if exists "Lectura pública de fotos remeras" on storage.objects;
drop policy if exists "Subir fotos remeras solo autenticado" on storage.objects;
drop policy if exists "Subir fotos remeras solo admins" on storage.objects;
drop policy if exists "Eliminar fotos remeras solo autenticado" on storage.objects;
drop policy if exists "Eliminar fotos remeras solo admins" on storage.objects;

create policy "Lectura pública de fotos remeras"
  on storage.objects for select
  using (bucket_id = 'remeras-fotos');

create policy "Subir fotos remeras solo admins"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'remeras-fotos' and auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

create policy "Eliminar fotos remeras solo admins"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'remeras-fotos' and auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

-- =========================================
-- Tabla de pedidos (manejados por el admin)
-- =========================================
-- Datos personales de clientes: solo lectura/escritura con sesión iniciada.
-- Un pedido puede tener una o más remeras (arreglo "items").
-- En lugar de hacer drop (que borraría los pedidos ya cargados), se crea si no
-- existe y se agregan columnas nuevas si faltan; es seguro correrlo varias veces.
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  telefono text not null default '',
  info_extra text not null default '',
  items jsonb not null default '[]',
  pago text not null default 'pendiente',
  monto_pagado numeric not null default 0,
  entregado boolean not null default false,
  entregado_en timestamptz,
  created_at timestamptz not null default now()
);

alter table public.pedidos add column if not exists telefono text not null default '';
alter table public.pedidos add column if not exists info_extra text not null default '';
alter table public.pedidos add column if not exists items jsonb not null default '[]';
alter table public.pedidos add column if not exists pago text not null default 'pendiente';
alter table public.pedidos add column if not exists monto_pagado numeric not null default 0;
alter table public.pedidos add column if not exists entregado boolean not null default false;
alter table public.pedidos add column if not exists entregado_en timestamptz;

-- Check que permite los tres estados de pago usados en el admin:
alter table public.pedidos drop constraint if exists pedidos_pago_check;
alter table public.pedidos
  add constraint pedidos_pago_check
  check (pago in ('pendiente', 'senia', 'pagado'));

alter table public.pedidos enable row level security;

drop policy if exists "Leer pedidos solo autenticado" on public.pedidos;
drop policy if exists "Leer pedidos solo admins" on public.pedidos;
drop policy if exists "Crear pedidos solo autenticado" on public.pedidos;
drop policy if exists "Crear pedidos solo admins" on public.pedidos;
drop policy if exists "Actualizar pedidos solo autenticado" on public.pedidos;
drop policy if exists "Actualizar pedidos solo admins" on public.pedidos;
drop policy if exists "Eliminar pedidos solo autenticado" on public.pedidos;
drop policy if exists "Eliminar pedidos solo admins" on public.pedidos;

create policy "Leer pedidos solo admins"
  on public.pedidos for select
  to authenticated
  using (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

create policy "Crear pedidos solo admins"
  on public.pedidos for insert
  to authenticated
  with check (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

create policy "Actualizar pedidos solo admins"
  on public.pedidos for update
  to authenticated
  using (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']))
  with check (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

create policy "Eliminar pedidos solo admins"
  on public.pedidos for delete
  to authenticated
  using (auth.email() = any (array['carlosgarciaballadares@gmail.com','ll0260779@gmail.com']));

-- Refrescar el caché de PostgREST para que vea la tabla nueva al instante:
notify pgrst, 'reload schema';
