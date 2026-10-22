import i18n from '../../i18n/instance';
import type { SupportCategory } from './types/faq';

const keys: Record<SupportCategory, string> = {
  'Cuenta y perfil': 'support:faq_cuenta_y_perfil',
  'Publicación de propiedades': 'support:faq_publicacion_de_propiedades',
  'Búsqueda y filtros': 'support:faq_busqueda_y_filtros',
  'Servicios de propiedades': 'support:faq_servicios_de_propiedades',
  'Mensajería': 'support:faq_mensajeria_617198',
  'Reseñas': 'support:faq_resenas_afa91b',
  'Seguridad y privacidad': 'support:faq_seguridad_y_privacidad',
};
export const categoryLabel = (category: SupportCategory) => i18n.t(keys[category]);
