import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const templates = {
  welcome: ({ name, role }) => ({
    subject: 'Welcome to DroneDelivery!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B82F6, #10B981); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to DroneDelivery!</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1F2937;">Hello ${name}!</h2>
          <p style="color: #6B7280; line-height: 1.6;">
            Thank you for joining DroneDelivery as a ${role}. We're excited to have you on board!
          </p>
          <p style="color: #6B7280; line-height: 1.6;">
            Your account has been successfully created and you can now start using our platform.
          </p>
          ${role === 'customer' ? `
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1F2937; margin: 0 0 15px 0;">What's Next?</h3>
              <ul style="color: #6B7280; margin: 0; padding-left: 20px;">
                <li>Browse restaurants in your area</li>
                <li>Place your first order</li>
                <li>Track your delivery in real-time</li>
              </ul>
            </div>
          ` : ''}
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}" 
               style="background: #3B82F6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Get Started
            </a>
          </div>
        </div>
        <div style="background: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="color: #9CA3AF; margin: 0; font-size: 14px;">
            If you have any questions, feel free to contact our support team.
          </p>
        </div>
      </div>
    `
  }),

  orderConfirmation: ({ name, orderNumber, items, total, estimatedDelivery }) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10B981; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
          <p style="color: #D1FAE5; margin: 10px 0 0 0;">Order #${orderNumber}</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1F2937;">Hi ${name}!</h2>
          <p style="color: #6B7280; line-height: 1.6;">
            Your order has been confirmed and is being prepared. Our drone will deliver it to you soon!
          </p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin: 0 0 15px 0;">Order Items:</h3>
            ${items.map(item => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #374151;">${item.quantity}x ${item.name}</span>
                <span style="color: #1F2937; font-weight: bold;">$${item.price.toFixed(2)}</span>
              </div>
            `).join('')}
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #E5E7EB;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #1F2937; font-weight: bold;">Total:</span>
              <span style="color: #1F2937; font-weight: bold;">$${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #1E40AF; margin: 0;">
              <strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toLocaleString()}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/orders/track/${orderNumber}" 
               style="background: #3B82F6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Track Your Order
            </a>
          </div>
        </div>
      </div>
    `
  }),

  passwordReset: ({ name, resetUrl }) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #F97316; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1F2937;">Hi ${name}!</h2>
          <p style="color: #6B7280; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          <p style="color: #6B7280; line-height: 1.6;">
            This link will expire in 10 minutes for security reasons.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #F97316; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
        <div style="background: #FEF2F2; padding: 20px; text-align: center; border-top: 1px solid #FCA5A5;">
          <p style="color: #DC2626; margin: 0; font-size: 14px;">
            Never share your password or reset links with anyone.
          </p>
        </div>
      </div>
    `
  })
};

export const sendEmail = async ({ to, subject, template, context, html, text }) => {
  try {
    const transporter = createTransporter();

    let emailContent = {};

    if (template && templates[template]) {
      emailContent = templates[template](context || {});
    } else {
      emailContent = {
        subject: subject || 'DroneDelivery Notification',
        html: html || text || 'No content provided'
      };
    }

    const mailOptions = {
      from: `"DroneDelivery" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: text || emailContent.text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', result.messageId);
    
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

export const sendBulkEmails = async (emails) => {
  try {
    const results = [];
    
    for (const email of emails) {
      try {
        const result = await sendEmail(email);
        results.push({ success: true, result, email: email.to });
      } catch (error) {
        results.push({ success: false, error, email: email.to });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    console.log(`📧 Bulk email results: ${successful}/${emails.length} sent successfully`);
    
    return results;
  } catch (error) {
    console.error('❌ Bulk email sending failed:', error);
    throw error;
  }
};