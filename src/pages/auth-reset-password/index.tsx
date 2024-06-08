import logo_with_background from "@assets/logo-with-background.png";
import { validMarchet, validPassword } from "@utils/validators";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AuthService from "src/services/auth";

import "./index.css";

class Validators {
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

export function AuthResetPassword() {
    const authService = new AuthService();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const otp = searchParams.get("otp");

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setloading] = useState<boolean>(false);

    const changeState = (value: string, setState: any) => setState(value);

    const submitForgetPassword = async () => {
        if (!otp) return;

        const _password = Validators.validatePassword(password);
        const _confirmPassword = Validators.validateConfirmPassword(password, confirmPassword);

        if (!_password || !_confirmPassword) {
            setloading(false);
            return
        }

        setloading(true);

        const response = await authService.resetPassword(_password, otp);

        setloading(false);

        if (response.status !== 200) {
            toast(response.msg || "Erro na troca de senha", { type: "error" });
            return;
        }

        toast("Senha redefinida comn sucesso.", { type: "success" });

        goLoginScheen();
    }

    useEffect(() => {
        if (!otp) window.location.href = "/";
    }, [])

    const goLoginScheen = () => navigate("/");

    return (
        <div className="background-auth-reset-password">
            <div className="panel-auth-reset-password">
                
                <div className="logo mt-3">
                    <img src={logo_with_background} alt="logo" />
                </div>

                <div className="panel-control mt-5">
                    <input
                        type="password"
                        name="password"
                        placeholder="Nova Senha"
                        id="password"
                        onChange={({ target }) => changeState(target.value, setPassword)}
                        value={password || ""}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirmação da nova senha"
                        onChange={({ target }) => changeState(target.value, setConfirmPassword)}
                        value={confirmPassword || ""}
                    />

                    <button className="mt-3" type="button" onClick={submitForgetPassword}>
                        {loading
                            ?
                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            :
                            <span>Redefinir Senha</span>
                        }
                    </button>
                </div>

                <button onClick={goLoginScheen} type="button" className="btn btn-link">Volta para tela de login</button>
            </div>
            <ToastContainer position="top-right" theme="light" />
        </div>
    )
}