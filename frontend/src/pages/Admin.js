import { useEffect, useState } from "react";

function Admin() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("https://ecommerce-backend-new-3ntn.onrender.com/api/orders")
            .then(res => res.json())
            .then(data => setOrders(data));
    }, []);
    const deleteOrder = async (id) => {
    await fetch(`https://ecommerce-backend-new-3ntn.onrender.com/api/orders/${id}`, {
        method: "DELETE"
    });

    window.location.reload();
};
    return (
        <div>
            <h1>Admin Dashboard</h1>

            {orders.map((o, i) => (
                <div key={i}>
                    <p>Total: ₹{o.total}</p>
                </div>
            ))}
            <button onClick={() => deleteOrder(order._id)}>
                Delete Order
            </button>
        </div>
    );
}

export default Admin;