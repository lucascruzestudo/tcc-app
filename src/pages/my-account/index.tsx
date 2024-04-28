import defaultProfile from "@assets/profile.jpeg";
import { Spinner } from "@components/index";
import UserService from "@services/user";
import { useEffect, useState } from "react";
import { TbPhotoEdit } from "react-icons/tb";
import { toast } from "react-toastify";
import { useAuth } from "src/hooks/authContextProvider";
import "./index.css";
import { UpdateUser } from "./types";

export function MyAccount() {
    const userLocalStorage = useAuth().user!
    const userService = new UserService()
    const [profileImg, setProfileImg] = useState<string>('');
    const [loading, setloading] = useState<boolean>(false);     
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
        setloading(true);

        const user = {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            profile_picture: userLocalStorage.profile_picture || "",
            email: userLocalStorage.email || "",
            full_name: userLocalStorage.full_name || "",
        };
        
        setUser(user);

        userService.getProfile<BlobPart>(userLocalStorage.id).then(({data}) => {
            if (!data) return;
            if (profileImg) URL.revokeObjectURL(profileImg);

            const blob = new Blob([data]);
            const url = URL.createObjectURL(blob);
            //useAuth().setUser({...userLocalStorage, profile_picture: url});
            setProfileImg(url);
        });

        setloading(false);
    }, []);

    const handleUpdateGeneralData = async () => {
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

        if (Object.keys(userUpdate).length === 0) return;
        
        const id: string = userLocalStorage.id
        const response = await userService.edit<{msg: string}>(id, userUpdate);

        if (response.status !== 200 && response.data) {
            toast(response.data.msg,  {type: "error"});
            return false;
        }

        useAuth().setUser({...userLocalStorage, ...userUpdate});

        toast("Dados atualizados!",  {type: "success"});
    }

    const handleUpdatePassword = async () => {
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

        const id: string = userLocalStorage.id

        const response = await userService.edit<{msg: string}>(id, {
            currentPassword: currentPassword,
            newPassword: newPassword
        });

        if (response.status !== 200 && response.data) {
            if (response.data.msg.includes('Invalid Password')) {
                toast("Senha antiga incorreta!",  {type: "error"});
            } else {
                toast(response.data.msg,  {type: "error"});
            }
            return false;
        }

        toast("Senha atualizada!",  {type: "success"});
        setUser({...user, newPassword: '', confirmNewPassword: '', currentPassword: ''});
    }

    const handlePhotoChange = async (e: any) => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('file', file);
        
        const id: string = userLocalStorage.id

        await userService.editprofile(id, formData);

        userService.getProfile<BlobPart>(userLocalStorage.id).then(({data}) => {
            if (!data) return;
            if (profileImg) URL.revokeObjectURL(profileImg);

            const blob = new Blob([data]);
            const url = URL.createObjectURL(blob);
            //useAuth().setUser({...userLocalStorage, profile_picture: url});
            setProfileImg(url);
        });
    };

    return(
        <div className="container-user row mt-3">
            <Spinner loading={loading} />

            <div className="row mb-5">
                <div className="col">
                    <div className="profile-picture">
                        <img src={profileImg || defaultProfile} alt="Foto de Perfil" id="profile-img" />
                        <input onChange={handlePhotoChange} type="file" id="file-input" />
                        <label id="file-input" htmlFor="file-input"><TbPhotoEdit /></label>
                    </div>
                </div>
            </div>

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