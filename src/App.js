import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/Navbar';
import { AuthContextProvider } from './context/AuthContext';
import { RegisterOrLogin } from './components/LoginComponent/SignInOrSignUp';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import { ErrorElement } from './components/ErrorPage';
import { Home } from './HomeElement';

function App() {

    const route = createBrowserRouter([
        {   path:"/",
            element : <Navbar />,
            errorElement : <ErrorElement />,
            children : [
                {index : true, element: <Home /> },
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
