import { Link } from 'react-router-dom';
import classes from './MainNavigation.module.css';

function MainNavigation() {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to='/'>Generate Report</Link>
                    </li>
                    <li>
                        <Link to='/dashboard' target='_blank' rel="noopener noreferrer" >Report Dashboard</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;