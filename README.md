# Valheim Réplicas — catálogo de remeras

Tienda de camisetas de fútbol réplica, pensada para verse primero en el
celular (95% del tráfico). Stack: Next.js 16 (App Router) + React 19 +
TypeScript + Tailwind CSS 4 + Supabase (auth, base de datos y storage).

## Rutas públicas

- `/` — página principal: hero con banner, carrusel **Más vendidas**
  (destacadas), carrusel **Novedades**, chips de categorías y sección
  "Sobre nosotros". Los dos carruseles avanzan sincronizados cada 3 segundos.
- `/catalogo` — catálogo completo con buscador por nombre y filtro por
  categoría (`?categoria=<slug>`). Cada remera muestra fotos, nombre, precio
  y talles; se elige un talle disponible y el botón **Pedir** abre WhatsApp
  con el mensaje armado.

## Panel de administración

- `/login` — inicio de sesión (solo los emails admin entran).
- `/admin` — listado de remeras con toggle de talle/activa/destacada,
  **Editar** y **Eliminar**.
- `/admin/nueva` — alta de remera (nombre, descripción, precio, categoría,
  talles, destacada y fotos, varios archivos de una).
- `/admin/[id]/editar` — edición completa, borrado/orden de fotos y alta de
  fotos nuevas.
- `/admin/categorias` — crear, renombrar y eliminar categorías.
- `/admin/pedidos` — pedidos con estado de pago (sin pago/seña/pagado) y
  entregado; `nueva` y `[id]/editar` para cargarlos a mano.

Las rutas `/admin/*` y `/login` están protegidas por el middleware
(`proxy.ts`, en esta versión de Next el archivo se llama `proxy.ts` y no
`middleware.ts`). Además, cada Server Action verifica la sesión con
`lib/auth.ts` y las políticas RLS solo permiten escribir a los emails
listados como admins.

## Configurar el proyecto en Supabase

1. Creá un proyecto en https://supabase.com.
2. Copiá de **Project Settings → API** la `Project URL` y la `anon public key`.
3. En **SQL Editor**, ejecutá el contenido de `supabase/schema.sql`. Es
   seguro correrlo varias veces (no borra datos). Crea/actualiza las tablas
   `categorias`, `remeras` y `pedidos`, las políticas RLS (lectura pública,
   escritura solo para los emails admin) y el bucket público `remeras-fotos`.
4. En **Authentication → Sign In / Providers**, desactivá *"Allow new users
   to sign up"* (y el anónimo si está encendido). El registro está bloqueado
   por RLS igualmente, pero conviene cerrarlo de entrada.
5. En **Authentication → Users**, creá el/los usuarios admin (los emails
   `lib/auth.ts` y los de las políticas de `supabase/schema.sql`).

## Variables de entorno

Copiá `.env.local.example` a `.env.local` y completá:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_WHATSAPP_NUMBER=595981234567
```

`NEXT_PUBLIC_SITE_URL` se usa para el canonical, `sitemap.xml`, `robots.txt`
y los datos estructurados. `NEXT_PUBLIC_WHATSAPP_NUMBER` es el número que
recibe los pedidos: código de país + número, sin `+`, espacios ni guiones.

## Correr en local

```bash
npm install
npm run dev
```

- Sitio: http://localhost:3001
- Login admin: http://localhost:3001/login

Verificación antes de pushear: `npm run lint` y `npx next build`.

## Cómo funciona por dentro

- **Auth**: `proxy.ts` refresca la sesión en cada request de `/admin` y
  `/login`. Las Server Actions del panel empiezan con `requireAdmin()`, que
  redirige a `/login` si no hay sesión o el email no es admin.
- **Fotos**: se suben al bucket `remeras-fotos` (carpeta por remera) desde
  las Server Actions y se guardan las URLs públicas en `remeras.imagenes`.
- **Talles**: se guardan como `jsonb` (`{"P": true, "M": false, ...}`);
  eliminar un talle no borra el dato, así se reactiva con un clic.
- **Carruseles**: `lib/tickCarrusel.ts` emite un evento global cada 3
  segundos; ambos carruseles de la home se suscriben y avanzan juntos.
- **SEO**: `app/sitemap.ts`, `app/robots.ts`, canonical/OG por página e
  `app/layout.tsx`; datos estructurados (JSON-LD) de tipo *Product* y
  *OnlineStore* generados por `components/ProductJsonLd.tsx`.

## Estructura

```
app/
  page.tsx                      landing (hero, carruseles, categorías, sobre nosotros)
  catalogo/page.tsx             catálogo + filtros + JSON-LD de productos
  login/                        login/logout
  sitemap.ts, robots.ts         SEO
  admin/                        listado, alta/edición, categorías, pedidos
components/
  RemeraCard.tsx                tarjeta pública (fotos, talles, botón Pedir)
  CarruselDestacadas.tsx        carrusel compartido (destacadas/novedades)
  Lightbox.tsx                  visor de fotos con zoom
  ProductJsonLd.tsx             datos estructurados de producto
  WhatsAppFlotante.tsx          botón flotante de WhatsApp
lib/
  supabase/client.ts, server.ts clientes de Supabase
  auth.ts                       emails admin + verificación de sesión
  site.ts                       URL pública del sitio y sitemap/robots
  tickCarrusel.ts               tick global de los carruseles
  categorias.ts                 categorías + slugify
proxy.ts                        middleware de auth (protege /admin y /login)
supabase/schema.sql             tablas, RLS y bucket de Storage
types/                         tipos Remera, Tallas, Pedido
```