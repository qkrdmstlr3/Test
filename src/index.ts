// Dependencies
import { render } from 'shell-html';
import '@Lib/state';

// Components
import '@Components/Layout';
import '@Components/Nav';
import '@Components/SubnavCheck';
import '@Components/SubnavHome';
import '@Components/CheckPost';
import '@Components/HomeMain';
import '@Components/CalendarMain';
import '@Components/CalendarMain/Calendar';

// Pages
import '@Pages/calendar';
import '@Pages/check';
import '@Pages/home';
import '@Pages/note';

render('layout-main', document.getElementById('root'));
