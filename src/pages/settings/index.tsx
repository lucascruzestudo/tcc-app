import "./index.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UpdateUser } from "./types"
import { validUsername } from "../../utils/validators";
import { User } from "../../utils/types";

export function Settings() {
    const userLocalStorage: Omit<User, "password"> & {
        role: number | string,
        access_token: string,
        refresh_token: string,
    } = JSON.parse(localStorage.get("user"));
    
    const [user, setUser] = useState<UpdateUser>({
        full_name: "",
        username: "",
        email: "",
        oldPassword: "",
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
            ...userLocalStorage,
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        }
        setUser(user);
    }, []);

    const handleUpdateGeneralData = () => {
        const userUpdate: {
            username?: string,
            email?: string,
            full_name?: string,
        } = {
            username: user.username ? user.username.trim() : "",
            email: user.email ? user.email.trim() : "",
            full_name: user.full_name ? user.full_name.trim() : "",
        }

        if (userUpdate.username === userLocalStorage.username) delete userUpdate.username;
        if (userUpdate.email === userLocalStorage.email) delete userUpdate.email;
        if (userUpdate.full_name === userLocalStorage.full_name) delete userUpdate.full_name;

        if (userUpdate.email && userUpdate.email.length === 0) {
            toast("E-mail is required.",  {type: "error"});
            return false;
        }

        if(userUpdate.username && !validUsername(userUpdate.username)) {
            toast(
                "O username deve conter apenas letras minúsculas, números, '_' ou '.'.", 
                {type: "error"}
            );
            return
        }
        // TODO: send update E-mail to API

        console.log("onCLick -> Update Email", user)
    }

    const handleUpdatePassword = () => {
        const oldPassword = user.oldPassword.trim();
        const newPassword = user.newPassword.trim();
        const confirmNewPassword = user.confirmNewPassword.trim();
        
        if (oldPassword.length === 0) {
            toast("Old Password is required.",  {type: "error"});
            return false;
        }
        
        if (newPassword !== confirmNewPassword) {
            toast("New Password not match with Confirm password.",  {type: "error"});
            return false;
        }

        // TODO: send update password to API

        console.log("onCLick -> Update Password", user)
    }

    return(
        <div className="container-user">
            <div className="form-update-general-data">
                <label htmlFor="formControlUsername" className="form-label">Login</label>
                <input 
                    type="text" 
                    className="form-control mb-3" 
                    id="formControlUsername" 
                    placeholder="name.login"
                    name="username"
                    value={user.username}
                    onChange={(event) => changeUpdateUserState(event)}
                />

                <label htmlFor="formControlEmail" className="form-label">E-mail</label>
                <input 
                    type="email" 
                    className="form-control mb-3" 
                    id="formControlEmail" 
                    placeholder="name@example.com"
                    name="email"
                    value={user.email}
                    onChange={(event) => changeUpdateUserState(event)}
                />    

                <button type="button" onClick={handleUpdateGeneralData} className="btn btn-primary mt-2">
                    Salvar novos dados
                </button>
            </div>

            <div className="form-update-password mt-5">
                <label htmlFor="formControlOldPassword" className="form-label">Senha Antiga</label>
                <input 
                    type="password" 
                    className="form-control mb-3" 
                    id="formControlOldPassword" 
                    placeholder="Old Password"
                    name="oldPassword"
                    value={user.oldPassword}
                    onChange={(event) => changeUpdateUserState(event)}
                />

                <label htmlFor="formControlPassword" className="form-label">Nova Senha</label>
                <input 
                    type="password" 
                    className="form-control mb-3"
                    id="formControlPassword"
                    placeholder="New Password"
                    name="newPassword"
                    value={user.newPassword}
                    onChange={(event) => changeUpdateUserState(event)}
                />

                <label htmlFor="formControlConfirmPassword"className="form-label">Confirmação da Senha</label>
                <input 
                    type="password" 
                    className="form-control mb-3"
                    id="formControlConfirmPassword"
                    placeholder="Comfirm New Password"
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