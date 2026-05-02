
import { useMusicStore } from "@/stores/useMusicStore";

import { useThemeStore } from "@/stores/useThemeStore";
import PlayButton from "@/pages/home/components/PlayButton";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";


const FeaturedUserSection = () => {
	const {featuredSongs,  error} = useMusicStore();
	const { users, fetchUsers} = useChatStore();
	
		useEffect(() => {
		fetchUsers();
		console.log("user", users)
		}, [fetchUsers]);

const { isDark} = useThemeStore();

	if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>;

	return (
		<div className="mb-12">
			<div className="flex items-center justify-between mb-5 px-2">
							<div className="flex items-center gap-3">
								<div>
									<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
										Today's Artists
									</h2>
									<p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'} mt-1 hidden sm:block`}>
										Check out the latest songs ever
									</p>
								</div>
							</div>
							
						
						</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
			{featuredSongs.map((song) => (
				<div
					key={song._id}
					className={`flex items-center ${isDark ? 'bg-gradient-to-b from-zinc-900 to-zinc-900/50' : 'bg-white'} 
								hover:bg-secondary-foreground/10 
								 rounded-md overflow-hidden
                      transition-colors group cursor-pointer relative`}
				>
					<img
						src={song?.imageUrl}
						alt={song?.title}
						className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
					/>
					<div className='flex-1 p-4'>
						<p className='font-medium truncate line-clamp-1'>{song.title}</p>
						<p className='text-sm text-muted-foreground line-clamp-1 truncate'>{song.artist}</p>
					</div>
					<PlayButton song={song} />
				</div>
			))}
		</div>

		</div>
		
	);
};
export default FeaturedUserSection;