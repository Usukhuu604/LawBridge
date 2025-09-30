"use client";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "@/graphql/post";
import { useGetAdminSpecializationsQuery } from "@/generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import {
  Loader2,
  PenTool,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Rocket,
  ImagePlus,
  FileVideo,
  Volume2,
  XCircle,
  Scale,
} from "lucide-react";

interface CreatePostProps {
  onPostCreated?: () => void;
  onPostStart?: () => void;
  isModal?: boolean;
}

const CreatePost = ({ onPostCreated, onPostStart, isModal = false }: CreatePostProps) => {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { data: specData } = useGetAdminSpecializationsQuery();

  // Konami Code sequence: ↑↑↓↓←→←→BA
  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  // Easter egg: Konami code detection
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const newSequence = [...konamiCode, e.code].slice(-10);
      setKonamiCode(newSequence);

      if (JSON.stringify(newSequence.slice(-10)) === JSON.stringify(konamiSequence)) {
        setEasterEggActive(true);
        setSuccess("🎉 Konami Code activated! Developer mode enabled! 🚀");
        setTimeout(() => setSuccess(null), 5000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiCode]);

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      console.log("✅ Post created successfully:", data);
      const successMsg = easterEggActive ? "🚀 Post created with developer magic! ✨" : "Нийтлэл амжилттай үүслээ!";
      setSuccess(successMsg);

      setTitle("");
      setPostContent("");
      setSpecialization([]);
      setImage(null);
      setVideo(null);
      setAudio(null);
      setTimeout(() => setSuccess(null), 3000);

      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (audioInputRef.current) audioInputRef.current.value = "";

      // Call the callback if provided
      if (onPostCreated) {
        onPostCreated();
      }
    },
    // Refetch queries to show new data immediately
    refetchQueries: [
      "GetLawyerPosts", // Refetch lawyer posts
      "GetPosts", // Refetch all posts
    ],
    onError: (error) => {
      console.error("❌ Post creation failed:", error);
      console.error("❌ Error details:", error.message);
      console.error("❌ Error graphQLErrors:", error.graphQLErrors);
      console.error("❌ Error networkError:", error.networkError);
      setError(error.message || "Нийтлэл үүсгэхэд алдаа гарлаа.");
      setTimeout(() => setError(null), 3000);
    },
  });

  const uploadToCloudflare = async (file: File) => {
    console.log("📤 Starting file upload...");
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setError(null);
    console.log("🔄 Uploading state set to true");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("📤 Upload response received:", data);
      setUploading(false);
      console.log("✅ Uploading state set to false");

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (data?.url) {
        console.log("File uploaded successfully:", data);
        return data.url;
      }

      throw new Error("No URL returned from upload");
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Файл илгээхэд алдаа гарлаа.");
      setUploading(false);
      console.log("❌ Uploading state set to false (error)");
      return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "audio") => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`📁 File selected for ${type}:`, file);

    // Validate file type
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const allowedAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];

    const allAllowedTypes = [...allowedImageTypes, ...allowedVideoTypes, ...allowedAudioTypes];

    if (!allAllowedTypes.includes(file.type)) {
      setError("Файлын төрөл дэмжигдэхгүй байна. Зураг, видео, эсвэл аудио файл оруулна уу.");
      return;
    }

    // Validate file size (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError("Файл хэт том байна. Хамгийн ихдээ 50MB байх ёстой.");
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    if (type === "image") setImage(previewUrl);
    else if (type === "video") setVideo(previewUrl);
    else if (type === "audio") setAudio(previewUrl);

    console.log(`🖼️ Preview set for ${type}:`, previewUrl);

    // Clear the input so the same file can be selected again
    e.target.value = "";
  };

  const removeFile = (type: "image" | "video" | "audio") => {
    if (type === "image") {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
      setImage(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } else if (type === "video") {
      if (video && video.startsWith("blob:")) {
        URL.revokeObjectURL(video);
      }
      setVideo(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
    } else if (type === "audio") {
      if (audio && audio.startsWith("blob:")) {
        URL.revokeObjectURL(audio);
      }
      setAudio(null);
      if (audioInputRef.current) audioInputRef.current.value = "";
    }
  };

  // Easter egg: Triple click detector
  const handleTitleClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 500) {
      setClickCount((prev) => prev + 1);
      if (clickCount >= 2) {
        setTitle("☕ Coding with coffee since 1995 ☕");
        setPostContent(
          "// TODO: Write amazing code\n// FIXME: Remove this easter egg before production\n// NOTE: If you're reading this, you found our secret! 🎯\n\nconsole.log('Hello, fellow developer! 👋');\n\n// Fun fact: This component has been clicked with love ❤️"
        );
        setClickCount(0);
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
  };

  const handleSubmit = async () => {
    console.log("🚀 Submit button clicked!");

    if (!title.trim() || !postContent.trim()) {
      console.log("❌ Validation failed: Missing title or content");
      setError("Гарчиг болон агуулгыг бөглөнө үү.");
      setTimeout(() => setError(null), 1500);
      return;
    }

    console.log("✅ Validation passed, proceeding with post creation");
    console.log("🔍 Current URL path:", window.location.pathname);
    console.log("🔍 Lawyer ID from URL:", window.location.pathname.split("/").pop());
    console.log("👤 User info:", {
      id: user?.id,
      role: user?.publicMetadata?.role,
      firstName: user?.firstName,
      lastName: user?.lastName,
    });

    // Call onPostStart if provided
    if (onPostStart) {
      console.log("📞 Calling onPostStart callback");
      onPostStart();
    }

    try {
      let finalImageUrl = null;
      let finalVideoUrl = null;
      let finalAudioUrl = null;

      // Step 1: Upload files to Cloudflare if they exist
      if (image && image.startsWith("blob:")) {
        console.log("📤 Uploading image to Cloudflare...");
        const file = await blobToFile(image, "image.jpg");
        finalImageUrl = await uploadToCloudflare(file);
        if (!finalImageUrl) {
          setError("Зураг илгээхэд алдаа гарлаа.");
          return;
        }
        console.log("✅ Image uploaded:", finalImageUrl);
      } else if (image) {
        finalImageUrl = image; // Already a Cloudflare URL
      }

      if (video && video.startsWith("blob:")) {
        console.log("📤 Uploading video to Cloudflare...");
        const file = await blobToFile(video, "video.mp4");
        finalVideoUrl = await uploadToCloudflare(file);
        if (!finalVideoUrl) {
          setError("Видео илгээхэд алдаа гарлаа.");
          return;
        }
        console.log("✅ Video uploaded:", finalVideoUrl);
      } else if (video) {
        finalVideoUrl = video; // Already a Cloudflare URL
      }

      if (audio && audio.startsWith("blob:")) {
        console.log("📤 Uploading audio to Cloudflare...");
        const file = await blobToFile(audio, "audio.mp3");
        finalAudioUrl = await uploadToCloudflare(file);
        if (!finalAudioUrl) {
          setError("Аудио илгээхэд алдаа гарлаа.");
          return;
        }
        console.log("✅ Audio uploaded:", finalAudioUrl);
      } else if (audio) {
        finalAudioUrl = audio; // Already a Cloudflare URL
      }

      // Step 2: Create post with Cloudflare URLs
      const postData = {
        title,
        specialization,
        content: {
          text: postContent,
          image: finalImageUrl || undefined,
          video: finalVideoUrl || undefined,
          audio: finalAudioUrl || undefined,
        },
        lawyerId: user?.id || "default-lawyer-id", // Include lawyerId in the input
      };

      console.log("📝 Creating post with data:", postData);

      createPost({
        variables: {
          input: postData,
        },
      });
      console.log("✅ createPost mutation called successfully");
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
      setError("Нийтлэл үүсгэхэд алдаа гарлаа.");
    }
  };

  // Helper function to convert blob URL to File
  const blobToFile = async (blobUrl: string, filename: string): Promise<File> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const getRandomEmoji = () => {
    const emojis = ["🚀", "⚡", "🔥", "✨", "🎯", "💻", "🎉", "🌟"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const content = (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800 rounded-lg text-sm sm:text-base">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800 rounded-lg text-sm sm:text-base">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Title Input */}
      <div className="space-y-2 sm:space-y-3">
        <Label htmlFor="title" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
          Гарчиг
        </Label>
        <Input
          id="title"
          placeholder="Нийтлэлийн гарчиг оруулна уу..."
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-[#003365] focus:ring-1 focus:ring-[#003365] bg-white transition-all duration-200 text-sm sm:text-base"
        />
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">{title.length > 60 && "📝 Урт гарчиг байна"}</div>
          <div className="text-xs text-gray-400">{title.length}/80</div>
        </div>
      </div>

      {/* Content Textarea */}
      <div className="space-y-2 sm:space-y-3">
        <Label htmlFor="content" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
          Агуулга
        </Label>
        <Textarea
          id="content"
          placeholder={easterEggActive ? "// Write your epic content here 🚀" : "Нийтлэлийн агуулга бичнэ үү..."}
          rows={4}
          value={postContent}
          maxLength={3000}
          onChange={(e) => setPostContent(e.target.value)}
          className={`border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-[#003365] focus:ring-1 focus:ring-[#003365] bg-white transition-all duration-200 resize-none text-sm sm:text-base ${
            easterEggActive ? "font-mono" : ""
          }`}
        />
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {postContent.length > 2500 && (
              <>
                <Zap className="h-3 w-3" />
                Бараг дууслаа!
              </>
            )}
          </div>
          <div className="text-xs text-gray-400">{postContent.length}/3000</div>
        </div>
      </div>

      {/* Specializations */}
      <div className="space-y-3 sm:space-y-4">
        <Label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Scale className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Хуулийн салбар
        </Label>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {specData?.getAdminSpecializations?.map((spec: { id: string; categoryName: string }) => (
            <button
              key={spec.id}
              type="button"
              onClick={() =>
                setSpecialization((prev) => (prev.includes(spec.id) ? prev.filter((id) => id !== spec.id) : [...prev, spec.id]))
              }
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border ${
                specialization.includes(spec.id)
                  ? "bg-[#003365] text-white border-[#003365] shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#003365] hover:text-[#003365] hover:bg-gray-50"
              }`}
            >
              <span className="truncate max-w-[120px] sm:max-w-none">{spec.categoryName}</span>
              {specialization.includes(spec.id) && easterEggActive && <span className="ml-1">{getRandomEmoji()}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-3 sm:space-y-4">
        <Label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
          <ImagePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Медиа файл
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Image Upload */}
          <div
            className={`border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-200 cursor-pointer ${
              easterEggActive
                ? "border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                : "border-gray-200 hover:border-[#003365] hover:bg-gray-50"
            } flex flex-col items-center justify-center relative min-h-[100px] sm:min-h-[120px] group`}
          >
            <Label
              onClick={() => imageInputRef.current?.click()}
              className="cursor-pointer flex flex-col gap-2 sm:gap-3 items-center w-full"
            >
              <ImagePlus
                className={`h-6 w-6 sm:h-8 sm:w-8 transition-colors ${
                  easterEggActive ? "text-purple-500" : "text-gray-400 group-hover:text-[#003365]"
                }`}
              />
              <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Зураг нэмэх</span>
            </Label>
            <Input type="file" accept="image/*" hidden ref={imageInputRef} onChange={(e) => handleFileUpload(e, "image")} />
            {image && (
              <div className="relative mt-3">
                <img src={image} alt="preview" className="max-h-20 rounded-lg shadow-sm" />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300"
                  onClick={() => removeFile("image")}
                >
                  <XCircle className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div
            className={`border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-200 cursor-pointer ${
              easterEggActive
                ? "border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                : "border-gray-200 hover:border-[#003365] hover:bg-gray-50"
            } flex flex-col items-center justify-center relative min-h-[100px] sm:min-h-[120px] group`}
          >
            <Label
              onClick={() => videoInputRef.current?.click()}
              className="cursor-pointer flex flex-col gap-2 sm:gap-3 items-center w-full"
            >
              <FileVideo
                className={`h-6 w-6 sm:h-8 sm:w-8 transition-colors ${
                  easterEggActive ? "text-purple-500" : "text-gray-400 group-hover:text-[#003365]"
                }`}
              />
              <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Видео нэмэх</span>
            </Label>
            <Input type="file" accept="video/*" hidden ref={videoInputRef} onChange={(e) => handleFileUpload(e, "video")} />
            {video && (
              <div className="relative mt-3">
                <video src={video} controls className="max-h-20 rounded-lg shadow-sm" />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300"
                  onClick={() => removeFile("video")}
                >
                  <XCircle className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            )}
          </div>

          {/* Audio Upload */}
          <div
            className={`border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-200 cursor-pointer ${
              easterEggActive
                ? "border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                : "border-gray-200 hover:border-[#003365] hover:bg-gray-50"
            } flex flex-col items-center justify-center relative min-h-[100px] sm:min-h-[120px] group`}
          >
            <Label
              onClick={() => audioInputRef.current?.click()}
              className="cursor-pointer flex flex-col gap-2 sm:gap-3 items-center w-full"
            >
              <Volume2
                className={`h-6 w-6 sm:h-8 sm:w-8 transition-colors ${
                  easterEggActive ? "text-purple-500" : "text-gray-400 group-hover:text-[#003365]"
                }`}
              />
              <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Аудио нэмэх</span>
            </Label>
            <Input type="file" accept="audio/*" hidden ref={audioInputRef} onChange={(e) => handleFileUpload(e, "audio")} />
            {audio && (
              <div className="relative mt-3 w-full">
                <audio src={audio} controls className="w-full max-w-[100px] rounded-lg" />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300"
                  onClick={() => removeFile("audio")}
                >
                  <XCircle className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-3 sm:pt-4">
        <Button
          onClick={() => {
            console.log("🔘 Button clicked!");
            console.log("🔍 Button state:", {
              loading,
              uploading,
              title: title.trim(),
              postContent: postContent.trim(),
            });
            console.log("🔍 Button disabled:", loading || uploading || !title.trim() || !postContent.trim());
            handleSubmit();
          }}
          disabled={loading || uploading || !title.trim() || !postContent.trim()}
          className={`w-full h-10 sm:h-12 text-sm sm:text-base font-semibold transition-all duration-200 rounded-lg ${
            easterEggActive
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
              : "bg-[#003365] hover:bg-[#002a52] text-white shadow-sm hover:shadow-md"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading || uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              <span className="text-xs sm:text-sm">
                {easterEggActive ? "Deploying awesome content..." : uploading ? "Файл илгээж байна..." : "Илгээж байна..."}
              </span>
            </>
          ) : (
            <>
              {easterEggActive ? <Rocket className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> : <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />}
              <span className="text-xs sm:text-sm">{easterEggActive ? "Launch Post 🚀" : "Нийтлэл нийтлэх"}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <Card
        className={`border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm transition-all duration-300 ${
          easterEggActive ? "ring-2 ring-purple-200 shadow-purple-100" : "hover:shadow-lg"
        }`}
      >
        <CardHeader className="pb-4 sm:pb-6 border-b border-gray-100">
          <CardTitle
            className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
            onClick={handleTitleClick}
          >
            <PenTool className="h-5 w-5 sm:h-6 sm:w-6 text-[#003365]" />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">Шинэ нийтлэл үүсгэх</span>
            {easterEggActive && <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 animate-pulse" />}
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            {easterEggActive ? "🎮 Developer mode activated! " : ""}
            Хэрэглэгчдийн хуулийн мэдлэг олгох зөвлөгөө нийтлэл бичнэ үү
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8">{content}</CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
