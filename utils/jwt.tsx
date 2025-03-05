import jsonwebtoken from "jsonwebtoken";

export const generateToken = (userId: number, email: string) => {
  return jsonwebtoken.sign(
    {
      userId,
      email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
};

export const verifyToken = (token: string) => {
  return jsonwebtoken.verify(token, process.env.JWT_SECRET!);
};

export default { generateToken, verifyToken };
