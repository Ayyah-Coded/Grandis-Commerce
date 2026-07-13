import Stripe from "stripe";
import { StripeProductType } from "@repo/types";
import stripe from "./stripe";



export const createStripeProduct = async (
  item: StripeProductType
): Promise<Stripe.Response<Stripe.Product>> => {
  const res = await stripe.products.create({
    id: item.id.toString(),
    name: item.name,
    default_price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
    },
  });
  return res;
};

export const getStripeProductPrice = async (
  productId: number
): Promise<number | null> => {
  const res = await stripe.prices.list({
    product: productId.toString(),
  });
  return res.data[0]?.unit_amount ?? null;
};

export const deleteStripeProduct = async (
  productId: number
): Promise<Stripe.Response<Stripe.DeletedProduct>> => {
  const res = await stripe.products.del(productId.toString());
  return res;
};