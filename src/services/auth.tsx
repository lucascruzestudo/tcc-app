import api from "@config/api";

type Login = {
  username: string;
  password: string;
};

type Register = {
  username: string;
  password: string;
  email: string;
  full_name: string;
  rule: 1 | 2 | 3 | 4;
}

export default class AuthService {
  login = async (data: Login): Promise<any | null> => {
    try {
      const response = await api.post("/login", data);
      return response.data;
    } catch (error) {
      console.error("Error when logging in");
      return null
    }
  };

  register = async (data: Register): Promise<any | null> => {
    try {
      const response = await api.post("/login", data);
      return response.data;
    } catch (error) {
      console.error("Error registering new user");
      return null
    }
  };
}
