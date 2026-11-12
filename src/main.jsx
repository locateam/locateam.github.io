import React from 'react';
import {hydrateRoot,createRoot} from 'react-dom/client';
import App from './app.jsx';
import {legacyUrl} from './routes.js';
import './style.css';
const legacy=legacyUrl(location.search);
if(legacy)location.replace(legacy);
else{
  const root=document.getElementById('root');
  const app=<App pathname={location.pathname}/>;
  if(root.hasChildNodes())hydrateRoot(root,app);
  else createRoot(root).render(app);
}
