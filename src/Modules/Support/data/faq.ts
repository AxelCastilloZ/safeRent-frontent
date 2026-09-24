import { normalize } from '../../Explore/properties'
import type { FaqItem } from '../types/faq'

export const faqItems: FaqItem[] = [
  {
    id: 'crear-cuenta',
    category: 'Cuenta y perfil',
    question: '¿Cómo creo una cuenta?',
    answer:
      'Desde el botón "Registrarse" en la parte superior puedes crear tu cuenta como inquilino o arrendatario, indicando tus datos básicos de contacto.',
    keywords: ['registro', 'registrarse', 'cuenta nueva', 'crear cuenta'],
  },
  {
    id: 'editar-perfil',
    category: 'Cuenta y perfil',
    question: '¿Cómo puedo editar mi perfil?',
    answer: 'Puedes actualizar tu nombre, teléfono y preferencias desde la sección de ajustes de tu cuenta.',
    keywords: ['perfil', 'ajustes', 'editar datos', 'configuración'],
  },
  {
    id: 'publicar-propiedad',
    category: 'Publicación de propiedades',
    question: '¿Cómo publico una propiedad?',
    answer:
      'Si tienes una cuenta de arrendatario, puedes crear una publicación agregando fotos, precio, dirección y los servicios disponibles de tu propiedad.',
    keywords: ['publicar', 'anunciar', 'nueva propiedad', 'arrendatario'],
  },
  {
    id: 'editar-propiedad',
    category: 'Publicación de propiedades',
    question: '¿Puedo editar una propiedad después de publicarla?',
    answer: 'Sí, desde tu panel de propiedades puedes actualizar fotos, precio, descripción y disponibilidad en cualquier momento.',
    keywords: ['editar propiedad', 'actualizar', 'disponibilidad', 'precio'],
  },
  {
    id: 'buscar-propiedades',
    category: 'Búsqueda y filtros',
    question: '¿Cómo busco propiedades por zona o precio?',
    answer:
      'Desde "Explorar" puedes indicar una ubicación y un rango de precio; el listado y el mapa se actualizan con las propiedades que coinciden.',
    keywords: ['buscar', 'filtros', 'zona', 'ubicación', 'precio', 'explorar'],
  },
  {
    id: 'sin-resultados-busqueda',
    category: 'Búsqueda y filtros',
    question: '¿Qué hago si no encuentro propiedades en mi zona?',
    answer: 'Prueba ampliar el rango de precio o quitar alguno de los filtros aplicados; también puedes limpiar la búsqueda desde el explorador.',
    keywords: ['sin resultados', 'zona', 'ampliar búsqueda', 'limpiar filtros'],
  },
  {
    id: 'servicios-verificables',
    category: 'Servicios de propiedades',
    question: '¿Qué significan los servicios verificados de una propiedad?',
    answer: 'Son datos como agua, electricidad o velocidad de internet que el arrendador registra para que sepas con qué cuenta la propiedad.',
    keywords: ['servicios', 'agua', 'electricidad', 'internet', 'verificado'],
  },
  {
    id: 'servicios-catalogo',
    category: 'Servicios de propiedades',
    question: '¿Quién define los servicios disponibles de una propiedad?',
    answer: 'El arrendador selecciona los servicios de un catálogo al crear o editar su publicación.',
    keywords: ['catálogo de servicios', 'arrendador', 'amenidades'],
  },
  {
    id: 'contactar-arrendador',
    category: 'Mensajería',
    question: '¿Cómo contacto a un arrendador?',
    answer:
      'Dentro del detalle de cada propiedad encontrarás una opción para iniciar una conversación con el arrendador a través de la mensajería interna de SafeRent.',
    keywords: ['contactar', 'mensajería', 'chat', 'arrendador'],
  },
  {
    id: 'mensajeria-privacidad',
    category: 'Mensajería',
    question: '¿La mensajería expone mi número o correo?',
    answer: 'No. La conversación ocurre dentro de SafeRent sin compartir tus datos de contacto directamente con la otra persona.',
    keywords: ['privacidad', 'mensajería', 'contacto', 'datos personales'],
  },
  {
    id: 'sistema-resenas',
    category: 'Reseñas',
    question: '¿Cómo funciona el sistema de reseñas?',
    answer:
      'Los inquilinos que han vivido en una propiedad pueden dejar una reseña y calificación, ayudando a que futuros interesados conozcan la experiencia real de vivir ahí.',
    keywords: ['reseñas', 'calificación', 'experiencia', 'residentes'],
  },
  {
    id: 'quien-puede-resenar',
    category: 'Reseñas',
    question: '¿Quién puede dejar una reseña?',
    answer: 'Cualquier inquilino que haya tenido una estadía registrada en la propiedad puede compartir su experiencia.',
    keywords: ['reseña', 'inquilino', 'calificar'],
  },
  {
    id: 'reportar-publicacion',
    category: 'Seguridad y privacidad',
    question: '¿Cómo reporto una publicación?',
    answer: 'Si una publicación te parece incorrecta o sospechosa, puedes reportarla para que el equipo de moderación de SafeRent la revise.',
    keywords: ['reportar', 'denunciar', 'moderación', 'publicación sospechosa'],
  },
  {
    id: 'proteccion-datos',
    category: 'Seguridad y privacidad',
    question: '¿Cómo protege SafeRent mis datos personales?',
    answer: 'Solo mostramos la información necesaria para el proceso de alquiler; podés revisar el detalle en nuestra Política de privacidad.',
    keywords: ['seguridad', 'privacidad', 'datos personales', 'protección'],
  },
]

/**
 * Búsqueda 100% local: normaliza (sin tildes, minúsculas) y busca la
 * coincidencia como subcadena en pregunta + categoría + respuesta + keywords.
 * Reutilizado tanto por el listado de FAQ como por las sugerencias en vivo
 * del buscador, para no duplicar la lógica de coincidencia.
 */
export function searchFaq(query: string, items: FaqItem[] = faqItems): FaqItem[] {
  const normalizedQuery = normalize(query.trim())
  if (!normalizedQuery) return items
  return items.filter((item) =>
    normalize([item.question, item.category, item.answer, ...item.keywords].join(' ')).includes(normalizedQuery),
  )
}
