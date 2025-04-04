import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import RootLayout from './src/app/_layout';
import { useEffect } from 'react';
import { setupGlobalErrorHandler } from './src/utils/errorHandler';

export default function App() {
  useEffect(() => {
    setupGlobalErrorHandler();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootLayout />
      </PersistGate>
    </Provider>
  );
}