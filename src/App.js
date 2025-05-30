import "./App.css";
import { Navbar } from "./components/Navbar";
import { RegisterOrLogin } from "./components/Element/LoginComponent/SignInOrSignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorElement } from "./components/ErrorPage";
import { Home } from "./components/HomeElement";
import { CartsComponent } from "./components/CartComponent";
import { OrderHistoryComponent } from "./components/OrderHistoryComponent";
import { ToastContainer } from "react-toastify";

function App() {
    const route = createBrowserRouter([
        {
            path: "/",
            element: <Navbar />,
            errorElement: <ErrorElement />,
            children: [
                { index: true, element: <Home /> },
                { path: "/SignupOrLogin", element: <RegisterOrLogin /> },
                { path: "/cart", element: <CartsComponent></CartsComponent> },
                {
                    path: "/orderHistory",
                    element: <OrderHistoryComponent> </OrderHistoryComponent>,
                },
            ],
        },
    ]);
    return (
        <>
            <ToastContainer></ToastContainer>
            <RouterProvider router={route} />
        </>
    );
}

export default App;
