# Internacionalización de SafeRent

## Estado — 22 de octubre de 2026

Se integró JSON + i18next + react-i18next + Intl nativo en los módulos de la aplicación.
Hay 23 namespaces y 1.197 claves por idioma: español (es-CR), inglés (en-US), francés (fr-FR) y portugués de Brasil (pt-BR).
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

## Controles y resultados — 22 de octubre de 2026

- i18n:check: 23 namespaces, 1197 claves por idioma y 1282 referencias verificadas. Igualdad de claves/variables, valores no vacíos, etiquetas, parámetros, plurales, respaldo, detección, errores almacenados, catálogos, fechas e importes exactos.
- Auditoría AST: cero candidatos de texto incrustado. Incluye atributos personalizados como linkLabel/emptyDescription; sigue siendo una heurística, acompañada por pruebas de integración y navegador.
- TypeScript, ESLint y build del frontend aprobados. El backend compila y empaqueta los cuatro JSON de correo. Rutas por rol y siete controles monetarios aprobados.
- **Suite global: 49/49 suites y 411/411 pruebas aprobadas, sin omisiones.** Los fixtures de repositorios/dependencias y las expectativas de estados/publicación quedaron actualizados. Los tests de login incluyen contraseña incorrecta, cuentas inactivas/ausentes y claims de sesión. El contrato público de detalles se conserva; contactar al propietario y acceder a datos privados siguen protegidos.
- **216 solicitudes HTTP aprobadas contra PostgreSQL**, 54 por idioma, con JWT/guards reales: perfil, permisos, borrador/envío/cambios/aprobación, conversación idempotente, remitente, lectura, adjuntos privados y MIME, reserva/liberación, guardados, comentario único/moderación y conversaciones directas. No se enviaron mensajes a cuentas reales ni correos.
- Los detalles, comandos y resúmenes están en [el informe del backend](../../safeRent-backend/docs/i18n-verification.md), i18n-jest-checks.json e i18n-flow-checks.json.

## Revisión en navegador

Las comprobaciones usan cuentas y contenido ficticios dentro de una transacción PostgreSQL, con recuperación/correo y sincronización de monedas deshabilitados. No sustituyen dispositivos físicos.

| Escenario | Idiomas | Ancho | Resultado |
| --- | --- | --- | --- |
| Ajustes CLIENT/OWNER/ADMIN | es/en/fr/pt | 390 px | Cambio de idioma y preferencia; sin desbordamiento |
| Catálogo administrativo y formulario de traducciones | es/en/fr/pt | 390 y 1440 px | Campos conservados; creación/edición/recarga; sin desbordamiento |
| Catálogo, revisión adicional | fr | 320 px | Desbordamiento del mínimo global corregido |
| Reserva poblada del inquilino | es/en/fr/pt | 390 px | Datos, fechas, precio y acciones traducidos |
| Propiedades del propietario: DRAFT/PENDING/CHANGES_REQUESTED/ACTIVE/INACTIVE | es/en/fr/pt | 390 px | Estados y acciones; sin desbordamiento |
| Comentarios administrativos poblados | es/en/fr/pt | 390 px | Estados, filtros y etiquetas; sin desbordamiento |
| Conversación poblada y confirmación de quitar reserva | fr | 390 px | Contenido de usuario conservado; acciones traducidas |
| Ocultar/restaurar comentario ficticio | fr | 390 px | Motivo obligatorio, ocultación y restauración correctas |
| Backend detenido durante moderación | fr | 390 px | Error de conexión traducido; motivo escrito conservado |
| Publicación, pasos 1 y 2 | es/en/fr/pt | 390 px | Campos/errores conservados al cambiar idioma; sin desbordamiento |
| Guardar borrador, avanzar y volver | fr | 390 px | Título/descripción/precio/tipo/servicios recuperados desde PostgreSQL |

En esta revisión se añadió el selector de idioma al formulario de publicación para alternar sin abandonarlo. Se corrigieron los plurales del contador de servicios y los resúmenes de propiedades adicionales, los títulos del navegador de comentarios/usuarios/reportes y el tooltip de atribución Leaflet en ambos mapas. Las marcas y atribuciones se conservaron.

Evidencias: i18n-browser-checks.json, i18n-populated-browser-checks.json, i18n-publication-browser-checks.json y capturas en esta carpeta. La búsqueda de FAQ francesa y la política portuguesa ya se habían revisado en la etapa anterior. La revisión no incluye toda combinación posible de datos, permisos del navegador o fallos de proveedores externos.

## Esquema de la base configurada

Se detectó una diferencia posterior a la aplicación original: el historial conservaba las dos migraciones, pero sus cinco columnas habían desaparecido. Se reparó explícitamente con check-i18n-db.cjs --repair y volvió a pasar la persistencia. El comprobador ahora contrasta columnas reales e historial.

La causa concreta no se identificó; es compatible con sincronización desde código anterior. **Detener instancias antiguas que compartan la base y usar DB_SYNCHRONIZE=false en producción.** No basta con consultar la tabla migrations.

Al terminar se comprobaron cero cuentas, propiedades y mensajes ficticios persistidos; también se revirtió el borrador creado desde navegador y se verificó que las cinco columnas seguían presentes. No quedaron archivos PNG temporales de QA. El servidor de vista previa dispone de cierre ordenado con stop/Enter, drenaje de solicitudes y límite de 15 minutos.

## Pendiente para autorizar publicación

- [x] Resolver las pruebas globales fallidas y repetir la suite completa.
- [x] Verificar esquema y persistencia real, incluyendo detección de diferencias respecto del historial.
- [x] Recorrer los flujos principales por HTTP en los cuatro idiomas con los tres roles.
- [x] Revisar paneles poblados, moderación, formularios de publicación, validación y error de red en navegador según la matriz anterior.
- [ ] **Revisión editorial del grupo:** terminología es/en/fr/pt y texto legal. Conservar el significado y confirmar la fecha/versión del borrador. Esta entrega técnica no registra aprobación editorial.
- [ ] **Dispositivos físicos:** Safari/iOS y Chrome/Android, cuatro idiomas, teclado, desplazamiento, menús, formularios largos, modales, selección de imágenes y permisos de ubicación. No hay dispositivos físicos conectados a esta verificación.
- [ ] **Destino efectivo de producción:** detener versiones antiguas, configurar DB_SYNCHRONIZE=false, ejecutar migraciones y check-i18n-db.cjs, desplegar backend antes del frontend y comprobar HTTPS, enrutamiento /api y los flujos desde el dominio público. El entorno configurado aquí no certifica otro servidor/base.

El build conserva un aviso de tamaño del chunk principal (aproximadamente 1,24 MB minificado / 370 kB gzip). La carga diferida por idioma sigue siendo una posible mejora de rendimiento.

**Estado: suite global y matriz técnica documentada aprobadas; publicación pendiente de revisión editorial, dispositivos físicos y comprobación del destino.**
