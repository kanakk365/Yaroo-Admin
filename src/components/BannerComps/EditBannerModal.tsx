import { Banner } from "./types";
import { ChangeEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Upload } from "lucide-react";
import { uploadFile } from "@/lib/client-upload";

interface EditBannerModalProps {
  banner: Banner;
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (updatedBanner: Banner) => Promise<void>;
  formatDateTimeForInput: (dateString: string) => string;
}

export default function EditBannerModal({ 
  banner, 
  isVisible, 
  onClose, 
  onUpdate,
  formatDateTimeForInput
}: EditBannerModalProps) {
  const [editingBanner, setEditingBanner] = useState<Banner>({
    ...banner,
    start_time: formatDateTimeForInput(banner.start_time),
    end_time: formatDateTimeForInput(banner.end_time)
  });
  const [editPreviewImage, setEditPreviewImage] = useState(banner.banner_image);
  const [isUploading, setIsUploading] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingBanner(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditActiveToggle = () => {
    setEditingBanner(prev => ({ ...prev, active: !prev.active }));
  };
  
  const handleEditFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleEditFile(e.target.files[0]);
    }
  };
  
  const handleEditFile = async (file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
      alert("File type not supported. Please upload JPG, PNG, or GIF image.");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit. Please upload a smaller image.");
      return;
    }
    
    const fileUrl = URL.createObjectURL(file);
    setEditPreviewImage(fileUrl);
    
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadFile(file);
      if (uploadedUrl) {
        setEditingBanner(prev => ({ ...prev, banner_image: uploadedUrl }));
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const submitUpdateBanner = async () => {
    if (!editingBanner.name || !editingBanner.redirect_url || !editingBanner.banner_image || 
        !editingBanner.start_time || !editingBanner.end_time) {
      alert("Please fill all required fields");
      return;
    }
    
    try {
      setIsUploading(true);
      
      const updatedBanner = {
        ...editingBanner,
        start_time: new Date(editingBanner.start_time).toISOString(),
        end_time: new Date(editingBanner.end_time).toISOString(),
        expiry: new Date(editingBanner.end_time).toISOString()
      };
      
      await onUpdate(updatedBanner);
      
      onClose();
    } catch (error) {
      console.error("Error updating banner:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Banner</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Name*
                </label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingBanner.name}
                  onChange={handleEditInputChange}
                  placeholder="Enter banner name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-redirect_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Redirect URL*
                </label>
                <Input
                  id="edit-redirect_url"
                  name="redirect_url"
                  value={editingBanner.redirect_url}
                  onChange={handleEditInputChange}
                  placeholder="https://example.com/page"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-start_time" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date*
                  </label>
                  <Input
                    id="edit-start_time"
                    name="start_time"
                    type="datetime-local"
                    value={editingBanner.start_time}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-end_time" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date*
                  </label>
                  <Input
                    id="edit-end_time"
                    name="end_time"
                    type="datetime-local"
                    value={editingBanner.end_time}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-banner-active"
                  checked={editingBanner.active}
                  onCheckedChange={handleEditActiveToggle}
                />
                <label htmlFor="edit-banner-active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image*
              </label>
              
              <div
                className="border-2 border-dashed rounded-lg p-4 h-[200px] flex flex-col items-center justify-center cursor-pointer border-gray-300"
                onClick={() => editFileInputRef.current?.click()}
              >
                {editPreviewImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={editPreviewImage}
                      alt="Banner preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        
                        if (!confirm("Are you sure you want to remove this image? You'll need to upload a new one.")) {
                          return;
                        }
                        
                        setEditPreviewImage("");
                        setEditingBanner(prev => ({ ...prev, banner_image: "" }));
                        if (editFileInputRef.current) editFileInputRef.current.value = "";
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600">Click to upload a new banner image</p>
                    <p className="mt-1 text-sm text-gray-500">Supported formats: JPG, PNG, GIF (Max 2MB)</p>
                  </>
                )}
                <input
                  ref={editFileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleEditFileChange}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#4FB372] hover:bg-[#3d9059]"
              onClick={submitUpdateBanner}
              disabled={isUploading}
            >
              {isUploading ? "Updating..." : "Update Banner"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}