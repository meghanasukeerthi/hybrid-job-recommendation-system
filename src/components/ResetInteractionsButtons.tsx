
import { Button } from "@/components/ui/button";
import { resetUserInteractions, resetAllUserInteractions } from "@/services/jobService";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    <div className="flex gap-4 items-center justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
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
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Your Interactions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all your job interactions including likes, applications, and comments.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetUser}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
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
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Users' Interactions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset ALL users' job interactions including likes, applications, and comments.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetAll}
              className="bg-destructive hover:bg-destructive/90"
            >
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
