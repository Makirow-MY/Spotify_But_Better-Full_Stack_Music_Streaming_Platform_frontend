// components/skeletons/SectionGridSkeleton.tsx
import { useThemeStore } from "@/stores/useThemeStore";

type SectionGridSkeletonProps = {
	columns?: 2 | 3 | 4 | 5;
};

const SectionGridSkeleton = ({ columns = 4 }: SectionGridSkeletonProps) => {
	const { isDark } = useThemeStore();

	const getGridCols = () => {
		switch(columns) {
			case 2: return "grid-cols-1 sm:grid-cols-2";
			case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
			case 5: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
			default: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
		}
	};

	// Determine how many skeleton cards to show based on columns
	const getSkeletonCount = () => {
		switch(columns) {
			case 2: return 4;
			case 3: return 6;
			case 5: return 10;
			default: return 8;
		}
	};

	return (
		<div className='mb-6 group/section'>
			{/* Section Header Skeleton */}
			<div className='flex items-center justify-between mb-5 px-2'>
				<div className="flex items-center gap-3">
					<div>
						<div className="h-8 w-52 bg-secondary-foreground/10 rounded animate-pulse" />
						<div className="h-4 w-32 bg-secondary-foreground/10 rounded animate-pulse mt-1 hidden sm:block" />
					</div>
				</div>
				
			</div>

			{/* Song Grid Skeleton */}
			<div className={`grid ${getGridCols()} gap-5`}>
				{[...Array(getSkeletonCount())].map((_, idx) => (
					<div
						key={idx}
						className={`
							group relative 
							${isDark ? 'bg-zinc-900/40' : 'bg-white'} 
							rounded-lg p-4 
							border ${isDark ? 'border-zinc-800/50' : 'border-gray-200/50'}
							shadow-sm
						`}
					>
						{/* Album Art Skeleton */}
						<div className='relative mb-4'>
							<div className={`
								aspect-square rounded-md shadow-lg overflow-hidden
								bg-secondary-foreground/10
								animate-pulse
							`}>
								<div className={`w-full h-full ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
							</div>
							
							{/* Overlay Gradient Placeholder */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-md" />
							
							{/* Play Button Skeleton */}
							<div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm animate-pulse" />
							</div>
							
							{/* Duration Badge Skeleton */}
							<div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
								<div className="h-3 w-8 bg-secondary-foreground/20 rounded animate-pulse" />
							</div>
						</div>

						{/* Song Info Skeleton */}
						<div className="space-y-1">
							<div className="flex items-start justify-between gap-2">
								<div className="flex-1 min-w-0 space-y-2">
									{/* Title Skeleton */}
									<div className="h-4 w-32 bg-secondary-foreground/10 rounded animate-pulse" />
									{/* Artist Skeleton */}
									<div className="h-3 w-24 bg-secondary-foreground/10 rounded animate-pulse" />
								</div>
								
								{/* Context Menu Button Skeleton */}
								<div className="opacity-0 group-hover:opacity-100 transition-opacity">
									<div className="h-6 w-6 rounded-full bg-secondary-foreground/10 animate-pulse" />
								</div>
							</div>

							{/* Action Buttons Row Skeleton */}
							<div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="h-6 w-6 rounded-full bg-secondary-foreground/10 animate-pulse" />
								<div className="h-6 w-6 rounded-full bg-secondary-foreground/10 animate-pulse" />
							</div>
						</div>

						{/* Hover Border Effect Placeholder */}
						<div className="absolute inset-0 rounded-lg border border-transparent" />
					</div>
				))}
			</div>

			{/* View All Button Skeleton - Mobile */}
			<div className="mt-6 text-center sm:hidden">
				<div className="h-9 w-32 bg-secondary-foreground/10 rounded-full animate-pulse mx-auto" />
			</div>
		</div>
	);
};

export default SectionGridSkeleton;