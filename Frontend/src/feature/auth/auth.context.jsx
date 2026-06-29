import { useEffect, useState, createContext } from "react"
import { handleLogin as apiHandleLogin, handleRegister as apiHandleRegister } from "./service/auth.api"

export const AuthContext = createContext()

function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const handleLogin = async (email, password) => {
        console.log("AuthProvider.handleLogin start", { email })
        try{
            const response = await apiHandleLogin(email, password)
            console.log("AuthProvider.handleLogin success", { email, user: response.user })
            setUser(response.user)
            
            return response
        }

        catch(err)
        {
             console.error("Login Error:", err);
            console.error("Response Data:", err.response?.data);

            alert(
                JSON.stringify(
                err.response?.data || err.message,
                null,
                2
                )
            );

            throw err;

        }
        finally{
            setLoading(false)
        }
    }
    const handleRegister = async (email, contact, password, fullName) => {
        console.log("AuthProvider.handleRegister start", { email, contact, fullName })
        try{
            const response = await apiHandleRegister(email, contact, password, fullName)
            console.log("AuthProvider.handleRegister success", { email, user: response.user })
            setUser(response.user)
            return response

        }
        catch(err)
        {
            console.error("Registration Error:", err);
        
      throw err;
        }
        finally{
            setLoading(false)
        }

    }
    const handleLogout = () => {
        setUser(null)
    }
    return(
        <AuthContext.Provider value={{
            user,loading,handleLogin,handleRegister,handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider