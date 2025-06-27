const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Witamy w systemie rezerwacji!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Witamy ${data.firstName}!</h2>
        <p>Dziękujemy za rejestrację w naszym systemie rezerwacji.</p>
        <p>Twoje konto zostało utworzone z adresem email: <strong>${data.email}</strong></p>
        <p>Możesz teraz korzystać z naszego systemu do zarządzania rezerwacjami.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Wiadomość została wysłana automatycznie. Prosimy nie odpowiadać na ten email.
        </p>
      </div>
    `
  }),

  'reservation-confirmation': (data) => ({
    subject: 'Potwierdzenie rezerwacji',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Potwierdzenie rezerwacji</h2>
        <p>Szanowny/a ${data.customerName},</p>
        <p>Potwierdzamy utworzenie Twojej rezerwacji:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${data.title}</h3>
          <p style="margin: 5px 0;"><strong>Data rozpoczęcia:</strong> ${new Date(data.startDate).toLocaleString('pl-PL')}</p>
          <p style="margin: 5px 0;"><strong>Data zakończenia:</strong> ${new Date(data.endDate).toLocaleString('pl-PL')}</p>
          <p style="margin: 5px 0;"><strong>Numer rezerwacji:</strong> ${data.reservationId}</p>
        </div>
        
        <p>W przypadku pytań lub potrzeby zmiany rezerwacji, prosimy o kontakt.</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Wiadomość została wysłana automatycznie. Prosimy nie odpowiadać na ten email.
        </p>
      </div>
    `
  }),

  'reservation-cancellation': (data) => ({
    subject: 'Anulowanie rezerwacji',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f44336;">Anulowanie rezerwacji</h2>
        <p>Szanowny/a ${data.customerName},</p>
        <p>Informujemy, że Twoja rezerwacja została anulowana:</p>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${data.title}</h3>
          <p style="margin: 5px 0;"><strong>Data:</strong> ${new Date(data.startDate).toLocaleString('pl-PL')}</p>
          <p style="margin: 5px 0;"><strong>Numer rezerwacji:</strong> ${data.reservationId}</p>
        </div>
        
        <p>W przypadku pytań, prosimy o kontakt z naszym zespołem.</p>
        <p>Przepraszamy za ewentualne niedogodności.</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Wiadomość została wysłana automatycznie. Prosimy nie odpowiadać na ten email.
        </p>
      </div>
    `
  }),

  'reservation-reminder': (data) => ({
    subject: 'Przypomnienie o nadchodzącej rezerwacji',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">Przypomnienie o rezerwacji</h2>
        <p>Szanowny/a ${data.customerName},</p>
        <p>Przypominamy o Twojej nadchodzącej rezerwacji:</p>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${data.title}</h3>
          <p style="margin: 5px 0;"><strong>Data:</strong> ${new Date(data.startDate).toLocaleString('pl-PL')}</p>
          <p style="margin: 5px 0;"><strong>Numer rezerwacji:</strong> ${data.reservationId}</p>
        </div>
        
        <p>Jeśli potrzebujesz zmienić lub anulować rezerwację, prosimy o jak najszybszy kontakt.</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Wiadomość została wysłana automatycznie. Prosimy nie odpowiadać na ten email.
        </p>
      </div>
    `
  })
};

// Send email function
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    let mailOptions = {
      from: `"System Rezerwacji" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
    };

    // If using template
    if (options.template && templates[options.template]) {
      const template = templates[options.template](options.data);
      mailOptions.subject = template.subject;
      mailOptions.html = template.html;
    } else {
      // Direct HTML or text
      if (options.html) {
        mailOptions.html = options.html;
      } else {
        mailOptions.text = options.text;
      }
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send bulk emails
exports.sendBulkEmail = async (recipients, template, data) => {
  try {
    const promises = recipients.map(recipient => {
      return exports.sendEmail({
        to: recipient.email,
        template,
        data: { ...data, ...recipient }
      });
    });

    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Bulk email results: ${successful} successful, ${failed} failed`);
    
    return {
      successful,
      failed,
      results
    };
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    throw error;
  }
};

// Verify email configuration
exports.verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
};
