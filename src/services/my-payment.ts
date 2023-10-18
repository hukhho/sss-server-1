import {
    AbstractPaymentProcessor,
    Address,
    CartService,
    Customer,
    // PaymentProcessorContext,
    PaymentProcessorError,
    PaymentProcessorSessionResponse,
    PaymentSessionStatus,
} from "@medusajs/medusa";
import { ReturnQueryFromVNPayDTO, VNPay } from 'vnpay';

type PaymentProcessorContext = {
    billing_address?: Address | null
    email: string
    currency_code: string
    amount: number
    resource_id: string
    customer?: Customer
    context: Record<string, unknown>
    paymentSessionData: Record<string, unknown>
}

class MyPaymentProcessor extends AbstractPaymentProcessor {
    protected readonly vnpay: VNPay;
    private cartService: CartService;

    static identifier = "vn-pay";

    constructor(container, options) {
        super(container);

        const vnpayInstance = new VNPay({
            paymentGateway: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", //your payment gateway, default is sandbox
            tmnCode: "QH1923CV", // your tmn code
            secureSecret: "ECVJJJFHCHKUIMBWJMZSJBFQRVZSKQNK", // your secure secret
            returnUrl: "http://localhost:9000/api/vnpay_return", // return url
        });

        this.vnpay = vnpayInstance;
        this.cartService = container.cartService;

    }

    async capturePayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        console.log("capturePayment Method Called, paymentSessionData:", paymentSessionData)
        return { status: "captured" };
    }

    async authorizePayment(
        paymentSessionData: Record<string, unknown>,
        context: Record<string, unknown>
    ): Promise<
        | PaymentProcessorError
        | { status: PaymentSessionStatus; data: Record<string, unknown> }
    > {
        console.log("Authorize Payment Method Called, paymentSessionData:", paymentSessionData, "context:", context);

        const cartId: string = (context.cart_id as string) || "";

        const cart = await this.cartService.retrieveWithTotals(cartId, {
            relations: ["billing_address"],
        });
        console.log("Authorize cart.context.vnpay: ", cart?.context?.vnpay);
        // Explicitly specify the type or cast to a known type
        if ((cart as unknown as { context: { vnpay: { returnQueryData: any } } })?.context?.vnpay?.returnQueryData) {
            console.log("Authorize returnQueryData: ", (cart as unknown as { context: { vnpay: { returnQueryData: any } } })?.context?.vnpay?.returnQueryData);
            const vnpayInstance = new VNPay({
                paymentGateway: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", //your payment gateway, default is sandbox
                tmnCode: "QH1923CV", // your tmn code
                secureSecret: "ECVJJJFHCHKUIMBWJMZSJBFQRVZSKQNK", // your secure secret
                returnUrl: "http://localhost:9000/payment/vnpay", // return url
              });
              const returnQueryData: ReturnQueryFromVNPayDTO = (cart as unknown as { context: { vnpay: { returnQueryData: any } } })?.context?.vnpay?.returnQueryData as unknown as ReturnQueryFromVNPayDTO;
              const verifyResult = await vnpayInstance.verifyReturnUrl(returnQueryData);
              console.log("Authorize verifyResult: ", verifyResult);
              const payment = verifyResult
              if (payment instanceof Error) return { error: payment.message };
              if (payment.isSuccess === true) {
                  await this.capturePayment(paymentSessionData);
                  console.log("Authorize paymentSessionData capturePayment: ", paymentSessionData)
                  return {
                      status: PaymentSessionStatus.AUTHORIZED,
                      data: paymentSessionData,
                  }; 
              }
              return {
                  error: payment.message,
              };
        }
    }


    async cancelPayment(paymentSessionData) {
        console.log("Cancel Payment Method Called, paymentSessionData:", paymentSessionData);
        return { status: PaymentSessionStatus.CANCELED, data: { paymentSessionData } };
    }

    async initiatePayment(context) {
        console.log("Initiate Payment Method Called context:", context);
        return { session_data: { context: context } };
    }

    async deletePayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        return {};
    }

    async getPaymentStatus(
        paymentSessionData: Record<string, unknown>
    ): Promise<PaymentSessionStatus> {
        return PaymentSessionStatus.AUTHORIZED;
    }

    async refundPayment(
        paymentSessionData: Record<string, unknown>,
        refundAmount: number
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        throw new Error("Method not implemented");
        return {};
    }

    async retrievePayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        return {};
    }

    async updatePayment(
        context: PaymentProcessorContext
    ): Promise<void | PaymentProcessorError | PaymentProcessorSessionResponse> {
        return { session_data: context.paymentSessionData };
    }

    async updatePaymentData(sessionId, data) {
        console.log("Update Payment Data Method Called, sessionId:", sessionId, "data:", data);
        // Mock implementation
        return { session_data: {} };
    }
}

export default MyPaymentProcessor;
