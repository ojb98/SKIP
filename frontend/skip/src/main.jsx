import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './index.css'
import './css/Rentalshop.css'
import './css/admin.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store.js'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
)
