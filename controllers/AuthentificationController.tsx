import prisma from "../prisma/prisma";

class AuthentificationController {
  async login(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }
}

export default new AuthentificationController();
