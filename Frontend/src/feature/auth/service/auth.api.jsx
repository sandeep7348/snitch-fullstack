import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
})

export async function handleRegister(email, contact, password, fullName) {
    console.log("auth.api.handleRegister request", { email, contact, fullName })
    try {
        const response = await api.post("/api/auth/register", {
            email,
            contact,
            password,
            fullName,
        })
        console.log("auth.api.handleRegister response", response.data)
        return response.data
    } catch (err) {
        console.error("auth.api.handleRegister error", err.response?.data || err.message)
        throw err
    }
}
export async function handleLogin(email, password) {
    console.log("auth.api.handleLogin request", { email })
    try{
        const response = await api.post("/api/auth/login",{
            email,
            password
        })
        console.log("auth.api.handleLogin response", response.data)
        return response.data

    }
    catch(err)
    {
        console.error("auth.api.handleLogin error", err.response?.data || err.message)
        throw err;
    }

}