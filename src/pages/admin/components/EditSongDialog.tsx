// components/admin/EditSongDialog.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface EditSongDialogProps {
  song: any;
  open: boolean;
  onClose: () => void;
}

const EditSongDialog = ({ song, open, onClose }: EditSongDialogProps) => {
  const { albums, fetchSongs } = useMusicStore();

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    albumId: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title || "",
        artist: song.artist || "",
        albumId: song.albumId?._id || song.albumId || "",
        description: song.description?.toString() || "",
      });
    }
  }, [song]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.put(`/admin/songs/${song._id}`, formData);
      toast.success("Song updated successfully");
      fetchSongs();
      onClose();
    } catch (error: any) {
      toast.error("Failed to update song");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-secondary border-zinc-800 text-white max-h-[80vh] overflow-y-auto max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg text-green-500 gap-3">
            <Pencil className="h-5 w-5 text-green-500" />
            Edit Song
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label>Song Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-zinc-900 border-zinc-700"
            />
          </div>

          <div>
            <Label>Artist</Label>
            <Input
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="bg-zinc-900 border-zinc-700"
            />
          </div>

          <div>
            <Label>Album</Label>
            <Select value={formData.albumId} onValueChange={(val) => setFormData({ ...formData, albumId: val })}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700">
                <SelectValue placeholder="Select album" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">No Album</SelectItem>
                {albums.map((a) => (
                  <SelectItem key={a._id} value={a._id}>
                    {a.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={isLoading} className="bg-green-500 hover:bg-green-600">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSongDialog;