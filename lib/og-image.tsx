import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Bannières de partage des pages (fichiers opengraph-image.tsx des segments).
// Générées au build : servies en statique, aucun rendu à la demande.
export const OG_SIZE = { width: 1200, height: 630 };

function asset(path: string) {
  return readFile(join(process.cwd(), path));
}

function dataUri(buffer: Buffer, mime: string) {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function renderOgImage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const [motif, logo, bold, medium] = await Promise.all([
    asset("public/_assets/img/motif-aja.png"),
    asset("public/icons/icon-192.png"),
    asset("assets/fonts/BaiJamjuree-Bold.ttf"),
    asset("assets/fonts/BaiJamjuree-Medium.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Bai Jamjuree",
          color: "white",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUri(motif, "image/png")}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            // Motif aux couleurs du club assombri à gauche pour la lisibilité du titre
            backgroundImage:
              "linear-gradient(90deg, rgba(8,24,60,0.92) 0%, rgba(8,24,60,0.7) 60%, rgba(8,24,60,0.2) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "56px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUri(logo, "image/png")} width={72} height={72} alt="" />
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Mémoire d&apos;Auxerrois
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: title.length > 28 ? 64 : 80,
                fontWeight: 700,
                lineHeight: 1.05,
                textTransform: "uppercase",
                maxWidth: 1000,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: "rgba(255,255,255,0.88)",
                maxWidth: 940,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 500,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            memoiredauxerrois.fr · L&apos;histoire de l&apos;AJ Auxerre
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bai Jamjuree", data: bold, weight: 700, style: "normal" },
        { name: "Bai Jamjuree", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}

// --- Bannières des matchs et des saisons (pages /matchs et /saisons) ---

const SUPPORTED_LOGOS = /^image\/(png|jpe?g|svg\+xml)/;

/**
 * Premier logo lisible par le moteur de rendu (PNG, JPEG ou SVG) parmi les candidats,
 * en data URI. Les logos locaux sont lus sur le site : un chemin variable n'est pas
 * embarqué dans la fonction serveur.
 */
async function loadLogo(candidates: (string | null | undefined)[], siteUrl: string): Promise<string | null> {
  for (const src of candidates) {
    if (!src) continue;
    try {
      const response = await fetch(src.startsWith("/") ? `${siteUrl}${src}` : src, {
        headers: { "User-Agent": "MemoireDAuxerrois/1.0 (+https://memoiredauxerrois.fr)" },
      });
      const type = response.headers.get("content-type") ?? "";
      if (!response.ok || !SUPPORTED_LOGOS.test(type)) continue;
      return dataUri(Buffer.from(await response.arrayBuffer()), type.split(";")[0]);
    } catch {
      // Logo injoignable : candidat suivant
    }
  }
  return null;
}

/**
 * Même présentation que les cartes de /methodes-expert : logos face à face (match) ou
 * logo d'époque du club (saison), avec le score ou la saison et l'année en dessous.
 */
export async function renderMethodeOgImage({
  logos,
  center,
  caption,
  siteUrl,
}: {
  // Un ou deux logos, chacun avec ses solutions de repli
  logos: (string | null | undefined)[][];
  // Score (match) ou saison, entre ou sous les logos
  center: string;
  caption: string;
  siteUrl: string;
}) {
  const [images, brand, bold, medium] = await Promise.all([
    Promise.all(logos.map((candidates) => loadLogo(candidates, siteUrl))),
    asset("public/icons/icon-192.png"),
    asset("assets/fonts/BaiJamjuree-Bold.ttf"),
    asset("assets/fonts/BaiJamjuree-Medium.ttf"),
  ]);
  const pair = images.length === 2;

  const logo = (src: string | null, key: number) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={key} src={src} width={pair ? 260 : 300} height={pair ? 260 : 300} alt="" style={{ objectFit: "contain" }} />
    ) : (
      <div key={key} style={{ width: pair ? 260 : 300, height: pair ? 260 : 300, display: "flex" }} />
    );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Bai Jamjuree",
          color: "#0f2a5c",
          backgroundImage: "linear-gradient(180deg, #e8eff8 0%, #c3d4ea 100%)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: pair ? 56 : 0 }}>
          {pair ? (
            <>
              {logo(images[0], 0)}
              <div style={{ fontSize: 96, fontWeight: 700, minWidth: 220, display: "flex", justifyContent: "center" }}>
                {center}
              </div>
              {logo(images[1], 1)}
            </>
          ) : (
            logo(images[0], 0)
          )}
        </div>
        {!pair && <div style={{ fontSize: 88, fontWeight: 700, marginTop: 12 }}>{center}</div>}
        <div style={{ fontSize: 34, fontWeight: 500, color: "#3c5478", marginTop: pair ? 28 : 4 }}>{caption}</div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUri(brand, "image/png")} width={36} height={36} alt="" />
          Mémoire d&apos;Auxerrois
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bai Jamjuree", data: bold, weight: 700, style: "normal" },
        { name: "Bai Jamjuree", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}

// --- Bannières des joueurs et des coachs (pages /joueurs et /coachs) ---

// Portrait recadré au format du panneau par Cloudinary, en JPEG (le moteur de rendu ne lit pas le WebP)
function portraitUrl(src: string, width: number, height: number) {
  const match = src.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/);
  return match ? `${match[1]}c_fill,g_face,w_${width},h_${height},f_jpg,q_auto/${match[2]}` : src;
}

