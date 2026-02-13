import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path
import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: process.env.APP_URL? [process.env.APP_URL] : [],

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            try {
                const info = await transporter.sendMail({
                    from: `"Medicine Store" <${process.env.APP_USER}>`,
                    to: user.email,
                    subject: "Please verify your email",
                    html: `
        <h2>Verify your email</h2>
        <p>Click the button below to verify your email address.</p>

        <a href="${url}"
           style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
          Verify Email
        </a>

        <p>If the button does not work, copy this link:</p>
        <p>${url}</p>
      `,
                });

                console.log("Verification email sent:", info.messageId);
            } catch (error) {
                console.error("Email send failed:", error);
            }
        },

    },

    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});