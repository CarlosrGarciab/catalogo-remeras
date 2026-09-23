import type { Remera, Tallas } from '@/types/remera'
import { siteUrl } from '@/lib/site'

const TALLAS: Array<keyof Tallas> = ['P', 'M', 'G', 'XL', 'XXL']

export default function ProductJsonLd({ remeras }: { remeras: Remera[] }) {
  const productos = remeras
    .filter((remera, indice, todas) => todas.findIndex((r) => r.id === remera.id) === indice)
    .map((remera) => {
      const enStock = TALLAS.some((talla) => Boolean(remera.tallas?.[talla]))
      const url = siteUrl(`/catalogo#remera-${remera.id}`)
      const imagenes = (remera.imagenes ?? []).filter(Boolean)
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: remera.nombre,
        url,
        ...(imagenes.length > 0 ? { image: imagenes } : {}),
        ...(remera.descripcion ? { description: remera.descripcion } : {}),
        brand: { '@type': 'Brand', name: 'Valheim Réplicas' },
        offers: {
          '@type': 'Offer',
          price: Number(remera.precio).toFixed(2),
          priceCurrency: 'PYG',
          availability: enStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url,
        },
      }
    })

  if (productos.length === 0) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productos) }}
    />
  )
}