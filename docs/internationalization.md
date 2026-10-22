# Internacionalización de SafeRent

## Estado — 22 de octubre de 2026

Se integró JSON + i18next + react-i18next + Intl nativo en los módulos de la aplicación.
Hay 23 namespaces y 1.187 claves por idioma: español (es-CR), inglés (en-US), francés (fr-FR) y portugués de Brasil (pt-BR).
Los recursos están en src/i18n/locales/{es,en,fr,pt}/{modulo}.json. Los correos tienen sus propios cuatro JSON en el backend.

| Área del trabajo pendiente original | Implementación incorporada |
| --- | --- |
| Landing, acerca de y soporte | Encabezados, contenido, pie, categorías, FAQ, búsqueda y asunto del enlace de soporte |
| Exploración y publicación | Filtros, listas, mapas, galería, asistentes, borradores, revisión y estados de propiedad |
| Paneles y administración | Inquilino, propietario, administrador, reservaciones, guardadas, comentarios y roles |
| Mensajería | Conversaciones, composición, estados de envío/lectura, etiquetas de roles, fechas y errores |
| Catálogos | Códigos estables para las 8 entradas de servicios y 4 tipos observados; traducciones editables para servicios |
| API y validaciones | Códigos de error con parámetros y validaciones estructuradas; presentación traducida en el cliente |
| Correos | Asunto, HTML, texto plano, duración y enlace de recuperación en los cuatro idiomas |
| Legal | Términos y privacidad completos, índice, estructura y fecha de versión original localizada |
| Formatos | Fechas, horas, precios, nombres de países y monedas, contadores y plurales |
| Verificación | Controles automáticos de claves, variables, textos incrustados y contratos; revisión visual de páginas públicas |

Esto describe cobertura del código y de los recursos incorporados. No sustituye una prueba manual de todas las combinaciones de cuenta, ruta, estado y dispositivo.

## Idioma y reactividad

La preferencia de la cuenta tiene prioridad al cargar el perfil. Sin ella se utiliza la selección local, el navegador y finalmente español.
Los enlaces con un parámetro lang válido permiten abrir una recuperación en el idioma del correo. Un locale no admitido no carga recursos arbitrarios.
El selector usa nombres propios: Español, English, Français y Português.

Para visitantes se guarda saferent.language en localStorage; si está bloqueado, el cambio sigue funcionando en memoria.
Para cuentas, PATCH /auth/language guarda solamente el idioma de la identidad autenticada. Una solicitud fallida mantiene el idioma anterior.
No se remontan páginas ni se vacían formularios al traducir.

Los componentes se suscriben mediante useTranslation. Los datos traducibles de configuración, FAQ y documentos legales se generan mediante funciones al consumirlos, para evitar congelar textos en el primer idioma.
Los avisos persistentes usan useMessageState y descriptores { key, params }; las validaciones y los errores ya visibles pueden traducirse sin borrar sus valores.
LocalizedError y LocalizedHttpError conservan claves/payloads y resuelven su mensaje en el idioma actual, incluso cuando React Query mantiene el error en caché.
La instancia compartida sin efectos de navegador está en src/i18n/instance.ts; la inicialización de la aplicación está en src/i18n/index.ts.

Las claves son planas y semánticas, con namespaces por módulo; keySeparator está deshabilitado. Los parámetros de mensajes dinámicos se conservan y verifican en la compilación.
Para frases con componentes o enlaces se utiliza Trans. No se inyectan traducciones como HTML.
Los recursos iniciales se empaquetan con Vite: no hay llamadas a un servicio externo para traducir ni solicitudes HTTP al alternar el idioma.

## Contenido que conserva su idioma original

Nombres de personas, direcciones, títulos/descripciones de propiedades, mensajes, comentarios y notas escritas por usuarios conservan su texto original.
Los nombres de producto, marcas, códigos monetarios, números, símbolos y nombres propios de idiomas tampoco requieren traducción.
Los controles nativos del navegador o del sistema —por ejemplo, su calendario o sus permisos— dependen del navegador, no de los JSON de SafeRent.

