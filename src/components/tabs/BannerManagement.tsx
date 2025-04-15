"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Eye } from "lucide-react";
import axios from "axios";

import BannerGrid from "../BannerComps/BannerGrid";
import CreateBannerForm from "../BannerComps/CreateBannerForm";
import EditBannerModal from "../BannerComps/EditBannerModal";
import { Banner } from "../BannerComps/types";
import { apiRoute, getAuthHeaders } from "@/lib/server";

interface BannerManagementProps {
  isActive: boolean;
}

export default function BannerManagement({ isActive }: BannerManagementProps) {
  const [isUploadAreaVisible, setIsUploadAreaVisible] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `${apiRoute}/v1/admin/banners`,
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.data.success) {
        setBanners(response.data.data);
        setFilteredBanners(response.data.data);
      } else {
        console.error("Failed to fetch banners:", response.data.message);
        setBanners([]);
        setFilteredBanners([]);
        alert(`Failed to fetch banners: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]);
      setFilteredBanners([]);
      alert("Failed to fetch banners. Please try again.");
    }
  };

  const filterBanners = (query: string, status: string) => {
    let result = banners;

    if (query) {
      result = result.filter((banner) =>
        banner.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (status !== "all") {
      const isActive = status === "active";
      result = result.filter((banner) => banner.active === isActive);
    }

    setFilteredBanners(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterBanners(query, filterStatus);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    filterBanners(searchQuery, status);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") return "";
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const handleStatusToggle = (bannerId: string, currentStatus: boolean) => {
    const updatedBanners = banners.map((banner) =>
      banner.banner_id === bannerId
        ? { ...banner, active: !currentStatus }
        : banner,
    );
    setBanners(updatedBanners);
    filterBanners(searchQuery, filterStatus);
  };

  const handleStartEditing = (banner: Banner) => {
    setEditingBanner(banner);
    setIsEditModalVisible(true);
  };

  const handleCancelCreation = () => {
    setIsUploadAreaVisible(false);
  };

  const handleCreateBanner = async (newBanner: Partial<Banner>) => {
    try {
      const response = await axios.post(
        `${apiRoute}/v1/admin/banners`,
        newBanner,
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.data.success) {
        const createdBanner = response.data.data;
        setBanners((prev) => [createdBanner, ...prev]);
        filterBanners(searchQuery, filterStatus);

        setIsUploadAreaVisible(false);

        alert("Banner created successfully!");
      } else {
        alert(`Failed to create banner: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error creating banner:", error);
      alert("Failed to create banner. Please try again.");
    }
  };

  const handleUpdateBanner = async (updatedBanner: Banner) => {
    try {
      const response = await axios.post(
        `${apiRoute}/v1/admin/banners/update`,
        updatedBanner,
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.data.success) {
        setBanners((prev) =>
          prev.map((b) =>
            b.banner_id === updatedBanner.banner_id ? updatedBanner : b,
          ),
        );
        filterBanners(searchQuery, filterStatus);

        alert("Banner updated successfully!");
      } else {
        alert(`Failed to update banner: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      alert("Failed to update banner. Please try again.");
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      const response = await axios.post(
        `${apiRoute}/v1/admin/banners/delete`,
        { banner_id: bannerId },
        {
          headers: getAuthHeaders(),
        },
      );

      if (response.data.success) {
        setBanners((prev) =>
          prev.filter((banner) => banner.banner_id !== bannerId),
        );
        filterBanners(searchQuery, filterStatus);

        alert("Banner deleted successfully!");
      } else {
        alert(`Failed to delete banner: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner. Please try again.");
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditingBanner(null);
  };

  if (!isActive) return null;

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Banner Management
            </h2>
            <p className="text-gray-600 mt-1">
              Upload, edit and manage your website banners
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-[#4FB372] hover:bg-[#3d9059]"
            onClick={() => setIsUploadAreaVisible(!isUploadAreaVisible)}
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload New Banner
          </Button>
        </div>

        {isUploadAreaVisible && (
          <CreateBannerForm
            onCancel={handleCancelCreation}
            onSubmit={handleCreateBanner}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#4FB372]/10 text-[#4FB372]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Banners
                  </h3>
                  <p className="text-2xl font-semibold text-gray-800">
                    {banners.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Eye className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Banner Views
                  </h3>
                  <p className="text-2xl font-semibold text-gray-800">8.5K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Click Rate
                  </h3>
                  <p className="text-2xl font-semibold text-gray-800">3.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <BannerGrid
          banners={filteredBanners}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onStatusToggle={handleStatusToggle}
          onEdit={handleStartEditing}
          onDelete={handleDeleteBanner}
          formatDate={formatDate}
        />
      </div>

      {editingBanner && (
        <EditBannerModal
          banner={editingBanner}
          isVisible={isEditModalVisible}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateBanner}
          formatDateTimeForInput={formatDateTimeForInput}
        />
      )}
    </div>
  );
}
