import './App.css';

import { AuthProvider } from 'oidc-react';
import OssStigReports from './OssStigReports';
import { Provider } from 'react-redux';
import store from './store/index.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardTab from './components/tabs/DashboardTab.js';
import { RootLayout } from './components/tabs/Root.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '/', element: <OssStigReports /> },
      { path: '/dashboard', element: <DashboardTab /> }
    ]

  }
]);

function App() {
  return (
    <div className="App">
      <AuthProvider
        authority={process.env.REACT_APP_AUTH_CONNECT_URL}
        clientId={process.env.REACT_APP_CLIENT_ID}
        redirectUri={process.env.REACT_APP_REDIRECT_URI}
        scope={process.env.REACT_APP_AUTH_SCOPE}
        responseType={process.env.REACT_APP_RESPONSE_TYPE}
        postLogoutRedirectUri={process.env.REACT_APP_REDIRECT_URI}
        automaticSilentRenew={true}
      >
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </AuthProvider>
    </div>
  );
}

export default App;
