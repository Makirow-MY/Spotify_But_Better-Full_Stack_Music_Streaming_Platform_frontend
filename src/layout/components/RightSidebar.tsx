// components/LeftSidebar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { ChevronLeft, ChevronRight, HeadphonesIcon, Music, Users, X } from "lucide-react";
import { useEffect } from "react";

interface RightSidebarProps {
  isOpen: boolean;           // For mobile drawer
  onClose: () => void;
  isCollapsed: boolean;      // For desktop collapse
  toggleCollapse: () => void;
}

const RightSidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }: RightSidebarProps) => {
const { isDark, toggleTheme } = useThemeStore();
		const { users, fetchUsers, authUser, checkAuth } = useAuthStore();
		const {  //onlineUsers, userActivities 
	
		} = useChatStore();
	
		useEffect(() => {
			if (authUser) fetchUsers();
		}, [fetchUsers, authUser]);


  return (
	<>
	  {/* Mobile Overlay */}
	  {isOpen && (
		<div 
		  className="fixed inset-0 bg-black/70 z-50 lg:hidden"
		  onClick={onClose}
		/>
	  )}

	  <aside 
		className={`
		  fixed lg:static inset-y-0 right-0 z-50 
		  border-l border-neutral-800 
		   flex flex-col h-full transition-all duration-300
		  ${isOpen  ? isDark ? 'bg-black/80 translate-x-0' : "bg-white/80 translate-x-0" : 'translate-x-0'}
		  ${isCollapsed ? 'w-20' : 'w-60'}
		`}
	  >
		{/* Header */}
		<div className="flex items-center justify-between  p-6">
			{
			!isCollapsed &&  <button 
			onClick={toggleCollapse}
			className="hidden lg:block bg-primary p-1 rounded-full hover:bg-secondary/10"
		  > <ChevronRight size={22} /> </button>
			}
			{
			authUser && authUser.isVerified && isCollapsed &&  <button 
			onClick={toggleCollapse}
			className="hidden lg:block bg-primary p-1 rounded-full hover:bg-secondary/10"
		  > <ChevronLeft size={22} /> </button>
			}

			<div className='flex items-center flex-1 shrink-0 gap-2'>
				 <h1 className={`font-bold text-center  transition-all ${isCollapsed ? 'text-2xl' : 'text-md'}`}>
			{isCollapsed ? "" : "What online users listen too"}
		  </h1>

							</div>
		 
		  {/* Collapse Toggle Button - Only visible on large screens */}
		 
			

		 
		</div>

{(!authUser || (authUser && !authUser.isVerified)) && <LoginPrompt toggleCollapse={toggleCollapse} isCollapsed={isCollapsed ? true : false} />}
		<ScrollArea className='flex-1'>
						<div className='p-4 space-y-4'>
							{users.map((user) => {
							  //	const activity = userActivities.get(user.clerkId);
								//const isPlaying = activity && activity !== "Idle";
		
								return (
									<div
										key={user._id}
										className={`cursor-pointer ${!isCollapsed && "hover:bg-zinc-800/50" }  p-3 rounded-md transition-colors group`}
									>
										<div className='flex items-start gap-3'>
											<div className={`relative ${isCollapsed && "hover:bg-zinc-800/50 p-1 rounded-full" }`}>
												<Avatar className='size-10'>
													<AvatarImage src={user.imageUrl} alt={user.fullName} />
													<AvatarFallback>{user.fullName[0]}</AvatarFallback>
												</Avatar>
												<div
													className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-1 border-zinc-900 
														${user.isVerified? "bg-green-500" : "bg-zinc-500"}
														`}
													aria-hidden='true'
												/>
											</div>
		
											<div className='flex-1 min-w-0'>
												<div className='flex items-center gap-2'>
													<span className='font-medium text-sm '>{user.fullName}</span>
												<Music className='size-3.5 text-emerald-400 shrink-0' />
												</div>
		
												{user.isVerified ? (
													<div className='mt-1'>
														<div className='mt-1 text-sm text-muted-foreground font-medium truncate'>
															{//activity.replace("Playing ", "").split(" by ")[0]
															}
															makia yengue
														</div>
														<div className='text-xs text-zinc-400 truncate'>
															{//activity.split(" by ")[1]
															}
															
														</div>
													</div>
												) : (
													<div className='mt-1 text-xs text-zinc-400'>Idle</div>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</ScrollArea>
	  </aside>
	</>
  );
};

export default RightSidebar;




const LoginPrompt = ({isCollapsed, toggleCollapse}: {isCollapsed: boolean, toggleCollapse: () => void}) => (
	<div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse'
				aria-hidden='true'
			/>
			{!isCollapsed  &&  <div className='relative bg-zinc-900 rounded-full p-4 '>
				<HeadphonesIcon className='size-8 text-emerald-400' />
			</div>}
			{isCollapsed  &&  <div onClick={toggleCollapse} className='relative cursor-pointer bg-primary rounded-full p-2 sm:p-4'>
				<ChevronLeft size={22}  className='sm:size-8 size-4 ' />
			</div>}
		</div>

		{!isCollapsed  &&  <div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold '>See What Friends Are Playing</h3>
			<p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p>
		</div>}
	</div>
);