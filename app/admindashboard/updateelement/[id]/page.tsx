import getAllMethodes from "@/actions/method/get-all-methodes";
import MethodeUpdate from "./_components/MethodeUpdate";

export default async function Page() {
  const methodes = await getAllMethodes();

  return <MethodeUpdate methodes={methodes} />;
}
