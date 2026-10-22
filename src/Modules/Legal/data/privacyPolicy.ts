import i18n from '../../../i18n/instance';
import type { LegalSection } from '../types/legal'

export const privacyPolicySections: () => LegalSection[] = () => ([
  {
    id: 'introduccion',
    title: i18n.t("legal:privacypolicy_1_introduccion"),
    paragraphs: [
      i18n.t("legal:privacypolicy_esta_politica_de_privacidad_describe_de_forma_preliminar_como"),
    ],
  },
  {
    id: 'informacion-que-recopilamos',
    title: i18n.t("legal:privacypolicy_2_informacion_que_recopilamos"),
    paragraphs: [
      i18n.t("legal:privacypolicy_podemos_recopilar_la_informacion_que_proporcionas_directamente_al_crear"),
    ],
  },
  {
    id: 'como-utilizamos-la-informacion',
    title: i18n.t("legal:privacypolicy_3_como_utilizamos_la_informacion"),
    paragraphs: [
      i18n.t("legal:privacypolicy_la_informacion_recopilada_se_utiliza_para_operar_la_plataforma"),
    ],
  },
  {
    id: 'informacion-de-cuenta-y-perfil',
    title: i18n.t("legal:privacypolicy_4_informacion_de_cuenta_y_perfil"),
    paragraphs: [
      i18n.t("legal:privacypolicy_tu_perfil_puede_incluir_datos_basicos_de_identificacion_y"),
    ],
  },
  {
    id: 'informacion-de-propiedades',
    title: i18n.t("legal:privacypolicy_5_informacion_relacionada_con_propiedades"),
    paragraphs: [
      i18n.t("legal:privacypolicy_las_publicaciones_de_propiedades_pueden_incluir_direccion_aproximada_fotografias"),
    ],
  },
  {
    id: 'mensajes-y-comunicaciones',
    title: i18n.t("legal:privacypolicy_6_mensajes_y_comunicaciones"),
    paragraphs: [
      i18n.t("legal:privacypolicy_la_mensajeria_interna_busca_permitir_el_contacto_entre_arrendadores"),
    ],
  },
  {
    id: 'tecnologias-necesarias',
    title: i18n.t("legal:privacypolicy_7_uso_de_tecnologias_necesarias_para_el_funcionamiento_del"),
    paragraphs: [
      i18n.t("legal:privacypolicy_saferent_utiliza_tecnologias_basicas_de_almacenamiento_en_el_navegador"),
    ],
  },
  {
    id: 'como-compartimos-la-informacion',
    title: i18n.t("legal:privacypolicy_8_como_compartimos_la_informacion"),
    paragraphs: [
      i18n.t("legal:privacypolicy_no_vendemos_la_informacion_de_nuestros_usuarios_la_informacion"),
    ],
  },
  {
    id: 'seguridad-de-los-datos',
    title: i18n.t("legal:privacypolicy_9_seguridad_de_los_datos"),
    paragraphs: [
      i18n.t("legal:privacypolicy_trabajamos_en_implementar_medidas_razonables_para_proteger_la_informacion"),
    ],
  },
  {
    id: 'conservacion-de-informacion',
    title: i18n.t("legal:privacypolicy_10_conservacion_de_informacion"),
    paragraphs: [
      i18n.t("legal:privacypolicy_conservamos_la_informacion_mientras_la_cuenta_este_activa_o"),
    ],
  },
  {
    id: 'derechos-de-los-usuarios',
    title: i18n.t("legal:privacypolicy_11_derechos_de_los_usuarios"),
    paragraphs: [
      i18n.t("legal:privacypolicy_como_usuario_podras_solicitar_acceder_actualizar_o_eliminar_tu"),
    ],
  },
  {
    id: 'cambios-en-la-politica',
    title: i18n.t("legal:privacypolicy_12_cambios_en_la_politica"),
    paragraphs: [
      i18n.t("legal:privacypolicy_esta_politica_podra_actualizarse_conforme_el_proyecto_evolucione_buscaremos"),
    ],
  },
  {
    id: 'contacto',
    title: i18n.t("legal:privacypolicy_13_contacto"),
    paragraphs: [
      i18n.t("legal:privacypolicy_si_tienes_dudas_sobre_esta_politica_de_privacidad_puedes"),
    ],
  },
])
