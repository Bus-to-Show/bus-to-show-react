import React from 'react'
import MediaQuery from 'react-responsive'
import ProductList from '../Components/Products/ProductList';

import { useState, useEffect } from 'react';

const fetchUrl = `${process.env.REACT_APP_API_URL}`;

const ShopPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${fetchUrl}/products`)
      .then(response => response.json())
      .then(data => {
        if(data){
          console.log('data ==>>==>> ', data);
          setProducts(data)
        }
      })
      .catch(error => console.error(error));

  }, []);

  return (
    <div>
    <MediaQuery minWidth={800}>
      <div className="w-75 mx-auto">
        <div className="container-border-orange m-4 p-4">
            <div className='col-12 text-center'>
            <h3 className="bts-orange-bg">Shop</h3>
            <ProductList products={products} />
            </div>
        </div>
    </div>
    </MediaQuery>
    <MediaQuery maxWidth={799}>
      <div className="container-border-orange m-4 p-4">
          <div className='col-12 text-center'>
          <h3 className="bts-orange-bg">Shop</h3>
          <ProductList products={products} />
          </div>
      </div>
    </MediaQuery>
</div>

  );
}

export default ShopPage
