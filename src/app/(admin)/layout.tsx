import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("devjourney_token")?.value;

  if (!token) redirect("/login");

  let user;
  try {
    user = verifyToken(token);
    if (user.role?.toLowerCase() !== "admin") redirect("/dashboard");
  } catch {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar user={{ name: user.name, email: user.email }} />
      <main className="flex-1 md:ml-60">
        <div className="pt-16 md:pt-0 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
