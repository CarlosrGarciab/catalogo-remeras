# Catálogo de remeras (práctica con Supabase)

Tienda de camisetas de fútbol réplica, con panel admin, en Next.js 16 (App
Router) + React 19 + TypeScript 5.7 + Tailwind CSS 4.

## Categorías

Las categorías ya no están fijas en el código: viven en la tabla
`categorias` de Supabase y se administran desde `/admin/categorias`
(crear, renombrar, eliminar). El proyecto arranca con estas 4 (creadas por
`supabase/schema.sql`), pero podés agregar, renombrar o borrar las que
quieras:

- Jugador · Clubes
- Jugador · Selecciones
- Fan (clubes y selecciones)
- Jugador · Temporada pasada

Cada categoría tiene un `slug` interno (se genera solo a partir del nombre
al crearla, y no cambia si después editás el nombre) y una `etiqueta`
visible. Una categoría no se puede eliminar si todavía hay remeras
cargadas con ella — primero hay que reasignarlas o borrarlas.

## Rutas

- `/` — catálogo público, con pestañas por categoría. Cada remera muestra sus
  fotos (con flechas si hay más de una), nombre, descripción, precio y
  talles. El cliente elige un talle disponible y aparece el botón **Pedir
  por WhatsApp**, que abre WhatsApp con un mensaje ya armado pidiendo esa
  remera en ese talle.
- `/login` — inicio de sesión del admin.
- `/admin` — listado de todas las remeras. Desde acá:
  - se puede tildar/destildar cada talle (S/M/L/XL) al instante, sin entrar
    a editar — útil para marcar "se agotó el talle M";
  - **Editar** abre el formulario completo;
  - **Eliminar** borra la remera y sus fotos.
- `/admin/nueva` — alta de una remera nueva: nombre, descripción, precio,
  categoría, talles iniciales y fotos (podés elegir varios archivos de tu
  PC de una sola vez).
- `/admin/[id]/editar` — edición: mismos campos, más la posibilidad de
  eliminar fotos existentes (tildándolas) y agregar fotos nuevas.
- `/admin/categorias` — alta, edición del nombre y borrado de categorías.

## 1. Crear/actualizar el proyecto en Supabase

1. En https://supabase.com creá un proyecto (o usá uno que ya tengas).
2. Copiá de **Project Settings → API** la `Project URL` y la `anon public key`.
3. En **SQL Editor**, ejecutá el contenido de `supabase/schema.sql`. Este
   script:
   - crea (o actualiza, si ya existía) la tabla `remeras` con las columnas
     `descripcion`, `categoria`, `imagenes` (array de URLs) y `tallas`
     (objeto `{S, M, L, XL}` con `true`/`false`);
   - define las políticas de RLS: lectura pública, escritura (insert /
     update / delete) solo para usuarios autenticados;
   - crea el **bucket de Storage público** `remeras-fotos` donde se guardan
     las fotos, con sus propias políticas (lectura pública, subida/borrado
     solo autenticado).
4. En **Authentication → Users**, creá tu usuario admin (email + contraseña)
   si todavía no lo tenés. No hay registro público, solo ese usuario entra
   a `/admin`.

## 2. Variables de entorno

Copiá `.env.local.example` a `.env.local` y completá:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
NEXT_PUBLIC_WHATSAPP_NUMBER=595981234567
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` es el número que va a recibir los pedidos:
código de país + número, sin `+`, espacios ni guiones.

## 3. Instalar y correr

```bash
npm install
npm run dev
```

- Catálogo: http://localhost:3000
- Login admin: http://localhost:3000/login

## Cómo funciona por dentro

- **Subida de fotos**: el formulario de alta/edición usa
  `encType="multipart/form-data"` con `<input type="file" multiple>`. La
  Server Action recibe los archivos directamente en el `FormData`, los sube
  al bucket `remeras-fotos` (carpeta `<id-de-la-remera>/...`) con el cliente
  de Supabase del servidor, y guarda las URLs públicas en la columna
  `imagenes`.
- **Talles**: se guardan como `jsonb` (`{"S": true, "M": false, ...}`) en
  vez de eliminar el talle, así se puede reactivar con un clic cuando vuelva
  el stock.
- **WhatsApp**: el botón arma un link `https://wa.me/<numero>?text=<mensaje
  codificado>` con el nombre de la remera y el talle elegido. No depende de
  Supabase, es solo un link — no hace falta configurar nada más que el
  número en `.env.local`.
- **Auth**: igual que antes, `middleware.ts` protege `/admin/*` y redirige a
  `/login` si no hay sesión.
- **Un detalle de React**: los formularios con `action={miServerAction}` NO
  deben llevar `encType` a mano — React ya lo pone automáticamente cuando
  detecta un `<input type="file">` en el formulario. Ponerlo manualmente
  generaba un conflicto que corrompía el envío cuando se subía más de una
  foto (aparecía la misma imagen duplicada en vez de las dos elegidas).

## Estructura

```
app/
  page.tsx                    catálogo público (pestañas por categoría)
  login/
    page.tsx, actions.ts        login/logout
  admin/
    page.tsx                    listado + toggle de talles + eliminar
    actions.ts                   server actions: alta, edición, borrado, toggle
    campos.tsx                   inputs/labels reutilizados en los formularios
    TallaCheckbox.tsx             checkbox interactivo de disponibilidad
    nueva/page.tsx                formulario de alta (con subida de fotos)
    [id]/editar/page.tsx           formulario de edición
    categorias/page.tsx            administrar categorías
    categorias/actions.ts          server actions de categorías
lib/
  categorias.ts                 lee/crea slugs de categorías desde Supabase
  supabase/client.ts, server.ts  clientes de Supabase
middleware.ts                   protección de /admin
supabase/schema.sql              tablas remeras/categorias, RLS y bucket de Storage
types/remera.ts                  tipos Remera y Tallas
components/RemeraCard.tsx        tarjeta pública: fotos, talle, WhatsApp
```

## Ideas para seguir practicando

- Agregar un buscador por nombre en el catálogo.
- Subir el límite de tamaño/tipo de archivo permitido en el input de fotos.
- Mostrar un aviso de "sin stock" si ningún talle está disponible.
