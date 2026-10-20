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
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Mémoire d&apos;Auxerrois
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ width: 96, height: 8, background: "#f76200" }} />
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
