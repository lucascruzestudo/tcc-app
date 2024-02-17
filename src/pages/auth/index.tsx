import "./index.css"
import { useState } from "react"

export function Auth    () {
    const [preview, setPreview] = useState<"sign-in" | "sign-up" | "forgot-password">("sign-in")
    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const changeState = (value: string, setState: any) => setState(value);

    const submitLogin = () => {
        const _email = _validateEmail();
        const _password = _validatePassword();

        if (!_email || !_password) return;

        console.log({_email, _password});
    }

    const submitForgotPassword = () => {
        const _email = _validateEmail();

        if (!_email) return;
        
        console.log({_email});
    }

    const submitRegister = () => {
        const _email = _validateEmail();
        const _password = _validatePassword();
        const _confirmPassword = _validateConfirmPassword();

        if (!_email || !_password || !_confirmPassword) return;

        console.log({email, password, confirmPassword});
    }

    
    const _validateEmail = () => {
        const _email = email.trim()

        if (!(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i).test(_email)){
            console.log("Invalid E-mail.");
            return false
        }

        return _email;
    }
    
    const _validatePassword = () => {
        const _password = password.trim();

        if (_password.length === 0) {
            console.log("Invalid Password.")
            return false;
        }

        //TODO: validate if _password contains Numbera, Uppercase, lowercase and special characters
        return _password;
    }

    const _validateConfirmPassword = () => {
        const _password = password.trim()
        const _confirmPassword = confirmPassword.trim()

        if (_password !== _confirmPassword) {
            console.log("Password not matchet");
            return false
        }

        return _confirmPassword;
    }; 


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
                            <p className="mb-5">Informe seu E-mail e Senha</p>

                            <input 
                                type="text" 
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

                            <button type="button" onClick={submitLogin}>Acessar</button>
                        </div>
                    }
                    
                    {preview === "sign-up" &&
                        <div className="panel-register">
                            <h3 className="mb-2">Criar Conta</h3>
                            <p className="mb-5">Preencha os campos com os seus dados</p>

                            <input 
                                type="text" 
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
        </div>
    )
}