import { User, InvitationCode } from '../config/database';
export declare const registerUser: (username: string, password: string, email: string, inviteCode?: string) => Promise<User>;
export declare const loginUser: (username: string, password: string) => Promise<{
    user: User;
    token: string;
}>;
export declare const verifyToken: (token: string) => {
    userId: string;
    username: string;
    isAdmin: boolean;
    isVIP: boolean;
};
export declare const getUserById: (userId: string) => User | undefined;
export declare const updateUserOnlineStatus: (userId: string, isOnline: boolean) => void;
export declare const generateInvitationCode: (adminId: string) => InvitationCode;
//# sourceMappingURL=authService.d.ts.map