import displayBrouillons from "@/actions/article/display-brouillons";
import BrouillonComponent from "./_components/BrouillonComponent";

export default async function PageBrouillon() {
  const brouillons = await displayBrouillons();

  const normalizedBrouillons = brouillons.map((b) => ({
    ...b,
    state: b.state ?? "pending",
  }));

  return <BrouillonComponent brouillons={normalizedBrouillons} />;
}
