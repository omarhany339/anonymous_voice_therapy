import axios from "axios";

const PAYMOB_API_URL = "https://api.paymob.com/api";
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;

interface PaymobAuthResponse {
  token: string;
}

interface PaymobOrderResponse {
  id: number;
  merchant_id: number;
  amount_cents: number;
  currency: string;
  order_status: string;
}

interface PaymobPaymentKeyResponse {
  token: string;
}

/**
 * Get authentication token from Paymob
 */
export async function getPaymobAuthToken(): Promise<string> {
  try {
    const response = await axios.post<PaymobAuthResponse>(
      `${PAYMOB_API_URL}/auth/tokens`,
      {
        api_key: PAYMOB_API_KEY,
      }
    );

    return response.data.token;
  } catch (error) {
    console.error("[Paymob] Failed to get auth token:", error);
    throw new Error("Failed to authenticate with Paymob");
  }
}

/**
 * Create an order in Paymob
 */
export async function createPaymobOrder(
  authToken: string,
  amountCents: number,
  currency: string = "EGP",
  merchantOrderId?: string
): Promise<PaymobOrderResponse> {
  try {
    const response = await axios.post<PaymobOrderResponse>(
      `${PAYMOB_API_URL}/ecommerce/orders`,
      {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amountCents,
        currency: currency,
        merchant_order_id: merchantOrderId,
      }
    );

    return response.data;
  } catch (error) {
    console.error("[Paymob] Failed to create order:", error);
    throw new Error("Failed to create order with Paymob");
  }
}

/**
 * Get payment key from Paymob
 */
export async function getPaymobPaymentKey(
  authToken: string,
  orderId: number,
  amountCents: number,
  currency: string,
  customerEmail: string,
  customerPhone?: string,
  customerFirstName?: string,
  customerLastName?: string
): Promise<string> {
  try {
    const response = await axios.post<PaymobPaymentKeyResponse>(
      `${PAYMOB_API_URL}/acceptance/payment_keys`,
      {
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600, // 1 hour
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: customerEmail,
          floor: "NA",
          first_name: customerFirstName || "Patient",
          street: "NA",
          mobile_number: customerPhone || "NA",
          last_name: customerLastName || "Anonymous",
          city: "NA",
          country: "EG",
          postal_code: "NA",
          state: "NA",
        },
        currency: currency,
        integration_id: parseInt(PAYMOB_INTEGRATION_ID || "0"),
        lock_order_when_paid: true,
      }
    );

    return response.data.token;
  } catch (error) {
    console.error("[Paymob] Failed to get payment key:", error);
    throw new Error("Failed to get payment key from Paymob");
  }
}

/**
 * Generate Hosted Payment Page URL
 */
export function generatePaymobCheckoutUrl(paymentKey: string): string {
  return `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_INTEGRATION_ID}?payment_token=${paymentKey}`;
}

/**
 * Create complete payment session
 */
export async function createPaymentSession(
  amountCents: number,
  customerEmail: string,
  customerPhone?: string,
  customerFirstName?: string,
  customerLastName?: string,
  merchantOrderId?: string
): Promise<{
  checkoutUrl: string;
  orderId: number;
  paymentKey: string;
}> {
  try {
    // Get auth token
    const authToken = await getPaymobAuthToken();

    // Create order
    const order = await createPaymobOrder(
      authToken,
      amountCents,
      "EGP",
      merchantOrderId
    );

    // Get payment key
    const paymentKey = await getPaymobPaymentKey(
      authToken,
      order.id,
      amountCents,
      "EGP",
      customerEmail,
      customerPhone,
      customerFirstName,
      customerLastName
    );

    // Generate checkout URL
    const checkoutUrl = generatePaymobCheckoutUrl(paymentKey);

    return {
      checkoutUrl,
      orderId: order.id,
      paymentKey,
    };
  } catch (error) {
    console.error("[Paymob] Failed to create payment session:", error);
    throw error;
  }
}

/**
 * Verify transaction (called from webhook)
 */
export async function verifyPaymobTransaction(
  transactionId: string,
  authToken: string
): Promise<boolean> {
  try {
    const response = await axios.get(
      `${PAYMOB_API_URL}/acceptance/transactions/${transactionId}`,
      {
        params: {
          auth_token: authToken,
        },
      }
    );

    return response.data.success === true;
  } catch (error) {
    console.error("[Paymob] Failed to verify transaction:", error);
    return false;
  }
}
