import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
// import { AuthInitializer } from './auth/AuthInitializer';
import AuthInitializer from './auth/AuthInitializer';
// import { ErrorBoundary } from './components/common/ErrorBoundary/ErrorBoundary';


function App() {
  return (
    <Provider store={store}>
      {/* <ErrorBoundary> */}
        <Router>
          <AuthInitializer>
            <AppRoutes />
          </AuthInitializer>
        </Router>
      {/* </ErrorBoundary> */}
    </Provider>
  );
}

export default App;