import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18에서는 'react-dom/client'를 사용
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// createRoot를 사용하여 클라이언트에서 렌더링
const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
