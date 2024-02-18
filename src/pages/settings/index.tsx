import "./index.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UpdateUser } from "./types"

export function Settings() {
    const [user, setUser] = useState<UpdateUser>({
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })

    const changeUpdateUserState = (event: any) => {
        const {name, value} = event.target;
        setUser(prev => ({...prev, [name]: value}));
    };

    useEffect(() => {
        const user = {
            name: "Lucas",
            email: "lucasgomes@fatec.sp.gov.br",
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        }
        setUser(user);
    }, [])

    const handleUpdateEmail = () => {
        let email = user.email.trim();
        
        if (email.length === 0) {
            toast("E-mail is required.",  {type: "error"});
            return false;
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
            <div className="form-update-password">
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

                <button type="button" onClick={handleUpdateEmail} className="btn btn-primary mt-2">
                    Salvar novo E-mail
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