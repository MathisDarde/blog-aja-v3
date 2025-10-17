import { useEffect } from "react";
import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

export function useFormErrorToasts(errors: FieldErrors) {
  useEffect(() => {
    Object.values(errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string);
      }
    });
  }, [errors]);
}
