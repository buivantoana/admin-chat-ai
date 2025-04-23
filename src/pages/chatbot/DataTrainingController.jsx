import React, { useEffect, useState } from "react";
import DataTrainingView from "./DataTrainingView";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { getQuestion } from "../../services/questions";

export const DataTrainingController = () => {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(false);
   const { id } = useParams();
   useEffect(() => {
      if (id) {
         getProduct()
      }
   }, [id]);
   const getProduct = async () => {
      setLoading(true);
      try {
         let result = await getQuestion(id);
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
         <DataTrainingView products={products} setLoading={setLoading} getProduct={getProduct} setProducts={setProducts} />
      </div>
   );
};
