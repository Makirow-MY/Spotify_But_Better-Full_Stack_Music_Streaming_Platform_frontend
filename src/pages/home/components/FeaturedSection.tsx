// components/FeaturedSection.tsx
import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import { useThemeStore } from "@/stores/useThemeStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { ChevronLeft, ChevronRight,  Clock, Heart } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const FeaturedSection = () => {
	const { isLoading, featuredSongs, currentAlbum } = useMusicStore();
	const { isDark } = useThemeStore();
	const { currentSong, isPlaying } = usePlayerStore();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);

	if (isLoading) return <FeaturedGridSkeleton />;
console.log(featuredSongs)
	const songsToShow = currentAlbum?.songs || featuredSongs || [];

	const scroll = (direction: 'left' | 'right') => {
		if (scrollContainerRef.current) {
			const scrollAmount = 300;
			const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
			scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
		}
	};

	const handleScroll = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
			setShowLeftArrow(scrollLeft > 0);
			setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
		}
	};

	if (songsToShow.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-zinc-500">No featured songs available</p>
			</div>
		);
	}

	return (
		<div className="mb-12">
			{/* Section Header */}
			<div className="flex items-center justify-between mb-5 px-2">
				<div className="flex items-center gap-3">
					<div>
						<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
							Popular Now
						</h2>
						<p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'} mt-1 hidden sm:block`}>
							Top picks for you 
						</p>
					</div>
				</div>
				
				{/* Navigation Arrows */}
				<div className="hidden sm:flex gap-2">
					<button
						onClick={() => scroll('left')}
						className={`p-2 rounded-full transition-all ${
							showLeftArrow 
								? `bg-primary hover:bg-primary/60 ${isDark ? 'text-white' : 'text-black'}` 
								: `bg-secondary-foreground/30  ${isDark ? 'text-white' : 'text-black'} cursor-not-allowe '`
						}`}
						disabled={!showLeftArrow}
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						onClick={() => scroll('right')}
						className={`p-2 rounded-full transition-all ${
							showRightArrow 
								? `bg-primary hover:bg-primary/60 ${isDark ? 'text-white' : 'text-black'}` 
								: `bg-secondary-foreground/30  ${isDark ? 'text-white' : 'text-black'} cursor-not-allowe '`
						}`}
						disabled={!showRightArrow}
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			</div>

			{/* Horizontal Scroll Container */}
			<div 
				ref={scrollContainerRef}
				onScroll={handleScroll}
				className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
				style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
			>
				{songsToShow.map((song, idx) => {
					const isCurrentSong = currentSong?._id === song._id;
					const isSongLiked = likedSongs.has(song._id);
					
					return (
						<div
							key={song._id}
							className={`
								flex-shrink-0 w-64 sm:w-72 
								${isDark ? 'bg-gradient-to-b from-zinc-900 to-zinc-900/50' : 'bg-white'} 
								rounded-xl overflow-hidden
								hover:bg-secondary-foreground/10 
								transition-all duration-300 
								cursor-pointer
								group
								shadow-lg
								hover:shadow-xl
								hover:scale-[1.02]
								border ${isDark ? 'border-zinc-800' : 'border-gray-200'}
							`}
						>
							{/* Card Content */}
							<div className="relative">
								{/* Rank Badge */}
								<div className="absolute top-2 left-2 z-10">
									<div className="bg-black/70 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
										<span className="text-sm font-bold text-white">#{idx + 1}</span>
									</div>
								</div>

								{/* Album Art */}
								<div className={`
									relative aspect-square overflow-hidden
									${isCurrentSong && isPlaying ? 'ring-2 ring-green-500 ring-offset-2' : ''}
								`}>
									<img
										src={song?.imageUrl}
										alt={song?.title}
										className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
										loading="lazy"
									/>
									
									{/* Gradient Overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
									
									<PlayButton song={song} size="default" />
								</div>

								{/* Song Info */}
								<div className="p-4 space-y-2">
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1 min-w-0">
											<h3 className='font-semibold text-base truncate group-hover:text-white transition'>
												{song.title}
											</h3>
											<p className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
												{song.artist}
											</p>
										</div>
									</div>

									{/* Stats and Actions */}
									<div className="flex items-center justify-between pt-1">
										<div className="flex items-center gap-1 text-xs text-zinc-500">
											<Clock className="h-3 w-3" />
											<span>
												{song.duration 
													? `${Math.floor(song.duration / 60)}:${Math.floor(song.duration % 60).toString().padStart(2, '0')}`
													: '3:45'
												}
											</span>
										</div>
										
										<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<button 
												className="p-1.5 rounded-full hover:bg-white/10 transition"
												onClick={(e) => {
													e.stopPropagation();
													if (isSongLiked) {
														likedSongs.delete(song._id);
														toast.success('Removed from library');
													} else {
														likedSongs.add(song._id);
														toast.success('Added to library');
													}
													setLikedSongs(new Set(likedSongs));
												}}
											>
												<Heart className={`h-3.5 w-3.5 transition ${isSongLiked ? 'fill-green-500 text-green-500' : 'text-zinc-400'}`} />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			
		</div>
	);
};

export default FeaturedSection;
