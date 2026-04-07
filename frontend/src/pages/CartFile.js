import { useEffect, useState } from "react";

function Cart() {
    const [cart, setCart] = useState([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // Update Cart in state + localStorage
    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // Increase Quantity
    const increaseQty = (index) => {
        let newCart = [...cart];
        newCart[index].qty = (newCart[index].qty || 1) + 1;
        updateCart(newCart);
    };

    // Decrease Quantity
    const decreaseQty = (index) => {
        let newCart = [...cart];

        if ((newCart[index].qty || 1) > 1) {
            newCart[index].qty -= 1;
        } else {
            newCart.splice(index, 1); // remove item if qty 0
        }

        updateCart(newCart);
    };

    // Remove Item
    const removeItem = (index) => {
        let newCart = [...cart];
        newCart.splice(index, 1);
        updateCart(newCart);
    };

    // Total Price
    const total = cart.reduce(
        (sum, item) => sum + item.price * (item.qty || 1),
        0
    );

    // FAKE PAYMENT + ORDER
    const placeOrder = async () => {
        if (cart.length === 0) {
            setMsg("Cart is empty");
            return;
        }

        const confirmPayment = window.confirm("Proceed to payment?");
        if (!confirmPayment) return;

        setMsg("Processing payment...");

        try {
            // Fake delay (looks real)
            setTimeout(async () => {

                await fetch("https://e-commerce-fxy9.onrender.com/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        products: cart,
                        total: total
                    })
                });

                setMsg(" Payment Successful & Order Placed!");

                // Clear cart
                localStorage.removeItem("cart");
                setCart([]);

                // Redirect after 2 sec
                setTimeout(() => {
                    window.location.href = "/orders";
                }, 2000);

            }, 1000);

        } catch (err) {
            setMsg(" Error placing order");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>My Cart </h1>

            {msg && (
                <p style={{
                    textAlign: "center",
                    color: msg.includes("Error") ? "red" : "green",
                    fontWeight: "bold"
                }}>
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
                            padding: "15px",
                            borderRadius: "10px"
                        }}>
                            <h3>{item.name}</h3>
                            <p>₹{item.price}</p>

                            <div>
                                <button onClick={() => decreaseQty(index)}>-</button>
                                <span style={{ margin: "0 10px" }}>
                                    {item.qty || 1}
                                </span>
                                <button onClick={() => increaseQty(index)}>+</button>
                            </div>

                            <br />

                            <button onClick={() => removeItem(index)}>
                                Remove
                            </button>
                        </div>
                    ))}

                    <h2 style={{ textAlign: "center" }}>
                        Total: ₹{total}
                    </h2>

                    <div style={{ textAlign: "center" }}>
                        <button
                            onClick={placeOrder}
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "5px",
                                fontSize: "16px"
                            }}
                        >
                            Pay & Place Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;