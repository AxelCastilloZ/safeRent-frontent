import { AlertCircle, LoaderCircle, Upload, Video, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { message, messageFromError } from '../../../i18n/messages'
import { useMessageState } from '../../../i18n/useMessageState'
import { ApiError } from '../services/api'
import { propertyService } from '../services/propertyService'
import type { PropertyFile } from '../types/property'
import { FormSection } from './PropertyFormLayout'

const MAX_VIDEOS = 2
const MAX_VIDEO_MEGABYTES = 30
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

const isVideo = (file: PropertyFile) => file.mimeType.startsWith('video/')

/**
 * Video del recorrido (opcional): hasta 2, de 30 MB. A diferencia de las fotos, se sube y se quita al momento,
 * sin esperar al botón de guardar del paso.
 */
export default function PropertyVideosSection({ propertyId, disabled }: { propertyId: number; disabled: boolean }) {
  useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [videos, setVideos] = useState<PropertyFile[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useMessageState('')

  useEffect(() => {
    let cancelled = false
    propertyService.getFiles(propertyId).then((files) => { if (!cancelled) setVideos(files.filter(isVideo)) }).catch(() => undefined)
    return () => { cancelled = true }
  }, [propertyId])

  async function upload(list: FileList | null) {
    if (!list || list.length === 0 || busy || disabled) return
    const chosen = Array.from(list)
    if (videos.length + chosen.length > MAX_VIDEOS) { setError(message('property:videoLimit', { max: MAX_VIDEOS })); return }
    if (chosen.some((file) => !VIDEO_TYPES.includes(file.type))) { setError(message('property:videoFormat')); return }
    if (chosen.some((file) => file.size > MAX_VIDEO_MEGABYTES * 1024 * 1024)) { setError(message('property:videoTooLarge', { size: MAX_VIDEO_MEGABYTES })); return }
    setBusy(true)
    setError('')
    try {
      const saved = await propertyService.uploadVideos(propertyId, chosen)
      setVideos((previous) => [...previous, ...saved])
    } catch (reason) {
      setError(reason instanceof Error ? messageFromError(reason) : message('property:videoUploadFailed'))
    } finally { setBusy(false) }
  }

  async function remove(fileId: number) {
    if (busy || disabled) return
    setBusy(true)
    setError('')
    try {
      await propertyService.removeFile(propertyId, fileId)
      setVideos((previous) => previous.filter((video) => video.id !== fileId))
    } catch (reason) {
      setError(reason instanceof ApiError ? messageFromError(reason) : message('property:videoRemoveFailed'))
    } finally { setBusy(false) }
  }

  return (
    <FormSection icon={Video} title={i18n.t('property:videoSectionTitle')} description={i18n.t('property:videoSectionDescription', { max: MAX_VIDEOS, size: MAX_VIDEO_MEGABYTES })}>
      {error && <div role="alert" className="flex gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" />{error}</div>}
      {videos.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {videos.map((video) => (
            <div key={video.id} className="relative overflow-hidden rounded-xl bg-slate-900">
              <video src={video.url || undefined} controls preload="metadata" playsInline className="aspect-video w-full" />
              <button type="button" disabled={busy || disabled} onClick={() => void remove(video.id)} aria-label={i18n.t('property:videoRemove')}
                className="absolute right-0 top-0 grid size-11 place-items-center rounded-bl-xl bg-white/90 text-primary shadow-sm transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={busy || disabled || videos.length >= MAX_VIDEOS} onClick={() => inputRef.current?.click()} className="property-button">
          {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
          {busy ? i18n.t('property:videoUploading') : i18n.t('property:videoAdd')}
        </button>
        <span className="text-sm text-slate-500">{i18n.t('property:videoCount', { current: videos.length, max: MAX_VIDEOS })}</span>
      </div>
      <input ref={inputRef} type="file" accept={VIDEO_TYPES.join(',')} multiple hidden onChange={(event) => { void upload(event.target.files); event.target.value = '' }} />
    </FormSection>
  )
}
