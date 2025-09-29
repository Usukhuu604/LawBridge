"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import CreatePost from "@/app/my-profile/[lawyerId]/tabs/post/CreatePost";
import { PlusCircle } from "lucide-react";

interface CreatePostModalProps {
  onPostCreated?: () => void;
}

const CreatePostModal = ({ onPostCreated }: CreatePostModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handlePostCreated = () => {
    setIsCreating(false);
    setIsOpen(false);
    onPostCreated?.();
  };

  const handlePostStart = () => {
    setIsCreating(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#003365] hover:bg-[#002a52] text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base">
          <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden xs:inline">Шинэ нийтлэл үүсгэх</span>
          <span className="xs:hidden">Нийтлэл</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl border border-gray-200">
        <DialogHeader className="pb-4 sm:pb-6 border-b border-gray-100">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center">
            {isCreating ? "Нийтлэл үүсгэж байна..." : "Шинэ нийтлэл үүсгэх"}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4 sm:pt-6 md:pt-8 bg-white">
          <CreatePost
            onPostCreated={handlePostCreated}
            onPostStart={handlePostStart}
            isModal={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
