import React from 'react'
import "./Checkout.css";
import Subtotal from "./Subtotal";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";


function Checkout() {
    const [{ basket, user }, dispatch] = useStateValue();
    return (
        <div className="checkout">
            <div className="checkout_left">
                <img className="checkout_ad"
                 src="https://blog.fitanalytics.com/wp-content/uploads/2017/07/prime-day-banner.png"
                 alt=""
                 />
                 <div className="checkout_title">
                     <h3>Hello,{user?.email}</h3>
                     <h2>The Shopping Basket</h2>
                     {basket.map(item => (
            <CheckoutProduct
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              rating={item.rating}
            />
          ))}
                 </div>
            </div>
            <div className="checkout_right">
               <Subtotal />
            </div>
        </div>
    )
}

export default Checkout
