import jsonwebtoken from "jsonwebtoken";

export const generateToken = (id: number, email: string) => {
  return jsonwebtoken.sign(
    {
      id,
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
