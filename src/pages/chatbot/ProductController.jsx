import React, { useEffect, useState } from "react";
import ProductView from "./ProductView";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { getBotProduct } from "../../services/bot";

export const ProductController = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getProduct()
    }
  }, [id]);
  const getProduct = async ()=>{
    setLoading(true);
    try {
      let result = await getBotProduct(id);
      if (result && result.length > 0) {
        setProducts(result);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  return (
    <div>
      {loading && <Loading />}
      <ProductView products={products} setLoading={setLoading} getProduct={getProduct} setProducts={setProducts} />
    </div>
  );
};
