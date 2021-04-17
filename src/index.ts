import { render } from './lib/shellact';
import './common/style/reset.css';

// Components
import './components/Layout';
import './components/Nav';

render('layout-main', document.getElementById('root'));
