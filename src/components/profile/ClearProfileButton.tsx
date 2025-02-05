
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UseFormReset } from "react-hook-form";
import { formSchema } from "./FormFields";
import * as z from "zod";

interface ClearProfileButtonProps {
  onClear: UseFormReset<z.infer<typeof formSchema>>;
}

export const ClearProfileButton = ({ onClear }: ClearProfileButtonProps) => {
  const { toast } = useToast();

  const handleClear = () => {
    onClear({
      fullName: "",
      email: "",
      skills: "",
      experience: "",
      education: "",
      careerGoals: ""
    });
    localStorage.removeItem('userProfile');
    
    toast({
      title: "Profile Cleared",
      description: "All profile data has been cleared successfully.",
    });
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleClear}
      className="w-full gap-2"
    >
      <Trash2 className="h-4 w-4" />
      Clear Profile Data
    </Button>
  );
};
