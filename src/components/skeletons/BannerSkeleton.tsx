import { useThemeStore } from "@/stores/useThemeStore";


const AlbumBannerSkeleton = () => {
  const { isDark } = useThemeStore();

  return (
    <div className="relative group mb-8">
      {/* Background Gradient & Blur Effect */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-2xl"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${!isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)'}, transparent)`
        }}
      />

      {/* Main Banner Container */}
      <div className="relative flex justify-center flex-col md:flex-row md:justify-normal gap-6 md:gap-8 p-6 md:p-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900/50">
        
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 -z-10">
          <div className="w-full  h-full bg-zinc-800 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-transparent" />
        </div>

        {/* Album Art Skeleton */}
        <div className="flex-shrink-0 relative">
          <div className="w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 bg-secondary-foreground/20 animate-pulse" />
        </div>

        {/* Album Info Skeleton */}
        <div className="flex-1 flex flex-col justify-end  pt-6 md:pt-0 space-y-6">
          
          {/* Album Type */}
          <div className="h-4 w-40 bg-secondary-foreground/20 rounded animate-pulse" />

          {/* Title */}
          <div className="space-y-3">
            <div className="h-12 md:h-14 w-3/4 bg-secondary-foreground/20 rounded-xl animate-pulse" />
          </div>

          {/* Artist & Song Count */}
          <div className="flex items-center gap-3">
            <div className="h-7 w-48 bg-secondary-foreground/20 rounded animate-pulse" />
            </div>

          {/* Description */}
          <div className="space-y-2 max-w-2xl">
            <div className="h-4 w-full bg-secondary-foreground/20  rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-secondary-foreground/20 rounded animate-pulse" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            {/* Play Button */}
            <div className="h-12 w-40 bg-green-500/30 rounded-full animate-pulse" />

          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumBannerSkeleton;