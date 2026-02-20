import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Ole Knitwear admin dashboard for managing products and customers.",
  openGraph: {
    title: "Admin Dashboard | Ole Knitwear",
    description: "Ole Knitwear admin dashboard for managing products and customers.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ole-knitwear.com"}/admin`,
    type: "website",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
