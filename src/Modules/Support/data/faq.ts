import { categoryLabel } from '../categoryLabel';
import i18n from '../../../i18n/instance';
import { normalize } from '../../Explore/utils/property.utils'
import type { FaqItem } from '../types/faq'

export const faqItems: () => FaqItem[] = () => ([
  {
    id: 'crear-cuenta',
    category: 'Cuenta y perfil',
    question: i18n.t("support:faq_como_creo_una_cuenta"),
    answer:
      i18n.t("support:faq_desde_el_boton_registrarse_en_la_parte_superior_puedes"),
    keywords: ['registro', 'registrarse', i18n.t("support:faq_cuenta_nueva"), i18n.t("support:faq_crear_cuenta")],
  },
  {
    id: 'editar-perfil',
    category: 'Cuenta y perfil',
    question: i18n.t("support:faq_como_puedo_editar_mi_perfil"),
    answer: i18n.t("support:faq_puedes_actualizar_tu_nombre_telefono_y_preferencias_desde_la"),
    keywords: ['perfil', 'ajustes', i18n.t("support:faq_editar_datos"), i18n.t("support:faq_configuracion")],
  },
  {
    id: 'publicar-propiedad',
    category: 'Publicación de propiedades',
    question: i18n.t("support:faq_como_publico_una_propiedad"),
    answer:
      i18n.t("support:faq_si_tienes_una_cuenta_de_arrendatario_puedes_crear_una"),
    keywords: ['publicar', 'anunciar', i18n.t("support:faq_nueva_propiedad"), 'arrendatario'],
  },
  {
    id: 'editar-propiedad',
    category: 'Publicación de propiedades',
    question: i18n.t("support:faq_puedo_editar_una_propiedad_despues_de_publicarla"),
    answer: i18n.t("support:faq_si_desde_tu_panel_de_propiedades_puedes_actualizar_fotos"),
    keywords: [i18n.t("support:faq_editar_propiedad"), 'actualizar', 'disponibilidad', 'precio'],
  },
  {
    id: 'buscar-propiedades',
    category: 'Búsqueda y filtros',
    question: i18n.t("support:faq_como_busco_propiedades_por_zona_o_precio"),
    answer:
      i18n.t("support:faq_desde_explorar_puedes_indicar_una_ubicacion_y_un_rango"),
    keywords: ['buscar', 'filtros', 'zona', i18n.t("support:faq_ubicacion"), 'precio', 'explorar'],
  },
  {
    id: 'sin-resultados-busqueda',
    category: 'Búsqueda y filtros',
    question: i18n.t("support:faq_que_hago_si_no_encuentro_propiedades_en_mi_zona"),
    answer: i18n.t("support:faq_prueba_ampliar_el_rango_de_precio_o_quitar_alguno"),
    keywords: [i18n.t("support:faq_sin_resultados"), 'zona', i18n.t("support:faq_ampliar_busqueda"), i18n.t("support:faq_limpiar_filtros")],
  },
  {
    id: 'servicios-verificables',
    category: 'Servicios de propiedades',
    question: i18n.t("support:faq_que_significan_los_servicios_verificados_de_una_propiedad"),
    answer: i18n.t("support:faq_son_datos_como_agua_electricidad_o_velocidad_de_internet"),
    keywords: ['servicios', 'agua', 'electricidad', 'internet', 'verificado'],
  },
  {
    id: 'servicios-catalogo',
    category: 'Servicios de propiedades',
    question: i18n.t("support:faq_quien_define_los_servicios_disponibles_de_una_propiedad"),
    answer: i18n.t("support:faq_el_arrendador_selecciona_los_servicios_de_un_catalogo_al"),
    keywords: [i18n.t("support:faq_catalogo_de_servicios"), 'arrendador', 'amenidades'],
  },
  {
    id: 'contactar-arrendador',
    category: 'Mensajería',
    question: i18n.t("support:faq_como_contacto_a_un_arrendador"),
    answer:
      i18n.t("support:faq_dentro_del_detalle_de_cada_propiedad_encontraras_una_opcion"),
    keywords: ['contactar', i18n.t("support:faq_mensajeria_46a6f5"), 'chat', 'arrendador'],
  },
  {
    id: 'mensajeria-privacidad',
    category: 'Mensajería',
    question: i18n.t("support:faq_la_mensajeria_expone_mi_numero_o_correo"),
    answer: i18n.t("support:faq_no_la_conversacion_ocurre_dentro_de_saferent_sin_compartir"),
    keywords: ['privacidad', i18n.t("support:faq_mensajeria_46a6f5"), 'contacto', i18n.t("support:faq_datos_personales")],
  },
  {
    id: 'sistema-resenas',
    category: 'Reseñas',
    question: i18n.t("support:faq_como_funciona_el_sistema_de_resenas"),
    answer:
      i18n.t("support:faq_los_inquilinos_que_han_vivido_en_una_propiedad_pueden"),
    keywords: [i18n.t("support:faq_resenas_c0ca3a"), i18n.t("support:faq_calificacion"), 'experiencia', 'residentes'],
  },
  {
    id: 'quien-puede-resenar',
    category: 'Reseñas',
    question: i18n.t("support:faq_quien_puede_dejar_una_resena"),
    answer: i18n.t("support:faq_cualquier_inquilino_que_haya_tenido_una_estadia_registrada_en"),
    keywords: [i18n.t("support:faq_resena"), 'inquilino', 'calificar'],
  },
  {
    id: 'reportar-publicacion',
    category: 'Seguridad y privacidad',
    question: i18n.t("support:faq_como_reporto_una_publicacion"),
    answer: i18n.t("support:faq_si_una_publicacion_te_parece_incorrecta_o_sospechosa_puedes"),
    keywords: ['reportar', 'denunciar', i18n.t("support:faq_moderacion"), i18n.t("support:faq_publicacion_sospechosa")],
  },
  {
    id: 'proteccion-datos',
    category: 'Seguridad y privacidad',
    question: i18n.t("support:faq_como_protege_saferent_mis_datos_personales"),
    answer: i18n.t("support:faq_solo_mostramos_la_informacion_necesaria_para_el_proceso_de"),
    keywords: ['seguridad', 'privacidad', i18n.t("support:faq_datos_personales"), i18n.t("support:faq_proteccion")],
  },
])

/**
 * Búsqueda 100% local: normaliza (sin tildes, minúsculas) y busca la
 * coincidencia como subcadena en pregunta + categoría + respuesta + keywords.
 * Reutilizado tanto por el listado de FAQ como por las sugerencias en vivo
 * del buscador, para no duplicar la lógica de coincidencia.
 */
export function searchFaq(query: string, items: FaqItem[] = faqItems()): FaqItem[] {
  const normalizedQuery = normalize(query.trim())
  if (!normalizedQuery) return items
  return items.filter((item) =>
    normalize([item.question, categoryLabel(item.category), item.answer, ...item.keywords].join(' ')).includes(normalizedQuery),
  )
}
