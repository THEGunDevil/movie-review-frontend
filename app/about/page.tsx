import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <h1 className="text-4xl font-bold">About Framewise</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Framewise is a portfolio movie review website featuring film criticism,
        ratings, trailers, essays, and curated watchlists.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <h2 className="text-2xl font-semibold">128+</h2>
            <p className="text-muted-foreground">Movie reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-2xl font-semibold">42</h2>
            <p className="text-muted-foreground">Film essays</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-2xl font-semibold">19</h2>
            <p className="text-muted-foreground">Festival notes</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}