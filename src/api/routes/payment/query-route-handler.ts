import { Request, Response } from 'express'
import { ConfigModule, authenticate } from "@medusajs/medusa";
import { getConfigFile } from "medusa-core-utils";
import { ReturnQueryFromVNPayDTO, VNPay } from 'vnpay';
import { randomUUID } from 'crypto';
import Medusa from "@medusajs/medusa-js"


export default async (request: Request, res: Response): Promise<void> => {
  const { query } = request.query
  console.log("query: ", request.query)

  const baseUrl = process.env.BASE_URL || "http://localhost:9000";

  const medusa = new Medusa({ baseUrl: "http://localhost:9000", maxRetries: 3 })

  const vnpayInstance = new VNPay({
    paymentGateway: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", //your payment gateway, default is sandbox
    tmnCode: "QH1923CV", // your tmn code
    secureSecret: "ECVJJJFHCHKUIMBWJMZSJBFQRVZSKQNK", // your secure secret
    returnUrl: "http://localhost:9000/payment/vnpay", // return url
  });

  const returnQueryData: ReturnQueryFromVNPayDTO = request.query as unknown as ReturnQueryFromVNPayDTO;
  console.log("returnQueryData: ", returnQueryData);
  console.log("returnQueryData.vnp_TxnRef: ", returnQueryData instanceof ReturnQueryFromVNPayDTO);
  if (!returnQueryData?.vnp_TxnRef) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  if (returnQueryData?.vnp_TxnRef) {
    const ref = returnQueryData.vnp_TxnRef;

    const cartId = ref.split('-')[0];
    const verifyResult = await vnpayInstance.verifyReturnUrl(returnQueryData);
    await medusa.carts.update(cartId, {
      context: { vnpay: { returnQueryData: returnQueryData, verifyResult: verifyResult } }
    })
    .then(async ({ cart }) => {
      console.log("update cart success", cart);
      medusa.carts.retrieve(cartId)
      .then(({ cart }) => {
        res.status(200).json({ verifyResult: verifyResult, cart: cart })
        return
      }).catch((err) => {
        res.status(500).json({ err: err })
        return
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ err: err })
      return
    });
  }
  // // res.set('Content-Type', 'application/javascript');
  // // res.send('<script src="./popup.js"></script>');
  // res.status(200).json({ verifyResult: verifyResult })
}
