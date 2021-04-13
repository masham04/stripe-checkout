import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { graphql, useStaticQuery } from "gatsby";
import "./products.css";

const IndexPage = () => {
  const redirectToCheckout = async (event, pid) => {
    event.preventDefault();
    const stripe = await loadStripe(
      "pk_test_51IfNcCGQJFOR3XETq8ow4kZ8ARrBNIuKMOrVJ8JqlKIKPbQQJViXUCXV0Vm8VJ9wda6B0zETfPVUOFEWRS99Pezs00AiDTTvsA"
    );
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: pid, quantity: 1 }],
      successUrl: `http://localhost:8000/Payment-success/`,
      cancelUrl: `http://localhost:8000/Payment-error`,
    });
    if (error) {
      console.warn("Error:", error);
    }
  };
  const data = useStaticQuery(graphql`
    query MyQuery {
      allStripePrice {
        edges {
          node {
            product {
              id
              name
              description
              images
            }
            id
          }
        }
      }
    }
  `);
  console.log(data);

  return (
    <div>
      <h2>My Products</h2>
      {data.allStripePrice.edges.map(({ node }) => {
        const el = node.product;
        return (
          <div key={el.id} className="card">
            <img src={el.images[0]} alt="Denim Jeans" width="100%" />
            <h1>{el.name}</h1>
            <p className="price">$19.99</p>
            <p>{el.description}</p>
            <p>
              <button onClick={(e) => redirectToCheckout(e, node.id)}>
                Buy {el.name}
              </button>
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default IndexPage;
