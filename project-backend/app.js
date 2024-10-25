const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const { Sequelize, DataTypes } = require('sequelize');
const moment = require('moment-timezone');
const sequelize = new Sequelize('mydb', 'abirami', 'your_password', {
    dialect: 'mysql', // Replace with your database dialect (e.g., postgres, mysql, sqlite)
    host: 'localhost',
    port: '3036'
});
import Contact from './project-backend/Contact';
import Joi from 'joi';



const User = {
    register: async (email, password) => {
        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Check if user already exists (replace with database query)
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user (replace with database query)
        const newUser = await User.create({ email, password: hashedPassword });

        return newUser;
    },

    login: async (email, password) => {
        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Find user by email (replace with database query)
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)   
 {
            throw new Error('Invalid email or password');   

        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: 
 '1h' });

        return token;
    },

    sendPasswordResetEmail: async (email) => {
        // Validate email
        if (!email) {
            throw new Error('Email is required');
        }

        // Find user by email (replace with database query)
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        // Generate OTP
        const otp = randomstring.generate({ length: 6 });

        // Save OTP to database (replace with database query)
        await user.update({ otp });

        // Send password reset email
        await sendPasswordResetEmail(user.id, user.email, otp);
    },

    resetPassword: async (userId, otp, newPassword) => {
        // Validate input
        if (!userId || !otp || !newPassword) {
            throw new Error('Invalid data');
        }

        // Find user by ID (replace with database query)
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Verify OTP
        if (user.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP (replace with database query)
        await user.update({ password: hashedPassword, otp: null });

        return true;
    }
};
const sendVerificationEmail = async (userId, email) => {
    const transporter = nodemailer.createTransport({
        // Your email provider configuration
    });

    const mailOptions = {
        from: 'your_email@example.com',
        to: email,
        subject: 'Email Verification',
        html: `<p>Please click the following link to verify your email:</p>
                <a href="http://your-app-url/verify/${userId}">Verify Email</a>`
    };

    await transporter.sendMail(mailOptions);
};
const contact = { sequelize.define('Contact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type:   
 DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING   

    },
    timezone: {
        type: DataTypes.STRING
    }
}),
timeZone : sequelize.define('Contact', {
    // ... other fields
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')   

    }
})
}

const userSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
});

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email().unique(), // Assuming a unique constraint
    phoneNumber: Joi.string().optional(),
    address: Joi.string().optional(),
    timezone: Joi.string().optional()
});


const userTimezone = 'UTC'; // Replace with the user's timezone

const contactsWithTimezones = contacts.map(contact => ({
    ...contact.dataValues,
    createdAt: moment(contact.createdAt).tz(userTimezone).format(),
    updatedAt: moment(contact.updatedAt).tz(userTimezone).format()
}));

res.status(200).json(contactsWithTimezones);



findRangeOfDate:  await Contact.findAll({
    where: {
        createdAt: {
            [Op.between]: [startDate, endDate]
        }
    }
});

module.exports = User;