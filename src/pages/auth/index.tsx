import { LocalStorangeUser } from "@utils/types";
import {
    validEmail,
    validMarchet,
    validPassword,
} from "@utils/validators";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import logo from "src/assets/logo-without-background-2.png";
import AuthService from "src/services/auth";
import "./index.css";

class Validators {

    static validateEmail = (email: string) => {
        const validator = validEmail(email);

        if (!validator) {
            toast("E-mail inválido.", { type: "error" });
            return false
        }

        return email;
    }

    static validatePassword = (password: string) => {
        const validator = validPassword(password);

        if (!validator.valid) {
            toast(validator.message, { type: "error" });
            return false
        }

        return password;
    }

    static validateConfirmPassword = (password: string, confirmPassword: string) => {
        const validator = validMarchet(password, confirmPassword)

        if (validator) {
            toast("Senha não correspondida", { type: "error" });
            return false
        }

        return confirmPassword;
    };
}

export function Auth() {
    const authService = new AuthService();

    const [preview, setPreview] = useState<"sign-in" | "sign-up" | "forgot-password">("sign-in")

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [profile, setProfile] = useState<number>(3);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setloading] = useState<boolean>(false);
    const [secretManager, setSecretManager] = useState<string>('');

    const changeState = (value: string, setState: any) => setState(value);

    const submitLogin = async () => {
        const _email = Validators.validateEmail(email);
        const _password = Validators.validatePassword(password);

        if (!_email || !_password) return;

        setloading(true);

        const response = await authService.login<LocalStorangeUser>({
            email: _email,
            password: _password,
        });

        if (response.status === 401) {
            toast(response.msg || "O E-mail ou senha está incorreto.", { type: "error" });
            setloading(false);
            return
        }

        setloading(false);

        if (response.status !== 200) {
            toast(response.msg || "Erro de Login", { type: "error" });
            setloading(false);
            return
        }

        const {
            access_token,
            refresh_token,
            ...userData
        } = response.data

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        // const path = userData.role === 3 && userData.projectIds.length === 1  
        //     ? `/project-progress/${userData.projectIds[0]}`
        //     : '/projects';

        window.location.href = '/projects'
    }

    const submitForgotPassword = async () => {
        const _email = Validators.validateEmail(email);

        if (!_email) return;

        await authService.sendResetPassword(_email);

        toast("Em alguns minutos, as instruções para a redefinição de" +
            "senha devem chegar ao e-mail informado.", 
            { type: "success" }
        )
    }

    const submitRegister = async () => {
        const _email = Validators.validateEmail(email);
        const _password = Validators.validatePassword(password);
        const _confirmPassword = Validators.validateConfirmPassword(password, confirmPassword);

        if (
            !_email ||
            !_password ||
            !_confirmPassword ||
            fullName.length < 4 ||
            !([1, 2, 3].includes(profile))
        ) {
            toast("Dados inválidos.", { type: "error" });
            return
        }

        if (profile === 1 && secretManager.trim().length == 0) {
            toast("Chave secreta não fornecida.", { type: "error" });
            return
        }

        setloading(true);

        const response = await authService.register({
            password: _password,
            email: _email,
            full_name: fullName,
            role: profile,
            secret_manager: secretManager
        });

        setloading(false);

        if (response.status !== 201) {
            toast(response.msg || "Erro de registro", { type: "error" });
            setloading(false);
            return
        };

        submitLogin();
    }

    return (
        <div className="background-sign-in">
            <div className="container-sign-in">

                <div className="panel-menu">

                    <img className="logo" src={logo} alt="logo" />

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
                                type="email"
                                name="email"
                                id="email"
                                placeholder="E-mail"
                                onChange={({ target }) => changeState(target.value, setEmail)}
                                value={email || ""}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Senha"
                                id="password"
                                onChange={({ target }) => changeState(target.value, setPassword)}
                                value={password || ""}
                            />

                            <button type="button" onClick={submitLogin}>
                                {loading
                                    ?
                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    :
                                    <span>Acessar</span>
                                }
                            </button>
                        </div>
                    }

                    {preview === "sign-up" &&
                        <div className="panel-register">
                            <h3 className="mb-2">Criar Conta</h3>
                            <p className="mb-5">Preencha os campos com os seus dados</p>

                            <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                placeholder="Apelido"
                                onChange={({ target }) => changeState(target.value, setFullName)}
                                value={fullName || ""}
                            />

                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="E-mail"
                                onChange={({ target }) => changeState(target.value, setEmail)}
                                value={email || ""}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Senha"
                                id="password"
                                onChange={({ target }) => changeState(target.value, setPassword)}
                                value={password || ""}
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Confirmação da senha"
                                onChange={({ target }) => changeState(target.value, setConfirmPassword)}
                                value={confirmPassword || ""}
                            />

                            <select
                                value={profile}
                                className="form-select"
                                onChange={({ target }) => setProfile(Number(target.value))}
                            >
                                <option value={3}>Aluno</option>
                                <option value={2}>Orientador</option>
                                <option value={1}>Coordenador</option>
                            </select>

                            {profile === 1 &&
                                <input
                                    type="password"
                                    name="secret-manager"
                                    placeholder="Chave secreta"
                                    id="secret-manager"
                                    onChange={({ target }) => changeState(target.value, setSecretManager)}
                                    value={secretManager || ""}
                                />
                            }

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
                                onChange={({ target }) => changeState(target.value, setEmail)}
                                value={email || ""}
                            />

                            <button type="button" onClick={submitForgotPassword}>
                                {loading
                                    ?
                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    :
                                    <span>Cadastrar</span>
                                }
                            </button>
                        </div>
                    }

                </div>

            </div>

            <ToastContainer position="top-right" theme="light" />
        </div>
    )
}