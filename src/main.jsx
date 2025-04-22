// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './redux/store';  // Import store (we'll create this next)
import App from './App.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap App with Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);