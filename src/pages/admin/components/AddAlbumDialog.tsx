import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Album, ImageIcon, Plus} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const AddAlbumDialog = () => {
	const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
const { checkAuth} = useAuthStore();
 const [imagePreview, setImagePreview] = useState<string | null>(null);
	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();
	const [newAlbum, setNewAlbum] = useState({
		title: "",
		artist: "",
		description: "",
		imageUrl: "",
		releaseYear: new Date().getFullYear(),
	});

	const [imageFile, setImageFile] = useState<File | null>(null);

	const uploadToCloudinary = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'chat_attachments_preset');
    formData.append('cloud_name', 'dyf21ulbr');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dyf21ulbr/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    return data.secure_url;
  };

	const handleImageSelect = async(e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			 setImagePreview(URL.createObjectURL(file));
			
		}
	};

		useEffect(() => {
			fetchAlbums();
			fetchSongs();
			fetchStats();
		}, [fetchAlbums, fetchSongs,checkAuth, fetchStats,  newAlbum, albumDialogOpen]);
	

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!imageFile) {
				return toast.error("Please upload an image");
			}
      const imageUrl = await uploadToCloudinary(imageFile);
      setNewAlbum({ ...newAlbum, imageUrl: imageUrl as string });

			const formData = new FormData();
			formData.append("title", newAlbum.title);
			formData.append("artist", newAlbum.artist);
			formData.append("description", newAlbum.description)
			formData.append("releaseYear", newAlbum.releaseYear.toString());
			formData.append("imageFile", imageUrl || newAlbum.imageUrl);

			await axiosInstance.post("/admin/albums", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setNewAlbum({
				title: "",
				artist: "",
				description: "",
				imageUrl: "",
				releaseYear: new Date().getFullYear(),
			});
			setImageFile(null);
			setImagePreview(null)
			setAlbumDialogOpen(false);
			toast.success("Album created successfully");
		} catch (error: any) {
			toast.error("Failed to create album: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-primary hover:bg-primary/25 '>
					<Plus className='mr-2 h-4 w-4' />
					Add Album
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-secondary border-zinc-700 max-h-[80vh] overflow-auto'>
				<DialogHeader>
						  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
							<Album className="h-6 w-6 text-green-500" />
							Create New Album
						  </DialogTitle>
						</DialogHeader>
				<div className='space-y-4 py-4'>
				
				 <div>
								<Label className="text-sm text-zinc-400 mb-3 block">Cover Art</Label>
								<div
								  onClick={() => fileInputRef.current?.click()}
								  className="border-2 border-dashed border-zinc-700 hover:border-green-500/50 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition"
								>
								  {imagePreview ? (
									<img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
								  ) : (
									<div className="text-center">
									  <ImageIcon className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
									  <p className="text-zinc-400">Upload Cover Art</p>
									</div>
								  )}
								</div>
								<input type="file"disabled={isLoading} ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
							  </div>
					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Album Title</Label>
						<Input
						disabled={isLoading}
							value={newAlbum.title}
							onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
							className='bg-secondary-foreground/20 border-zinc-700'
							placeholder='Enter album title'
						/>
					</div>
					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Artist</Label>
						<Input
						disabled={isLoading}
							value={newAlbum.artist}
							onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
							className='bg-secondary-foreground/20 border-zinc-700'
							placeholder='Enter artist name'
						/>
					</div>
					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Release Year</Label>
						<Input
						disabled={isLoading}
							type='number'
							value={newAlbum.releaseYear}
							onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })}
							className='bg-secondary-foreground/20 border-zinc-700'
							placeholder='Enter release year'
							min={1900}
							max={new Date().getFullYear()}
						/>
					</div>
					 <div>
										   <Label>Description</Label>
										   <textarea
											 value={newAlbum.description}
											 onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
											 className="bg-secondary-foreground/10 outline-none resize-none py-2 px-3 w-full h-[30vh] border-zinc-700 mt-1.5"
                                            	 placeholder="Write a brief description about your music"
										   />
										 </div>
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() =>
						{setNewAlbum({description: "", artist: "", imageUrl:"", releaseYear: newAlbum.releaseYear, title: ""})
						setAlbumDialogOpen(false)}} disabled={isLoading} >
					
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className='bg-primary hover:bg-primary/50'
						disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.artist}
					>
						{isLoading ? "Creating..." : "Add Album"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddAlbumDialog;
