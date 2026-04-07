import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51TJZQ13i55zySdtBh5JQJfnUpGirP0lSztD3BNKsv8Y4mN0SpfqG18pAUHLZQuvHvHskLyl71etrstt7WnHfMuK6005gTSYko1"); 
function Cart() {
    const [cart, setCart] = useState([]);
    const [msg, setMsg] = useState("");

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

            setMsg("Payment Successful & Order Placed!");

            localStorage.removeItem("cart");
            setCart([]);

            setTimeout(() => {
                window.location.href = "/orders";
            }, 1500);

        } catch (err) {
            setMsg("Error placing order");
        }
    };

    // Stripe Payment (SIMULATED SUCCESS)
    const handleStripePayment = async () => {
        if (cart.length === 0) {
            setMsg("Cart is empty");
            return;
        }

        setMsg("Processing payment...");

        const stripe = await stripePromise;

        // Simulate payment success after 2 sec
        setTimeout(() => {
            placeOrder();
        }, 2000);
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

                    {/* STRIPE PAYMENT BUTTON */}
                    <div style={{ textAlign: "center" }}>
                        <button
                            onClick={handleStripePayment}
                            style={{
                                backgroundColor: "purple",
                                color: "white",
                                padding: "12px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            Pay with Stripe
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;