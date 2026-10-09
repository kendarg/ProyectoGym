export interface LoginCredential{
    email: string;
    password: string;

}
export interface AuthResponse{
    token: string;
    user:{
        id: number;
        nombre: string;
        email: string;
        rol: 'GUEST'|'CLIENT'|'ADMIN'
    };
}