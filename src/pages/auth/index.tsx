import "./index.css"
import { useState } from "react"
import { ToastContainer, toast } from "react-toastify";
import { validEmail, validMarchet, validPassword, validUsername } from "../../utils/validators";

export function Auth    () {
    const [preview, setPreview] = useState<"sign-in" | "sign-up" | "forgot-password">("sign-in")
    
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const changeState = (value: string, setState: any) => setState(value);

    const submitLogin = () => {
        const _username = _validateUsername();
        const _password = _validatePassword();

        if (!_username || !_password) return;
        
        // TODO: Login to API
        const userData = {} // result from api
        
        localStorage.setItem("user", JSON.stringify(userData));
        console.log({_username, _password});
        window.location.href = '/';
    }

    const submitForgotPassword = () => {
        const _email = _validateEmail();

        if (!_email) return;
        
        // TODO: ForgotPassword to API
        console.log({_email});
    }

    const submitRegister = () => {
        const _email = _validateEmail();
        const _password = _validatePassword();
        const _confirmPassword = _validateConfirmPassword();
        
        if (!_email || !_password || !_confirmPassword) return;

        // TODO: Register to API
        console.log({email, password, confirmPassword});
        window.location.href = '/';
    }

    
    const _validateEmail = () => {
        const validator = validEmail(email);

        if (!validator){
            toast("Invalid E-mail.", {type: "error"});
            return false
        }

        return email;
    }
    
    const _validatePassword = () => {
        const validator = validPassword(password);

        if (!validator.valid) {
            toast(validator.message, {type: "error"});
            return false
        }

        return password;
    }

    const _validateConfirmPassword = () => {
        const validator = validMarchet(password, confirmPassword)

        if (validator) {
            toast("Password not matchet.", {type: "error"});
            return false
        }

        return confirmPassword;
    }; 

    const _validateUsername = () => {
        if (!validUsername(username)) {
            toast(
                "O username deve conter apenas letras minúsculas, números, '_' ou '.'.", 
                {type: "error"}
            );
            return false
        }
        
        return username
    }

    return (
        <div className="background-sign-in">
            <div className="container-sign-in">
                
                <div className="panel-menu">
                    
                    <div className="info-app">
                        <h3>Bem-vindo ao</h3>
                        <h3 className="mb-2">Laboratório de TCC</h3>
                        
                        <p className="mb-3">{preview === "sign-in" ? "Cadastrar uma conta" : "Faça Login na sua conta"}</p>
                    </div>
                    
                    <button
                        className="btn-preview"
                        onClick={() => preview === "sign-in" ? setPreview("sign-up") : setPreview("sign-in")} 
                        type="button"
                    >
                        {preview === "sign-in" ? "Cadastrar" : "Entrar"}
                    </button>

                    <p className="mt-3 forgot-password" onClick={() => setPreview("forgot-password")}>Esqueceu sua senha ? clique aqui!</p>

                </div>

                <div className="panel-control">
                    
                    {preview === "sign-in" &&
                        <div className="panel-login">
                            <h3 className="mb-2">Login</h3>
                            <p className="mb-5">Informe seu Login e Senha</p>

                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                placeholder="username" 
                                onChange={({target}) => changeState(target.value, setUsername)}
                                value={username || ""}
                            />
                            <input 
                                type="text" 
                                name="password"
                                placeholder="Senha" 
                                id="password" 
                                onChange={({target}) => changeState(target.value, setPassword)}
                                value={password || ""}
                            />

                            <button type="button" onClick={submitLogin}>Acessar</button>
                        </div>
                    }
                    
                    {preview === "sign-up" &&
                        <div className="panel-register">
                            <h3 className="mb-2">Criar Conta</h3>
                            <p className="mb-5">Preencha os campos com os seus dados</p>

                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                placeholder="Username" 
                                onChange={({target}) => changeState(target.value, setUsername)}
                                value={username || ""}
                            />
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="E-mail" 
                                onChange={({target}) => changeState(target.value, setEmail)}
                                value={email || ""}
                            />
                            <input 
                                type="text" 
                                name="password"
                                placeholder="Senha" 
                                id="password" 
                                onChange={({target}) => changeState(target.value, setPassword)}
                                value={password || ""}
                            />
                            <input 
                                type="text" 
                                name="confirmPassword" 
                                id="confirmPassword"
                                placeholder="Confirmação da senha"
                                onChange={({target}) => changeState(target.value, setConfirmPassword)}
                                value={confirmPassword || ""}
                            />

                            <button type="button" onClick={submitRegister}>Cadastrar</button>
                        </div>
                    }

                    {preview === "forgot-password" &&
                        <div className="panel-login">
                            <h3 className="mb-2">Esqueci minha senha</h3>
                            <p className="mb-5">Informe o E-mail Cadastrado</p>


                            <input 
                                type="text" 
                                name="email" 
                                id="email" 
                                placeholder="E-mail" 
                                onChange={({target}) => changeState(target.value, setEmail)}
                                value={email || ""}
                            />
                            
                            <button type="button" onClick={submitForgotPassword}>Enviar</button>
                        </div>
                    }

                </div>

            </div>

            <ToastContainer  position="top-right" theme="light" />
        </div>
    )
}