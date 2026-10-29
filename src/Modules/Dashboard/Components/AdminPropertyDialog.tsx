import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { catalogText } from '../../../i18n/catalog';
import { formatDate } from '../../../i18n/formatters';
import { formatMoney, photoUrl } from '../../Explore/utils/property.utils';
import { propertyService } from '../../Property/services/propertyService';
import type { Property } from '../../Property/types/property';

interface Props {
  property: Property;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onApprove: (property: Property) => Promise<void>;
  onRequestChanges: (property: Property) => void;
  onReject: (property: Property) => void;
}

export default function AdminPropertyDialog({ property, loading, error, onClose, onApprove, onRequestChanges, onReject }: Props) {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const detail = useQuery({
    queryKey: ['admin', 'property', property.id],
    queryFn: () => propertyService.getById(property.id),
    staleTime: 0,
  });
  const data = detail.data;
  const photos = (data?.files ?? []).filter(file => file.mimeType?.startsWith('image/'))
    .map(file => photoUrl({ files: [file] })).filter((url): url is string => Boolean(url));

  useEffect(() => {
    const element = dialog.current!;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  const buttonClass = 'rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50 disabled:opacity-50';
  const fieldClass = 'rounded-xl bg-slate-50 p-3';
  const labelClass = 'text-xs font-medium text-muted-ink';

  return createPortal(
    <dialog ref={dialog} aria-labelledby="admin-property-title"
      className="m-auto max-h-[90dvh] w-[min(800px,94vw)] max-w-none overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-primary shadow-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden backdrop:bg-slate-900/50"
      onCancel={event => { event.preventDefault(); if (!loading) onClose(); }}>
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-5 sm:px-6">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-medium text-muted-ink">{t('property:propertydetailpage_datos_de_la_propiedad')}</p>
          <h2 id="admin-property-title" className="break-words text-xl font-bold">{property.title}</h2>
        </div>
        <button type="button" autoFocus disabled={loading} onClick={onClose} aria-label={t('dashboard:adminpropertydialog_close')} className="shrink-0 rounded-lg p-2 hover:bg-slate-100 disabled:opacity-50"><X size={20} /></button>
      </header>

      <div className="space-y-5 p-5 sm:p-6" aria-busy={detail.isFetching}>
        {detail.isPending ? <p role="status" className="py-10 text-center text-sm text-muted-ink">{t('dashboard:adminpropertiespage_cargando_propiedades')}</p>
          : detail.isError ? <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {t('dashboard:adminpropertydialog_error')}{' '}
            <button type="button" onClick={() => void detail.refetch()} className="font-semibold underline">{t('comments:propertycomments_reintentar')}</button>
          </div> : data && <>
            {photos.length ? <section aria-label={t('property:propertygallery_fotografias_de_la_propiedad')}>
              <img key={photos[selectedPhoto]} src={photos[selectedPhoto]} alt={data.title} className="h-56 w-full rounded-xl bg-slate-100 object-contain sm:h-72" />
              {photos.length > 1 && <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{photos.map((url, index) =>
                <button key={`${url}-${index}`} type="button" aria-pressed={selectedPhoto === index} aria-label={t('property:propertygallery_ampliar_fotografia', { v0: index + 1 })}
                  onClick={() => setSelectedPhoto(index)} className={`shrink-0 overflow-hidden rounded-lg border-2 ${selectedPhoto === index ? 'border-primary' : 'border-transparent'}`}>
                  <img src={url} alt="" className="h-16 w-20 object-cover" />
                </button>)}</div>}
            </section> : <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-muted-ink">{t('property:propertygallery_esta_propiedad_aun_no_tiene_fotografias')}</p>}

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className={fieldClass}><dt className={labelClass}>{t('property:createpropertystep1page_precio_mes')}</dt><dd className="mt-1 break-words font-bold">{formatMoney(data.cost, data.typeOfCoin)}</dd></div>
              <div className={fieldClass}><dt className={labelClass}>{t('property:propertyformlayout_tipo_de_propiedad')}</dt><dd className="mt-1 font-semibold">{catalogText(data.typeOfProperty) || '—'}</dd></div>
              <div className={fieldClass}><dt className={labelClass}>{t('dashboard:adminpropertydialog_rooms')}</dt><dd className="mt-1 font-semibold">{data.rooms}</dd></div>
              <div className={fieldClass}><dt className={labelClass}>{t('dashboard:adminpropertydialog_capacity')}</dt><dd className="mt-1 font-semibold">{data.guest}</dd></div>
              <div className="col-span-2"><dt className={labelClass}>{t('dashboard:adminpropertiespage_ubicacion')}</dt><dd className="mt-1 break-words text-sm">{data.address || '—'}</dd>
                {data.latitude != null && data.longitude != null && <dd className="mt-1 text-xs text-muted-ink">{data.latitude}, {data.longitude}</dd>}
              </div>
              <div className="col-span-2"><dt className={labelClass}>{t('auth:roles_propietario')}</dt><dd className="mt-1 break-words text-sm">{[data.owner.name, data.owner.surname1, data.owner.surname2].filter(Boolean).join(' ')}</dd><dd className="mt-1 break-all text-sm text-muted-ink">{data.owner.email || '—'}</dd></div>
              <div className="col-span-2"><dt className={labelClass}>{t('dashboard:adminpropertydialog_created')}</dt><dd className="mt-1 text-sm">{formatDate(data.createdAt)}</dd></div>
              {data.reviewedAt && <div className="col-span-2"><dt className={labelClass}>{t('dashboard:adminpropertydialog_reviewed')}</dt><dd className="mt-1 text-sm">{formatDate(data.reviewedAt)}</dd></div>}
            </dl>

            <section><h3 className="mb-2 text-sm font-bold">{t('property:propertyformlayout_descripcion')}</h3><p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-ink">{data.description || t('property:publicpropertypage_sin_descripcion_disponible')}</p></section>
            <section><h3 className="mb-2 text-sm font-bold">{t('dashboard:adminhomepage_servicios')}</h3>
              {data.services?.length ? <ul className="flex flex-wrap gap-2">{data.services.map(service => <li key={service.id} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm">{catalogText(service)}</li>)}</ul>
                : <p className="text-sm text-muted-ink">{t('property:propertydetailpage_sin_servicios_asignados')}</p>}
            </section>
            {data.reservedTenantId != null && <section className="rounded-xl bg-slate-50 p-4"><h3 className="text-sm font-bold">{t('dashboard:ownerpropertiespage_reservada_para')}</h3><p className="mt-1 text-sm">{data.reservedTenantName || '—'}</p>{data.reservedAt && <p className="mt-1 text-xs text-muted-ink">{formatDate(data.reservedAt)}</p>}</section>}
            {data.reviewNote && <section className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 className="text-sm font-bold">{t('dashboard:notedialog_nota_para_el_propietario')}</h3><p className="mt-1 whitespace-pre-wrap break-words text-sm">{data.reviewNote}</p></section>}
          </>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>

      <footer className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-white p-4">
        <button type="button" disabled={loading} onClick={onClose} className={buttonClass}>{t('dashboard:adminpropertydialog_close')}</button>
        {data && !detail.isError && data.status === 'PENDING' && <>
          <button type="button" disabled={loading} onClick={() => onReject(data)} className={buttonClass}>{t('dashboard:adminpropertiespage_rechazar_2a0515')}</button>
          <button type="button" disabled={loading} onClick={() => onRequestChanges(data)} className={buttonClass}>{t('dashboard:adminpropertiespage_solicitar_cambios_e1aab9')}</button>
          <button type="button" disabled={loading} onClick={() => void onApprove(data)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50">{t('dashboard:adminpropertiespage_aprobar_10a00f')}</button>
        </>}
        {data && !detail.isError && data.status === 'ACTIVE' && <button type="button" disabled={loading} onClick={() => onReject(data)} className={buttonClass}>{t('dashboard:adminpropertiespage_desactivar_7ef1cd')}</button>}
      </footer>
    </dialog>, document.body,
  );
}
