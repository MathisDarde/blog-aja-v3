import Link from "next/link";
import Instagram from "./Instagram";
import XformerlyTwitter from "./Twitter";
import Facebook from "./Facebook";
import TikTok from "./Tiktok";

export default function Footer() {
  return (
    <div className="p-10 bg-white font-Montserrat">
      <div className="flex justify-between w-[1300px] mx-auto">
        <div className="flex flex-col text-aja-blue gap-2">
        <h4 className="text-lg font-Bai_Jamjuree uppercase font-bold">
            Menus pratiques
          </h4>
          <Link href={"/articles"}>Articles</Link>
          <Link href={"/effectifactuel"}>Effectif Actuel</Link>
          <Link href={"/palmares"}>Palmarès & Records</Link>
          <Link href={"/quiz"}>Quiz</Link>
          <Link href={"/chants"}>Chants</Link>
          <Link href={"/calendrier"}>Calendrier</Link>
          <Link href={"/classement"}>Classement</Link>
          <Link href={"/categories"}>Categories</Link>
        </div>

        <div className="flex flex-col text-aja-blue gap-2">
          <h4 className="text-lg font-Bai_Jamjuree uppercase font-bold">Services</h4>
          <Link href="">A propos</Link>
          <Link href="">Contactez-moi</Link>
          <Link href="/moncompte">Mon compte</Link>
          <Link href="/boutique">Boutique</Link>
          <Link href="">Règles générales d&apos;utilisation</Link>
          <Link href="">Charte graphique</Link>
          <Link href="">Cookies</Link>
        </div>

        <div className="flex flex-col text-aja-blue gap-2">
        <h4 className="text-lg font-Bai_Jamjuree uppercase font-bold">
            Réseaux Sociaux
          </h4>
          <div className="flex items-center gap-2">
            <Instagram fontSize={14}/>
            <p>@memoiredauxerrois</p>
          </div>
          <div className="flex items-center gap-2">
            <XformerlyTwitter fontSize={14}/>
            <p>@memoiredauxerrois</p>
          </div>
          <div className="flex items-center gap-2">
            <TikTok fontSize={14}/>
            <p>@memoiredauxerrois</p>
          </div>
          <div className="flex items-center gap-2">
            <Facebook fontSize={14}/>
            <p>@memoiredauxerrois</p>
          </div>
          </div>

        <div className="flex flex-col text-aja-blue gap-2">
          <h4 className="text-lg font-Bai_Jamjuree uppercase font-bold">
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

      <div className="border-b-2 border-aja-blue py-10 h-2 w-full"></div>

      <div>
        <Link href="/">
        <h2 className="text-center text-aja-blue uppercase font-Bai_Jamjuree italic font-bold text-6xl pt-10">
          Mémoire d&apos;Auxerrois
        </h2>
        </Link>
        <p className="text-aja-blue text-center font-bold my-2">L&apos;AJA est bâtie sur pierre. L&apos;AJA ne périra pas.</p>
        <div className="flex items-center gap-2 text-aja-blue justify-center py-2">
          <p>&copy; 2025 Mémoire d&apos;Auxerrois</p>
          <p>•</p>
          <p>Termes d&apos;utilisation</p>
        </div>
      </div>
    </div>
  );
}
