import UpdateProfileForm from "./_components/UpdateProfileForm";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import UpdateProfileGuard from "./_components/UpdateProfileGuard";

export default async function UpdateProfilePage() {
    const auth = await isAuthenticated();

    let user: User | null = null;

    if (auth?.user?.id) {
        const users = await getUserbyId(auth.user.id);
        user = users?.[0] ?? null;
    }

    return (
        <div>
            <div>
                {/* Protection côté client */}
                <UpdateProfileGuard />

                <h2
                    className="font-bold font-Bai_Jamjuree uppercase text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer"
                >
                    Formulaire de modification du profil
                </h2>

                <UpdateProfileForm
                    userData={{
                        name: user?.name || "",
                        email: user?.email || "",
                        birthday: user?.birthday || new Date(),
                        photodeprofil: user?.photodeprofil || "",
                    }}
                />
            </div>
        </div>
    )
}