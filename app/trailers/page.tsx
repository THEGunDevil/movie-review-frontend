import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">About Framewise</h1>

        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Framewise is a movie review portfolio website built for showcasing film
          criticism, ratings, trailers, essays, and a clean reviewer identity.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold">4</h2>
              <p className="text-muted-foreground">Featured films</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold">9.0</h2>
              <p className="text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold">100%</h2>
              <p className="text-muted-foreground">Portfolio ready</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}