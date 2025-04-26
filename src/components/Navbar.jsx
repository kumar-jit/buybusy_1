// Import icons
import { FaShoppingCart } from "react-icons/fa";
import { RiLoginCircleFill, RiLogoutCircleFill } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";

// Import router and redux utilities
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { handleLogout } from "../Redux/Slice/AuthSlice.js";

// Navbar component
const NavbarE = (props) => {
    const { isLoggedIn, handleLogout } = props; // Destructure props
    const navigate = useNavigate(); // React Router navigation

    // Handle logout event
    const onLogout = (event) => {
        event.preventDefault();
        handleLogout(); // Dispatch logout action
        navigate("/"); // Navigate to home page
    };

    return (
        <>
            <nav className="navbar">
                {/* Logo */}
                <div className="logo">Buy Busy</div>
                
                {/* Navigation links */}
                <ul className="navLinks">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>

                    {/* Show Cart and Orders if user is logged in */}
                    {isLoggedIn && (
                        <li>
                            <NavLink to="/cart">
                                <FaShoppingCart className="navItemsLogo" /> Cart
                            </NavLink>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <NavLink to="/orderHistory">
                                <FaBoxOpen className="navItemsLogo" /> Orders
                            </NavLink>
                        </li>
                    )}

                    {/* Show Login if user is not logged in */}
                    {!isLoggedIn && (
                        <li>
                            <NavLink to="/SignupOrLogin">
                                <RiLoginCircleFill className="navItemsLogo" /> Login
                            </NavLink>
                        </li>
                    )}

                    {/* Show Logout if user is logged in */}
                    {isLoggedIn && (
                        <li onClick={onLogout}>
                            <NavLink to="/">
                                <RiLogoutCircleFill className="navItemsLogo" /> Logout
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>

            {/* Nested route content will render here */}
            <Outlet />
        </>
    );
};

// Map Redux state to component props
const mapStateToProps = (state) => ({
    isLoggedIn: state.authReducer.isLoggedIn,
});

// Map dispatch actions to component props
const mapDispatchToProps = (dispatch) => ({
    handleLogout: () => dispatch(handleLogout()),
});

// Connect Navbar component to Redux
export const Navbar = connect(mapStateToProps, mapDispatchToProps)(NavbarE);
