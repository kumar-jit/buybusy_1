// import Icon
import { FaShoppingCart } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { RiLogoutCircleFill } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { handleLogout } from "../Redux/Slice/AuthSlice.js";
import { useEffect } from "react";

let NavbarE = (props) => {
    const { isLoggedIn, handleLogout } = props;


    const navigate = useNavigate();

    return (
        <>
            <nav className="navbar">
                <div className="logo">Buy Busy</div>
                <ul className="navLinks">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <NavLink to="/cart">
                                {" "}
                                <FaShoppingCart className="navItemsLogo" /> Cart{" "}
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
                    {!isLoggedIn && (
                        <li>
                            <NavLink to="/SignupOrLogin">
                                <RiLoginCircleFill className="navItemsLogo" />{" "}
                                Login
                            </NavLink>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li
                            onClick={(event) => {
                                handleLogout();
                                navigate("/");
                                event.preventDefault();
                            }}
                        >
                            <NavLink to="/">
                                <RiLogoutCircleFill className="navItemsLogo" />{" "}
                                Logout
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
            <Outlet></Outlet>
        </>
    );
};

const mapStateToProps = (state) => ({
    isLoggedIn: state.authReducer.isLoggedIn,
});
const mapDispatchToProps = (dispatch) => ({
    handleLogout: () => dispatch(handleLogout())
});
export const Navbar = connect(mapStateToProps, mapDispatchToProps)(NavbarE);

// onClick={() => handleSignIn("jitmaity9@gmail.com", "Kumar@548")}
