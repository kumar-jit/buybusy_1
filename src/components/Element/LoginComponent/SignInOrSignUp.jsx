
import { useEffect, useRef, useState } from 'react'
import styles from './SignInOrSignUp.module.css'
import { useNavigate } from 'react-router-dom';
import { handleSignIn, handleSignUp } from '../../../Redux/Slice/AuthSlice';
import { connect } from 'react-redux';

export const RegisterOrLoginE = (props) => {

    const [showSignUpScreen, setshowSignUpScreen] = useState(true); // use to switch between sign and sign up page
    const {isLoggedIn, handleSignIn, handleSignUp} = props; 
    const navigate = useNavigate();


    const loginEmailref = useRef(null);
    const loginPasswordRef = useRef(null);
    const signupEmailRef = useRef(null);
    const signupPassword = useRef(null);
    const signupFullName = useRef(null);
    const singinErrorRef = useRef(null);
    const singupErrorRef = useRef(null);

    useEffect(() => {
        if(isLoggedIn)
            navigate("/")
    },[isLoggedIn])
    

    /* ------------------------------ all function ------------------------------ */

    const loginWithEmail = async (event) => {
        event.preventDefault(); // preventing form default behaviour 
        if(loginEmailref.current && loginPasswordRef.current){
            const emailId = loginEmailref.current.value;
            const password = loginPasswordRef.current.value;
            if(emailId && password){
                let response = await handleSignIn(emailId,password);
                if(!response && singinErrorRef.current){
                    singinErrorRef.current.innerHTML = "Wrong email or password/ Please try again !"
                }
                else if(singinErrorRef.current){
                    singinErrorRef.current.innerHTML = ""
                }
            }
        }
    }
    const signupWithEmailPassword = async (event) =>{
        event.preventDefault();
        if(signupEmailRef.current && signupPassword.current && signupFullName.current){
            const email = signupEmailRef.current.value;
            const password = signupPassword.current.value;
            const fullName = signupFullName.current.value;
            if(email && password && fullName){
                let response = await handleSignUp(email,password,fullName);
                if(!response && singupErrorRef.current){
                    singupErrorRef.current.innerHTML = "Email already in use. Please try with abother email !"
                }
                else if(singupErrorRef.current){
                    singupErrorRef.current.innerHTML = ""
                }
            }
        }
    }

    return(
        <div className={styles.bodyContent + " mainBodyHeight"}>
            <div className={ styles.container + (showSignUpScreen ? "" : " " + styles.active) } id="container">
                <div className={ styles.formContainer + " " + styles.signUp }>
                    <form id="signUpForm">
                        <h1>Create Account</h1>                    
                        <input type="text" placeholder="Full Name" name="name" ref={signupFullName} />
                        <input type="email" placeholder="Email" name="email" ref={signupEmailRef} />
                        <input type="password" placeholder="Password" ref={signupPassword} />
                        <span className={ styles.errorMsgForm } id="signUpErrorSpan" ref={singupErrorRef}></span>
                        <button onClick={(event) => signupWithEmailPassword(event)}>Sign Up</button>
                    </form>
                </div>
                <div className={ styles.formContainer + " " + styles.signIn }>
                    <form id="loginForm" >
                        <h1>Sign In</h1>
                        {/* <span>or use your email and password</span> */}
                        <input type="email" placeholder="Email" name="email" ref={loginEmailref} required/>
                        <input type="password" placeholder="Password" ref={loginPasswordRef} required/>
                        <span className={ styles.errorMsgForm } id="loginErrorSpan" ref={singinErrorRef}></span>
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

const mapStateToProps = (state) => ({
    isLoggedIn: state.authReducer.isLoggedIn,
});
const mapDispatchToProps = (dispatch) => ({
    handleSignUp: (email, password, fullName) => dispatch(handleSignUp({email, password, fullName})),
    handleSignIn: (email, password) => dispatch(handleSignIn({email, password}))
});
export const RegisterOrLogin = connect(mapStateToProps, mapDispatchToProps)(RegisterOrLoginE);
