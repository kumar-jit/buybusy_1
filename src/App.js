import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/Navbar';
import { AuthContextProvider } from './context/AuthContext';
import { RegisterOrLogin } from './components/Element/LoginComponent/SignInOrSignUp';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import { ErrorElement } from './components/ErrorPage';
import { Home } from './components/HomeElement';
import { ProductContextProvider } from './context/ProductContext';

function App() {

    const route = createBrowserRouter([
        {   path:"/",
            element : <Navbar />,
            errorElement : <ErrorElement />,
            children : [
                {index : true, element:<ProductContextProvider> <Home /> </ProductContextProvider> },
                {path : "/SignupOrLogin", element : <RegisterOrLogin />}
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
