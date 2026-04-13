import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";

import { Provider } from "react-redux";
import { store } from "./app/store";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>   {/* ✅ FIX HERE */}
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
