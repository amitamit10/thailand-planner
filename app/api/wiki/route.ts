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

async function getWikiData(query: string): Promise<{
  image: string | null;
  extract: string | null;
  title: string | null;
}> {
  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&srlimit=1&format=json&origin=*`
    );
    if (!searchRes.ok) return { image: null, extract: null, title: null };
    const searchData = await searchRes.json();
    const title: string | undefined = searchData.query?.search?.[0]?.title;
    if (!title) return { image: null, extract: null, title: null };

    const [imgRes, extRes] = await Promise.all([
      fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          title
        )}&prop=pageimages&pithumbsize=800&format=json&origin=*`
      ),
      fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          title
        )}&prop=extracts&exintro&explaintext&exsentences=3&format=json&origin=*`
      ),
    ]);

    let image: string | null = null;
    let extract: string | null = null;
    if (imgRes.ok) {
      const d = await imgRes.json();
      const page: any = Object.values(d.query?.pages ?? {})[0];
      image = page?.thumbnail?.source ?? null;
    }
    if (extRes.ok) {
      const d = await extRes.json();
      const page: any = Object.values(d.query?.pages ?? {})[0];
      extract = page?.extract ?? null;
    }
    return { image, extract, title };
  } catch {
    return { image: null, extract: null, title: null };
  }
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });

  const data = await getWikiData(query);
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=86400" },
  });
}

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });
  // Return image bytes directly for <img> usage (proxied from Wikipedia)
  const data = await getWikiData(query);
  if (!data.image || !isSafeUrl(data.image))
    return NextResponse.json({ error: "no photo" }, { status: 404 });
  try {
    const imgRes = await fetch(data.image);
    if (!imgRes.ok) throw new Error("upstream");
    const buf = await imgRes.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "upstream failed" }, { status: 502 });
  }
}
