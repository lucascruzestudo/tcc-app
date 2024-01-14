import { useState } from "react"
import { Login } from "./types"

export function SignIn() {
    const [login, setLogin] = useState<Login>({
        email: '',
        password: ''
    });

    const changeLoginState = (event: any) => {
        const { name, value } = event.target
        
        setLogin((previous) => ({...previous, [name]: value}));
    }


    const submitLogin = () => {
        console.log(login)
    }

    return (
        <div className="container-sign-in">
            <input type="text" name="email" id="email" onChange={changeLoginState}/>
            <input type="text" name="password" id="password" onChange={changeLoginState}/>

            <button type="button" onClick={submitLogin}>Acessar</button>
        </div>
    )
}