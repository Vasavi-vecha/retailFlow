// src/pages/customer/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; 
import { useAppContext } from "../../context/AppContext"; // Pulled Context Connection Hook

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { placeCustomerOrder } = useAppContext();

  const [formData, setFormData] = useState({
    fullName: user?.name || "", 
    email: user?.email || "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "UPI",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handlePlaceOrder(event) {
    event.preventDefault();

    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }

    try {
      setIsSubmitting(true);

      await placeCustomerOrder(user?.name || formData.fullName, cartItems, {
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        paymentMethod: formData.paymentMethod,
      });

      clearCart();
      alert("Order placed successfully!");
      navigate("/orders/history");
    } catch (error) {
      console.error("Context Error: ", error);
      alert("Order placement failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-wrapper">
      <section className="panel panel-wide">
        <p className="section-label">Authentication</p>
        <h3>Complete Your Order</h3>
        <p className="section-text">
          Enter delivery and payment details to place your order.
        </p>

        {cartItems.length === 0 ? (
          <div className="empty-box">
            <h3>No items in cart</h3>
            <p>Add products before continuing to checkout.</p>
          </div>
        ) : (
          <form className="order-form" onSubmit={handlePlaceOrder}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  className="input"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  className="input"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  className="input"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  name="pincode"
                  className="input"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  className="select"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>
            </div>

            <div className="checkout-summary-box">
              <strong>Total Amount: ₹ {totalAmount}</strong>
            </div>

            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? "Processing Order..." : "Place Order"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default CheckoutPage;