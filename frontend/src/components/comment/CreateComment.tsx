"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT } from "@/graphql/post";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface CreateCommentProps {
  postId: string;
  onCommentAdded?: () => void;
}

function CreateComment({ postId, onCommentAdded }: CreateCommentProps) {
  const [text, setText] = useState("");
  const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setText("");
      onCommentAdded?.();
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });

  const handleSend = async () => {
    if (!text.trim() || loading) return;

    try {
      await createComment({
        variables: {
          input: {
            postId,
            content: text.trim(),
          },
        },
      });
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return (
    <div className="space-y-2 mt-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Сэтгэгдэл бичих..."
        disabled={loading}
        className="resize-none border-0 border-b border-gray-200 rounded-none focus:ring-0 focus:border-b-[#003365] bg-transparent"
        rows={3}
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!text.trim() || loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Илгээж байна...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Сэтгэгдэл үлдээх
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default CreateComment;
