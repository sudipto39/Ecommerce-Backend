const Razorpay = require('razorpay');
const crypto = require('crypto');


class PaymentService {
  /**
   * Initialize Razorpay instance
   * @private
   */
  static initializeRazorpay() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are not configured. Please check your environment variables.');
    }

    try {
      return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      throw new Error('Failed to initialize payment gateway');
    }
  }

  /**
   * Get Razorpay instance (lazy initialization)
   * @private
   */
  static _razorpay = null;
  static getRazorpayInstance() {
    if (!this._razorpay) {
      this._razorpay = this.initializeRazorpay();
    }
    return this._razorpay;
  }

  /**
   * Create a new Razorpay order
   * @param {number} amount - Amount in INR
   * @param {string} receipt - Order receipt ID
   * @returns {Promise<Object>} Razorpay order object
   */
  static async createOrder(amount, receipt) {
    try {
      const razorpay = this.getRazorpayInstance();

      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (!receipt) {
        throw new Error('Receipt ID is required');
      }

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt,
        payment_capture: 1 // Auto capture payment
      });

      if (!order || !order.id) {
        throw new Error('Failed to create order');
      }

      return order;
    } catch (error) {
      if (error.error) {
        // Handle Razorpay API errors
        const razorpayError = error.error;
        if (razorpayError.code === 'BAD_REQUEST_ERROR') {
          throw new Error(`Invalid request: ${razorpayError.description}`);
        } else if (razorpayError.code === 'AUTHENTICATION_ERROR') {
          throw new Error('Invalid Razorpay credentials');
        } else {
          throw new Error(razorpayError.description || 'Payment gateway error');
        }
      }
      
      // console.error('Razorpay create order error:', error);
      console.error('Razorpay order error:', error.message);
      throw error instanceof Error ? error : new Error('Failed to create payment order');
    }
  }

  /**
   * Verify Razorpay payment signature
   * @param {string} orderId - Razorpay order ID
   * @param {string} paymentId - Razorpay payment ID
   * @param {string} signature - Razorpay signature
   * @returns {boolean} True if signature is valid
   */
  static verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      if (!orderId || !paymentId || !signature) {
        throw new Error('Missing required parameters for signature verification');
      }

      if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay secret key is not configured');
      }

      const sign = `${orderId}|${paymentId}`;
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest('hex');
      
      return expectedSign === signature;
    } catch (error) {
      console.error('Payment signature verification error:', error);
      throw error instanceof Error ? error : new Error('Failed to verify payment signature');
    }
  }

  /**
   * Get payment details from Razorpay
   * @param {string} paymentId - Razorpay payment ID
   * @returns {Promise<Object>} Payment details
   */
  static async getPaymentDetails(paymentId) {
    try {
      const razorpay = this.getRazorpayInstance();

      if (!paymentId) {
        throw new Error('Payment ID is required');
      }

      const payment = await razorpay.payments.fetch(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }

      return payment;
    } catch (error) {
      if (error.error) {
        const razorpayError = error.error;
        if (razorpayError.code === 'BAD_REQUEST_ERROR') {
          throw new Error('Invalid payment ID');
        } else if (razorpayError.code === 'AUTHENTICATION_ERROR') {
          throw new Error('Invalid Razorpay credentials');
        }
      }

      console.error('Razorpay fetch payment error:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch payment details');
    }
  }

  /**
   * Refund a payment
   * @param {string} paymentId - Razorpay payment ID
   * @param {number} amount - Amount to refund in INR
   * @returns {Promise<Object>} Refund details
   */
  static async refundPayment(paymentId, amount) {
    try {
      const razorpay = this.getRazorpayInstance();

      if (!paymentId) {
        throw new Error('Payment ID is required');
      }

      if (!amount || amount <= 0) {
        throw new Error('Invalid refund amount');
      }

      const refund = await razorpay.payments.refund(paymentId, {
        amount: Math.round(amount * 100) // Convert to paise
      });

      if (!refund) {
        throw new Error('Failed to process refund');
      }

      return refund;
    } catch (error) {
      if (error.error) {
        const razorpayError = error.error;
        if (razorpayError.code === 'BAD_REQUEST_ERROR') {
          throw new Error(`Invalid refund request: ${razorpayError.description}`);
        } else if (razorpayError.code === 'AUTHENTICATION_ERROR') {
          throw new Error('Invalid Razorpay credentials');
        }
      }

      console.error('Razorpay refund error:', error);
      throw error instanceof Error ? error : new Error('Failed to process refund');
    }
  }

  /**
   * Get Razorpay configuration for frontend
   * @param {Object} options - Configuration options
   * @returns {Object} Frontend configuration
   */
  static getFrontendConfig(options = {}) {
    try {
      if (!process.env.RAZORPAY_KEY_ID) {
        throw new Error('Razorpay key ID is not configured');
      }

      return {
        key: process.env.RAZORPAY_KEY_ID,
        currency: 'INR',
        name: options.name || 'Shoe Store',
        description: options.description || 'Payment for your order',
        // image: options.image || '/shoe.svg',
        image: options.image || process.env.SITE_LOGO || '/logo.png',
        theme: {
          color: '#4F46E5'
        }
      };
    } catch (error) {
      console.error('Get frontend config error:', error);
      throw error instanceof Error ? error : new Error('Failed to get payment configuration');
    }
  }

  /**
   * Verify Razorpay credentials
   * @returns {Promise<boolean>} True if credentials are valid
   */
  static async verifyCredentials() {
    try {
      const razorpay = this.getRazorpayInstance();
      
      // Try to fetch a non-existent payment to verify credentials
      // This will fail with auth error if credentials are invalid
      // await razorpay.payments.fetch('dummy_id');
      await razorpay.orders.all({ count: 1 });
    } catch (error) {
      if (error.error && error.error.code === 'AUTHENTICATION_ERROR') {
        return false;
      }
      // If error is "not found", credentials are valid
      return true;
    }
  }
}

module.exports = PaymentService; 