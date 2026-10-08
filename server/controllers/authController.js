import User from '../models/User.js';
import { generateUserToken } from '../config/jwt.js';
import crypto from 'crypto';
import twilio from 'twilio';
export const register = async (req, res, next) => {
  try {
    const { username, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email
          ? 'Email already registered.'
          : 'Username already taken.',
      });
    }

    const user = await User.create({ username, email, mobile, password });
    const token = generateUserToken({ id: user._id, role: user.role });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: { token, user: user.toPublicJSON() },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    user.lastLogin = new Date();
    await User.updateOne({ _id: user._id }, { $set: { lastLogin: user.lastLogin } });

    const token = generateUserToken({ id: user._id, role: user.role });

    res.json({
      success: true,
      message: 'Login successful.',
      data: { token, user: user.toPublicJSON() },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, mobile, dob, maritalStatus, place, pincode } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, mobile, dob, maritalStatus, place, pincode },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated.', data: { user: user.toPublicJSON() } });
  } catch (error) {
    next(error);
  }
};

export const sendMobileOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.isMobileVerified) {
      return res.status(400).json({ success: false, message: 'Mobile is already verified' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioNumber || accountSid === 'MY_ACCOUNT_SID') {
      return res.status(500).json({ success: false, message: 'Twilio credentials not configured in backend' });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.mobileOtp = otp;
    user.mobileOtpExpiry = otpExpiry;
    await user.save({ validateBeforeSave: false });

    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: `Your AVIOX verification OTP is ${otp}. This code expires in 5 minutes.`,
      from: twilioNumber,
      to: `+91${user.mobile}` // Assuming Indian numbers
    });

    res.json({ success: true, message: 'OTP sent to your mobile successfully.' });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, message: 'Failed to send OTP SMS. Please try again.' });
  }
};

export const verifyMobileOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: 'OTP is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isMobileVerified) {
      return res.status(400).json({ success: false, message: 'Mobile is already verified' });
    }

    if (user.mobileOtp !== otp || !user.mobileOtpExpiry || user.mobileOtpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isMobileVerified = true;
    user.mobileOtp = undefined;
    user.mobileOtpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Mobile verified successfully.', data: { user: user.toPublicJSON() } });
  } catch (error) {
    next(error);
  }
};

