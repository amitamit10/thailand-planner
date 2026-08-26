import { NextRequest, NextResponse } from "next/server";

const SAFE_HOSTS = ["upload.wikimedia.org", "images.unsplash.com"];

function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    return SAFE_HOSTS.some((h) => host === h || host.endsWith("." + h));
  } catch {
    return false;
  }
}

async function getWikipediaPhoto(query: string): Promise<string | null> {
  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&srlimit=1&format=json&origin=*`,
      { next: { revalidate: 86400 } }
    );
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const title: string | undefined = searchData.query?.search?.[0]?.title;
    if (!title) return null;
    const imgRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        title
      )}&prop=pageimages&pithumbsize=800&format=json&origin=*`,
      { next: { revalidate: 86400 } }
    );
    if (!imgRes.ok) return null;
    const imgData = await imgRes.json();
    const pages = imgData.query?.pages ?? {};
    const page: any = Object.values(pages)[0];
    return page?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });

  const photoUrl = await getWikipediaPhoto(query);
  if (!photoUrl || !isSafeUrl(photoUrl))
    return NextResponse.json({ error: "no photo found" }, { status: 404 });

  try {
    const imgRes = await fetch(photoUrl);
    if (!imgRes.ok) throw new Error("upstream failed");
    const buffer = await imgRes.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "upstream failed" }, { status: 502 });
  }
}
