import "./index.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UpdateUser } from "./types"
import { useAuth } from "src/hooks/authContextProvider";

export function MyAccount() {
    const userLocalStorage = useAuth().user!
     
    const [user, setUser] = useState<UpdateUser>({
        full_name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        profile_picture: "",
    })

    const changeUpdateUserState = (event: any) => {
        const {name, value} = event.target;
        setUser(prev => ({...prev, [name]: value}));
    };

    useEffect(() => {
        const user = {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            profile_picture: userLocalStorage.profile_picture || "",
            email: userLocalStorage.email || "",
            full_name: userLocalStorage.full_name || "",
        };
        
        setUser(user);
    }, []);

    const handleUpdateGeneralData = () => {
        const userUpdate: {
            email?: string,
            full_name?: string,
        } = {
            email: user.email ? user.email.trim() : "",
            full_name: user.full_name ? user.full_name.trim() : "",
        }

        if (userUpdate.email === userLocalStorage.email) delete userUpdate.email;
        if (userUpdate.full_name === userLocalStorage.full_name) delete userUpdate.full_name;

        if (userUpdate.email && userUpdate.email.length === 0) {
            toast("E-mail é obrigatório.",  {type: "error"});
            return false;
        }

        // TODO: send update E-mail to API

        console.log(userUpdate)

        console.log("onCLick -> Update Email", user)
    }

    const handleUpdatePassword = () => {
        const currentPassword = user.currentPassword.trim();
        const newPassword = user.newPassword.trim();
        const confirmNewPassword = user.confirmNewPassword.trim();
        
        if (currentPassword.length === 0) {
            toast("A senha atual é obrigatória.",  {type: "error"});
            return false;
        }
        
        if (newPassword !== confirmNewPassword) {
            toast("A nova senha não corresponde à confirmação da senha.",  {type: "error"});
            return false;
        }

        // TODO: send update password to API

        console.log("onCLick -> Update Password", user)
    }

    return(
        <div className="container-user row mt-3">
            <div className="form-update-general-data mb-5 col-md-6 col-sm-12">
                <label htmlFor="formControlName" className="form-label">Nome social</label>
                <input 
                    type="text" 
                    className="form-control mb-3" 
                    id="formControlName" 
                    placeholder="Nome ou Apelido"
                    name="full_name"
                    value={user.full_name}
                    onChange={(event) => changeUpdateUserState(event)}
                />

                <label htmlFor="formControlEmail" className="form-label">E-mail</label>
                <input 
                    type="email" 
                    className="form-control mb-3" 
                    id="formControlEmail" 
                    placeholder="nome@exemplo.com"
                    name="email"
                    value={user.email}
                    onChange={(event) => changeUpdateUserState(event)}
                />    

                <button type="button" onClick={handleUpdateGeneralData} className="btn btn-primary mt-2">
                    Salvar novos dados
                </button>
            </div>

            <div className="form-update-password mb-5 col-md-6 col-sm-12">
                <label htmlFor="formControlcurrentPassword" className="form-label">Senha Antiga</label>
                <input 
                    type="password" 
                    className="form-control mb-3" 
                    id="formControlcurrentPassword" 
                    placeholder="Senha atual"
                    name="currentPassword"
                    value={user.currentPassword}
                    onChange={(event) => changeUpdateUserState(event)}
                />

                <label htmlFor="formControlPassword" className="form-label">Nova Senha</label>
                <input 
                    type="password" 
                    className="form-control mb-3"
                    id="formControlPassword"
                    placeholder="Nova senha"
                    name="newPassword"
                    value={user.newPassword}
                    onChange={(event) => changeUpdateUserState(event)}
                />

                <label htmlFor="formControlConfirmPassword"className="form-label">Confirmação da Senha</label>
                <input 
                    type="password" 
                    className="form-control mb-3"
                    id="formControlConfirmPassword"
                    placeholder="Confirmação da nova senha"
                    name="confirmNewPassword"
                    value={user.confirmNewPassword}
                    onChange={(event) => changeUpdateUserState(event)}
                />

                <button type="button" onClick={handleUpdatePassword}className="btn btn-primary mt-2">
                    Salvar nova Senha
                </button>
            </div>
        </div>
    )
}