const isAja = (club: string) => /^(aj )?auxerre$/i.test(club.trim());

/**
 * Portrait à gauche ; nom, poste et logos des clubs du parcours (d'époque) à droite,
 * avec les années à l'AJA.
 */
export async function renderPersonOgImage({
  kind,
  name,
  subtitle,
  portrait,
  clubs,
  siteUrl,
}: {
  kind: "joueur" | "coach";
  name: string;
  subtitle: string;
  portrait: string | null | undefined;
  // [logo, nom, années] du parcours, chaque logo avec ses solutions de repli
  clubs: { logos: (string | null | undefined)[]; name: string; years: string }[];
  siteUrl: string;
}) {
  const PANEL = { width: 440, height: 630 };
  // Un club une seule fois, dans l'ordre du parcours
  const distinct = clubs.filter((c, i) => clubs.findIndex((o) => o.name === c.name) === i).slice(0, 6);
  const ajaYears = clubs.filter((c) => isAja(c.name)).map((c) => c.years).join(", ");

  const [photo, loaded, brand, bold, medium] = await Promise.all([
    portrait ? loadLogo([portraitUrl(portrait, PANEL.width, PANEL.height)], siteUrl) : null,
    Promise.all(distinct.map((c) => loadLogo(c.logos, siteUrl))),
    asset("public/icons/icon-192.png"),
    asset("assets/fonts/BaiJamjuree-Bold.ttf"),
    asset("assets/fonts/BaiJamjuree-Medium.ttf"),
  ]);
  // Deux passages au même club (ou ses deux noms) : un seul logo
  const logos = loaded.filter((src, i): src is string => !!src && loaded.indexOf(src) === i);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "Bai Jamjuree",
          color: "#0f2a5c",
          backgroundImage: "linear-gradient(180deg, #e8eff8 0%, #c3d4ea 100%)",
          position: "relative",
        }}
      >
        <div style={{ ...PANEL, display: "flex", backgroundColor: "#0f2a5c" }}>
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} width={PANEL.width} height={PANEL.height} alt="" style={{ objectFit: "cover" }} />
          )}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px 40px" }}>
          <div style={{ fontSize: 26, fontWeight: 500, color: "#3c77b4", textTransform: "uppercase", letterSpacing: 2 }}>
            {kind === "joueur" ? "Fiche du joueur" : "Fiche du coach"}
          </div>
          <div style={{ fontSize: name.length > 18 ? 60 : 76, fontWeight: 700, lineHeight: 1.05, marginTop: 8 }}>{name}</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: "#3c5478", marginTop: 10 }}>{subtitle}</div>
          {ajaYears && (
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f76200", marginTop: 6 }}>{`À l'AJA : ${ajaYears}`}</div>
          )}

          {logos.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 34 }}>
              {logos.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} width={76} height={76} alt="" style={{ objectFit: "contain" }} />
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUri(brand, "image/png")} width={36} height={36} alt="" />
          Mémoire d&apos;Auxerrois
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bai Jamjuree", data: bold, weight: 700, style: "normal" },
        { name: "Bai Jamjuree", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
