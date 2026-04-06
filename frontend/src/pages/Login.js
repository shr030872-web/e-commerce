import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
    try {
        const url = isLogin
            ? "https://e-commerce-fxy9.onrender.com/api/auth/login"
            : "https://e-commerce-fxy9.onrender.com/api/auth/signup";

        const res = await axios.post(url, form);

        if (res.data.token) {
    localStorage.setItem("token", res.data.token);

    if (res.data.user && res.data.user._id) {
        localStorage.setItem("userId", res.data.user._id);
    }

    navigate("/dashboard");
    } else {
        setMessage(res.data.message || "Login failed");
    }

    } catch (err) {
        console.log(err); // see real error
        setMessage(err.response?.data?.message || "Login failed");
    }
};

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{isLogin ? "Login" : "Signup"}</h2>

            {!isLogin && (
                <>
                    <input
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                    />
                    <br /><br />
                </>
            )}

            <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />

            <br /><br />

            <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
            />

            <br /><br />

            <button onClick={handleSubmit}>
                {isLogin ? "Login" : "Signup"}
            </button>

            <br /><br />

            {message && (
                <p style={{ color: message.includes("error") ? "red" : "green" }}>
                    {message}
                </p>
            )}

            <p
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage("");
                }}
            >
                Switch to {isLogin ? "Signup" : "Login"}
            </p>
        </div>
    );
}

export default Login;