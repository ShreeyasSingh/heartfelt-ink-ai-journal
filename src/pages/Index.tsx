
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navbar } from "@/components/Navbar";
import { Book, Image, Lock, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-br from-background via-background to-accent/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 tracking-tight">
                  Capture your thoughts with <span className="text-primary">HeartfeltInk</span>
                </h1>
                <p className="text-lg mb-8 text-muted-foreground">
                  A beautiful and private space to write your thoughts, attach images, and reflect on your journey with AI-powered insights.
                </p>
                <div className="flex flex-wrap gap-4">
                  <SignedOut>
                    <Link to="/sign-up">
                      <Button size="lg" className="rounded-full">
                        Start Journaling
                      </Button>
                    </Link>
                    <Link to="/sign-in">
                      <Button size="lg" variant="outline" className="rounded-full">
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link to="/dashboard">
                      <Button size="lg" className="rounded-full">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link to="/journal/new">
                      <Button size="lg" variant="outline" className="rounded-full">
                        New Entry
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>
              <div className="relative animate-fade-in">
                <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-xl journal-card bg-gradient-to-br from-diary-cream to-diary-softPink">
                  <div className="p-6">
                    <div className="h-8 w-3/4 bg-primary/10 rounded mb-4"></div>
                    <div className="h-4 w-full bg-primary/10 rounded mb-3"></div>
                    <div className="h-4 w-full bg-primary/10 rounded mb-3"></div>
                    <div className="h-4 w-5/6 bg-primary/10 rounded mb-6"></div>
                    <div className="h-32 w-full bg-diary-softBlue rounded-lg mb-4"></div>
                    <div className="h-4 w-full bg-primary/10 rounded mb-3"></div>
                    <div className="h-4 w-full bg-primary/10 rounded mb-3"></div>
                    <div className="h-4 w-4/6 bg-primary/10 rounded"></div>
                  </div>
                </div>
                <div className="absolute top-6 right-6 w-40 h-40 rounded-lg bg-diary-softBlue shadow-lg rotate-6 -z-10"></div>
                <div className="absolute bottom-6 left-6 w-40 h-40 rounded-lg bg-primary/20 shadow-lg -rotate-6 -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 md:px-8 lg:px-12 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16 text-center">Journal Your Way</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="journal-card">
                <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-primary/20">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Private Journaling</h3>
                <p className="text-muted-foreground">Write freely in your secure, private space that only you can access.</p>
              </div>
              <div className="journal-card">
                <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-primary/20">
                  <Image className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Rich Media</h3>
                <p className="text-muted-foreground">Add images and customize the look of your journal entries.</p>
              </div>
              <div className="journal-card">
                <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">AI Insights</h3>
                <p className="text-muted-foreground">Get personalized reflections and answers to your questions powered by AI.</p>
              </div>
              <div className="journal-card">
                <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-primary/20">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Optional Sharing</h3>
                <p className="text-muted-foreground">Choose to publish specific entries with others while keeping the rest private.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-8 lg:px-12 bg-primary/10">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Start Your Journal Today</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Join thousands of people who capture their thoughts, memories, and reflections with HeartfeltInk.
            </p>
            <div className="flex justify-center gap-4">
              <SignedOut>
                <Link to="/sign-up">
                  <Button size="lg" className="rounded-full">
                    Get Started — It's Free
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/journal/new">
                  <Button size="lg" className="rounded-full">
                    Create New Entry
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-6 md:px-8 lg:px-12 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              <span className="font-serif font-semibold">HeartfeltInk</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HeartfeltInk. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
