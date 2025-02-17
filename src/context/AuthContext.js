


import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { db } from "../Db/connection";

const { useContext, createContext, useState, useEffect } = require("react");

const authContext = createContext();

// exporting auth context
export const useAuthContext = () => {
    const authContextState = useContext(authContext);
    return authContextState;
}

// prepareing auth context
export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedUserInfo, setLoggedUserInfo] = useState();

    const authInstance = getAuth();

   const handleSignUp = async (email, password, name) => {
        try {
            let auth = await createUserWithEmailAndPassword(authInstance, email,password);  // creating new user
            const user = auth.user;
            // update user Display Name
            let updateUser = await updateProfile(user, {
                displayName : name
            });
            console.info(updateUser);
            setLoggedUserInfo(user);
        } catch (error) {
            console.log(error);
            setLoggedUserInfo(null);
        }
   }

   const handleSignIn = async (email, password) => {
        try {
            let auth = await signInWithEmailAndPassword(authInstance, email, password);
            setLoggedUserInfo(auth.user); 
            console.info(auth);
        } catch (error) {
            setLoggedUserInfo(null);
            console.log(error)
        }

   }

   // updating loginuser status
   useEffect( () => {
    const userInfo = localStorage.getItem('user');
    if(userInfo != 'null'){
        setLoggedUserInfo(JSON.parse(userInfo));
    }
   },[]);
   
   // updating loginuser status
   useEffect( () => {
    localStorage.setItem('user', loggedUserInfo != null? JSON.stringify(loggedUserInfo) : null );
    if(loggedUserInfo == null)
        setIsLoggedIn(false);
    else
        setIsLoggedIn(true);
   },[loggedUserInfo]);

   


    return (
        <authContext.Provider value={{isLoggedIn,loggedUserInfo, handleSignIn, handleSignUp}}>
            {props.children}
        </authContext.Provider>
    )
}


// {
//     email : "jitmaity9@gmail.com",
//     password : "Kumar@548"
// }