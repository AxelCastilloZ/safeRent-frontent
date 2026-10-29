import LanguageSelector from '../../../i18n/LanguageSelector';
import DisplayCurrencySelector from './DisplayCurrencySelector';

export default function DisplayPreferences() {
  return <div className="flex shrink-0 items-start gap-2">
    <div className="w-20 min-w-0"><LanguageSelector compact /></div>
    <DisplayCurrencySelector />
  </div>;
}
