import { InscSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";
import { hashPassword } from "@/utils/bcrypt";

class UsersController {
  async getProfileInfo(id_user: number) {
    const user = await prisma.user.findUnique({
      where: { user_id: id_user },
    });
    return user;
  }

  async index() {
    const users = await prisma.user.findMany();
    return users;
  }

  async store(data: InscSchemaType) {
    const birthdayDate = new Date(data.birthday);
    birthdayDate.setUTCHours(0, 0, 0, 0);

    const pseudo = data.pseudo;
    const email = data.email;
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        pseudo,
        birthday: birthdayDate,
        email,
        password: hashedPassword,
      },
    });
    return user;
  }

  async show(id_user: number) {
    const result = await prisma.user.findUnique({
      where: {
        user_id: id_user,
      },
    });
    return result;
  }

  async update(
    id_user: number,
    pseudo: string,
    birthday: Date,
    email: string,
    password: string
  ) {
    let user = await prisma.user.update({
      where: { user_id: id_user },
      data: { pseudo, birthday, email, password },
    });
    return user;
  }

  async destroy(id_user: number) {
    const user = await prisma.user.delete({
      where: { user_id: id_user },
    });
    return user;
  }

  async getUserNamePdp(id_user: number) {
    const user = await prisma.user.findUnique({
      where: { user_id: id_user },
      select: { pseudo: true, photodeprofil: true },
    });
    return user;
  }
}

export default new UsersController();
