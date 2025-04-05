
import { useToast } from "@/hooks/use-toast";
import { toast as hookToast } from "@/hooks/use-toast";
import { type Toast } from "@/components/ui/toast";

// Create an extended toast with additional methods
const toast = {
  ...hookToast,
  success: (message: string) => {
    return hookToast({
      title: "Success",
      description: message,
      variant: "default",
    });
  },
  error: (message: string) => {
    return hookToast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }
};

export { useToast, toast };
