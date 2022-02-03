export interface JWT {
    user: User;
    [key: string]: any;
}
export interface User {
    [key: string]: any;
}
export interface Session {
    user: User;
    [key: string]: any;
}
