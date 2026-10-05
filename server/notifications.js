// Notification Provider Abstraction
// Handles delivery or graceful pending logging when third-party services are unconfigured.

export class MockLoggingNotificationProvider {
  constructor() {
    this.hasExternalProvider = false;
  }

  async sendAdminNotification(booking) {
    const timestamp = new Date().toISOString();
    console.log(`[NOTIFICATION | ADMIN | ${timestamp}] New Booking Request Received:`);
    console.log(`  ID: ${booking.id}`);
    console.log(`  Client: ${booking.customer_name} (${booking.phone})`);
    console.log(`  Artist: ${booking.artist} | Style: ${booking.style}`);
    console.log(`  Preferred Date/Time: ${booking.preferred_date} @ ${booking.preferred_time}`);
    console.log(`  Delivery Status: PENDING_INTERNAL_LOG (External SMS/SMTP provider not configured)`);
    return {
      success: true,
      provider: 'internal_logger',
      status: 'LOGGED_PENDING_CONFIG',
      bookingId: booking.id,
    };
  }

  async sendCustomerConfirmation(booking) {
    const timestamp = new Date().toISOString();
    console.log(`[NOTIFICATION | CUSTOMER | ${timestamp}] Booking Acknowledgement:`);
    console.log(`  Recipient: ${booking.customer_name} <${booking.email || 'No email provided'}>`);
    console.log(`  Booking ID: ${booking.id}`);
    console.log(`  Delivery Status: PENDING_EXTERNAL_GATEWAY (Provide SMTP_HOST or TWILIO_SID in .env)`);
    return {
      success: true,
      provider: 'internal_logger',
      status: 'LOGGED_PENDING_CONFIG',
      bookingId: booking.id,
    };
  }
}

export const notificationService = new MockLoggingNotificationProvider();
