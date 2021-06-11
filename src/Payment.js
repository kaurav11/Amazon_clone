import React,{useState,useEffect} from 'react'
import {useHistory} from "react-router-dom";
import "./Payment.css"
import {useStateValue} from "./StateProvider";
import CheckoutProduct from './CheckoutProduct';
import {Link} from 'react-router-dom';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal} from "./reducer";
import axios from "./axios";
import { db } from './firebase';


function Payment() {
  const [{basket,user}, dispatch] = useStateValue();
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true); 
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    // generate the special stripe secret which allows
    // us to charge a customer
    const getClientSecret = async () => {
        const response = await axios({
            method: 'post',
            // Stripe expects the total in a currency subunit
            url: `/payments/create?total=${getBasketTotal(basket) *100}`

        })
        setClientSecret(response.data.clientSecret);
    }

    getClientSecret();
}, [basket]);

  console.log("the secret is>>>", clientSecret);
  console.log(user);

  const handleSubmit = async (e) => {
    //do all the stripe work
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    }).then(({ paymentIntent })=> {
      //paymentIntent = paymentconfirmation
      
        db.collection('users')
         .doc(user?.uid)
         .collection('orders')
         .doc(paymentIntent?.id)
         .set({
            basket: basket,
            amount: getBasketTotal(basket),
            created: Date.now(),
        })
          

      setSucceeded(true);
      setError(null);
      setProcessing(false);
      dispatch({
        type: 'EMPTY_BASKET',
    })
     history.replace('/orders');
    })
  }
  const handleChange = e => {
    //listen for changes in the card element
    //and display errors 
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  }



    return (
        <div className="Payment">
           <div className="payment__container">
             <h1>
                Checkout ( <Link to="/checkout">{basket?.length} items</Link>)
             </h1>
             <div className="payment__section">
               <div className="payment__title">
                 <h3>Delivery address</h3>
               </div>
               <div className="payment__address">
                  <p>{user?.email}</p>
                  <p>Rajapara Road</p>
                  <p>Pakur,India</p>
               </div>
             </div>
             <div className="payment__section">
               <div className="payment__title">
                 <h3>Review Items And delivery</h3>
               </div>
               <div className="payment__items">
                    {basket.map((item) => (
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
             <div className="payment__section">
             <div className="payment__title">
                        <h3>Payment method</h3>
                      </div>
                      <div className="payment__details">
                         {/* {stripe magic} */}
                         <form onSubmit={handleSubmit}>
                             <CardElement onChange={handleChange} />
                             <div className="payment__pricecontainer">
                             <CurrencyFormat
                                renderText={(value) => (
                                  <h3>Order Total: {value}</h3>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)} // Part of the homework
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                              />
                              <button disabled={processing || disabled ||
                              succeeded}>
                                <span>{processing ? <p>processing</p> :
                                "Buy Now"}</span>
                              </button>
                             </div>
                            {/* error */}
                            {error && <div>{error}</div>}
                         </form>
                      </div>
             </div>
                     
             </div> 
        </div>
    )
}

export default Payment
