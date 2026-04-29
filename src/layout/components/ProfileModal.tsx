// components/ProfileModal.tsx
import { useState, useEffect } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { authUser, checkAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    imageUrl: '',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with current user data
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || '',
        imageUrl: authUser.imageUrl || '',
      });
      setPreviewImage(authUser.imageUrl || null);
    }
  }, [authUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setFormData(prev => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.put('/auth/update-profile', {
        fullName: formData.fullName,
        imageUrl: formData.imageUrl || undefined,
      });

      toast.success("Profile updated successfully!");
      await checkAuth(); // Refresh user data
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full  shadow flex items-center justify-center z-[100] p-4">
      <div className="bg-secondary rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-700 px-6 py-4">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-500">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
                    <Camera size={40} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Overlay */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer">
                <div className="flex flex-col items-center text-white">
                  <Upload size={24} />
                  <span className="text-xs mt-1">Change</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">Click to upload new photo</p>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Display Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-white/30 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition"
              placeholder="Your name"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-neutral-700 hover:bg-neutral-800 transition font-medium"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-600/50 text-black font-bold rounded-full transition"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;