
// import Icon
import { FaShoppingCart } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { RiLogoutCircleFill } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";

import { Outlet, NavLink } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.js";

export function Navbar() {
    const { isLoggedIn } = useAuthContext();
    return (
        <>
            <nav className="navbar">
                <div className="logo">Buy Busy</div>
                <ul className="navLinks">
                    <li><NavLink to="/">Home</NavLink></li>
                    {isLoggedIn && <li><NavLink to="/"> <FaShoppingCart className="navItemsLogo"/> Cart </NavLink></li>}
                    {isLoggedIn && <li><NavLink to="/"><FaBoxOpen className="navItemsLogo"/> Orders</NavLink></li>}
                    {!isLoggedIn && <li><NavLink to="/SignupOrLogin"><RiLoginCircleFill className="navItemsLogo"/> Login</NavLink></li>}
                    {isLoggedIn && <li><NavLink to="/"><RiLogoutCircleFill className="navItemsLogo"/> Logout</NavLink></li>}
                </ul>
            </nav>
            <Outlet></Outlet>
        </>
        
    );
    
}

// onClick={() => handleSignIn("jitmaity9@gmail.com", "Kumar@548")}