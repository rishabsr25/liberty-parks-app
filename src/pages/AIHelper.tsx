import { PARK_SELECTOR_ENABLED } from '@/config/features';
import ParkSelectorPage from '@/pages/ParkSelectorPage';
import ParkSelectorRetiredNotice from '@/pages/ParkSelectorRetiredNotice';

export default function AIHelper() {
  if (PARK_SELECTOR_ENABLED) {
    return <ParkSelectorPage />;
  }

  return <ParkSelectorRetiredNotice />;
}
