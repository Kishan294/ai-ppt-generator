"use client";

import { deletePresentation } from "@/app/actions/presentation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeletePresentationButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the viewer
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this presentation?")) return;

    setDeleting(true);
    try {
      await deletePresentation(id);
      toast.success("Presentation deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete presentation");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={deleting}
      className="h-8 w-8 rounded-full border border-zinc-800 bg-zinc-950/50 text-zinc-500 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
    >
      {deleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
