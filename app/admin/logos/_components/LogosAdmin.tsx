"use client";

/* eslint-disable @next/next/no-img-element -- logos de toutes origines (Cloudinary, scrapers, Wikimedia…) */

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ImageUp, Pencil, Plus, RotateCcw, Search, Trash, X } from "lucide-react";
import { toast } from "sonner";
import ActionPopup from "@/components/ActionPopup";
import { AdminClubLogos, resetClubLogos, saveClubLogos } from "@/controllers/ClubLogosController";
import { normalizeText } from "@/lib/normalize-text";
import { ClubLogosSchemaType } from "@/types/forms";

interface PeriodDraft {
  legende: string;
  // Champs du formulaire : texte libre, vide = sans limite
  de: string;
  a: string;
  logo: string;
}

interface ClubDraft {
  key: string;
  nom: string;
  noms: string;
  periodes: PeriodDraft[];
}

const EMPTY_PERIOD: PeriodDraft = { legende: "", de: "", a: "", logo: "" };

const seasonLabel = (year: number) => `${year}-${year + 1}`;

/** « 1992-1993 à 1996-1997 », « depuis 2024-2025 »… */
function periodLabel(de: number | null, a: number | null) {
  if (de != null && a != null) return de === a ? seasonLabel(de) : `${seasonLabel(de)} à ${seasonLabel(a)}`;
  if (de != null) return `depuis ${seasonLabel(de)}`;
  if (a != null) return `jusqu'en ${seasonLabel(a)}`;
  return "toutes les saisons";
}

const parseYear = (value: string) => {
  const year = parseInt(value.trim(), 10);
  return Number.isNaN(year) ? null : year;
};

const toDraft = (club: AdminClubLogos): ClubDraft => ({
  key: club.key,
  nom: club.nom,
  noms: club.noms.join("\n"),
  periodes: club.periodes.map((p) => ({
    legende: p.legende,
    de: p.de?.toString() ?? "",
    a: p.a?.toString() ?? "",
    logo: p.logo,
  })),
});

