import Link from "next/link";
import Instagram from "./Instagram";
import XformerlyTwitter from "./Twitter";
import Facebook from "./Facebook";
import TikTok from "./Tiktok";

export default function Footer() {
  return (
    <div className="p-10 bg-aja-blue font-Montserrat mt-10">
      <div className="flex justify-between ">
        <div className="w-[700px]">
          <div className="flex justify-between">
            <h4 className="text-white font-bold text-xl ml-4 uppercase">
              Newsletter
            </h4>
            <p className="text-white">
              <span className="text-red-600">*</span> champs obligatoires
            </p>
          </div>
          <form action="" className="flex gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="" className="text-white ml-4 py-2">
                Adresse Mail <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                placeholder="Adresse Mail"
                className="py-3 px-5 rounded-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="text-white ml-4 py-2">
                Date d&apos;anniversaire <span className="text-red-600">*</span>
              </label>
              <input type="date" className="py-3 px-5 rounded-full" />
            </div>
          </form>
          <div className="mt-4 mb-10">
            <button
              type="submit"
              className="bg-white text-aja-blue w-full py-3 rounded-full"
            >
              Je m&apos;inscris à la newsletter
            </button>
          </div>
          <div className="flex gap-4">
            <div
              id="instagramlogo"
              className="border-4 border-white p-3 rounded-full"
            >
              <Instagram className="" />
            </div>
            <div
              id="twitterlogo"
              className="border-4 border-white p-3 rounded-full"
            >
              <XformerlyTwitter />
            </div>
            <div
              id="facebooklogo"
              className="border-4 border-white p-3 rounded-full"
            >
              <Facebook />
            </div>
            <div
              id="tiktoklogo"
              className="border-4 border-white p-3 rounded-full"
            >
              <TikTok />
            </div>
          </div>
        </div>

        <div className="flex flex-col text-white gap-2">
          <h4 className="text-lg uppercase font-bold">Services</h4>
          <Link href="">A propos</Link>
          <Link href="">Contactez-moi</Link>
          <Link href="/moncompte">Mon compte</Link>
          <Link href="/boutique">Boutique</Link>
          <Link href="">Règles générales d&apos;utilisation</Link>
          <Link href="">Charte graphique</Link>
          <Link href="">Cookies</Link>
        </div>

        <div className="flex flex-col text-white gap-2">
          <h4 className="text-lg uppercase font-bold">
            Liens vers les sites officiels
          </h4>
          <Link
            href="https://www.aja.fr/"
            target="_BLANK"
            className="underline"
          >
            Site officiel de l&apos;AJ Auxerre
          </Link>
          <Link
            href="https://boutique.aja.fr/"
            target="_BLANK"
            className="underline"
          >
            Boutique officielle du club
          </Link>
          <Link
            href="https://billetterie.aja.fr/(S(ik5fzmplrup4sa3hgb3mzseb))/Pages/PSpectacles.aspx"
            target="_BLANK"
            className="underline"
          >
            Billetterie
          </Link>
          <Link
            href="https://fr.wikipedia.org/wiki/Association_de_la_jeunesse_auxerroise"
            target="_BLANK"
            className="underline"
          >
            Wikipedia
          </Link>
        </div>
      </div>

      <div className="border-b-2 border-white py-8 h-2 w-full"></div>

      <div>
        <h2 className="text-center text-white uppercase font-Bai_Jamjuree italic font-bold text-6xl pt-10">
          Mémoire d&apos;Auxerrois
        </h2>
        <div className="flex items-center gap-2 text-white justify-center py-2">
          <p>&copy; 2025 Mémoire d&apos;Auxerrois</p>
          <p>•</p>
          <p>Termes d&apos;utilisation</p>
        </div>
      </div>
    </div>
  );
}
