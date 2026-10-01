# Administración de servicios

Ruta: `/admin/servicios` (TanStack Router). Requiere el QueryClientProvider existente.

- `interfaces/`: contratos del catálogo y creación.
- `services/`: GET y POST `/service`; usa VITE_API_URL o el proxy `/api`.
- `hooks/`: consultas y mutación con React Query; actualiza e invalida el catálogo tras crear.
- `pages/`: formulario, vista previa y catálogo adaptable a móvil.
- `routes/`: registro de la ruta administrativa.
- `icons/`: lista explícita de iconos Lucide con nombres persistentes y etiquetas en español.
- `components/`: ServiceIcon compartido con Explorar y la selección de servicios del hospedaje.

El backend recibe `name`, `icono` (por ejemplo `wifi`) y `description`. El identificador del icono se guarda como texto; nunca como HTML ni SVG. Los nombres antiguos `cargador`, `droplet` y `pool` tienen equivalencias; un icono desconocido usa un símbolo genérico. Para ampliar el selector, agrega una importación y entrada en `serviceIcons.ts`.

La creación valida nombre obligatorio, límites de 100/255 caracteres, duplicados en el catálogo y errores del servidor. Conserva los campos tras un fallo y bloquea envíos repetidos mientras guarda. Los servicios creados se pueden elegir por su ID en `serviceIds` al crear o editar hospedajes.

La página mantiene el alcance acordado: no implementa roles ni autenticación. Tener una URL administrativa no restringe acceso; la autorización deberá implementarse en el backend y conectarse a la ruta cuando exista el sistema de permisos.
