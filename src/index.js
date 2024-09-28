import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18에서는 'react-dom/client'를 사용
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 서버에서 렌더링된 HTML을 클라이언트에서 hydrateRoot로 재활용
const rootElement = document.getElementById('root');
ReactDOM.hydrateRoot(
  rootElement,
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
