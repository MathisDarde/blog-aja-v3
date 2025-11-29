"use client";

import Link from "next/link";
import Instagram from "./Instagram";
import XformerlyTwitter from "./Twitter";
import Facebook from "./Facebook";
import TikTok from "./Tiktok";
import { useState } from "react";

export default function Footer() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const sections = [
    {
      title: "Menus pratiques",
      links: [
        { label: "Accueil", href: "/" },
        { label: "Articles", href: "/articles" },
        { label: "Effectif Actuel", href: "/effectif-actuel" },
        { label: "Palmarès & Records", href: "/palmares" },
        { label: "Quiz", href: "/quiz" },
        { label: "Chants", href: "/chants" },
        { label: "Calendrier", href: "/calendrier" },
        { label: "Classement", href: "/classement-statistiques" },
        { label: "Categories", href: "/categories" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "A propos", href: "/about" },
        { label: "Contactez-moi", href: "mailto:contact@memoiredauxerrois.fr" },
        { label: "Mon compte", href: "/moncompte" },
        { label: "Boutique", href: "/boutique" },
        { label: "Règles générales d'utilisation", href: "/utilisation" },
        { label: "Charte graphique", href: "/charte-graphique" },
      ],
    },
    {
      title: "Réseaux Sociaux",
      content: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Instagram fontSize={14} />
            <p>@memoiredauxerrois</p>
          </div>
          <div className="flex items-center gap-2">
            <XformerlyTwitter fontSize={14} />
            <p>@memoiredauxerrois</p>
          </div>
          <div className="flex items-center gap-2">
            <TikTok fontSize={14} />
            <p>@memoiredauxerrois</p>
          </div>
          <div className="flex items-center gap-2">
            <Facebook fontSize={14} />
            <p>@memoiredauxerrois</p>
          </div>
        </div>
      ),
    },
    {
      title: "Liens vers les sites officiels",
      links: [
        {
          label: "Site officiel de l'AJ Auxerre",
          href: "https://www.aja.fr/",
          target: "_blank",
        },
        {
          label: "Boutique officielle du club",
          href: "https://boutique.aja.fr/",
          target: "_blank",
        },
        {
          label: "Billetterie",
          href: "https://billetterie.aja.fr/(S(ik5fzmplrup4sa3hgb3mzseb))/Pages/PSpectacles.aspx",
          target: "_blank",
        },
        {
          label: "Wikipedia",
          href: "https://fr.wikipedia.org/wiki/Association_de_la_jeunesse_auxerroise",
          target: "_blank",
        },
      ],
    },
  ];

  return (
    <div className="p-10 bg-white font-Montserrat">
      <div className="flex flex-col xl:flex-row justify-between max-w-[1300px] mx-auto gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="text-aja-blue">
            <button
              className="w-full flex justify-between items-center gap-2 xl:block text-left text-base sm:text-lg font-Bai_Jamjuree uppercase font-bold"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === section.title ? null : section.title
                )
              }
            >
              {section.title}
              <span className="xl:hidden">
                {openDropdown === section.title ? "-" : "+"}
              </span>
            </button>

            {/* Contenu */}
            <div
              className={`mt-2 flex flex-col gap-2 transition-all overflow-hidden text-sm sm:text-base ${
                openDropdown === section.title ? "max-h-[500px]" : "max-h-0"
              } xl:max-h-full`}
            >
              {section.links?.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className={link.href ? "" : "cursor-default"}
                >
                  <span className="hover:underline hover:text-orange-third">
                    {link.label}
                  </span>
                </Link>
              ))}
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="border-b-2 border-aja-blue py-3 sm:py-5 h-2 w-full"></div>

      <div>
        <Link href="/">
          <h2 className="text-center text-aja-blue uppercase font-Bai_Jamjuree italic font-bold text-4xl sm:text-6xl pt-5 sm:pt-10">
            Mémoire d&apos;Auxerrois
          </h2>
        </Link>
        <p className="text-aja-blue text-center font-bold my-2 text-sm sm:text-base">
          L&apos;AJA est bâtie sur pierre. <br />
          L&apos;AJA ne périra pas.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-2 text-aja-blue justify-center py-2 text-sm sm;:text-base">
          <p>&copy; 2025 Mémoire d&apos;Auxerrois</p>
          <p className="hidden sm:block">•</p>
          <a
            href="/utilisation"
            className="underline hover:text-orange-third cursor-pointer"
          >
            Termes d&apos;utilisation
          </a>
        </div>
      </div>
    </div>
  );
}
