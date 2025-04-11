

import { useState } from "react"
import axios from "axios"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProductsProps {
    isActive: boolean;
}

export default function Products({ isActive }: ProductsProps) {
    const [productUrl, setProductUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

    if (!isActive) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!productUrl.trim()) {
            setMessage({ text: "Please enter a product URL", type: "error" })
            return
        }
        
        try {
            setLoading(true)
            setMessage(null)
              const response = await axios.post(
                "https://yaro-6000-karma.offline.coffeecodes.in/v1/admin/products",
                { productUrl },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Karma-Admin-Auth": "sdbsdbjdasdabhjbjahbjbcj8367"
                    }
                }
            )
            
            if (response.status === 200 || response.status === 201) {
                setMessage({ text: "Product URL added successfully!", type: "success" })
                setProductUrl("")
            } else {
                setMessage({ text: response.data?.message || "Failed to add product URL", type: "error" })
            }
        } catch (error) {
            console.error("Error adding product URL:", error)
            
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 
                                    error.message || 
                                    "Failed to add product URL"
                setMessage({ text: typeof errorMessage === 'string' ? errorMessage : "Server error", type: "error" })
            } else {
                setMessage({ text: "An unexpected error occurred", type: "error" })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                    <p className="text-gray-600">Add new product URLs to the system</p>
                </div>

                <Card className="overflow-hidden mb-8">
                    <div className="border-b border-gray-200">
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-800">Add New Product</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product URL
                                </label>
                                <Input
                                    id="productUrl"
                                    type="url"
                                    placeholder="Enter product URL"
                                    value={productUrl}
                                    onChange={(e) => setProductUrl(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {message && (
                                <div className={`p-3 rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                    {message.text}
                                </div>
                            )}

                            <div>
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-[#4FB372] hover:bg-[#3d9059] text-white"
                                >
                                    {loading ? "Adding..." : "Add Product"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>

                {/* Product list could be added here in the future */}
            </div>
        </div>
    )
}