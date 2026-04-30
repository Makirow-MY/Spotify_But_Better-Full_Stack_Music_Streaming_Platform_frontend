import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import EditSongDialog from "./EditSongDialog";
import { useState } from "react";

const SongsTable = () => {
	const { songs, isLoading, error, deleteSong } = useMusicStore();
const [editingSong, setEditingSong] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

   const handleEdit = (song: any) => {
    setEditingSong(song);
    setEditOpen(true);
  };

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-muted-foreground'>Loading songs...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}

	return (
		<>
		<Table>
			<TableHeader>
				<TableRow className='bg-secondary-foreground/20 hover:bg-secondary-foreground/20'>
					<TableHead className='text-primary font-medium w-[50px]'></TableHead>
					<TableHead className='text-primary font-medium'>Title</TableHead>
					<TableHead className='text-primary font-medium'>Artist</TableHead>
					<TableHead className='text-primary font-medium'>Release Date</TableHead>
					<TableHead className='text-primary font-medium text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{songs.map((song) => (
					<TableRow key={song._id} className='hover:bg-primary'>
						<TableCell>
							<img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />
						</TableCell>
						<TableCell className='font-medium'>{song.title}</TableCell>
						<TableCell>{song.artist}</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1'>
								<Calendar className='h-4 w-4' />
								{song.createdAt.split("T")[0]}
							</span>
						</TableCell>

						<TableCell className='text-right'>
							<div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(song)}
                      className="text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSong(song._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
		{editingSong && (
        <EditSongDialog
          song={editingSong}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditingSong(null);
          }}
        />
      )}
		</>
	);
};
export default SongsTable;






// const SongsTable = () => {
//   const { songs, isLoading, deleteSong } = useMusicStore();
//   const [editingSong, setEditingSong] = useState<any>(null);
//   const [editOpen, setEditOpen] = useState(false);

//   const handleEdit = (song: any) => {
//     setEditingSong(song);
//     setEditOpen(true);
//   };

//   if (isLoading) return <div className="text-center py-8 text-primary">Loading songs...</div>;

//   return (
//     <>
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-zinc-800">
//               <th className="text-left py-4 px-4 w-14"></th>
//               <th className="text-left py-4 px-4 text-primary font-medium">Title</th>
//               <th className="text-left py-4 px-4 text-primary font-medium">Artist</th>
//               <th className="text-left py-4 px-4 text-primary font-medium">Album</th>
//               <th className="text-left py-4 px-4 text-primary font-medium">Duration</th>
//               <th className="text-right py-4 px-4 text-primary font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {songs.map((song) => (
//               <tr key={song._id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
//                 <td className=" w-12 h-12 shrink-0">
//                   <img src={song.imageUrl} alt={song.title} className="w-full h-full shrink-0 rounded object-cover" />
//                 </td>
//                 <td className="px-4 py-4 font-medium">{song.title}</td>
//                 <td className="px-4 py-4 ">{song.artist}</td>
//                 <td className="px-4 py-4 ">
//                   {song.albumId?.title || "Single"}
//                 </td>
//                 <td className="px-4 py-4 ">
//                   {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
//                 </td>
//                 <td className="px-4 py-4 text-right">
//                   <div className="flex gap-2 justify-end">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleEdit(song)}
//                       className="text-blue-400 hover:text-blue-300"
//                     >
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => deleteSong(song._id)}
//                       className="text-red-400 hover:text-red-300"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Edit Modal */}
//       {editingSong && (
//         <EditSongDialog
//           song={editingSong}
//           open={editOpen}
//           onClose={() => {
//             setEditOpen(false);
//             setEditingSong(null);
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default SongsTable;