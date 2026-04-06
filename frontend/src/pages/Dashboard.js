import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "https://ecommerce-backend-new-3ntn.onrender.com/api/auth/dashboard",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setMessage(res.data.message); 

            } catch (err) {
                window.location.href = "/";
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{message || "Loading..."}</h1>  
            <p>You are logged in</p>
            <button onClick={() => window.location.href = "/products"}>
            Go to Products 
        </button>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Dashboard;