import React from "react";
import {
  Control,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  useFieldArray,
  FieldErrors,
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

interface TeamInfosSectionProps {
  control: Control<MethodeMatchSchemaType>;
  register: UseFormRegister<MethodeMatchSchemaType>;
  watch: UseFormWatch<MethodeMatchSchemaType>;
  setValue: UseFormSetValue<MethodeMatchSchemaType>;
  errors: FieldErrors<MethodeMatchSchemaType>;
  teamIndex: 1 | 2; // 1 pour domicile, 2 pour extérieur
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

  // Noms des champs dynamiques
  const teamNameField = `nomequipe${teamIndex}` as const;
  const systemField = `systemeequipe${teamIndex}` as const;
  const color1Field = `couleur1equipe${teamIndex}` as const;
  const color2Field = `couleur2equipe${teamIndex}` as const;
  const fieldArrayNameTitulaires = `titulairesequipe${teamIndex}`;
  const fieldArrayNameRemplacants = `remplacantsequipe${teamIndex}`;

  const titulairesErrors = (errors as any)?.[fieldArrayNameTitulaires];

  const {
    fields: fieldsTitulaires,
    append: appendTitulaire,
    remove: removeTitulaire
  } = useFieldArray({
    control,
    name: fieldArrayNameTitulaires as any,
  });

  const {
    fields: fieldsRemplacants,
    append: appendRemplacant,
    remove: removeRemplacant
  } = useFieldArray({
    control,
    name: fieldArrayNameRemplacants as any,
  });


  const handleColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: typeof color1Field | typeof color2Field
  ) => {
    const value = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue(fieldName, value);
    }
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
            className="aspect-square border-none cursor-pointer appearance-none"
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
            className="aspect-square border-none cursor-pointer appearance-none"
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
          className={`w-full py-3 sm:py-4 px-6 rounded-full border font-Montserrat text-xs sm:text-sm bg-white ${errors[systemField] ? "border-red-500" : "border-gray-600"
            }`}
        >
          <option value="">Sélectionner un système...</option>
          {GameSystems.map((system, index) => (
            <option key={index} value={system}>{system}</option>
          ))}
        </select>

        {errors[systemField] && (
          <span className="text-red-500 text-xs mt-1 ml-4">
            {errors[systemField]?.message}
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
          const rowError = titulairesErrors?.[index];

          return (
            <React.Fragment key={field.id}>
              <div className="flex flex-col md:flex-row items-center gap-2 mb-2 w-full">
                <div className="flex items-center gap-2 w-full md:w-2/5">
                  <input
                    type="text"
                    // @ts-ignore
                    {...register(`${fieldArrayNameTitulaires}.${index}.0`)}
                    placeholder="Nom (ex: Gaëtan Perrin)"
                    className={`py-2 px-4 border rounded w-full text-xs sm:text-sm ${rowError?.[0] ? "border-red-500" : ""
                      }`}
                  />
                  {rowError?.[0] && (
                    <span className="text-red-500 text-[10px]">
                      {rowError[0]?.message}
                    </span>
                  )}
                </div>
                <div className="relative w-full md:w-2/5 flex">
                  <input
                    type="text"
                    // @ts-ignore
                    {...register(`${fieldArrayNameTitulaires}.${index}.1`)}
                    placeholder="Numéro (ex: 10)"
                    className={`py-2 px-4 border rounded w-full text-xs sm:text-sm ${
                      rowError?.[1] ? "border-red-500" : ""
                      }`}
                  />
                  {rowError?.[1] && (
                    <span className="text-red-500 text-[10px]">
                      {rowError[1]?.message}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  // @ts-ignore
                  {...register(`${fieldArrayNameTitulaires}.${index}.2`)}
                  placeholder="Poste (ex: G)"
                  className={`py-2 px-4 border rounded w-full text-xs sm:text-sm ${
                    rowError?.[2] ? "border-red-500" : ""
                    }`}
                />
                {rowError?.[2] && (
                  <span className="text-red-500 text-[10px]">
                    {rowError[2]?.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-2 items-center px-0 md:px-12 mb-2">
                <input
                  type="text"
                  // @ts-ignore
                  {...register(`${fieldArrayNameTitulaires}.${index}.3`)}
                  placeholder="Minute de sortie (ex: 75')"
                  className={`py-2 px-4 border rounded w-full text-xs sm:text-sm ${
                    rowError?.[3] ? "border-red-500" : ""
                    }`}
                />
                {rowError?.[3] && (
                  <span className="text-red-500 text-[10px]">
                    {rowError[3]?.message}
                  </span>
                )}
                <input
                  type="text"
                  // @ts-ignore
                  {...register(`${fieldArrayNameTitulaires}.${index}.4`)}
                  placeholder="Buts (ex: 0)"
                  className={`py-2 px-4 border rounded w-full text-xs sm:text-sm ${
                    rowError?.[4] ? "border-red-500" : ""
                    }`}
                />
                {rowError?.[4] && (
                  <span className="text-red-500 text-[10px]">
                    {rowError[4]?.message}
                  </span>
                )}
                <label className="flex items-center gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    // @ts-ignore
                    {...register(`${fieldArrayNameTitulaires}.${index}.5`)}
                  />
                  Carton jaune
                </label>

                <label className="flex items-center gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    // @ts-ignore
                    {...register(`${fieldArrayNameTitulaires}.${index}.6`)}
                  />
                  Carton rouge
                </label>

              </div>

              <button
                type="button"
                onClick={() => removeTitulaire(index)}
                className="text-white bg-red-500 p-2 rounded-full mx-auto mb-2"
              >
                <Trash size={18} />
              </button>
            </React.Fragment>
          )
        })}

        <button
          type="button"
          // @ts-ignore
          onClick={() => appendTitulaire([["", "", "", "", "", false, false]])}
          className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline"
        >
          <Plus size={18} />
          Ajouter un titulaire
        </button>
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
                  <ChevronDown onClick={() => onToggleExpand(index)} className="cursor-pointer" />
                ) : (
                  <ChevronRight onClick={() => onToggleExpand(index)} className="cursor-pointer" />
                )}
                <input
                  type="text"
                  // @ts-ignore
                  {...register(`${fieldArrayNameRemplacants}.${index}.0`)}
                  placeholder="Nom (ex: Gaëtan Perrin)"
                  className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                />
              </div>
              <div className="relative w-full md:w-2/5 flex">
                <input
                  type="text"
                  // @ts-ignore
                  {...register(`${fieldArrayNameRemplacants}.${index}.1`)}
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
              <input
                type="text"
                // @ts-ignore
                {...register(`${fieldArrayNameRemplacants}.${index}.2`)}
                placeholder="Poste (ex: G)"
                className="py-2 px-4 border rounded w-full md:w-1/5 text-xs sm:text-sm"
              />
            </div>

            {expandedIndices.includes(index) && (
              <div className="flex flex-col md:flex-row gap-2 items-center px-0 md:px-12 mb-2">
                <input
                  type="text"
                  // @ts-ignore
                  {...register(`${fieldArrayNameRemplacants}.${index}.3`)}
                  placeholder="Minute (ex: 75')"
                  className="py-2 px-4 border rounded w-full md:w-2/4 text-xs sm:text-sm"
                />
                <input
                  type="text"
                  // @ts-ignore
                  {...register(`${fieldArrayNameRemplacants}.${index}.4`)}
                  placeholder="Buts (ex: 0)"
                  className="py-2 px-4 border rounded w-full md:w-2/4 text-xs sm:text-sm"
                />
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
          // @ts-ignore
          onClick={() => appendRemplacant([["", "", "", "", ""]])}
          className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline"
        >
          <Plus size={18} />
          Ajouter un remplaçant
        </button>
      </div>
    </Section>
  );
}