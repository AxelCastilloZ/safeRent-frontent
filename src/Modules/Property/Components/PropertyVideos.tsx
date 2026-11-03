import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import type { Property } from '../../Explore/interfaces/property.interface'
import { videoUrls } from '../../Explore/utils/property.utils'

/** Video del recorrido de la propiedad. No aparece si el propietario no subió ninguno. */
export default function PropertyVideos({ property }: { property: Pick<Property, 'files'> }) {
  useTranslation()
  const videos = videoUrls(property)
  if (videos.length === 0) return null
  return (
    <section className="mt-8 border-t border-slate-200 pt-6" aria-labelledby="property-videos-title">
      <h2 id="property-videos-title" className="text-xl font-bold">{i18n.t('property:videosTitle', { count: videos.length })}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {videos.map((url, index) => (
          <video
            key={url}
            src={url}
            controls
            preload="metadata"
            playsInline
            aria-label={i18n.t('property:videoLabel', { number: index + 1 })}
            className="aspect-video w-full rounded-xl bg-slate-900"
          />
        ))}
      </div>
    </section>
  )
}
