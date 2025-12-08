import React, { useEffect, useRef } from "react";
import {
  Control,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  useFieldArray,
  FieldErrors,
  Path,
  FieldArrayPath,
} from "react-hook-form";
import {
  ArrowLeftRight,
  ChartBarBig,
  ChevronDown,
  ChevronRight,
  FileQuestion,
  FolderPen,
  PaintbrushVertical,
  Plus,
  Trash,
} from "lucide-react";
import Section from "./DropdownContainerDomExt";
import { MethodeMatchSchemaType } from "@/types/forms";
import { GameSystems } from "@/components/GameSystems";
import { Dispositifs } from "@/components/Dispositifs";
import { RempPlayerType, TituPlayerType } from "@/contexts/Interfaces";

interface TeamInfosSectionProps {
  control: Control<MethodeMatchSchemaType>;
  register: UseFormRegister<MethodeMatchSchemaType>;
  watch: UseFormWatch<MethodeMatchSchemaType>;
  setValue: UseFormSetValue<MethodeMatchSchemaType>;
  errors: FieldErrors<MethodeMatchSchemaType>;
  teamIndex: 1 | 2;
  expandedIndices: number[];
  onToggleExpand: (index: number) => void;
  onOpenModal: (index: number) => void;
}

export default function TeamInfosSection({
  control,
  register,
  watch,
  setValue,
  errors,
  teamIndex,
  expandedIndices,
  onToggleExpand,
  onOpenModal,
}: TeamInfosSectionProps) {
  const isDom = teamIndex === 1;
  const domExtLabel = isDom ? "domicile" : "l'extérieur";

  // Construction des noms de champs dynamiques
  const teamNameField = `nomequipe${teamIndex}` as Path<MethodeMatchSchemaType>;
  const systemField =
    `systemeequipe${teamIndex}` as Path<MethodeMatchSchemaType>;
  const color1Field =
    `couleur1equipe${teamIndex}` as Path<MethodeMatchSchemaType>;
  const color2Field =
    `couleur2equipe${teamIndex}` as Path<MethodeMatchSchemaType>;

  const fieldArrayNameTitulaires =
    `titulairesequipe${teamIndex}` as FieldArrayPath<MethodeMatchSchemaType>;
  const fieldArrayNameRemplacants =
    `remplacantsequipe${teamIndex}` as FieldArrayPath<MethodeMatchSchemaType>;

  // Récupération des erreurs spécifiques
  const titulairesErrors = errors[
    `titulairesequipe${teamIndex}` as keyof MethodeMatchSchemaType
  ] as FieldErrors<TituPlayerType>[];
  const systemError = errors[systemField as keyof typeof errors];

  // --- LOGIQUE TITULAIRES ---
  const { fields: fieldsTitulaires, replace: replaceTitulaires } =
    useFieldArray({
      control,
      name: fieldArrayNameTitulaires,
    });

  // --- LOGIQUE REMPLACANTS ---
  const {
    fields: fieldsRemplacants,
    append: appendRemplacant,
    remove: removeRemplacant,
  } = useFieldArray({
    control,
    name: fieldArrayNameRemplacants,
  });

  const selectedSystem = watch(systemField) as string;
  const currentDispositif = Dispositifs.find((d) => d.name === selectedSystem);
  const positionsDisponibles = currentDispositif?.postes || [];

  const currentTitulaires = watch(fieldArrayNameTitulaires) as TituPlayerType[];
  const prevSystemRef = useRef<string | null>(null);

  // --- EFFET: GESTION DES POSTES ET MAINTENANCE ---
  useEffect(() => {
    if (!selectedSystem) return;

    // 1. Init
    if (prevSystemRef.current === null) {
      prevSystemRef.current = selectedSystem;
      return;
    }

    // 2. Pas de changement
    if (prevSystemRef.current === selectedSystem) {
      return;
    }

    // 3. Changement de système : Réorganiser les titulaires
    const formation = Dispositifs.find((d) => d.name === selectedSystem);

    if (formation) {
      // On mapppe sur les nouvelles positions du système
      const newTitulaires: TituPlayerType[] = formation.postes.map(
        (poste, index) => {
          // On récupère l'objet joueur existant à cet index (ou vide)
          const existingPlayer = currentTitulaires?.[index] || {};

          return {
            nom: existingPlayer.nom || "",
            numero: existingPlayer.numero || "",
            poste: poste.name,
            sortie: existingPlayer.sortie || "",
            buts: existingPlayer.buts || "",
            cartonJaune: !!existingPlayer.cartonJaune,
            cartonRouge: !!existingPlayer.cartonRouge,
          };
        }
      );

      // @ts-expect-error : Si le typage inféré est encore trop complexe pour le fieldArray, on peut forcer l'acceptation
      // mais normalement sans l'annotation explicite ci-dessus, cela devrait passer.
      replaceTitulaires(newTitulaires);
    }

    prevSystemRef.current = selectedSystem;
  }, [selectedSystem, currentTitulaires, replaceTitulaires]);

  const handleColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: Path<MethodeMatchSchemaType>
  ) => {
    const value = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue(fieldName, value);
    }
  };

  const emptyRemplacant: RempPlayerType = {
    nom: "",
    drapeau: "",
    poste: "",
    entree: "",
    buts: "",
    cartonJaune: false,
    cartonRouge: false,
  };

  return (
    <Section title={`Infos sur équipe à ${domExtLabel}`}>
      {/* --- COULEUR PRINCIPALE --- */}
      <div className="relative w-full my-4">
        <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
          <PaintbrushVertical className="mr-4" />
          Couleur principale de l&apos;équipe à {domExtLabel} (Code héx.) :
        </span>
        <div className="flex items-center gap-6">
          <input
            type="color"
            {...register(color1Field)}
            onChange={(e) => handleColorChange(e, color1Field)}
            className="aspect-square border-none cursor-pointer appearance-none h-full"
          />
          <input
            type="text"
            {...register(color1Field)}
            value={watch(color1Field) as string}
            onChange={(e) => handleColorChange(e, color1Field)}
            className="bg-white w-full md:w-1/3 px-6 py-2 md:py-3 rounded-md border-gray-600 border text-sm sm:text-base"
          />
        </div>
      </div>

      {/* --- COULEUR SECONDAIRE --- */}
      <div className="relative w-auto my-4">
        <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
          <PaintbrushVertical className="mr-4" />
          Couleur secondaire de l&apos;équipe à {domExtLabel} (Code héx.) :
        </span>
        <div className="flex items-center gap-6">
          <input
            type="color"
            {...register(color2Field)}
            onChange={(e) => handleColorChange(e, color2Field)}
            className="aspect-square border-none cursor-pointer appearance-none h-full"
          />
          <input
            type="text"
            {...register(color2Field)}
            value={watch(color2Field) as string}
            onChange={(e) => handleColorChange(e, color2Field)}
            className="bg-white w-full md:w-1/3 px-6 py-3 rounded-md border-gray-600 border text-sm sm:text-base"
          />
        </div>
      </div>

      {/* --- NOM EQUIPE --- */}
      <div className="relative w-auto my-4">
        <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
          <FolderPen className="mr-4" />
          Nom de l&apos;équipe à {domExtLabel} :
        </span>
        <input
          type="text"
          {...register(teamNameField)}
          className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
          placeholder={`Nom de l'équipe (ex: ${isDom ? "AJ Auxerre" : "RC Lens"})`}
        />
      </div>

      {/* --- SYSTEME DE JEU --- */}
      <div className="relative w-auto my-4">
        <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
          <ChartBarBig className="mr-4" />
          Système de jeu de l&apos;équipe à {domExtLabel} :
        </span>
        <select
          {...register(systemField)}
          className={`w-full py-3 sm:py-4 px-6 rounded-full border font-Montserrat text-xs sm:text-sm bg-white ${
            systemError ? "border-red-500" : "border-gray-600"
          }`}
        >
          <option value="">Sélectionner un système...</option>
          {GameSystems.map((system, index) => (
            <option key={index} value={system}>
              {system}
            </option>
          ))}
        </select>

        {systemError && (
          <span className="text-red-500 text-xs mt-1 ml-4">
            {systemError.message as string}
          </span>
        )}
      </div>

      {/* --- TITULAIRES --- */}
      <div className="relative w-auto my-4">
        <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
          <ArrowLeftRight className="mr-4" />
          Titulaires de l&apos;équipe à {domExtLabel} :
        </span>

        {fieldsTitulaires.map((field, index) => {
          const rowErrors = titulairesErrors?.[index];

          return (
            <React.Fragment key={field.id}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
                {/* NOM */}
                <div className="w-full md:w-5/12">
                  <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                    Nom du joueur
                  </label>
                  <input
                    type="text"
                    {...register(
                      `${fieldArrayNameTitulaires}.${index}.nom` as Path<MethodeMatchSchemaType>
                    )}
                    placeholder="Nom (ex: Gaëtan Perrin)"
                    className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                  />
                  {rowErrors?.nom && (
                    <span className="text-red-500 text-[10px]">
                      {rowErrors.nom.message}
                    </span>
                  )}
                </div>

                {/* POSTE */}
                <div className="w-full md:w-5/12">
                  <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                    Poste
                  </label>
                  <select
                    {...register(
                      `${fieldArrayNameTitulaires}.${index}.poste` as Path<MethodeMatchSchemaType>
                    )}
                    className={`py-2 px-4 border rounded-md w-full text-xs sm:text-sm bg-white focus:ring-2 focus:ring-aja-blue focus:outline-none ${
                      rowErrors?.poste ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Choisir...</option>
                    {positionsDisponibles.length > 0 &&
                      positionsDisponibles.map((poste, pIndex) => (
                        <option key={pIndex} value={poste.name}>
                          {poste.name}
                        </option>
                      ))}
                  </select>
                  {rowErrors?.poste && (
                    <span className="text-red-500 text-[10px]">
                      {rowErrors.poste.message}
                    </span>
                  )}
                </div>

                {/* NUMERO */}
                <div className="w-full md:w-2/12 relative">
                  <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                    Numéro
                  </label>
                  <input
                    type="text"
                    {...register(
                      `${fieldArrayNameTitulaires}.${index}.numero` as Path<MethodeMatchSchemaType>
                    )}
                    placeholder="N°"
                    className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                  />
                  {rowErrors?.numero && (
                    <span className="text-red-500 text-[10px]">
                      {rowErrors.numero.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2 items-center my-2">
                {/* SORTIE */}
                <div className="w-full md:w-1/4">
                  <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                    Sortie
                  </label>
                  <input
                    type="text"
                    {...register(
                      `${fieldArrayNameTitulaires}.${index}.sortie` as Path<MethodeMatchSchemaType>
                    )}
                    placeholder="Min. (ex: 75')"
                    className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                  />
                  {rowErrors?.sortie && (
                    <span className="text-red-500 text-[10px]">
                      {rowErrors.sortie.message}
                    </span>
                  )}
                </div>

                {/* BUTS */}
                <div className="w-full md:w-1/4">
                  <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                    Buts
                  </label>
                  <input
                    type="text"
                    {...register(
                      `${fieldArrayNameTitulaires}.${index}.buts` as Path<MethodeMatchSchemaType>
                    )}
                    placeholder="Buts"
                    className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                  />
                </div>

                {/* JAUNE */}
                <div className="w-full md:w-1/4">
                  <label className="flex items-center justify-start md:justify-center gap-2 text-xs sm:text-sm mt-4 md:mt-0">
                    <input
                      type="checkbox"
                      {...register(
                        `${fieldArrayNameTitulaires}.${index}.cartonJaune` as Path<MethodeMatchSchemaType>
                      )}
                    />
                    <div
                      className="w-4 h-6 bg-yellow-400 border border-gray-400 rounded-sm"
                      title="Carton Jaune"
                    ></div>
                    <p className="text-xs sm:text-sm">Carton jaune</p>
                  </label>
                </div>

                {/* ROUGE */}
                <div className="w-full md:w-1/4">
                  <label className="flex items-center justify-start md:justify-center gap-2 text-xs sm:text-sm mt-4 md:mt-0">
                    <input
                      type="checkbox"
                      {...register(
                        `${fieldArrayNameTitulaires}.${index}.cartonRouge` as Path<MethodeMatchSchemaType>
                      )}
                    />
                    <div
                      className="w-4 h-6 bg-red-600 border border-gray-400 rounded-sm"
                      title="Carton Rouge"
                    ></div>
                    <p className="text-xs sm:text-sm">Carton rouge</p>
                  </label>
                </div>
              </div>
              <hr className="border-gray-300 my-4 w-full" />
            </React.Fragment>
          );
        })}
      </div>

      {/* --- REMPLAÇANTS --- */}
      <div className="relative w-auto my-4">
        <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
          <ArrowLeftRight className="mr-4" />
          Remplaçants de l&apos;équipe à {domExtLabel} :
        </span>
        {fieldsRemplacants.map((field, index) => (
          <React.Fragment key={field.id}>
            <div className="flex flex-col md:flex-row items-center gap-2 mb-2 w-full">
              <div className="flex items-center gap-2 w-full md:w-2/5">
                {expandedIndices.includes(index) ? (
                  <ChevronDown
                    onClick={() => onToggleExpand(index)}
                    className="cursor-pointer"
                  />
                ) : (
                  <ChevronRight
                    onClick={() => onToggleExpand(index)}
                    className="cursor-pointer"
                  />
                )}

                {/* NOM REMPLACANT */}
                <input
                  type="text"
                  {...register(
                    `${fieldArrayNameRemplacants}.${index}.nom` as Path<MethodeMatchSchemaType>
                  )}
                  placeholder="Nom (ex: Gaëtan Perrin)"
                  className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                />
              </div>

              {/* DRAPEAU */}
              <div className="relative w-full md:w-2/5 flex">
                <input
                  type="text"
                  {...register(
                    `${fieldArrayNameRemplacants}.${index}.drapeau` as Path<MethodeMatchSchemaType>
                  )}
                  placeholder="Drapeau (ex: france)"
                  className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => onOpenModal(index)}
                  className="ml-1 text-aja-blue"
                >
                  <FileQuestion size={20} />
                </button>
              </div>

              {/* POSTE */}
              <input
                type="text"
                {...register(
                  `${fieldArrayNameRemplacants}.${index}.poste` as Path<MethodeMatchSchemaType>
                )}
                placeholder="Poste (ex: G)"
                className="py-2 px-4 border rounded w-full md:w-1/5 text-xs sm:text-sm"
              />
            </div>

            {expandedIndices.includes(index) && (
              <div className="flex flex-col md:flex-row gap-2 items-center my-2">
                {/* ENTREE */}
                <div className="w-full md:w-1/4">
                  <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                    Entrée
                  </label>
                  <input
                    type="text"
                    {...register(
                      `${fieldArrayNameRemplacants}.${index}.entree` as Path<MethodeMatchSchemaType>
                    )}
                    placeholder="Min. (ex: 75')"
                    className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                  />
                </div>

                {/* BUTS */}
                <div className="w-full md:w-1/4">
                  <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                    Buts
                  </label>
                  <input
                    type="text"
                    {...register(
                      `${fieldArrayNameRemplacants}.${index}.buts` as Path<MethodeMatchSchemaType>
                    )}
                    placeholder="Buts"
                    className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                  />
                </div>

                {/* JAUNE */}
                <div className="w-full md:w-1/4">
                  <label className="flex items-center justify-start sm:justify-center gap-2 text-xs sm:text-sm mt-4 md:mt-0">
                    <input
                      type="checkbox"
                      {...register(
                        `${fieldArrayNameRemplacants}.${index}.cartonJaune` as Path<MethodeMatchSchemaType>
                      )}
                    />
                    <div
                      className="w-4 h-6 bg-yellow-400 border border-gray-400 rounded-sm"
                      title="Carton Jaune"
                    ></div>
                    <p className="text-xs sm:text-sm">Carton jaune</p>
                  </label>
                </div>

                {/* ROUGE */}
                <div className="w-full md:w-1/4">
                  <label className="flex items-center justify-start sm:justify-center gap-2 text-xs sm:text-sm mt-4 md:mt-0">
                    <input
                      type="checkbox"
                      {...register(
                        `${fieldArrayNameRemplacants}.${index}.cartonRouge` as Path<MethodeMatchSchemaType>
                      )}
                    />
                    <div
                      className="w-4 h-6 bg-red-600 border border-gray-400 rounded-sm"
                      title="Carton Rouge"
                    ></div>
                    <p className="text-xs sm:text-sm">Carton rouge</p>
                  </label>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => removeRemplacant(index)}
              className="text-white bg-red-500 p-2 rounded-full mx-auto mb-2"
            >
              <Trash size={18} />
            </button>
          </React.Fragment>
        ))}
        <button
          type="button"
          onClick={() => appendRemplacant(emptyRemplacant)}
          className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline"
        >
          <Plus size={18} />
          Ajouter un remplaçant
        </button>
      </div>
    </Section>
  );
}
