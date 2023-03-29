import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
import { ProductList } from './components/productList';
import { ProductDetails } from './components/productDetails';
import { MainBasket } from './components/basket';
import { Login } from './components/login';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Page />,
        children: [
            {
                path: "/products/",
                element: <ProductList />,
            },
            {
                path: "/products/:typeFilter",
                element: <ProductList />,
            },
            {
                path: "/product/:prodID",
                element: <ProductDetails />,
            },
            {
                path: "/basket",
                element: <MainBasket />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "*",
                element: <main><h1>404 Error</h1><p>Click on one of the links above or below to head back to a page.</p></main>
            }
        ]
    }
])

const content = ReactDOM.createRoot(document.getElementById('content'));
content.render(
    <RouterProvider router={router} />
);