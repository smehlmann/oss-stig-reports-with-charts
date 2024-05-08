import { Outlet } from 'react-router-dom';
import MainNavigation from './MainNavigation.js';
import classes from './Root.module.css';

function RootLayout() {
    return (
        <>
            <MainNavigation />
            <main>
                <Outlet />
            </main >
        </>
    );
}

export { RootLayout };