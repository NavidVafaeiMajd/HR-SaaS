import { useAuthContext } from "@/Context/AuthContext";

export const usePermission = () => {

    const { user } = useAuthContext();

    const can = (permission: string) => {

        if (user?.roles[0] === "Admin")
            return true
        return user?.permissions.includes(permission);

    }

    return { can };

}