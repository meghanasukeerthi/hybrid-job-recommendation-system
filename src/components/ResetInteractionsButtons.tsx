
import { Button } from "@/components/ui/button";
import { resetUserInteractions, resetAllUserInteractions } from "@/services/jobService";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const ResetInteractionsButtons = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [isResettingAll, setIsResettingAll] = useState(false);

  const handleResetUser = async () => {
    setIsResetting(true);
    try {
      await resetUserInteractions();
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetAll = async () => {
    setIsResettingAll(true);
    try {
      await resetAllUserInteractions();
    } finally {
      setIsResettingAll(false);
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center mt-4">
      <Button 
        variant="outline" 
        onClick={handleResetUser}
        disabled={isResetting}
        className="w-48"
      >
        {isResetting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          'Reset My Interactions'
        )}
      </Button>
      <Button 
        variant="destructive" 
        onClick={handleResetAll}
        disabled={isResettingAll}
        className="w-48"
      >
        {isResettingAll ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting All...
          </>
        ) : (
          'Reset All Users'
        )}
      </Button>
    </div>
  );
};
