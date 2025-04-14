import { Metadata } from "next"
import AdminRegister from "@/components/AdminRegister"

export const metadata: Metadata = {
  title: "Admin Registration",
  description: "Register as an admin user",
}

export default function RegisterPage() {
  return <AdminRegister />
}