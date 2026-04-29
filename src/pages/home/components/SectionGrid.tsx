// components/SectionGrid.tsx
import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { useThemeStore } from "@/stores/useThemeStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { MoreHorizontal, Clock, Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type SectionGridProps = {
	title: string;
	songs: Song[];
	isLoading: boolean;
	showAllLink?: boolean;
	columns?: 2 | 3 | 4 | 5;
};

const SectionGrid = ({ 
	songs, 
	title, 
	isLoading, 
	showAllLink = true,
	columns = 4 
}: SectionGridProps) => {
	const { isDark } = useThemeStore();
	const { currentSong, isPlaying } = usePlayerStore();
	const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());

	if (isLoading) return <SectionGridSkeleton />;

	const getGridCols = () => {
		switch(columns) {
			case 2: return "grid-cols-1 sm:grid-cols-2";
			case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
			case 5: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
			default: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
		}
	};

	return (
		<div className='mb-12 group/section'>
			{/* Section Header */}
			<div className='flex items-center justify-between mb-5 px-2'>
				<div>
					<h2 className='text-2xl sm:text-3xl font-bold tracking-tight hover:underline cursor-pointer transition'>
						{title}
					</h2>
					<p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'} mt-1 hidden sm:block`}>
						{songs.length} songs • Updated weekly
					</p>
				</div>
				{showAllLink && (
					<Button 
						variant='ghost' 
						className='text-sm text-zinc-400 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 transition'
					>
						Show all
						<svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</Button>
				)}
			</div>

			{/* Song Grid - Spotify Card Style */}
			<div className={`grid ${getGridCols()} gap-5`}>
				{songs.map((song) => {
					const isCurrentSong = currentSong?._id === song._id;
					const isSongLiked = likedSongs.has(song._id);
					
					return (
						<div
							key={song._id}
							className={`
								group relative 
								${isDark ? 'bg-zinc-900/40' : 'bg-white'} 
								rounded-lg p-4 
								hover:bg-zinc-800/60 
								transition-all duration-300 
								cursor-pointer
								hover:shadow-xl
								border ${isDark ? 'border-zinc-800/50' : 'border-gray-200/50'}
								hover:border-zinc-700
							`}
						>
							{/* Album Art Container */}
							<div className='relative mb-4'>
								<div className={`
									aspect-square rounded-md shadow-lg overflow-hidden
									${isCurrentSong && isPlaying ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-zinc-900' : ''}
								`}>
									<img
										src={song.imageUrl}
										alt={song.title}
										className='w-full h-full object-cover transition-transform duration-500 
										group-hover:scale-105 group-hover:brightness-90'
										loading="lazy"
									/>
								</div>
								
								{/* Overlay Gradient */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
								
								{/* Play Button - Floating */}
								<PlayButton song={song} />
								
								{/* Duration Badge (if available) */}
								{song.duration && (
									<div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
										<span className="text-xs text-white">
											{Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}
										</span>
									</div>
								)}
							</div>

							{/* Song Info */}
							<div className="space-y-1">
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1 min-w-0">
										<h3 className='font-semibold text-sm sm:text-base truncate group-hover:text-white transition'>
											{song.title}
										</h3>
										<p className='text-xs sm:text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
											{song.artist}
										</p>
									</div>
									
									{/* Context Menu Button */}
									<button 
										className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-white/10"
										onClick={() => toast.success(`Options for ${song.title}`)}
									>
										<MoreHorizontal className="h-4 w-4 text-zinc-400" />
									</button>
								</div>

								{/* Action Buttons Row */}
								<div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<button 
										className="p-1 rounded-full hover:bg-white/10 transition"
										onClick={() => {
											if (isSongLiked) {
												likedSongs.delete(song._id);
												toast.success(`Removed from library`);
											} else {
												likedSongs.add(song._id);
												toast.success(`Added to library`);
											}
											setLikedSongs(new Set(likedSongs));
										}}
									>
										<Heart className={`h-3.5 w-3.5 transition ${isSongLiked ? 'fill-green-500 text-green-500' : 'text-zinc-400'}`} />
									</button>
									
									<button className="p-1 rounded-full hover:bg-white/10 transition">
										<Clock className="h-3.5 w-3.5 text-zinc-400" />
									</button>
								</div>
							</div>

							{/* Hover Border Effect */}
							<div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-zinc-700 pointer-events-none transition-colors" />
						</div>
					);
				})}
			</div>

			{/* View All Button - Mobile Optimized */}
			{showAllLink && (
				<div className="mt-6 text-center sm:hidden">
					<Button variant="outline" size="sm" className="rounded-full">
						View all {title.toLowerCase()}
					</Button>
				</div>
			)}
		</div>
	);
};

export default SectionGrid;



// import { Song } from "@/types";
// import SectionGridSkeleton from "./SectionGridSkeleton";
// import { Button } from "@/components/ui/button";
// import PlayButton from "./PlayButton";
// import { useThemeStore } from "@/stores/useThemeStore";

// type SectionGridProps = {
// 	title: string;
// 	songs: Song[];
// 	isLoading: boolean;
// };
// const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
// 	const { isDark, toggleTheme } = useThemeStore();
// 	if (isLoading) return <SectionGridSkeleton />;

// 	return (
// 		<div className='mb-8'>
// 			<div className='flex items-center justify-between mb-4'>
// 				<h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
// 				<Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
// 					Show all
// 				</Button>
// 			</div>

// 			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
// 				{songs.map((song) => (
// 					<div
// 						key={song._id}
// 						className={`${isDark ? 'bg-secondary' : "bg-white"} p-4 rounded-md hover:bg-primary/40 transition-all group cursor-pointer`}
// 					>
// 						<div className='relative mb-4'>
// 							<div className='aspect-square rounded-md shadow-lg overflow-hidden'>
// 								<img
// 									src={song.imageUrl}
// 									alt={song.title}
// 									className='w-full h-full object-cover transition-transform duration-300 
// 									group-hover:scale-105'
// 								/>
// 							</div>
// 							<PlayButton song={song} />
// 						</div>
// 						<h3 className='font-medium mb-2 truncate'>{song.title}</h3>
// 						<p className='text-sm text-muted-foreground truncate'>{song.artist}</p>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	);
// };
// export default SectionGrid;
