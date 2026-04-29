// components/PlayButton.tsx
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";


const PlayButton = ({ song, size = "default" }: { song: Song; size?: "small" | "default" | "large" }) => {
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

	const isCurrentSong = currentSong?._id === song._id;
	
	const getButtonSize = () => {
		switch(size) {
			case "small": return "h-8 w-8";
			case "large": return "h-14 w-14";
			default: return "h-10 w-10 sm:h-12 sm:w-12";
		}
	};
	
	const getIconSize = () => {
		switch(size) {
			case "small": return 14;
			case "large": return 28;
			default: return 18;
		}
	};

	const handlePlay = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isCurrentSong) {
			togglePlay();
		} else {
			setCurrentSong(song);
		}
	};

	return (
		<Button
			size={"icon"}
			onClick={handlePlay}
			className={`
				absolute bottom-2 right-2 sm:bottom-3 sm:right-3
				bg-green-500 hover:bg-green-400 
				hover:scale-105 active:scale-95
				transition-all duration-200 
				shadow-xl shadow-black/30
				${getButtonSize()}
				${isCurrentSong && isPlaying ? 'opacity-100 scale-100' : 'opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100'}
				${isCurrentSong && isPlaying ? 'bg-green-400' : ''}
				z-10
			`}
		>
			{isCurrentSong && isPlaying ? (
				<Pause className={`text-black`} size={getIconSize()} />
			) : (
				<Play className={`text-black ml-0.5`} size={getIconSize()} />
			)}
		</Button>
	);
};

export default PlayButton;

// import { Button } from "@/components/ui/button";
// import { usePlayerStore } from "@/stores/usePlayerStore";
// import { Song } from "@/types";
// import { Pause, Play } from "lucide-react";

// const PlayButton = ({ song }: { song: Song }) => {
// 	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
// 	const isCurrentSong = currentSong?._id === song._id;

// 	const handlePlay = () => {
// 		if (isCurrentSong) togglePlay();
// 		else setCurrentSong(song);
// 	};

// 	return (
// 		<Button
// 			size={"icon"}
// 			onClick={handlePlay}
// 			className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
// 				opacity-0 translate-y-2 group-hover:translate-y-0 ${
// 					isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
// 				}`}
// 		>
// 			{isCurrentSong && isPlaying ? (
// 				<Pause className='size-5 text-black' />
// 			) : (
// 				<Play className='size-5 text-black' />
// 			)}
// 		</Button>
// 	);
// };
// export default PlayButton;
