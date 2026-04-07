import { useEffect, useState } from "react";

function Cart() {
    const [cart, setCart] = useState([]);
    const [msg, setMsg] = useState("");
    const [showCompleteBtn, setShowCompleteBtn] = useState(false);

    // Load cart
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // Update cart
    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // Increase quantity
    const increaseQty = (index) => {
        const newCart = [...cart];
        newCart[index].qty = (newCart[index].qty || 1) + 1;
        updateCart(newCart);
    };

    // Decrease quantity
    const decreaseQty = (index) => {
        const newCart = [...cart];

        if ((newCart[index].qty || 1) > 1) {
            newCart[index].qty -= 1;
        } else {
            newCart.splice(index, 1);
        }

        updateCart(newCart);
    };

    // Remove item
    const removeItem = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        updateCart(newCart);
    };

    // Total
    const total = cart.reduce(
        (sum, item) => sum + item.price * (item.qty || 1),
        0
    );

    // Save order
    const placeOrder = async () => {
        try {
            await fetch("https://e-commerce-fxy9.onrender.com/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    products: cart,
                    total: total
                })
            });

            setMsg("Order Placed Successfully!");

            localStorage.removeItem("cart");
            setCart([]);
            setShowCompleteBtn(false);

            setTimeout(() => {
                window.location.href = "/orders";
            }, 1500);

        } catch (err) {
            setMsg("Error placing order");
        }
    };

    // Razorpay open (UI only)
    const handleRazorpayPayment = () => {
        if (cart.length === 0) {
            setMsg("Cart is empty");
            return;
        }

        const options = {
            key: "rzp_test_Sab5jrvPrQ6b1b",
            amount: total * 100,
            currency: "INR",
            name: "E-Commerce App",
            description: "Order Payment",

            prefill: {
                name: "Test User",
                email: "test@example.com",
                contact: "9999999999"
            },

            theme: {
                color: "#3399cc"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        // Show manual complete button
        setShowCompleteBtn(true);
        setMsg("After payment, click Complete Order");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>My Cart 🛒</h1>

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

                    {/* Pay Button */}
                    <div style={{ textAlign: "center" }}>
                        <button
                            onClick={handleRazorpayPayment}
                            style={{
                                backgroundColor: "blue",
                                color: "white",
                                padding: "12px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            Pay with Razorpay
                        </button>
                    </div>

                    {/* Complete Order Button */}
                    {showCompleteBtn && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <button
                                onClick={placeOrder}
                                style={{
                                    backgroundColor: "green",
                                    color: "white",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                Complete Order
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Cart;