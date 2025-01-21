
import { useEffect, useRef, useState } from 'react'
import styles from './SignInOrSignUp.module.css'
import { useAuthContext } from "../../context/AuthContext.js";
import { useNavigate } from 'react-router-dom';

export const RegisterOrLogin = () => {

    const [showSignUpScreen, setshowSignUpScreen] = useState(true); // use to switch between sign and sign up page
    const {isLoggedIn, handleSignIn} = useAuthContext();
    const navigate = useNavigate();


    const loginEmailref = useRef(null);
    const loginPasswordRef = useRef(null);
    
    useEffect(() => {
        if(isLoggedIn)
            navigate("/")
    },[isLoggedIn])
    

    /* ------------------------------ all function ------------------------------ */

    const loginWithEmail = (event) => {
        event.preventDefault(); // preventing form default behaviour 
        if(loginEmailref.current && loginPasswordRef.current){
            const emailId = loginEmailref.current.value;
            const password = loginPasswordRef.current.value;
            if(emailId && password){
                handleSignIn(emailId,password);
            }
        }
    }

    return(
        <div className={styles.bodyContent + " mainBodyHeight"}>
            <div className={ styles.container + (showSignUpScreen ? "" : " " + styles.active) } id="container">
                <div className={ styles.formContainer + " " + styles.signUp }>
                    <form id="signUpForm">
                        <h1>Create Account</h1>                    
                        <input type="text" placeholder="Full Name" name="name" />
                        <input type="email" placeholder="Email" name="email" />
                        <input type="password" placeholder="Password" />
                        <span className={ styles.errorMsgForm } id="signUpErrorSpan"></span>
                        <button>Sign Up</button>
                    </form>
                </div>
                <div className={ styles.formContainer + " " + styles.signIn }>
                    <form id="loginForm" >
                        <h1>Sign In</h1>
                        {/* <span>or use your email and password</span> */}
                        <input type="email" placeholder="Email" name="email" ref={loginEmailref} required/>
                        <span className={ styles.errorMsgForm } id="loginErrorSpan" ></span>
                        <input type="password" placeholder="Password" ref={loginPasswordRef} required/>
                        <button onClick={(event) => loginWithEmail(event)}>Sign In</button>
                    </form>
                </div>
                <div className={styles.toggleContainer}>
                    <div className={ styles.toggle }>
                        <div className={styles.togglePanel + " " + styles.toggleLeft}>
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features.</p>
                            <button className={ styles.hidden } onClick={() => setshowSignUpScreen(true)}>Sign In</button>
                        </div>
                        <div className={ styles.togglePanel + " " + styles.toggleRight }>
                            <h1>Hello, Subscriber!</h1>
                            <p>Register with your personal details to use all of site features.</p>
                            <button className={ styles.hidden } onClick={() => setshowSignUpScreen(false)} >Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}