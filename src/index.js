import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';
import rootReducer,{rootSaga} from './store';
import { createStore,applyMiddleware } from 'redux';
import {createLogger} from 'redux-logger';
import { Provider } from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger,sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
  
ReactDOM.render(
  <BrowserRouter>
  <Provider store={store}>
    <App />
  </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
