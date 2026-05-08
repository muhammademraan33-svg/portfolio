"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";

interface AboutData {
  id?: string;
  name?: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  heroHeading?: string;
  heroSub?: string;
  avatarUrl?: string;
}

interface Props {
  initialData?: AboutData | null;
}

export default function AdminAboutForm({ initialData }: Props) {
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || "");
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      title: initialData?.title || "",
      bio: initialData?.bio || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      location: initialData?.location || "",
      resumeUrl: initialData?.resumeUrl || "",
      heroHeading: initialData?.heroHeading || "",
      heroSub: initialData?.heroSub || "",
    },
  });

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json() as { url: string };
        setAvatarUrl(data.url);
        toast.success("Avatar uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const onSubmit = async (data: Record<string, string>) => {
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, avatarUrl }),
      });
      if (res.ok) {
        toast.success("About info updated!");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Error saving");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-semibold text-slate-100 mb-4">Profile Photo</h2>
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold gradient-text opacity-40">A</span>
            )}
          </div>
          <div className="flex-1">
            {avatarUrl ? (
              <button
                type="button"
                onClick={() => setAvatarUrl("")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
              >
                <X size={14} />
                Remove Photo
              </button>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-indigo-500/20 hover:border-indigo-500/40"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  {uploading ? (
                    <span className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload size={20} className="text-indigo-500/50" />
                      <span className="text-sm">Drop or click to upload</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-semibold text-slate-100 mb-4">Basic Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
            <input {...register("name")} placeholder="Alex Johnson" className="form-input" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Professional Title</label>
            <input {...register("title")} placeholder="Full Stack Developer" className="form-input" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <input {...register("email")} type="email" placeholder="you@example.com" className="form-input" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Phone</label>
            <input {...register("phone")} placeholder="+1 (555) 000-0000" className="form-input" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Location</label>
            <input {...register("location")} placeholder="San Francisco, CA" className="form-input" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Resume URL</label>
            <input {...register("resumeUrl")} placeholder="https://..." className="form-input" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm text-slate-400 mb-1.5">Bio</label>
          <textarea
            {...register("bio")}
            rows={4}
            placeholder="Write a short bio about yourself..."
            className="form-input resize-none"
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-semibold text-slate-100 mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Hero Heading</label>
            <input
              {...register("heroHeading")}
              placeholder="Building Digital Experiences That Matter"
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Typed Subtitles (separate with | )
            </label>
            <input
              {...register("heroSub")}
              placeholder="Full Stack Developer|UI/UX Designer|Problem Solver"
              className="form-input"
            />
            <p className="text-slate-500 text-xs mt-1">
              These will rotate as a typing animation in the hero section.
            </p>
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-70 flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </motion.button>
    </form>
  );
}
