import { useEffect, useState } from "react";

function Products() {
    const [products, setProducts] = useState([]);
    const [msg, setMsg] = useState("");
    const [search, setSearch] = useState("");
    const [price, setPrice] = useState(0);
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // Add to Cart
    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push(product);

        localStorage.setItem("cart", JSON.stringify(cart));

        setMsg(" Added to cart");
        setTimeout(() => setMsg(""), 2000);
    };

    // Admin Add Product
    const addProduct = async () => {
        const newProduct = {
            name: "New T-shirt",
            price: 999,
            description: "Cool product",
            image: ""
        };

        try {
            await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });

            setMsg(" Product added successfully");
            fetchProducts();

        } catch (err) {
            setMsg(" Error adding product");
        }

        setTimeout(() => setMsg(""), 2000);
    };

    // Search Filter
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (price === 0 || p.price <= price)
    );
// Delete Product (Admin)
    const deleteProduct = async (id) => {
        try {
            await fetch(`https://ecommerce-backend-new-3ntn.onrender.com/api/products/${id}`, {
                method: "DELETE"
            });
            setMsg(" Product deleted successfully");
            fetchProducts();
        } catch (err) {
            setMsg(" Error deleting product");
        }
        setTimeout(() => setMsg(""), 2000);
    };

    return (
        <div style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            minHeight: "100vh"
        }}>

            <h1 style={{
                textAlign: "center",
                marginBottom: "20px"
            }}>
                Products
            </h1>

           
            {msg && (
                <p style={{
                    color: msg.includes("Error") ? "red" : "green",
                    textAlign: "center",
                    fontWeight: "bold"
                }}>
                    {msg}
                </p>
            )}

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder=" Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "10px",
                        width: "260px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
            </div>

            
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <button
                    onClick={addProduct}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Add Product (Admin)
                </button>
            </div>

            
            {filteredProducts.length === 0 ? (
                <p style={{ textAlign: "center" }}>No products found</p>
            ) : (
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>

                    {filteredProducts.map((p) => (
                        <div
                            key={p._id}
                            style={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                margin: "15px",
                                padding: "15px",
                                width: "260px",
                                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                                textAlign: "center",
                                backgroundColor: "#fff",
                                transition: "0.3s"
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        >

                            <img
                                src={p.image || "https://via.placeholder.com/200"}
                                alt={p.name}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "10px"
                                }}
                            />

                            <h3>{p.name}</h3>

                            <p style={{
                                fontWeight: "bold",
                                fontSize: "18px"
                            }}>
                                ₹{p.price}
                            </p>

                            <p style={{ fontSize: "14px", color: "#555" }}>
                                {p.description}
                            </p>

                            <button
                                onClick={() => addToCart(p)}
                                style={{
                                    backgroundColor: "#ff9900",
                                    border: "none",
                                    padding: "10px",
                                    marginTop: "10px",
                                    cursor: "pointer",
                                    borderRadius: "6px",
                                    fontWeight: "bold",
                                    width: "100%"
                                }}
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={() => window.location.href = "/cart"}
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    padding: "8px",
                                    marginTop: "10px",
                                    cursor: "pointer",
                                    borderRadius: "6px",
                                    width: "100%"
                                }}
                            >
                                Go to Cart
                            </button>

                            <button
                                onClick={() => deleteProduct(p._id)}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "none",
                                    padding: "8px",
                                    marginTop: "10px",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    width: "100%"
                                }}
                            >   
                                Delete
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <p>Max Price: ₹{price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;