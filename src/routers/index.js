// routers/index.js
import { useRoutes } from 'react-router-dom';
import allRouters from './allRouters';

export default function Routers() {
    return useRoutes(allRouters);
}
