import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { catalogText } from '../../../i18n/catalog';
import { BedDouble, MapPin, Users } from 'lucide-react';
import ServiceIcon from '../../Services/components/ServiceIcon';
import type { Property } from '../../Explore/interfaces/property.interface';

type DescriptionProperty = Omit<Property, 'typeOfProperty'> & {
  typeOfProperty?: Property['typeOfProperty'] | null;
  iconDescriptions?: { id: number; title: string; icon: string }[];
};

export default function PropertyDescription({ property }: { property: DescriptionProperty }) {
  useTranslation();
  return <div className="min-w-0 [overflow-wrap:anywhere]">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">{catalogText(property.typeOfProperty) || i18n.t("property:publicpropertypage_propiedad_en_alquiler")}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{property.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-neutral"><MapPin size={18} className="shrink-0" />{property.address}</p>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-neutral"><span className="inline-flex items-center gap-2"><BedDouble size={19} />{property.rooms}{' '}{i18n.t('common:room', { count: property.rooms })}</span><span className="inline-flex items-center gap-2"><Users size={19} />{property.guest}{' '}{i18n.t('common:person', { count: property.guest })}</span></div>
            <section className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-xl font-bold">{i18n.t("explore:explorepage_servicios_incluidos")}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">{property.services?.map((service) => <li key={service.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"><ServiceIcon name={service.icono} size={17} className="text-secondary" />{catalogText(service)}</li>)}</ul>
              {!property.services?.length && <p className="mt-3 text-sm text-neutral/70">{i18n.t("property:publicpropertypage_no_se_han_especificado_servicios")}</p>}
            </section>
            <section className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-xl font-bold">{i18n.t("property:publicpropertypage_acerca_de_esta_propiedad")}</h2><p className="mt-4 whitespace-pre-wrap break-words leading-7 text-neutral">{property.description || i18n.t("property:publicpropertypage_sin_descripcion_disponible")}</p>
              <ul className="mt-4 flex flex-wrap gap-3">{property.iconDescriptions?.map((detail) => <li key={detail.id} className="inline-flex items-center gap-2 text-sm"><ServiceIcon name={detail.icon} size={18} />{detail.title}</li>)}</ul>
            </section>

  </div>;
}
