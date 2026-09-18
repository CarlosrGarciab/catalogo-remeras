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
drop policy if exists "Actualizar categorías solo autenticado" on public.categorias;
drop policy if exists "Eliminar categorías solo autenticado" on public.categorias;

create policy "Lectura pública de categorías"
  on public.categorias for select
  using (true);

create policy "Insertar categorías solo autenticado"
  on public.categorias for insert
  to authenticated
  with check (true);

create policy "Actualizar categorías solo autenticado"
  on public.categorias for update
  to authenticated
  using (true)
  with check (true);

create policy "Eliminar categorías solo autenticado"
  on public.categorias for delete
  to authenticated
  using (true);

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
  tallas jsonb not null default '{"S": true, "M": true, "L": true, "XL": true}',
  created_at timestamptz not null default now()
);

-- Si la tabla ya existía de una versión anterior del proyecto, agregá las
-- columnas nuevas (no rompe nada si ya existen):
alter table public.remeras add column if not exists descripcion text;
alter table public.remeras add column if not exists categoria text;
alter table public.remeras add column if not exists imagenes text[] not null default '{}';
alter table public.remeras add column if not exists tallas jsonb not null default '{"S": true, "M": true, "L": true, "XL": true}';

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
drop policy if exists "Actualizar solo autenticado" on public.remeras;
drop policy if exists "Eliminar solo autenticado" on public.remeras;

create policy "Lectura pública de remeras"
  on public.remeras for select
  using (true);

create policy "Insertar solo autenticado"
  on public.remeras for insert
  to authenticated
  with check (true);

create policy "Actualizar solo autenticado"
  on public.remeras for update
  to authenticated
  using (true)
  with check (true);

create policy "Eliminar solo autenticado"
  on public.remeras for delete
  to authenticated
  using (true);

-- =========================================
-- Storage: bucket público para las fotos
-- =========================================
insert into storage.buckets (id, name, public)
values ('remeras-fotos', 'remeras-fotos', true)
on conflict (id) do nothing;

drop policy if exists "Lectura pública de fotos remeras" on storage.objects;
drop policy if exists "Subir fotos remeras solo autenticado" on storage.objects;
drop policy if exists "Eliminar fotos remeras solo autenticado" on storage.objects;

create policy "Lectura pública de fotos remeras"
  on storage.objects for select
  using (bucket_id = 'remeras-fotos');

create policy "Subir fotos remeras solo autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'remeras-fotos');

create policy "Eliminar fotos remeras solo autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'remeras-fotos');

-- =========================================
-- Tabla de pedidos (manejados por el admin)
-- =========================================
-- Datos personales de clientes: solo lectura/escritura con sesión iniciada.
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  telefono text not null default '',
  info_extra text not null default '',
  remera_id uuid references public.remeras (id) on delete set null,
  remera_nombre text not null default '',
  talla text not null default '',
  pago text not null default 'pendiente'
    check (pago in ('pendiente', 'senia', 'pagado')),
  monto_pagado numeric not null default 0,
  entregado boolean not null default false,
  entregado_en timestamptz,
  created_at timestamptz not null default now()
);

alter table public.pedidos enable row level security;

drop policy if exists "Leer pedidos solo autenticado" on public.pedidos;
drop policy if exists "Crear pedidos solo autenticado" on public.pedidos;
drop policy if exists "Actualizar pedidos solo autenticado" on public.pedidos;
drop policy if exists "Eliminar pedidos solo autenticado" on public.pedidos;

create policy "Leer pedidos solo autenticado"
  on public.pedidos for select
  to authenticated
  using (true);

create policy "Crear pedidos solo autenticado"
  on public.pedidos for insert
  to authenticated
  with check (true);

create policy "Actualizar pedidos solo autenticado"
  on public.pedidos for update
  to authenticated
  using (true)
  with check (true);

create policy "Eliminar pedidos solo autenticado"
  on public.pedidos for delete
  to authenticated
  using (true);
