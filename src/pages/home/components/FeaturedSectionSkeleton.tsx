// components/skeletons/FeaturedSectionSkeleton.tsx
import { useThemeStore } from "@/stores/useThemeStore";

const FeaturedSectionSkeleton = () => {
	const { isDark } = useThemeStore();

	return (
		<div className="mb-12">
			{/* Section Header Skeleton */}
			<div className="flex items-center justify-between mb-5 px-2">
				<div className="flex items-center gap-3">
					<div>
						<div className="h-8 w-52 bg-secondary-foreground/10 rounded animate-pulse" />
						<div className="h-4 w-32 bg-secondary-foreground/10 rounded animate-pulse mt-1 hidden sm:block" />
					</div>
				</div>
				
				{/* Navigation Arrows Skeleton */}
				<div className="hidden sm:flex gap-2">
					<div className="h-9 w-9 rounded-full bg-secondary-foreground/10 animate-pulse" />
					<div className="h-9 w-9 rounded-full bg-secondary-foreground/10 animate-pulse" />
				</div>
			</div>

			{/* Horizontal Scroll Container Skeleton */}
			<div className="flex gap-4 overflow-x-auto pb-4">
				{[...Array(5)].map((_, idx) => (
					<div
						key={idx}
						className={`
							flex-shrink-0 w-64 sm:w-72 
							${isDark ? 'bg-gradient-to-b from-zinc-900 to-zinc-900/50' : 'bg-white'} 
							rounded-xl overflow-hidden
							border ${isDark ? 'border-zinc-800' : 'border-gray-200'}
							shadow-lg
						`}
					>
						<div className="relative">
							{/* Rank Badge Skeleton */}
							<div className="absolute top-2 left-2 z-10">
								<div className="bg-black/70 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
									<div className="h-4 w-4 bg-secondary-foreground/20 rounded animate-pulse" />
								</div>
							</div>

							{/* Album Art Skeleton */}
							<div className="relative aspect-square overflow-hidden animate-pulse">
								<div className={`w-full h-full ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
								
								{/* Gradient Overlay Skeleton */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
								
								{/* Play Button Skeleton */}
								<div className="absolute bottom-4 right-4">
									<div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm animate-pulse" />
								</div>
							</div>

							{/* Song Info Skeleton */}
							<div className="p-4 space-y-2">
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1 min-w-0 space-y-2">
										<div className="h-5 w-32 bg-secondary-foreground/10 rounded animate-pulse" />
										<div className="h-4 w-24 bg-secondary-foreground/10 rounded animate-pulse" />
									</div>
								</div>

								{/* Stats and Actions Skeleton */}
								<div className="flex items-center justify-between pt-1">
									<div className="flex items-center gap-1">
										<div className="h-3 w-3 bg-secondary-foreground/10 rounded animate-pulse" />
										<div className="h-3 w-10 bg-secondary-foreground/10 rounded animate-pulse" />
									</div>
									
									<div className="flex items-center gap-1">
										<div className="h-7 w-7 rounded-full bg-secondary-foreground/10 animate-pulse" />
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FeaturedSectionSkeleton;