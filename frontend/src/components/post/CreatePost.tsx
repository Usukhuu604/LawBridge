"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type PostType = {
  id: number;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  comments: string[];
  createdAt: string;
};

export default function CreatePost({ onCreate }: { onCreate: (post: PostType) => void }) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "">("");

  const handleSubmit = () => {
    if (!content.trim()) return;

    const newPost: PostType = {
      id: Date.now(),
      content,
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaType || undefined,
      comments: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onCreate(newPost);
    setContent("");
    setMediaUrl("");
    setMediaType("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Нийтлэл бичих</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Текст</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Юу бичих вэ?" />
        </div>
        <div>
          <Label>Зураг эсвэл Видео линк</Label>
          <Input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <Label>Медиа төрөл</Label>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as "image" | "video" | "")}
            className="w-full border rounded-md p-2 text-sm"
          >
            <option value="">Сонгох</option>
            <option value="image">Зураг</option>
            <option value="video">Видео</option>
          </select>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSubmit}>Нийтлэх</Button>
      </CardFooter>
    </Card>
  );
}
