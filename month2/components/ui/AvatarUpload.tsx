"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, User as UserIcon } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  name: string;
  onAvatarChange: (url: string) => void;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
}

export default function AvatarUpload({
  currentAvatar,
  name,
  onAvatarChange,
  size = "md",
  editable = true,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Ошибка загрузки");
      }

      const data = await res.json();
      onAvatarChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить фото");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const initial = (name || "U").trim().charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div
          className={`${sizeClasses[size]} rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold shadow-lg border-2 border-slate-700/80 shrink-0 relative`}
        >
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initial}</span>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            </div>
          )}
        </div>

        {editable && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Загрузить аватарку"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md border border-slate-800 transition-transform active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>

      {error && <span className="text-[11px] text-rose-400 mt-1.5">{error}</span>}
    </div>
  );
}
