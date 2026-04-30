// components/admin/AddSongDialog.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Music, Image as ImageIcon,  } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
//import { Progress } from "@/components/ui/progress"; // shadcn progress component

const AddSongDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { albums, fetchSongs } = useMusicStore();

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    albumId: "",           // Will be "" for no album
    description: "",
  });

  const [files, setFiles] = useState({
    audio: null as File | null,
    image: null as File | null,
  });

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFiles(prev => ({ ...prev, audio: file }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!files.audio || !files.image || !formData.title || !formData.artist) {
      return toast.error("Please fill all required fields");
    }

    setIsLoading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("artist", formData.artist);
    data.append("description", formData.description || "180");
    if (formData.albumId) data.append("albumId", formData.albumId);
    data.append("audioFile", files.audio);
    data.append("imageFile", files.image);

    try {
      await axiosInstance.post("/admin/songs", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percent);
        },
      });

      toast.success("Song uploaded successfully!");
      fetchSongs();
      resetForm();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", artist: "", albumId: "", description: "" });
    setFiles({ audio: null, image: null });
    setImagePreview(null);
    setUploadProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 font-medium flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Upload Song
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-secondary border-zinc-800  max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Music className="h-6 w-6 text-green-500" />
            Upload New Song
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Cover Art */}
          <div>
            <Label className="text-sm  mb-3 block">Cover Art</Label>
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 hover:border-green-500/50 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                  <p className="">Upload Cover Art</p>
                </div>
              )}
            </div>
            <input type="file" ref={imageInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
          </div>

          {/* Audio File */}
          <div>
            <Label className="text-sm  mb-2 block">Audio File</Label>
            <div
              onClick={() => audioInputRef.current?.click()}
              className="border border-zinc-700 hover:border-green-500/50 rounded-xl p-5 cursor-pointer transition"
            >
              <div className="flex items-center gap-4">
                <Music className="h-10 w-10 text-green-500" />
                <div>
                  <p className="font-medium">{files.audio ? files.audio.name : "Select Audio File"}</p>
                  <p className="text-xs text-zinc-500">MP3, WAV • Max 50MB recommended</p>
                </div>
              </div>
            </div>
            <input type="file" ref={audioInputRef} onChange={handleAudioSelect} accept="audio/*" className="hidden" />
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <Label>Song Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-secondary-foreground/10 border-zinc-700 mt-1.5"
                placeholder="Song title"
              />
            </div>

            <div>
              <Label>Artist</Label>
              <Input
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="bg-secondary-foreground/10 border-zinc-700 mt-1.5"
                placeholder="Artist name"
              />
            </div>

            <div>
              <Label>Album (Optional)</Label>
              <Select 
                value={formData.albumId} 
                onValueChange={(value) => setFormData({ ...formData, albumId: value })}
              >
                <SelectTrigger className="bg-secondary-foreground/10 border-zinc-700 mt-1.5">
                  <SelectValue placeholder="Select album or leave as single" />
                </SelectTrigger>
                <SelectContent className="bg-secondary-foreground/10 border-zinc-800">
                  <SelectItem value={"null"}>No Album (Single)</SelectItem>
                  {albums.map((album) => (
                    <SelectItem key={album._id} value={album._id}>
                      {album.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Progress Bar */}
          {isLoading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs ">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <progress value={uploadProgress} className="h-1" />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !files.audio || !files.image || !formData.title || !formData.artist}
            className="bg-green-500 hover:bg-green-600 font-semibold px-8"
          >
            {isLoading ? "Uploading..." : "Upload Song"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;