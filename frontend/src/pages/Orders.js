import { useEffect, useState } from "react";

function Orders() {
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user._id : null;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`https://e-commerce-fxy9.onrender.com/api/orders/${userId}`);
                const data = await res.json();

                console.log("Orders:", data); // debug

                setOrders(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>My Orders </h1>

            {orders.length === 0 ? (
                <p>No orders yet</p>
            ) : (
                orders.map((order, index) => (
                    <div key={index} style={{
                        border: "1px solid gray",
                        margin: "10px",
                        padding: "10px"
                    }}>
                        <h3>Order #{index + 1}</h3>

                        {order.products.map((p, i) => (
                            <p key={i}>
                                {p.name} - ₹{p.price}
                            </p>
                        ))}

                        <h4>Total: ₹{order.total}</h4>
                    </div>
                ))
            )}
        </div>
    );
}

export default Orders;