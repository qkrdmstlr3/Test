// Dependencies
import { render } from '@Lib/shell-html';
import '@Lib/state';
import '@Common/style/reset.css';

// Components
import '@Components/Layout';
import '@Components/Nav';
import '@Components/SubnavCheck';
import '@Components/CheckPost';

// Pages
import '@Pages/calendar';
import '@Pages/check';
import '@Pages/home';
import '@Pages/note';

render('layout-main', document.getElementById('root'));
