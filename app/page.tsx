"use client";

import { useState } from "react";
import { ChefHat, Star, ThumbsUp, Sparkles, Coffee, Drama, Banknote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Rating options based on the user's uploaded image
const RATING_TAGS = [
  { id: "great-food", label: "Great Food", icon: ChefHat },
  { id: "awesome-service", label: "Awesome Service", icon: Sparkles },
  { id: "cool-vibe", label: "Cool Vibe", icon: Drama },
  { id: "good-value", label: "Good Value", icon: Banknote },
];

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    area: "",
    feedback: "",
  });
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[6-9][0-9]{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rating,
          tags: selectedTags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setFormData({ name: "", phoneNumber: "", area: "", feedback: "" });
        setRating(0);
        setSelectedTags([]);
        setTimeout(() => setShowSuccess(false), 4000);
      } else {
        setErrors({ general: data.error || "Failed. Try again." });
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Ambience - Light Texture for pop */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-multiply pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-red-50 z-0 pointer-events-none" />

      {/* Success Notification - Light Mode */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white border-2 border-accent p-8 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                <ThumbsUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-black">Entry Recorded</h3>
              <p className="text-zinc-600">Thank you for visiting Bella Ciao!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg z-10 flex flex-col gap-6 mt-4 sm:mt-10 pb-10"
      >
        {/* Header Section */}
        <div className="text-center space-y-1">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase text-black drop-shadow-sm italic">
            BELLA CIAO
          </h1>
          <p className="text-accent text-lg sm:text-xl font-bold tracking-[0.2em] uppercase">
            Data Collection
          </p>
        </div>

        {/* Rating Section */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-black tracking-wide">How was it?</h2>

            {/* Stars */}
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                >
                  <Star
                    fill={rating >= star ? "#E50914" : "none"}
                    className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-200 ${rating >= star ? "text-accent stroke-none" : "text-zinc-300 stroke-[1.5px]"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tags Grid - Light Mode */}
          <div className="grid grid-cols-2 gap-3">
            {RATING_TAGS.map((tag) => {
              const Icon = tag.icon;
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl border transition-all duration-300 h-24 ${isSelected
                      ? "bg-accent text-white border-accent shadow-md scale-[1.02]"
                      : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100"
                    }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium text-xs sm:text-sm text-center leading-tight">{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* Name */}
            <div className="group relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="YOUR NAME"
                className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-4 text-lg text-black placeholder-zinc-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 font-semibold uppercase tracking-wide"
              />
              {errors.name && <p className="text-accent text-xs mt-1 absolute right-2 top-4 font-bold">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="group relative">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={10}
                placeholder="PHONE NUMBER"
                className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-4 text-lg text-black placeholder-zinc-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 font-semibold tracking-wide"
              />
              {errors.phoneNumber && <p className="text-accent text-xs mt-1 absolute right-2 top-4 font-bold">{errors.phoneNumber}</p>}
            </div>

            {/* Area */}
            <div className="group relative">
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="AREA (OPTIONAL)"
                className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-4 text-lg text-black placeholder-zinc-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 font-semibold uppercase tracking-wide"
              />
            </div>

            {/* Feedback Box */}
            <div className="group relative pt-4">
              <label className="block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 pl-1">
                Feedback (Optional)
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Tell us what more we can offer..."
                rows={3}
                className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-base text-black placeholder-zinc-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300"
              />
            </div>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-center font-bold">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-white py-4 rounded-xl font-black text-xl uppercase tracking-[0.15em] hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? "PROCESSING..." : "SUBMIT"}
          </button>
        </form>

        <div className="text-center mt-12 space-y-2 opacity-60">
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">
            All rights reserved to Bella Ciao Restaurant
          </p>
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.1em] font-bold">
            Powered by Margros
          </p>
        </div>
      </motion.div>
    </div>
  );
}
