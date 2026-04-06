import { useEffect, useState } from "react";

function Cart() {
    const [cart, setCart] = useState([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const increaseQty = (index) => {
        let newCart = [...cart];
        newCart[index].qty = (newCart[index].qty || 1) + 1;
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const decreaseQty = (index) => {
        let newCart = [...cart];

        if ((newCart[index].qty || 1) > 1) {
            newCart[index].qty -= 1;
        }

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const updateQuantity = (index, change) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].qty = (cart[index].qty || 1) + change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.reload();
};

const removeItem = (index) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.reload();
};

    const total = cart.reduce(
        (sum, item) => sum + item.price * (item.qty || 1),
        0
    );

    // FINAL PLACE ORDER
    const placeOrder = async () => {
    const confirmPayment = window.confirm("Proceed to payment?");

    if (!confirmPayment) return;

    setMsg("Payment Successful ");

    try {
        await fetch("https://e-commerce-fxy9.onrender.com/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                products: cart,
                total: total
            })
        });

        setMsg("Order Placed Successfully");
        setTimeout(() => setMsg(""), 2000);
        localStorage.removeItem("cart");
        setCart([]);
    } catch (err) {
        setMsg("Error placing order");
        setTimeout(() => setMsg(""), 2000);
    }
};
    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>My Cart 🛒</h1>

            {msg && (
                <p style={{ textAlign: "center", color: "green" }}>
                    {msg}
                </p>
            )}

            {cart.length === 0 ? (
                <p style={{ textAlign: "center" }}>Cart is empty</p>
            ) : (
                <>
                    {cart.map((item, index) => (
                        <div key={index} style={{
                            border: "1px solid #ddd",
                            margin: "10px",
                            padding: "10px",
                            borderRadius: "10px"
                        }}>
                            <h3>{item.name}</h3>
                            <p>₹{item.price}</p>

                            <button onClick={() => decreaseQty(index)}>-</button>
                            <span style={{ margin: "0 10px" }}>
                                {item.qty || 1}
                            </span>
                            <button onClick={() => increaseQty(index)}>+</button>

                            <br /><br />

                            <button onClick={() => removeItem(index)}>
                                Remove 
                            </button>
                            <p>Qty: {item.qty || 1}</p>

                            <button onClick={() => updateQuantity(index, 1)}>+</button>
                            <button onClick={() => updateQuantity(index, -1)}>-</button>

                            <button onClick={() => removeItem(index)}>Remove</button>
                        </div>
                    ))}

                    <h2>Total: ₹{total}</h2>

                    <button onClick={placeOrder} style={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "10px",
                        border: "none",
                        cursor: "pointer"
                    }}>
                        Place Order 
                    </button>
                </>
            )}
        </div>
    );
}

export default Cart;