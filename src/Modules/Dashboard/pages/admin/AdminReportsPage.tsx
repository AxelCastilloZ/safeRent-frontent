import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Flag } from 'lucide-react';
import EmptyPanel from '../../Components/EmptyPanel';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import PendingNotice from '../../Components/PendingNotice';

/** Reportes (admin): pantalla lista; el backend no tiene módulo de reportes. */
export default function AdminReportsPage() {
  useTranslation();
  return (
    <PageContainer>
      <PageHeader title={i18n.t("dashboard:adminreportspage_reportes")} description={i18n.t("dashboard:adminreportspage_reportes_de_usuarios_y_contenido_que_requieren_moderacion")} />
      <EmptyPanel icon={Flag} title={i18n.t("dashboard:adminreportspage_no_hay_reportes_pendientes")} description={i18n.t("dashboard:adminreportspage_los_reportes_enviados_por_los_usuarios_apareceran_aqui_para")} />
      <div className="mt-3">
        <PendingNotice>{i18n.t("dashboard:adminreportspage_reportes_y_moderacion_no_existe_el_modulo_en_el")}</PendingNotice>
      </div>
    </PageContainer>
  );
}
