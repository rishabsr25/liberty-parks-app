import { Navigate } from 'react-router-dom';
import { PARK_SELECTOR_ENABLED } from '@/config/features';
import ParkSelectorPage from '@/pages/ParkSelectorPage';

export default function AIHelper() {
  if (!PARK_SELECTOR_ENABLED) {
    return <Navigate to="/map" replace />;
  }

  return <ParkSelectorPage />;
}
