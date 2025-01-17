import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CartItemComponent from "../components/cart-item";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addToCart, calculatePrice, removeFromCart } from "../redux/reducers/cartReducer";
import { CartItemType } from "../types/types";

const Cart = () => {

  const dispatch = useDispatch();
  const { cartItems, loading, total, subtotal, shippingCharges, tax, discount } = useSelector((state: RootState) => state.cartReducer);

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItemType) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({...cartItem, quantity: cartItem.quantity + 1}));
  };

  const decrementHandler = (cartItem: CartItemType) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({...cartItem, quantity: cartItem.quantity - 1}));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeFromCart(productId));
  };


  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {
          cartItems.length > 0 ? (
          cartItems.map((cartItem) => (
            <CartItemComponent key={cartItem.productId} cartItem={cartItem} incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler} />
          ))
        ): (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ${subtotal}</p>
        <p>Shipping Charges: ${shippingCharges}</p>
        <p>Tax: ${tax}</p>
        <p>
          Discount: <em className="red"> - ${discount}</em>
        </p>
        <p>
          <b>Total: ${total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ${discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;