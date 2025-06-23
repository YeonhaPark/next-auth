import { CircleCheck } from "lucide-react";

interface FormSuccessProps {
  message: string | undefined;
}
export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) {
    return null; // Don't render anything if there's no message
  }
  return (
    <div className="border border-emerald-200 bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CircleCheck className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
