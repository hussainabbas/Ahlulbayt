import { AppProviders } from '@/providers/AppProviders';

import { NavigationRoot } from '@/NavigationRoot';

export default function App() {
  return (
    <AppProviders>
      <NavigationRoot />
    </AppProviders>
  );
}
