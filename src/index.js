import ReactDOM from 'react-dom/client';
import './css/base.css'
import './css/check-box.css';
import './css/errors.css';
import './css/out-of-stock.css';
import './css/selected-filter.css';
import './css/product-card.css';
import './css/header.css';
import './css/basket.css';
import './css/login.css';
import './css/product-list.css';
import './css/product-details.css';
import './css/footer.css';
import './css/mobile.css';
import './css/checkout.css';
import { Page } from './components/page';

const content = ReactDOM.createRoot(document.getElementById('content'));
content.render(<Page />);