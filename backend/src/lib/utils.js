import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in .env");
      throw new Error("JWT_SECRET is not set");
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    console.log("✅ Token generated successfully:", token);
    return token;
  } catch (error) {
    console.error("❌ Error generating token:", error.message);
    throw error;
  }
};
