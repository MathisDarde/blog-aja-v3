import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Trophy } from "lucide-react";
import { MethodeMatchSchemaType } from "@/types/forms";
import { buildMatchTitle } from "@/lib/methode-match-form";

const inputClass =
  "py-2 sm:py-3 px-3 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm text-center";

/** Abréviations, score, prolongation et tirs au but : le titre du match en découle. */
export default function MatchScoreFields({
  register,
  watch,
  errors,
}: {
  register: UseFormRegister<MethodeMatchSchemaType>;
  watch: UseFormWatch<MethodeMatchSchemaType>;
  errors: FieldErrors<MethodeMatchSchemaType>;
}) {
  const values = watch();
  const complete =
    values.abreviationequipe1?.trim() &&
    values.abreviationequipe2?.trim() &&
    values.scoreequipe1 !== "" &&
    values.scoreequipe2 !== "";

  const error =
    errors.abreviationequipe1 ??
    errors.scoreequipe1 ??
    errors.scoreequipe2 ??
    errors.abreviationequipe2 ??
    errors.tabequipe1 ??
    errors.tabequipe2;

  return (
    <div className="relative w-full my-4 font-Montserrat">
      <span className="font-semibold text-sm sm:text-base flex items-center text-gray-600 mb-2">
        <Trophy className="mr-4" />
        Score du match :
      </span>

      <div className="grid grid-cols-[1fr_4rem_auto_4rem_1fr] items-center gap-2">
        <input
          type="text"
          {...register("abreviationequipe1")}
          placeholder="Dom. (AJA)"
          className={inputClass}
        />
        <input
          type="text"
          inputMode="numeric"
          {...register("scoreequipe1")}
          placeholder="0"
          className={inputClass}
        />
        <span className="font-bold text-gray-600">-</span>
        <input
          type="text"
          inputMode="numeric"
          {...register("scoreequipe2")}
          placeholder="0"
          className={inputClass}
        />
        <input
          type="text"
          {...register("abreviationequipe2")}
          placeholder="Ext. (BVB)"
          className={inputClass}
        />
      </div>
      <p className="mt-1 text-[11px] text-gray-500 text-left ml-4">
        L&apos;abréviation se remplit avec la dernière utilisée pour le club dès que le nom de
        l&apos;équipe est saisi plus bas.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-3 text-xs sm:text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("prolongation")} />
          Après prolongation (a.p.)
        </label>
        <div className="flex items-center gap-2">
          <span>Tirs au but (facultatif) :</span>
          <input
            type="text"
            inputMode="numeric"
            {...register("tabequipe1")}
            placeholder="-"
            className="w-12 py-1 px-2 rounded-full border border-gray-600 text-center"
          />
          <span>-</span>
          <input
            type="text"
            inputMode="numeric"
            {...register("tabequipe2")}
            placeholder="-"
            className="w-12 py-1 px-2 rounded-full border border-gray-600 text-center"
          />
        </div>
      </div>

      {error?.message && <p className="mt-2 text-red-500 text-xs text-left ml-4">{error.message}</p>}

      <p className="mt-3 text-sm text-left ml-4">
        <span className="text-gray-500">Titre du match : </span>
        <span className="font-semibold font-Bai_Jamjuree">
          {complete ? buildMatchTitle(values) : "à compléter"}
        </span>
      </p>
    </div>
  );
}
