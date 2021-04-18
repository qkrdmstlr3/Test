// Dependencies
import { render } from '@Lib/shell-html';
import '@Lib/state';
import '@Common/style/reset.css';

// Components
import '@Components/Layout';
import '@Components/Nav';

// Pages
import '@Pages/calendar';
import '@Pages/check';
import '@Pages/home';
import '@Pages/note';
import '@Pages/trash';

render('layout-main', document.getElementById('root'));
