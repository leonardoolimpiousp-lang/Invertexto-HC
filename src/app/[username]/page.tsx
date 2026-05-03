import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidSlug } from "@/lib/utils/slug";
import { Workspace } from "@/components/workspace/Workspace";

interface PageProps {
  params: { username: string };
  searchParams: { welcome?: string };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `${params.username} · notepad`,
    robots: { index: false, follow: false },
  };
}

export default async function WorkspacePage({ params, searchParams }: PageProps) {
  const slug = params.username;
  if (!isValidSlug(slug)) notFound();

  const supabase = createSupabaseServerClient();

  const [{ data: profile }, { data: note }] = await Promise.all([
    supabase
      .from("profiles")
      .select("slug, full_name, level, hospital, created_at")
      .eq("slug", slug)
      .maybeSingle(),
    supabase
      .from("notes")
      .select("slug, content, updated_at")
      .eq("slug", slug)
      .maybeSingle() as any,
  ]);

  if (!profile) notFound();

  // log de view (best-effort, não bloqueia render)
  // @ts-expect-error - access_log is not in generated types yet
  void supabase.from("access_log").insert({ slug, event: "view" });

  return (
    <Workspace
      profile={profile}
      initialContent={note?.content ?? ""}
      initialUpdatedAt={note?.updated_at ?? null}
      isWelcome={searchParams.welcome === "1"}
    />
  );
}
