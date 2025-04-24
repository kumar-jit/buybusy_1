import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAuth,
    updateProfile,
} from "firebase/auth";
import { db } from "../Db/connection";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const { useContext, createContext, useState, useEffect } = require("react");

const authContext = createContext();

// exporting auth context
export const useAuthContext = () => {
    const authContextState = useContext(authContext);
    return authContextState;
};

// prepareing auth context
export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedUserInfo, setLoggedUserInfo] = useState();

    const authInstance = getAuth();

    const handleSignUp = async (email, password, name) => {
        try {
            let auth = await createUserWithEmailAndPassword(
                authInstance,
                email,
                password
            ); // creating new user
            const user = auth.user;
            // update user Display Name
            let updateUser = await updateProfile(user, {
                displayName: name,
            });
            console.info(updateUser);


            // Create a new document in Firestore with the user's UID as the document ID
            let userOtherInfo = await setDoc(doc(db, "users", user.uid), {
                email: email,
                name: name,
                cart: { products: {}, totalPrice: 0 }, // Initially empty cart
                orders: [], // Initially empty orders
            });

            setLoggedUserInfo(user);
            toast.success("Successfully signup");
            return true;
        } catch (error) {
            console.log(error);
            toast.error("Error while signup");
            setLoggedUserInfo(null);
            return false;
        }
    };

    const handleSignIn = async (email, password) => {
        try {
            let auth = await signInWithEmailAndPassword(
                authInstance,
                email,
                password
            );
            setLoggedUserInfo(auth.user);
            console.info(auth);
            toast.success("Successfully signin");
            return true;
        } catch (error) {
            toast.error("Error while login");
            setLoggedUserInfo(null);
            console.log(error);
            return false;
        }
    };
    const handleLogout = () => {
        localStorage.setItem("user", null);
        setLoggedUserInfo(null);
    };

    //    async function verifyIdToken(idToken) {
    //     try {
    //       const decodedToken = await admin.auth().verifyIdToken(idToken);
    //       const uid = decodedToken.uid;
    //       console.log("Decoded Token:", decodedToken);
    //       // Now you have the UID and other claims
    //       return decodedToken;
    //     } catch (error) {
    //       console.error("Error verifying ID token:", error);
    //       throw new Error("Token is invalid or expired");
    //     }
    //   }

    // updating loginuser status
    useEffect(() => {
        const userInfo = localStorage.getItem("user");
        if (userInfo != "null") {
            setLoggedUserInfo(JSON.parse(userInfo));
        }
    }, []);

    // updating loginuser status
    useEffect(() => {
        localStorage.setItem(
            "user",
            loggedUserInfo != null ? JSON.stringify(loggedUserInfo) : null
        );
        if (loggedUserInfo == null) setIsLoggedIn(false);
        else setIsLoggedIn(true);
    }, [loggedUserInfo]);

    return (
        <authContext.Provider
            value={{
                isLoggedIn,
                loggedUserInfo,
                handleSignIn,
                handleSignUp,
                handleLogout,
            }}
        >
            {props.children}
        </authContext.Provider>
    );
};

// {
//     email : "jitmaity9@gmail.com",
//     password : "Kumar@548"
// }
