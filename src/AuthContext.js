
import {useContext, useState, useEffect, createContext} from "react";
import { 
    GoogleAuthProvider, 
    signInWithPopup,
    signInWithRedirect,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import {auth} from './firebase';

const AuthContext= createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
    };

    

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            console.log('User', currentUser)
        });
        return () => {
            unsubscribe();
        }
    },[]) 

    const logOut = () => {
        signOut (auth)
    }
    
    return (
        <AuthContext.Provider value ={{ googleSignIn, logOut, user}}> 
            {children}
        </AuthContext.Provider>
    )
};

export const UserAuth=()=> {
    return useContext(AuthContext)
};