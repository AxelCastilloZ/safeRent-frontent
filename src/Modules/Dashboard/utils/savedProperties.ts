// "Guardar propiedad" (PublicPropertyPage) todavía vive solo en este navegador:
// una clave `saved-property-<id>` = 'true' por propiedad. Aquí se leen para el panel.
const PREFIX = 'saved-property-';

/** Ids de las propiedades guardadas en este dispositivo (vacío si no hay acceso a localStorage). */
export function readSavedPropertyIds(): number[] {
  try {
    const ids: number[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(PREFIX) || localStorage.getItem(key) !== 'true') continue;
      const id = Number(key.slice(PREFIX.length));
      if (Number.isInteger(id) && id > 0) ids.push(id);
    }
    return ids.sort((a, b) => a - b);
  } catch {
    return [];
  }
}
