"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Upload, X, Plus, Star, StarOff, Image as ImageIcon } from "lucide-react";
import { slugify } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(2, "Title required"),
  slug: z.string().min(2, "Slug required"),
  description: z.string().min(10, "Description required"),
  longDesc: z.string().optional(),
  category: z.string().min(1, "Category required"),
  date: z.string().min(4, "Date required"),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDesc: string;
  category: string;
  date: string;
  projectUrl: string;
  githubUrl: string;
  image: string;
  featured: boolean;
  tags: string;
}

interface Props {
  project?: Project;
  isEdit?: boolean;
}

const CATEGORIES = [
  "Full Stack",
  "Frontend",
  "Backend",
  "Mobile",
  "UI/UX",
  "Web App",
  "API",
  "DevOps",
  "Other",
];

export default function ProjectForm({ project, isEdit }: Props) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(project?.image || "");
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const defaultTags = (() => {
    try {
      return project?.tags ? (JSON.parse(project.tags) as string[]) : [];
    } catch {
      return [];
    }
  })();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      description: project?.description || "",
      longDesc: project?.longDesc || "",
      category: project?.category || "",
      date: project?.date || new Date().toISOString().slice(0, 7),
      projectUrl: project?.projectUrl || "",
      githubUrl: project?.githubUrl || "",
      featured: project?.featured || false,
      tags: defaultTags,
    },
  });

  const tags = watch("tags") || [];
  const featured = watch("featured");

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const data = await res.json() as { url: string };
          setImageUrl(data.url);
          toast.success("Image uploaded!");
        } else {
          toast.error("Upload failed");
        }
      } catch {
        toast.error("Upload error");
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setValue("tags", [...tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setValue("tags", tags.filter((t) => t !== tag));
  };

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, image: imageUrl };

    try {
      const url = isEdit ? `/api/projects/${project!.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEdit ? "Project updated!" : "Project created!");
        router.push("/admin/projects");
        router.refresh();
      } else {
        const err = await res.json() as { error?: string };
        toast.error(err.error || "Failed to save");
      }
    } catch {
      toast.error("Error saving project");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              {...register("title", {
                onChange: (e) => {
                  if (!isEdit) {
                    setValue("slug", slugify(e.target.value));
                  }
                },
              })}
              placeholder="My Awesome Project"
              className="form-input"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              URL Slug <span className="text-red-400">*</span>
            </label>
            <input
              {...register("slug")}
              placeholder="my-awesome-project"
              className="form-input font-mono text-sm"
            />
            {errors.slug && (
              <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Short Description <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="A brief summary of the project..."
              rows={2}
              className="form-input resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Full Description
            </label>
            <textarea
              {...register("longDesc")}
              placeholder="Detailed description shown on the project detail page..."
              rows={6}
              className="form-input resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Technologies / Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="React, Node.js, etc."
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Project Image
            </label>
            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-indigo-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Project"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  {uploading ? (
                    <>
                      <span className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
                      <span className="text-xs">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-indigo-500/50" />
                      <span className="text-sm">
                        Drop image or{" "}
                        <span className="text-indigo-400">browse</span>
                      </span>
                      <span className="text-xs">PNG, JPG, WebP up to 5MB</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Category & Date */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <select {...register("category")} className="form-input">
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Project Date <span className="text-red-400">*</span>
            </label>
            <input
              {...register("date")}
              type="month"
              className="form-input"
            />
          </div>

          {/* URLs */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Live URL
            </label>
            <input
              {...register("projectUrl")}
              placeholder="https://example.com"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              GitHub URL
            </label>
            <input
              {...register("githubUrl")}
              placeholder="https://github.com/..."
              className="form-input"
            />
          </div>

          {/* Featured toggle */}
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  field.value
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "glass text-slate-400 hover:text-slate-200"
                }`}
              >
                {field.value ? (
                  <Star size={16} className="fill-current" />
                ) : (
                  <StarOff size={16} />
                )}
                <span className="text-sm font-medium">
                  {field.value ? "Featured Project" : "Mark as Featured"}
                </span>
              </button>
            )}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4 border-t border-indigo-500/10">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            isEdit ? "Update Project" : "Create Project"
          )}
        </motion.button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl glass text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
