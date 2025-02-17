import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/Navbar';
import { AuthContextProvider } from './context/AuthContext';
import { RegisterOrLogin } from './components/Element/LoginComponent/SignInOrSignUp';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import { ErrorElement } from './components/ErrorPage';
import { Home } from './components/HomeElement';
import { ProductContextProvider } from './context/ProductContext';
import { CartsComponent } from './components/CartComponent';
import { CartContextProvider } from './context/CartContex';

// function App() {

//     const route = createBrowserRouter([
//         {   path:"/",
//             element : <Navbar />,
//             errorElement : <ErrorElement />,
//             children : [
//                 {index : true, element:<ProductContextProvider> <CartContextProvider> <Home />  </CartContextProvider> </ProductContextProvider> },
//                 {path : "/SignupOrLogin", element : <RegisterOrLogin />},
//                 {path : "/cart", element : <CartContextProvider> <CartsComponent></CartsComponent> </CartContextProvider>}
//             ]
//         }
//     ])
//     return (
//         <AuthContextProvider>
//             <RouterProvider router={route} />
//         </AuthContextProvider>
//     );
// }

/**
    Issue : 
    in this case cart state getting reset on Home to cart navigation because 
    The issue is that you're wrapping CartContextProvider separately for different routes, 
    causing it to reset every time you navigate. Since React creates a new provider instance each time 
    a component re-renders or is mounted anew, the state inside the context gets reset.

    Solution need to wrape NaveBar or whole app with productContext and cartContext then navigation will happen in same context and page will not rerander
*/

function App() {

    const route = createBrowserRouter([
        {   path:"/",
            element : <ProductContextProvider> <CartContextProvider> <Navbar /> </CartContextProvider> </ProductContextProvider>,
            errorElement : <ErrorElement />,
            children : [
                {index : true, element: <Home />   },
                {path : "/SignupOrLogin", element : <RegisterOrLogin />},
                {path : "/cart", element : <CartsComponent></CartsComponent>}
            ]
        }
    ])
    return (
        <AuthContextProvider>
            <RouterProvider router={route} />
        </AuthContextProvider>
    );
}

export default App;