export default function LogosAdmin({ clubs, sansLogo }: { clubs: AdminClubLogos[]; sansLogo: string[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  // null : aucun formulaire ouvert ; "new" : nouveau club ; sinon clé du club modifié
  const [editing, setEditing] = useState<string | null>(null);
  const [newClubName, setNewClubName] = useState("");
  const [toReset, setToReset] = useState<AdminClubLogos | null>(null);

  const shown = useMemo(() => {
    const wanted = normalizeText(search);
    if (!wanted) return clubs;
    return clubs.filter((club) =>
      [club.nom, ...club.noms, ...club.nomsRegistre].some((name) => normalizeText(name).includes(wanted)),
    );
  }, [clubs, search]);

  const customCount = clubs.filter((club) => club.personnalise).length;

  async function run(action: Promise<{ success: boolean; message?: string }>) {
    const result = await action;
    if (result.success) {
      if (result.message) toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message ?? "Erreur");
    }
    return result.success;
  }

  const startNewClub = (name = "") => {
    setNewClubName(name);
    setEditing("new");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-[1100px] mx-auto p-6 sm:p-10 font-Montserrat">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-Bai_Jamjuree text-3xl font-bold uppercase">Logos des clubs</h1>
          <p className="text-sm text-gray-600">
            {clubs.length} clubs, dont {customCount} repris à la main. Chaque version s&apos;affiche sur
            les saisons de sa période (classements, calendriers, historique, méthodes expert).
          </p>
        </div>
        {editing !== "new" && (
          <button
            type="button"
            onClick={() => startNewClub()}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aja-blue text-white hover:bg-orange-third transition-colors"
          >
            <Plus size={18} /> Ajouter un club
          </button>
        )}
      </div>

      {sansLogo.length > 0 && (
        <div className="mb-6 p-3 rounded-md bg-amber-100 text-amber-900 text-sm">
          <p className="font-semibold mb-2">Clubs des méthodes match sans logo</p>
          <div className="flex flex-wrap gap-2">
            {sansLogo.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => startNewClub(name)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-amber-300 hover:bg-amber-50"
              >
                <Plus size={14} /> {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {editing === "new" && (
        <ClubForm
          key={newClubName}
          initial={{ key: "", nom: newClubName, noms: "", periodes: [{ ...EMPTY_PERIOD }] }}
          onCancel={() => setEditing(null)}
          onSave={async (data) => (await run(saveClubLogos(data))) && setEditing(null)}
        />
      )}

      <label className="relative block mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un club"
          className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 text-sm bg-white"
        />
      </label>

      <ul className="space-y-3">
        {shown.map((club) =>
          editing === club.key ? (
            <li key={club.key}>
              <ClubForm
                initial={toDraft(club)}
                club={club}
                onCancel={() => setEditing(null)}
                onSave={async (data) => (await run(saveClubLogos(data))) && setEditing(null)}
                onReset={setToReset}
              />
            </li>
          ) : (
            <li key={club.key} className="bg-white rounded-xl p-4 flex items-center gap-4">
              <img src={club.logoActuel} alt="" className="w-10 h-10 object-contain shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold">
                  {club.nom}
                  <span
                    className={`ml-2 align-middle text-xs font-normal px-2 py-0.5 rounded-full ${
                      club.personnalise ? "bg-aja-blue text-white" : "bg-gray-200"
                    }`}
                  >
                    {club.personnalise ? (club.enRegistre ? "Repris à la main" : "Ajouté à la main") : "Automatique"}
                  </span>
                </p>
                {club.periodes.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-3">
                    {club.periodes.map((p, i) => (
                      <li key={i} className="flex items-center gap-1 text-xs text-gray-600" title={p.legende}>
                        <img src={p.logo} alt="" className="w-6 h-6 object-contain" />
                        {periodLabel(p.de, p.a)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Aucune version d&apos;époque : logo actuel partout.</p>
                )}
              </div>
              <button
                type="button"
                title="Modifier"
                aria-label={`Modifier les logos de ${club.nom}`}
                onClick={() => setEditing(club.key)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Pencil size={18} />
              </button>
            </li>
          ),
        )}
        {shown.length === 0 && (
          <li className="text-center text-sm text-gray-500 py-6">
            Aucun club trouvé.{" "}
            <button type="button" onClick={() => startNewClub(search)} className="text-aja-blue hover:underline">
              Ajouter « {search} »
            </button>
          </li>
        )}
      </ul>

      {toReset && (
        <ActionPopup
          onClose={() => setToReset(null)}
          title={toReset.enRegistre ? "Revenir aux logos automatiques ?" : "Supprimer ce club ?"}
          description={
            toReset.enRegistre
              ? `Les versions saisies pour « ${toReset.nom} » seront effacées : le site reprendra celles trouvées par les scrapers (Wikipédia).`
              : `« ${toReset.nom} » et ses logos seront supprimés définitivement.`
          }
          actions={[
            { label: "Annuler", onClick: () => setToReset(null), theme: "discard" },
            {
              label: toReset.enRegistre ? "Rétablir" : "Supprimer",
              onClick: async () => {
                const key = toReset.key;
                setToReset(null);
                if (await run(resetClubLogos(key))) setEditing(null);
              },
              theme: "delete",
            },
          ]}
        />
      )}
    </div>
  );
}

function ClubForm({
  initial,
  club,
  onSave,
  onCancel,
  onReset,
}: {
  initial: ClubDraft;
  club?: AdminClubLogos;
  onSave: (data: ClubLogosSchemaType) => Promise<unknown>;
  onCancel: () => void;
  onReset?: (club: AdminClubLogos) => void;
}) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);

  const setPeriod = (index: number, patch: Partial<PeriodDraft>) =>
    setData((d) => ({ ...d, periodes: d.periodes.map((p, i) => (i === index ? { ...p, ...patch } : p)) }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({
      key: data.key,
      nom: data.nom,
      noms: data.noms
        .split(/[\n,;]/)
        .map((n) => n.trim())
        .filter(Boolean),
      periodes: data.periodes.map((p) => ({
        legende: p.legende,
        de: parseYear(p.de),
        a: parseYear(p.a),
        logo: p.logo,
      })),
    });
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl p-4 sm:p-6 mb-3 border-2 border-aja-blue space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold">Nom du club</span>
          <input
            type="text"
            value={data.nom}
            onChange={(e) => setData({ ...data, nom: e.target.value })}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">
            Autres noms <span className="font-normal text-gray-500">(un par ligne)</span>
          </span>
          <textarea
            value={data.noms}
            onChange={(e) => setData({ ...data, noms: e.target.value })}
            rows={2}
            placeholder="Zenit St. Pétersbourg"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </label>
      </div>
      <p className="-mt-3 text-xs text-gray-500">
        Le club est reconnu sous tous ces noms (méthodes, classements, calendriers)
        {club && club.nomsRegistre.length > 0 && <>, en plus de ceux des scrapers : {club.nomsRegistre.join(", ")}</>}.
      </p>

      <fieldset>
        <legend className="text-sm font-semibold mb-1">Versions du logo</legend>
        <p className="text-xs text-gray-500 mb-3">
          Saisons indiquées par leur année de début (1992 = saison 1992-1993), vide = sans limite. Si deux
          périodes se chevauchent, la plus courte l&apos;emporte : une variante d&apos;une saison passe devant
          le logo de la décennie.
        </p>
        <div className="space-y-3">
          {data.periodes.map((period, index) => (
            <PeriodRow
              key={index}
              period={period}
              onChange={(patch) => setPeriod(index, patch)}
              onRemove={() => setData((d) => ({ ...d, periodes: d.periodes.filter((_, i) => i !== index) }))}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setData((d) => ({ ...d, periodes: [...d.periodes, { ...EMPTY_PERIOD }] }))}
          className="mt-3 text-sm text-aja-blue hover:underline inline-flex items-center gap-1"
        >
          <Plus size={14} /> Ajouter une version
        </button>
        {club && (
          <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            Hors de ces périodes : <img src={club.logoActuel} alt="" className="w-6 h-6 object-contain" /> logo
            actuel
          </p>
        )}
      </fieldset>

      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
        {club?.personnalise ? (
          <button
            type="button"
            onClick={() => onReset?.(club)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-red-600 hover:bg-red-50"
          >
            {club.enRegistre ? <RotateCcw size={18} /> : <Trash size={18} />}
            {club.enRegistre ? "Revenir aux logos automatiques" : "Supprimer le club"}
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aja-blue text-white hover:bg-orange-third transition-colors disabled:opacity-60"
          >
            <Check size={18} /> Enregistrer
          </button>
        </div>
      </div>
    </form>
  );
}

function PeriodRow({
  period,
  onChange,
  onRemove,
}: {
  period: PeriodDraft;
  onChange: (patch: Partial<PeriodDraft>) => void;
  onRemove: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const de = parseYear(period.de);
  const a = parseYear(period.a);

  async function upload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "clubs");
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      onChange({ logo: (await response.json()).secure_url });
    } catch (error) {
      console.error("Envoi du logo impossible", error);
      toast.error("Envoi du logo impossible.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex gap-3 items-start p-3 rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        title="Importer une image"
        className="w-16 h-16 shrink-0 rounded-md border border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50"
      >
        {uploading ? (
          <span className="text-xs text-gray-500">Envoi…</span>
        ) : period.logo ? (
          <img src={period.logo} alt="" className="w-14 h-14 object-contain" />
        ) : (
          <ImageUp size={22} className="text-gray-400" />
        )}
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-[1fr_7rem_7rem] gap-2">
        <input
          type="text"
          value={period.legende}
          onChange={(e) => onChange({ legende: e.target.value })}
          placeholder="Nom de la version (facultatif)"
          className="col-span-2 sm:col-span-1 border border-gray-300 rounded-md p-2 text-sm"
        />
        <input
          type="number"
          inputMode="numeric"
          value={period.de}
          onChange={(e) => onChange({ de: e.target.value })}
          placeholder="1re saison"
          aria-label="Première saison (année de début)"
          className="border border-gray-300 rounded-md p-2 text-sm"
        />
        <input
          type="number"
          inputMode="numeric"
          value={period.a}
          onChange={(e) => onChange({ a: e.target.value })}
          placeholder="Dernière"
          aria-label="Dernière saison (année de début)"
          className="border border-gray-300 rounded-md p-2 text-sm"
        />
        <input
          type="text"
          value={period.logo}
          onChange={(e) => onChange({ logo: e.target.value })}
          placeholder="Adresse du logo, ou cliquez sur l'image pour en importer un"
          className="col-span-2 sm:col-span-3 border border-gray-300 rounded-md p-2 text-xs"
        />
        <p className="col-span-2 sm:col-span-3 text-xs text-gray-500">{periodLabel(de, a)}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Retirer cette version"
        className="p-1 text-gray-400 hover:text-red-600"
      >
        <X size={18} />
      </button>
    </div>
  );
}
