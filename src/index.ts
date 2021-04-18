// Dependencies
import { render } from '@Lib/shellact';
import '@Common/style/reset.css';

// Components
import '@Components/Layout';
import '@Components/Nav';

// Pages
import '@Pages/home';

render('layout-main', document.getElementById('root'));
