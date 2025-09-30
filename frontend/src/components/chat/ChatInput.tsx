import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  X,
  Upload,
  File,
  Image,
  Video,
  Music,
} from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSendFile: (file: File, fileUrl: string) => void;
  disabled?: boolean;
  isSending?: boolean;
  onTyping?: (typing: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = React.memo(
  ({
    onSendMessage,
    onSendFile,
    disabled = false,
    isSending = false,
    onTyping,
  }) => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { uploadFile, uploadState, resetUploadState } = useFileUpload();

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || disabled || isSending) {
        return;
      }

      onSendMessage(message.trim());
      setMessage("");

      // Stop typing indicator
      if (onTyping) {
        onTyping(false);
        setIsTyping(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setMessage(value);

      // Handle typing indicator
      if (onTyping) {
        if (value.trim() && !isTyping) {
          onTyping(true);
          setIsTyping(true);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
          setIsTyping(false);
        }, 1000);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);

        // Create preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFilePreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setFilePreview(null);
        }
      }
      e.target.value = ""; // Reset input
    };

    const handleFileIconClick = () => {
      fileInputRef.current?.click();
    };

    const handleRemoveFile = () => {
      setSelectedFile(null);
      setFilePreview(null);
      resetUploadState();
    };

    const handleSendFile = async () => {
      if (!selectedFile || !onSendFile) return;

      try {
        const fileUrl = await uploadFile(selectedFile);
        onSendFile(selectedFile, fileUrl);
        handleRemoveFile();
      } catch (error) {
        console.error("File upload failed:", error);
      }
    };

    const getFileIcon = (file: File) => {
      if (file.type.startsWith("image/")) return <Image className="w-4 h-4" />;
      if (file.type.startsWith("video/")) return <Video className="w-4 h-4" />;
      if (file.type.startsWith("audio/")) return <Music className="w-4 h-4" />;
      return <File className="w-4 h-4" />;
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Cleanup typing timeout
    useEffect(() => {
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, []);

    return (
      <div className="bg-white border-t border-gray-200 shadow-lg">
        {/* File Preview */}
        {selectedFile && (
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-custom/10 rounded-lg flex items-center justify-center">
                    {getFileIcon(selectedFile)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {uploadState.isUploading && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-custom border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-500">
                      {uploadState.progress}%
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {uploadState.error && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                {uploadState.error}
              </div>
            )}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 md:gap-4 p-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleFileSelected}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />
          <button
            type="button"
            onClick={handleFileIconClick}
            title="Attach file"
            className="p-3 rounded-full text-primary-custom hover:bg-primary-custom/10 transition-all duration-200 hover:scale-110"
            disabled={isSending || disabled}
          >
            <Paperclip size={20} className="text-primary-custom" />
          </button>
          <input
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-full border-2 border-gray-200 bg-gray-50 px-6 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-custom focus:border-primary-custom transition-all duration-200 placeholder:text-gray-400"
            placeholder="Type a message..."
            disabled={isSending || disabled}
          />
          {selectedFile ? (
            <button
              type="button"
              onClick={handleSendFile}
              disabled={uploadState.isUploading || isSending || disabled}
              className="p-3 rounded-full text-white transition-all duration-200 shadow-md hover:shadow-lg bg-primary-custom hover:bg-primary-custom hover:scale-110 disabled:opacity-50 disabled:bg-gray-400 disabled:hover:scale-100"
            >
              <Upload size={20} className="text-white" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!message.trim() || isSending || disabled}
              className="p-3 rounded-full text-white transition-all duration-200 shadow-md hover:shadow-lg bg-primary-custom hover:bg-primary-custom hover:scale-110 disabled:opacity-50 disabled:bg-gray-400 disabled:hover:scale-100"
            >
              <Send size={20} className="text-white" />
            </button>
          )}
        </form>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
