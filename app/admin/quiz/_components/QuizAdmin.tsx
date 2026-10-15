"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Pencil, Plus, Trash, X } from "lucide-react";
import { toast } from "sonner";
import ActionPopup from "@/components/ActionPopup";
import { SelectQuizQuestion } from "@/db/schema";
import { QuizQuestionSchemaType } from "@/types/forms";
import {
  createQuizQuestion,
  deleteQuizQuestion,
  setQuizQuestionsActive,
  updateQuizQuestion,
} from "@/controllers/QuizController";

const EMPTY_QUESTION: QuizQuestionSchemaType = {
  question: "",
  answers: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
  active: true,
};

const MAX_ANSWERS = 6;

export default function QuizAdmin({ questions }: { questions: SelectQuizQuestion[] }) {
  const router = useRouter();
  // null : aucun formulaire ouvert ; "new" : création ; sinon id de la question modifiée
  const [editing, setEditing] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<SelectQuizQuestion | null>(null);

  const activeCount = questions.filter((q) => q.active).length;

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

  return (
    <div className="max-w-[1000px] mx-auto p-6 sm:p-10 font-Montserrat">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-Bai_Jamjuree text-3xl font-bold uppercase">Questions du quiz</h1>
          <p className="text-sm text-gray-600">
            {questions.length} question{questions.length > 1 ? "s" : ""}, dont {activeCount} tirée
            {activeCount > 1 ? "s" : ""} au sort (10 par partie)
          </p>
        </div>
        {editing !== "new" && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aja-blue text-white hover:bg-orange-third transition-colors"
          >
            <Plus size={18} /> Nouvelle question
          </button>
        )}
      </div>

      {activeCount < 10 && (
        <p className="mb-4 p-3 rounded-md bg-amber-100 text-amber-900 text-sm">
          Moins de 10 questions actives : les parties seront plus courtes que prévu.
        </p>
      )}

      {editing === "new" && (
        <QuestionForm
          initial={EMPTY_QUESTION}
          onCancel={() => setEditing(null)}
          onSave={async (data) => (await run(createQuizQuestion(data))) && setEditing(null)}
        />
      )}

      <ol className="space-y-3">
        {questions.map((q, index) =>
          editing === q.id_question ? (
            <li key={q.id_question}>
              <QuestionForm
                initial={{
                  question: q.question,
                  answers: q.answers,
                  correctIndex: q.correctIndex,
                  explanation: q.explanation ?? "",
                  active: q.active,
                }}
                onCancel={() => setEditing(null)}
                onSave={async (data) =>
                  (await run(updateQuizQuestion(q.id_question, data))) && setEditing(null)
                }
              />
            </li>
          ) : (
            <li
              key={q.id_question}
              className={`bg-white rounded-xl p-4 flex gap-4 ${q.active ? "" : "opacity-60"}`}
            >
              <span className="font-Bai_Jamjuree font-bold text-gray-400 w-6">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">
                  {q.question}
                  {!q.active && (
                    <span className="ml-2 align-middle text-xs font-normal px-2 py-0.5 rounded-full bg-gray-200">
                      Désactivée
                    </span>
                  )}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                  {q.answers.map((answer, i) => (
                    <li
                      key={i}
                      className={`px-2 py-0.5 rounded-md border ${
                        i === q.correctIndex ? "bg-green-100 border-green-500 text-green-800" : "border-gray-300"
                      }`}
                    >
                      {answer}
                    </li>
                  ))}
                </ul>
                {q.explanation && <p className="mt-2 text-xs text-gray-600">{q.explanation}</p>}
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-1">
                <IconButton label="Modifier" onClick={() => setEditing(q.id_question)}>
                  <Pencil size={18} />
                </IconButton>
                <IconButton
                  label={q.active ? "Désactiver" : "Activer"}
                  onClick={() => run(setQuizQuestionsActive([q.id_question], !q.active))}
                >
                  {q.active ? <EyeOff size={18} /> : <Eye size={18} />}
                </IconButton>
                <IconButton label="Supprimer" danger onClick={() => setToDelete(q)}>
                  <Trash size={18} />
                </IconButton>
              </div>
            </li>
          )
        )}
      </ol>

      {toDelete && (
        <ActionPopup
          onClose={() => setToDelete(null)}
          title="Supprimer cette question ?"
          description={`« ${toDelete.question} » sera supprimée définitivement. Pour la retirer temporairement, désactivez-la plutôt.`}
          actions={[
            { label: "Annuler", onClick: () => setToDelete(null), theme: "discard" },
            {
              label: "Supprimer",
              onClick: async () => {
                setToDelete(null);
                await run(deleteQuizQuestion(toDelete.id_question));
              },
              theme: "delete",
            },
          ]}
        />
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`p-2 rounded-full transition-colors ${
        danger ? "text-gray-500 hover:bg-red-500 hover:text-white" : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function QuestionForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: QuizQuestionSchemaType;
  onSave: (data: QuizQuestionSchemaType) => Promise<unknown>;
  onCancel: () => void;
}) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);

  const setAnswer = (index: number, value: string) =>
    setData({ ...data, answers: data.answers.map((a, i) => (i === index ? value : a)) });

  const removeAnswer = (index: number) =>
    setData({
      ...data,
      answers: data.answers.filter((_, i) => i !== index),
      // La bonne réponse suit son texte quand une réponse au-dessus disparaît
      correctIndex:
        index < data.correctIndex ? data.correctIndex - 1 : index === data.correctIndex ? 0 : data.correctIndex,
    });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(data);
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl p-4 sm:p-6 mb-3 border-2 border-aja-blue space-y-4">
      <label className="block">
        <span className="text-sm font-semibold">Question</span>
        <textarea
          value={data.question}
          onChange={(e) => setData({ ...data, question: e.target.value })}
          rows={2}
          className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm"
          required
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold mb-1">
          Réponses <span className="font-normal text-gray-500">(cochez la bonne)</span>
        </legend>
        <div className="space-y-2">
          {data.answers.map((answer, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={data.correctIndex === index}
                onChange={() => setData({ ...data, correctIndex: index })}
                aria-label={`Réponse ${index + 1} correcte`}
                className="accent-green-600 w-4 h-4"
              />
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(index, e.target.value)}
                placeholder={`Réponse ${index + 1}`}
                className={`flex-1 border rounded-md p-2 text-sm ${
                  data.correctIndex === index ? "border-green-500 bg-green-50" : "border-gray-300"
                }`}
                required
              />
              {data.answers.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeAnswer(index)}
                  aria-label={`Retirer la réponse ${index + 1}`}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        {data.answers.length < MAX_ANSWERS && (
          <button
            type="button"
            onClick={() => setData({ ...data, answers: [...data.answers, ""] })}
            className="mt-2 text-sm text-aja-blue hover:underline inline-flex items-center gap-1"
          >
            <Plus size={14} /> Ajouter une réponse
          </button>
        )}
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">
          Explication <span className="font-normal text-gray-500">(facultative, affichée après la réponse)</span>
        </span>
        <textarea
          value={data.explanation ?? ""}
          onChange={(e) => setData({ ...data, explanation: e.target.value })}
          rows={2}
          className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={data.active}
          onChange={(e) => setData({ ...data, active: e.target.checked })}
          className="w-4 h-4"
        />
        Question active (tirée au sort)
      </label>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100">
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
    </form>
  );
}
