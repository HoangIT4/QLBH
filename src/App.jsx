// App.js
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Routers from './routers';
import { runSystemCheck } from '@/utils/systemCheck';
import '@styles/main.scss';

function App() {
    useEffect(() => {
        // Chỉ chạy system check trong development mode
        if (import.meta.env.DEV) {
            runSystemCheck();
        }
    }, []);

    return (
        <BrowserRouter>
            <Routers />
        </BrowserRouter>
    );
}

export default App;
