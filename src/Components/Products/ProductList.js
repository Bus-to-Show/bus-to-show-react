import MediaQuery from 'react-responsive'
import {Product} from './Product';

const ProductList = ({ products }) => {
    return (
      <div>
        {products.map(product => (
          <div key={product.id}>
                <MediaQuery minWidth={800}>
                  <div className="mx-auto">
                    <div className="">
                        <div className='col-12 text-center'>
                        <Product product={product} />
                        </div>
                    </div>
                </div>
                </MediaQuery>
                <MediaQuery maxWidth={799}>
                  <div className="container-border-orange m-4 p-4">
                      <div className='col-12 text-center'>
                      <Product product={product} />
                      </div>
                  </div>
                </MediaQuery>

          </div>
        ))}
      </div>
    );
  }

export default ProductList
