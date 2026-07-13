import { Suspense } from "react";
import CartContent from "./CartContent";

const CartPage = () => {
  return (
    <Suspense fallback={null}>
      <CartContent />
    </Suspense>
  );
};

export default CartPage;