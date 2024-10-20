// import { EOL } from "os";
// import {
//   AbstractPaymentProcessor,
//   isPaymentProcessorError,
//   PaymentProcessorError,
// } from "@medusajs/medusa";
// import { Circle, CircleEnvironments } from "@circle-fin/circle-sdk";

// export default class CryptoPaymentService extends AbstractPaymentProcessor {
//   static identifier: string = "crypto";
//   client: any;

//   constructor(container, options) {
//     super(container);

//     this.client = new Circle(
//       `${process.env.CRYPTO_API_KEY}`,
//       CircleEnvironments.sandbox // API base url
//     );
//   }

//   protected buildError(
//     message: string,
//     e: PaymentProcessorError | Error
//   ): PaymentProcessorError {
//     return {
//       error: message,
//       code: "code" in e ? e.code : "321",
//       detail: isPaymentProcessorError(e)
//         ? `${e.error}${EOL}${e.detail ?? ""}`
//         : "detail" in e
//         ? e.detail
//         : e.message ?? "",
//     };
//   }
// }
