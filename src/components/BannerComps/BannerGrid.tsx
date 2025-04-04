import { Banner } from "./types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Search, Edit, ExternalLink, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface BannerGridProps {
  banners: Banner[];
  onSearch: (query: string) => void;
  onFilterChange: (status: string) => void;
  onStatusToggle: (bannerId: string, currentStatus: boolean) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (bannerId: string) => void;
  formatDate: (dateString: string) => string;
}

export default function BannerGrid({
  banners,
  onSearch,
  onFilterChange,
  onStatusToggle,
  onEdit,
  onDelete,
  formatDate
}: BannerGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(banners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentBanners = banners.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const startItem = banners.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + itemsPerPage, banners.length);

  return (
    <Card>
      <div className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">Active Banners</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search banners..."
                className="w-full pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Select
              defaultValue="all"
              onValueChange={onFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Banners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banners</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBanners.map((banner) => (
          <div key={banner.banner_id} className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-all">
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
              <Image
                src={banner.banner_image}
                alt={banner.name}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-2">
                  <button 
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => onEdit(banner)}
                  >
                    <Edit className="h-5 w-5 text-gray-700" />
                  </button>
                  <button 
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors" 
                    onClick={() => window.open(banner.redirect_url, '_blank')}
                  >
                    <ExternalLink className="h-5 w-5 text-gray-700" />
                  </button>
                  <button 
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors" 
                    onClick={() => onDelete(banner.banner_id)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${banner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-800">{banner.name}</h4>
              <p className="text-sm text-gray-500 mt-1">Added on {formatDate(banner.timestamp)}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500">Start: {formatDate(banner.start_time)}</span>
                <span className="text-xs text-gray-500">End: {formatDate(banner.end_time)}</span>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`banner-${banner.banner_id}-active`}
                    checked={banner.active}
                    onCheckedChange={() => onStatusToggle(banner.banner_id, banner.active)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <span>
            {banners.length > 0 
              ? `Showing ${startItem}-${endItem} of ${banners.length} banners` 
              : "No banners to display"}
          </span>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button 
                key={index}
                variant="outline" 
                className={currentPage === page 
                  ? "bg-[#4FB372] text-white hover:bg-[#3d9059]" 
                  : ""}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="self-center px-2">
                {page}
              </span>
            )
          ))}
          
          <Button 
            variant="outline" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}