import React, { useEffect, useState } from "react";
import BranchView from "./BranchView";
import { useParams } from "react-router-dom";
import { getBotBranch } from "../../services/bot";
import Loading from "../../components/Loading";

const BranchController = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getAddress();
    }
  }, [id]);
  const getAddress = async () => {
    setLoading(true);
    try {
      let result = await getBotBranch(id);
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
      <BranchView products={products} setLoading={setLoading} getAddress={getAddress} />
    </div>
  );
};

export default BranchController;
