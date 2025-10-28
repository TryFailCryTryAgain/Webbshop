import { useEffect, useState } from "react";

interface Profile {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    adress: string,
    ZIP: number,
    role: string
}

const useUser = (): Profile | null => {
    const [user, setUser] = useState<Profile | null>(null);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString) {
            try {
                setUser(JSON.parse(userString) as Profile);
            } catch (err) {
                console.error("Error parsing user data", err);
            }
        }
    }, []);

    return user;
}

const UserProfileTable = () => {

    const user = useUser();

    function CheckStatus() {
        console.log(user);
    }

    
    return (
        <>
            <button onClick={() => CheckStatus()}>Status</button>
            <div className="user-profile-grid">
                <div>Username <span>{user?.first_name} {user?.last_name}</span></div>
                <div>Email <span>{user?.email}</span></div>
                <div>Adress <span>{user?.adress} {user?.ZIP}</span></div>
                <div>Role <span>{user?.role}</span></div>
            </div>
            <div className="action-buttons-profile">
                <button className="btn edit">Edit Profile</button>
                <button className="btn delete">Delete Profile</button>
            </div>
        </>
    );
};

export default UserProfileTable;