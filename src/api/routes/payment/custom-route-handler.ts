// import { Request, Response } from 'express'
// import { ConfigModule, authenticate } from "@medusajs/medusa";
// import { getConfigFile } from "medusa-core-utils";
// import { VNPay } from 'vnpay';
// import { randomUUID } from 'crypto';



// export default async (req: Request, res: Response): Promise<void> => {
//   // Create instance
//   const vnpayInstance = new VNPay({
//     paymentGateway: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", //your payment gateway, default is sandbox
//     tmnCode: "QH1923CV", // your tmn code
//     secureSecret: "ECVJJJFHCHKUIMBWJMZSJBFQRVZSKQNK", // your secure secret
//     returnUrl: "http://localhost:9000/payment/vnpay", // return url
//   });
//   // const tnx = randomUUID();
//   // Build payment url
//   // const urlString = await vnpayInstance.buildPaymentUrl({
//   //   vnp_Amount: 100000, // amount in VND
//   //   vnp_IpAddr: '192.168.0.1', // customer ip address
//   //   vnp_TxnRef: tnx, // your transaction reference
//   //   vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
//   // });

//   res.json({ url: urlString });
// }