Las categorías de ayuda mantienen identificadores estables para filtrar; categoryLabel traduce su presentación. La búsqueda usa preguntas, respuestas y categorías traducidas, conservando aliases de búsqueda existentes.
El idioma modifica el formato del precio, no la moneda ni el tipo de cambio. El formateador monetario conserva aritmética decimal/BigInt y no convierte importes grandes a Number.
Las fechas sin hora, como el nacimiento y la versión legal, usan UTC al formatear para no retroceder un día en UTC-6.

## Catálogos y base de datos

Se consultaron de solo lectura los catálogos públicos del backend local: 8 servicios y 4 tipos.
La migración 1792713600000-catalog-i18n.ts agrega catalogCode y translations a service y type_of_property.
Una asociación inicial revisada asigna códigos a las entradas conocidas; el cliente traduce por código y nunca compara el nombre visible para resolver traducciones.
Las traducciones específicas almacenadas tienen prioridad sobre el catálogo fijo. Una entrada personalizada conserva su texto base cuando carece de una traducción.
El editor administrativo permite mantener nombres y descripciones en inglés, francés y portugués junto a los campos principales en español.
La creación por HTTP exige el objeto de traducciones de los cuatro idiomas; el cliente exige descripciones traducidas cuando existe una descripción principal.
Los códigos no son editables mediante el DTO de servicios.

La preferencia de cuenta utiliza 1792627200000-profile-language.ts.
En desarrollo, la sincronización existente crea las columnas; CatalogBootstrap asigna códigos faltantes a las entradas iniciales sin sobrescribir códigos existentes.
Con DB_SYNCHRONIZE=false se ejecutan las migraciones registradas al iniciar, incluida la asociación inicial de códigos.

**Desplegar/reiniciar primero el backend y después el frontend.** Un backend antiguo no devuelve catalogCode/translations ni reconoce los campos nuevos.
El 22 de octubre se aplicaron las dos migraciones de internacionalización en la base configurada y se verificó que no quedan migraciones pendientes. Se comprobaron persistencia real y protección de identidad/roles con fixtures revertidos. Los nombres originales de los catálogos no se renombraron. Esto no certifica un destino de producción diferente.
Las entradas adicionales creadas en otro entorno requieren traducciones explícitas; no se inventan traducciones de contenido desconocido.

## Contratos de errores y correo

Las excepciones HTTP incorporan code y params, conservando message para compatibilidad. El cliente utiliza los códigos de api.json.
La ValidationPipe global devuelve VALIDATION_FAILED con details [{ field, code }]. Los nombres de campos y restricciones se resuelven con fields.json y serverValidation.json.
Los mensajes desconocidos o errores de infraestructura usan avisos genéricos localizados; no se muestran respuestas técnicas sin traducir.
Accept-Language se envía en los clientes autenticados y determina el idioma de la búsqueda de direcciones de Geoapify.

El correo de recuperación se genera desde los JSON de src/mail/locales. Ya no requiere BREVO_RESET_TEMPLATE_ID.
Brevo sigue siendo el transporte; se mantienen remitente verificado, API key, TTL, límites, tokens de un uso y cifrado.
La cola cifra identificador e idioma de solicitud. El worker prioriza la preferencia de cuenta, luego la solicitud y español.
Los trabajos anteriores que solo cifraban el identificador siguen siendo compatibles.
El enlace lleva lang, y la duración distingue singular/plural. Los tests simulan el transporte; no se enviaron correos reales en esta entrega.

## Controles y resultados

