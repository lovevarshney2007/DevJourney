import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { StudentSidebar } from "@/components/student/StudentSidebar";

export default async function StudentLayout({
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
    if (user.role !== "student") redirect("/admin/dashboard");
  } catch {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <StudentSidebar
        user={{ name: user.name, email: user.email, studentNumber: undefined }}
      />
      <main className="flex-1 md:ml-60">
        <div className="pt-16 md:pt-0 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
