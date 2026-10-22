# Internacionalización de SafeRent

## Estado — 22 de octubre de 2026

Se integró JSON + i18next + react-i18next + Intl nativo en los módulos de la aplicación.
Hay 23 namespaces y 1.172 claves por idioma: español (es-CR), inglés (en-US), francés (fr-FR) y portugués de Brasil (pt-BR).
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
No se aplicaron migraciones contra la base de datos durante esta entrega. Los datos originales de los catálogos no se renombraron.
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
- En la selección ampliada del backend: 151 pruebas aprobadas y 4 fallidas en property-search.spec.ts. Las 13 suites restantes pasan, incluidas las nuevas pruebas de idioma, catálogo, validación y correo.
- La ejecución final de esas 13 suites aprobó sus 139 pruebas; la suite de búsqueda con las cuatro fallas sigue registrada por separado y no se declara aprobada.
- Las cuatro fallas de búsqueda corresponden a expectativas existentes de serviceIds vacío/1e2 y a fixtures sin UserService. Ese DTO no fue modificado y la dependencia ya existía en HEAD; no se consideran pruebas aprobadas ni se ocultaron cambiando expectativas.
- Revisión en navegador: cambios de idioma, conservación de formularios/errores (primera etapa), búsqueda traducida de FAQ en francés y política completa con fecha localizada en portugués. Hay capturas en esta carpeta.

## Verificación restante antes de publicar

1. Aplicar las migraciones en el entorno destino y verificar persistencia real de preferencias y traducciones del catálogo.
2. Revisar con cuentas de los tres roles todos los estados en los cuatro idiomas, especialmente formularios administrativos largos y pantallas móviles. No se ejecutó esa matriz manual completa.
3. Revisar las traducciones con el grupo y conservar la revisión editorial del borrador legal antes de publicarlo; su estructura y fecha no se alteraron.
4. Resolver por separado los fixtures/expectativas antiguos de búsqueda y las demás pruebas antiguas con dependencias incompletas si se desea certificar la suite global.

La implementación no declara completada una certificación de cobertura total mientras esas verificaciones de despliegue y uso real sigan pendientes.
