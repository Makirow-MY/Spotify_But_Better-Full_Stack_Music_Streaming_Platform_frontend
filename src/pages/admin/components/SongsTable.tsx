import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import EditSongDialog from "./EditSongDialog";
import { useEffect, useState } from "react";

const SongsTable = () => {
	const { songs, fetchSongs, error, deleteSong } = useMusicStore();
  const [editingSong, setEditingSong] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

	useEffect(() => {
		fetchSongs();
	}, [fetchSongs]);

   const handleEdit = (song: any) => {
    setEditingSong(song);
    setEditOpen(true);
  };

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