- pnpm i18n:check: igualdad de claves y variables en los cuatro idiomas, valores no vacíos, etiquetas de Trans, referencias, parámetros requeridos, plurales, respaldo y detección.
- El mismo control incluye la auditoría AST de JSX, atributos, configuraciones y expresiones. Resultado actual: cero candidatos de texto visible incrustado.
- La auditoría clasifica identificadores, valores técnicos, aliases, marcas y símbolos. Cero candidatos no demuestra por sí solo que una integración externa o una nueva entrada de catálogo esté traducida.
- Los tests también comprueban errores almacenados al alternar idioma, códigos de catálogo independientes del nombre, traducciones personalizadas, fechas sin desplazamiento y precios grandes exactos en los cuatro locales.
- pnpm build ejecuta el control antes de TypeScript/Vite. TypeScript, Vite y ESLint del frontend pasan. El backend compila y empaqueta los cuatro JSON de correo.
- El control de rutas por rol verifica CLIENT, OWNER, ADMIN, cuentas con varios roles y redirección por pérdida de sesión.
- Las 15 suites relevantes del backend aprobaron 169 pruebas, incluidos los contratos de búsqueda y catálogo corregidos.
- La suite global final aprobó 34/49 suites: 381 pruebas aprobadas y 24 fallidas; otras dos suites no ejecutan casos por Jest/ESM. El detalle y los comandos están en [el informe del backend](../../safeRent-backend/docs/i18n-verification.md). La suite global no se declara aprobada.
- Revisión en navegador: cambios de idioma, conservación de formularios/errores (primera etapa), búsqueda traducida de FAQ en francés y política completa con fecha localizada en portugués. Hay capturas en esta carpeta.

## Verificación previa a publicación — 22 de octubre de 2026

Completado en esta base y checkout:

- Migraciones versionadas aplicadas y registradas, prueba up/down/repetición en tablas temporales y comprobación posterior sin pendientes.
- Persistencia PostgreSQL de preferencias para CLIENT, OWNER y ADMIN en los cuatro idiomas, sin cambiar identidad o roles. Catálogo JSON creado, editado y leído. Datos de prueba revertidos.
- Navegador con cuentas temporales, autenticación y guards reales: ajustes de los tres roles × cuatro idiomas a 390 px, sin desbordamiento horizontal. Se verificó recarga del perfil del inquilino.
- Paneles iniciales de los tres roles y estado vacío de reservas en francés. Las entradas del catálogo existente se presentan traducidas por código.
- Formulario administrativo: validación, conservación de campos al cambiar entre los cuatro idiomas, creación, edición francesa, recarga y presentación portuguesa del registro temporal. Revisión a 390 y 1440 px en cuatro idiomas; revisión adicional a 320 px en francés.
- La revisión encontró 15 textos en propiedades personalizadas como linkLabel y emptyDescription. Se tradujeron y el auditor ahora cubre estos atributos. También se corrigieron plurales de habitaciones/personas.
- Se habilitó el botón de creación que estaba comentado, se incorporó un selector de idioma al catálogo y se hicieron visibles/legibles los campos de traducción en móvil. Se corrigió el mínimo global del body que provocaba desbordamiento a 320 px.
- Se corrigió el título de navegador del catálogo y el comando productivo del backend para usar su salida compilada real.

La evidencia de navegador está en i18n-browser-checks.json y la captura i18n-catalog-mobile-pt.png. El servidor QA usa una transacción PostgreSQL y sustituye los workers de recuperación/correo y sincronización de monedas. No envía mensajes ni correos. Al finalizar se verificaron **cero cuentas y cero catálogos temporales persistidos**.

### Pendiente para autorizar publicación

1. Resolver las 15 suites globales pendientes (24 casos fallidos y dos suites con error de carga ESM); ver el informe del backend. No se consideran aprobadas.
2. Completar la matriz exhaustiva de estados de negocio: propiedades con datos y moderación, reservas, adjuntos, conversaciones, formularios de publicación y errores de red en cada rol/idioma. Las comprobaciones descritas arriba son pruebas de humo concretas; no equivalen a recorrer todos los estados.
3. Revisar en dispositivos móviles físicos. Los tamaños de navegador comprobados verifican diseño adaptable y no emulan teclado táctil, Safari/iOS ni Android real.
4. Revisión editorial del grupo, especialmente francés/portugués y el borrador legal. Se conservó su estructura y fecha; esta comprobación técnica no sustituye su aprobación editorial.
5. Si producción utiliza otra base/servidor, ejecutar allí las migraciones y el mismo control de persistencia; desplegar backend antes del frontend y comprobar el enrutamiento /api.

El build mantiene un aviso de tamaño del chunk principal: aproximadamente 1,24 MB minificado / 370 kB gzip. La carga diferida por idioma puede evaluarse como mejora de rendimiento; el aviso no se ocultó.

**Estado: verificación técnica ampliada, publicación todavía pendiente.**
