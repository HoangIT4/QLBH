// routers/index.js
import { useRoutes } from 'react-router-dom';
import allRouters from './allRouters.jsx';

export default function Routers() {
    return useRoutes(allRouters);
}