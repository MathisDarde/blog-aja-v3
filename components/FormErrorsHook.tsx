import { useEffect } from "react";
import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { X } from "lucide-react";

export function useFormErrorToasts(errors: FieldErrors) {
  useEffect(() => {
    Object.values(errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string, {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        });
      }
    });
  }, [errors]);
}
