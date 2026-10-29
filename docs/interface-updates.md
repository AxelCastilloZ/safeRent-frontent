# Cambios de interfaz — 27 de octubre de 2026

- Mis propiedades usa la tarjeta de propiedades guardadas: fotografía, título, ubicación y precio; conserva estados y acciones de gestión fuera del enlace de la tarjeta.
- Ver abre una vista previa privada con galería, descripción y tarjeta de precio compartidas con el detalle público. Agendar está deshabilitado en esta vista; editar y enviar a revisión siguen disponibles según el estado.
- Los mensajes de citas conservan saltos de línea y parten palabras continuas. El formulario mantiene el límite de 500 caracteres y muestra un contador.
- Se quitó el fondo blanco y el relleno del logo del sidebar; se conserva el archivo original.
- El dashboard ocupa el viewport y su contenido tiene un único scroll principal. Los paneles de chat y diálogos conservan desplazamientos propios cuando corresponde.
- Idioma y moneda están visibles en la barra pública, Explorar y el dashboard, también en móvil. El idioma usa su código en barras compactas. La moneda de invitados persiste en el navegador; la de usuarios se guarda mediante PATCH /auth/currency, sin reescribir el perfil completo. GET /auth/display-currencies expone solo el catálogo público de monedas.
- El chat muestra un acceso a la cita vigente de esa propiedad compartida con la otra persona; no muestra citas ajenas ni conversaciones directas del administrador.
- Servicios está en /dashboard/admin/services con la navegación del administrador; /admin/services redirige conservando el control de acceso. Se ajustó su distribución para el ancho disponible dentro del panel.
- Los comentarios nuevos permiten estrellas de 1 a 5. El promedio excluye comentarios históricos sin puntuación y comentarios ocultos. Se mantiene la restricción de un comentario por inquilino vinculado y propiedad.
- Los textos nuevos están traducidos a español, inglés, francés y portugués.

## Verificación

Compilación y lint del frontend, compilación del backend, validación de traducciones y scripts de puntuaciones. Las pruebas del backend cubren puntuaciones, moderación, perfil y preferencias autenticadas.

`scripts/check-dashboard-ui.cjs` ejecuta verificaciones con Playwright y datos simulados, sin cuentas ni escrituras reales: tarjetas, vista previa, textos de citas, Ajustes, Servicios, chat, puntuaciones y moneda. Usa `PLAYWRIGHT_MODULE` para una instalación externa de Playwright, `UI_BASE_URL` para el servidor local y `UI_BROWSER` para el canal del navegador. Las capturas y resultados se guardan en `docs/ui-verification/` y son fixtures, no datos reales.

## Activación del backend

Reiniciar el backend para cargar los endpoints nuevos y aplicar el campo de puntuación mediante la sincronización de desarrollo o la migración registrada para DB_SYNCHRONIZE=false. No se han modificado datos reales ni publicado el sistema.
