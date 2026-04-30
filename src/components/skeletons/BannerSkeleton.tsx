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
      <div className="relative flex justify-center flex-col md:flex-row md:justify-normal gap-6 md:gap-8 p-6 md:p-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-secondary/50 backdrop-blur-sm">
        
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 -z-10">
          <div className={`w-full h-full ${isDark ? 'bg-secondary-foreground/10' : 'bg-secondary-foreground/5'} animate-pulse`} />
          <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-black/60 via-black/50' : 'from-black/30 via-black/20'} to-transparent`} />
        </div>

        {/* Album Art Skeleton */}
        <div className="flex-shrink-0 relative">
          <div className={`w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 ${
            isDark ? 'bg-secondary-foreground/15' : 'bg-secondary-foreground/10'
          } animate-pulse`} />
          
              </div>

        {/* Album Info Skeleton */}
        <div className="flex-1 flex flex-col justify-end pt-6 md:pt-0 space-y-5">
          
          {/* Album Type / Year */}
          <div className={`h-4 w-32 ${isDark ? 'bg-secondary-foreground/30' : 'bg-secondary-foreground/20'} rounded animate-pulse`} />

          {/* Title */}
          <div className="space-y-3">
            <div className={`h-12 md:h-14 w-3/4 ${
              isDark ? 'bg-secondary-foreground/20' : 'bg-secondary-foreground/15'
            } rounded-xl animate-pulse`} />
          </div>

          {/* Artist & Song Count */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`h-7 w-48 ${
              isDark ? 'bg-secondary-foreground/20' : 'bg-secondary-foreground/15'
            } rounded animate-pulse`} />
            <div className={`w-1 h-1 ${isDark ? 'bg-secondary-foreground/30' : 'bg-secondary-foreground/20'} rounded-full`} />
            <div className={`h-5 w-24 ${
              isDark ? 'bg-secondary-foreground/20' : 'bg-secondary-foreground/15'
            } rounded animate-pulse`} />
          </div>

          {/* Description */}
          <div className="space-y-2 max-w-2xl">
            <div className={`h-4 w-full ${
              isDark ? 'bg-secondary-foreground/15' : 'bg-secondary-foreground/10'
            } rounded animate-pulse`} />
            <div className={`h-4 w-5/6 ${
              isDark ? 'bg-secondary-foreground/15' : 'bg-secondary-foreground/10'
            } rounded animate-pulse`} />
            <div className={`h-4 w-4/6 ${
              isDark ? 'bg-secondary-foreground/15' : 'bg-secondary-foreground/10'
            } rounded animate-pulse`} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            {/* Play Button */}
            <div className={`h-12 w-36 ${
              isDark ? 'bg-green-500/30' : 'bg-green-500/25'
            } rounded-full animate-pulse`} />
            
            {/* Like Button */}
            <div className={`w-12 h-12 ${
              isDark ? 'bg-secondary-foreground/15' : 'bg-secondary-foreground/10'
            } rounded-full animate-pulse`} />
            
            {/* More Button */}
            <div className={`w-12 h-12 ${
              isDark ? 'bg-secondary-foreground/15' : 'bg-secondary-foreground/10'
            } rounded-full animate-pulse`} />
          </div>
        </div>
      </div>

      {/* Dropdown Menu Skeleton (optional - shown when menu would be open) */}
      {/* <div className="absolute top-20 right-6 w-56 rounded-xl shadow-2xl bg-secondary border border-white/10 z-50 py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full px-5 py-3">
            <div className="h-4 w-32 bg-secondary-foreground/15 rounded animate-pulse" />
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default AlbumBannerSkeleton;