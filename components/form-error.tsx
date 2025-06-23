import { CircleAlert } from "lucide-react";

interface FormErrorProps {
  message: string | undefined;
}
export const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null; // Don't render anything if there's no message
  }
  return (
    <div className="border border-red-200 bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <CircleAlert className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
