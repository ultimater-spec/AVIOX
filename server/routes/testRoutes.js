import express from 'express';
import crypto from 'crypto';
import twilio from 'twilio';

const router = express.Router();

router.post('/send-sms', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioNumber || accountSid === 'MY_ACCOUNT_SID') {
    console.log("Twilio initialized: NO (Missing or default credentials in .env)");
    return res.status(500).json({ success: false, message: 'Twilio credentials not configured in backend' });
  }

  console.log("Twilio initialized: YES");
  console.log(`Recipient: ${phone}`);

  const client = twilio(accountSid, authToken);
  const otp = crypto.randomInt(100000, 1000000).toString();

  try {
    console.log("SMS sending started");
    
    const message = await client.messages.create({
      body: `Your AVIOX verification OTP is ${otp}. This code expires in 5 minutes.`,
      from: twilioNumber,
      to: phone
    });

    console.log("SMS sent successfully");
    console.log(`Message SID: ${message.sid}`);

    return res.json({
      success: true,
      message: "OTP SMS sent successfully"
    });
  } catch (error) {
    console.error("Failed to send OTP SMS:");
    console.error(error); // Logs Twilio error for debugging
    
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP SMS"
    });
  }
});

export default router;
