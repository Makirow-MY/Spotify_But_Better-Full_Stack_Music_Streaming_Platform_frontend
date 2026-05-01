// components/AuthModal.tsx
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { X, Upload, CheckCircle, AlertCircle } from "lucide-react";

const AuthModal = ({ isOpen, onClose }: {
    isOpen: boolean;
    onClose: () => void;
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    imageUrl: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const { 
    signup, 
    login, 
    isLoading, 
    error, 
    successMessage,
    clearMessages 
  } = useAuthStore();

  // Clear messages when modal opens/closes or step changes
  useEffect(() => {
    if (isOpen) {
      clearMessages();
      setLocalError(null);
      setLocalSuccess(null);
    }
  }, [isOpen,  clearMessages]);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || successMessage || localError || localSuccess) {
      const timer = setTimeout(() => {
        clearMessages();
        setLocalError(null);
        setLocalSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, localError, localSuccess, clearMessages]);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, imageUrl: url as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);
    clearMessages();
    
    if (isLogin) {
      try {
        await login({ email: formData.email, password: formData.password });
        onClose();
      } catch (error) {
        // Error is handled in store
      }
    } else {
      try {
        await signup(formData);
        onClose();
      } catch (error) {
        // Error is handled in store
      }
    }
  };

  // Get the current message to display (prioritize local messages over store messages)
  const displayError = localError || error;
  const displaySuccess = localSuccess || successMessage;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
      <div className="bg-secondary rounded-2xl p-8 relative max-w-xl w-full mx-4">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4  hover:text-red-500 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl text-primary font-bold text-center mb-8">
          {isLogin ? "Log in" : "Sign up"}
        </h2>

        {/* Success Message */}
        {displaySuccess && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-500">
            <CheckCircle size={18} className="shrink-0" />
            <p className="text-sm">{displaySuccess}</p>
          </div>
        )}

        {/* Error Message */}
        {displayError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm">{displayError}</p>
          </div>
        )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row justify-between gap-3 mb-6 w-full">
              {!isLogin && (
                <div className="w-full md:w-[50%] shrink-0 space-y-6">
                  <div>
                    <label className="block text-sm mb-2">Profile Picture (Optional)</label>
                    <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 rounded-xl h-40 hover:border-green-500 transition">
                      {previewImage ? (
                        <img src={previewImage} alt="preview" className="h-full w-full object-cover rounded-xl" />
                      ) : (
                        <Upload size={40} className="text-gray-400" />
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              )}

              <div className={!isLogin ? `w-full md:w-[50%] shrink-0 space-y-6` : `w-full shrink-0 space-y-6`}>
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white/70 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required={!isLogin}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/70 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white/70 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : isLogin ? "Log In" : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="text-green-500 cursor-pointer hover:underline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  clearMessages();
                  setLocalError(null);
                  setLocalSuccess(null);
                }}
              >
                {isLogin ? "Sign up" : "Log in"}
              </span>
            </p>
          </form>
       
      </div>
    </div>
  );
};

export default AuthModal;


