import displayBrouillons from "@/actions/article/display-brouillons";
import BrouillonComponent from "./_components/BrouillonComponent";

export default async function PageBrouillon() {
  const brouillons = await displayBrouillons();

  return (
    <BrouillonComponent brouillons={brouillons} />
  );
}
