import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Music, Trash2 } from "lucide-react";
import { useEffect } from "react";

const AlbumsTable = () => {
	const {userAlbum,fetchStats, fetchUserAlbums, deleteAlbum, fetchAlbums } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
      fetchUserAlbums();
	  fetchStats()
	}, [fetchAlbums,fetchStats, fetchUserAlbums]);

	return (
		<Table>
			<TableHeader>
				<TableRow className="bg-secondary-foreground/20 hover:bg-secondary-foreground/20">
					<TableHead className='w-[50px]'></TableHead>
					<TableHead className='text-primary'>Title</TableHead>
					<TableHead className='text-primary'>Artist</TableHead>
					<TableHead className='text-primary'>Release Year</TableHead>
					<TableHead className='text-primary'>Songs</TableHead>
					<TableHead className='text-right text-primary'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{userAlbum.map((album) => (
					<TableRow key={album._id} className='hover:bg-primary/50'>
						<TableCell className=" w-12 h-12 shrink-0">
			                  <img src={album.imageUrl} alt={album.title} className="w-full h-full shrink-0 rounded object-cover" />
                </TableCell>
						<TableCell className='font-medium'>{album.title}</TableCell>
						<TableCell>{album.artist}</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 '>
								<Calendar className='h-4 w-4' />
								{album.releaseYear}
							</span>
						</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 '>
								<Music className='h-4 w-4' />
								{album.songs.length} songs
							</span>
						</TableCell>
						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => deleteAlbum(album._id)}
									className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default AlbumsTable;












// // components/admin/AlbumsGrid.tsx
// import { useMusicStore } from "@/stores/useMusicStore";
// import { Calendar, Music, Trash2, Edit2 } from "lucide-react";
// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";

// const AlbumsGrid = () => {
//   const { albums, deleteAlbum, fetchAlbums } = useMusicStore();

//   useEffect(() => {
//     fetchAlbums();
//   }, [fetchAlbums]);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
//       {albums.map((album) => (
//         <div
//           key={album._id}
//           className="group bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800/80 transition-all duration-300 border border-zinc-800 hover:border-zinc-700"
//         >
//           <div className="relative aspect-square">
//             <img
//               src={album.imageUrl}
//               alt={album.title}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all" />

//             {/* Hover Actions */}
//             <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
//               <Button size="icon" variant="secondary" className="h-9 w-9 bg-black/70 hover:bg-black">
//                 <Edit2 className="h-4 w-4" />
//               </Button>
//               <Button
//                 size="icon"
//                 variant="destructive"
//                 className="h-9 w-9 bg-black/70 hover:bg-red-600"
//                 onClick={() => deleteAlbum(album._id)}
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           <div className="p-4">
//             <h3 className="font-semibold text-lg line-clamp-1">{album.title}</h3>
//             <p className="text-zinc-400 text-sm mt-1">{album.artist}</p>

//             <div className="flex items-center justify-between mt-4 text-xs text-zinc-500">
//               <div className="flex items-center gap-1.5">
//                 <Calendar className="h-3.5 w-3.5" />
//                 {album.releaseYear}
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <Music className="h-3.5 w-3.5" />
//                 {album.songs?.length || 0} songs
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AlbumsGrid;