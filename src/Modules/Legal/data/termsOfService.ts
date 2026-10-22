import i18n from '../../../i18n/instance';
import type { LegalSection } from '../types/legal'

export const termsOfServiceSections: () => LegalSection[] = () => ([
  {
    id: 'aceptacion-de-los-terminos',
    title: i18n.t("legal:termsofservice_1_aceptacion_de_los_terminos"),
    paragraphs: [
      i18n.t("legal:termsofservice_al_utilizar_saferent_aceptas_estos_terminos_del_servicio_este"),
    ],
  },
  {
    id: 'descripcion-de-saferent',
    title: i18n.t("legal:termsofservice_2_descripcion_de_saferent"),
    paragraphs: [
      i18n.t("legal:termsofservice_saferent_es_una_plataforma_tecnologica_que_conecta_y_facilita"),
    ],
  },
  {
    id: 'registro-y-cuentas',
    title: i18n.t("legal:termsofservice_3_registro_y_cuentas_de_usuario"),
    paragraphs: [
      i18n.t("legal:termsofservice_para_acceder_a_ciertas_funciones_es_necesario_crear_una"),
    ],
  },
  {
    id: 'roles-de-usuario',
    title: i18n.t("legal:termsofservice_4_roles_de_usuario"),
    paragraphs: [
      i18n.t("legal:termsofservice_la_plataforma_contempla_distintos_roles_entre_ellos_inquilino_arrendatario"),
    ],
  },
  {
    id: 'publicacion-de-propiedades',
    title: i18n.t("legal:termsofservice_5_publicacion_de_propiedades"),
    paragraphs: [
      i18n.t("legal:termsofservice_los_arrendatarios_pueden_publicar_propiedades_incluyendo_informacion_como_fotografias"),
    ],
  },
  {
    id: 'responsabilidades-del-arrendador',
    title: i18n.t("legal:termsofservice_6_responsabilidades_del_arrendador"),
    paragraphs: [
      i18n.t("legal:termsofservice_quien_publica_una_propiedad_es_responsable_de_la_veracidad"),
    ],
  },
  {
    id: 'responsabilidades-del-inquilino',
    title: i18n.t("legal:termsofservice_7_responsabilidades_del_inquilino"),
    paragraphs: [
      i18n.t("legal:termsofservice_quien_busca_una_vivienda_es_responsable_de_utilizar_la"),
    ],
  },
  {
    id: 'comunicacion-entre-usuarios',
    title: i18n.t("legal:termsofservice_8_comunicacion_entre_usuarios"),
    paragraphs: [
      i18n.t("legal:termsofservice_saferent_facilita_un_canal_de_mensajeria_interno_para_que"),
    ],
  },
  {
    id: 'contenido-y-resenas',
    title: i18n.t("legal:termsofservice_9_contenido_y_resenas"),
    paragraphs: [
      i18n.t("legal:termsofservice_las_resenas_buscan_reflejar_experiencias_reales_de_los_usuarios"),
    ],
  },
  {
    id: 'conductas-prohibidas',
    title: i18n.t("legal:termsofservice_10_conductas_prohibidas"),
    paragraphs: [
      i18n.t("legal:termsofservice_no_esta_permitido_publicar_informacion_falsa_utilizar_la_plataforma"),
    ],
  },
  {
    id: 'reportes-y-moderacion',
    title: i18n.t("legal:termsofservice_11_reportes_y_moderacion"),
    paragraphs: [
      i18n.t("legal:termsofservice_los_usuarios_pueden_reportar_publicaciones_o_comportamientos_que_consideren"),
    ],
  },
  {
    id: 'suspension-o-eliminacion',
    title: i18n.t("legal:termsofservice_12_suspension_o_eliminacion_de_cuentas"),
    paragraphs: [
      i18n.t("legal:termsofservice_saferent_podra_suspender_o_eliminar_cuentas_que_incumplan_estos"),
    ],
  },
  {
    id: 'limitaciones-del-servicio',
    title: i18n.t("legal:termsofservice_13_limitaciones_del_servicio"),
    paragraphs: [
      i18n.t("legal:termsofservice_saferent_actua_como_intermediario_tecnologico_y_no_garantiza_la"),
    ],
  },
  {
    id: 'propiedad-intelectual',
    title: i18n.t("legal:termsofservice_14_propiedad_intelectual"),
    paragraphs: [
      i18n.t("legal:termsofservice_el_nombre_la_marca_y_los_elementos_visuales_de"),
    ],
  },
  {
    id: 'cambios-en-los-terminos',
    title: i18n.t("legal:termsofservice_15_cambios_en_los_terminos"),
    paragraphs: [
      i18n.t("legal:termsofservice_estos_terminos_podran_actualizarse_conforme_el_proyecto_evolucione_buscaremos"),
    ],
  },
  {
    id: 'contacto',
    title: i18n.t("legal:termsofservice_16_contacto"),
    paragraphs: [
      i18n.t("legal:termsofservice_para_consultas_relacionadas_con_estos_terminos_del_servicio_puedes"),
    ],
  },
])
