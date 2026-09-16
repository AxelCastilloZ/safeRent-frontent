# Explorar propiedades

Abre `/explorar` o usa **Explorar**, **Ver todas** o el buscador de la página de inicio.

- Inicia el backend en el puerto 4000 y el frontend con `pnpm dev`.
- Durante desarrollo, Vite envía `/api` al backend local. En producción configura `VITE_API_URL` con la URL pública del backend antes de compilar, o publica un proxy `/api` en el mismo dominio.
- El alojamiento del frontend debe servir `index.html` para `/explorar`.
- La pantalla consulta `GET /services` para mostrar el catálogo completo y `GET /properties?serviceIds=1,2` para buscar publicaciones activas que tengan todos los servicios elegidos. Sin coincidencias, el backend devuelve `200` con `[]`.
- El filtro de servicios se aplica en el backend; lista y mapa muestran la misma respuesta. Los cambios de selección cancelan la solicitud anterior y los errores del catálogo o de búsqueda se pueden reintentar de forma independiente.
- Los filtros de texto, moneda, precio y habitaciones se aplican a los resultados en el cliente. Los límites de precio requieren elegir una moneda para evitar comparar CRC con USD.

## Ubicaciones

Se agregaron campos opcionales `latitude` y `longitude` al backend, compatibles con `POST /properties` y `PATCH /properties/:id`. Los rangos admitidos son -90 a 90 y -180 a 180, respectivamente. Se deben enviar ambos para mostrar el marcador.

```json
{ "latitude": 9.935, "longitude": -84.084 }
```

Reinicia el backend para cargar el modelo actualizado. La configuración existente de TypeORM (`synchronize: true`) agrega las columnas; si desactivas sincronización en otro entorno, agrega las dos columnas nullable de tipo `double precision` mediante una migración antes de desplegar.

Las publicaciones existentes sin coordenadas siguen apareciendo en la lista; no se generan ubicaciones aproximadas a partir de sus direcciones. Para ver sus precios en el mapa, guarda sus coordenadas reales con el endpoint de actualización.

El mapa usa Leaflet y teselas de OpenStreetMap, conserva la atribución y requiere conexión a internet. No requiere API key. La geolocalización se solicita únicamente al pulsar **Usar mi ubicación** y requiere HTTPS o localhost y permiso del navegador.
