import { getRaceData } from "@/lib/kv";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | Backyard Ultra Tracker",
};

export default async function AdminPage() {
  const data = await getRaceData();
  return <AdminShell initialData={data} />;
}
