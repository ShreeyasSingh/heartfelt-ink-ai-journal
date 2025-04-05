
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Calendar, Heart, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { JournalEntry } from "@/types/journal";
import { getPublishedEntry } from "@/lib/journal-service";
import { format } from "date-fns";
import { Navbar } from "@/components/Navbar";

const PublishedEntry = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPublishedEntry();
    }
  }, [id]);

  const loadPublishedEntry = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const publishedEntry = await getPublishedEntry(id);
      if (publishedEntry) {
        setEntry(publishedEntry);
      } else {
        setError("The journal entry you're looking for doesn't exist or isn't published.");
      }
    } catch (e) {
      console.error("Error loading published entry:", e);
      setError("There was a problem loading this journal entry.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Entry Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || "The requested journal entry is not available."}</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = entry.userId.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 max-w-3xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
        
        <div
          className="bg-card rounded-lg p-8 shadow-md"
          style={{
            backgroundColor: entry.style?.backgroundColor || '#ffffff',
            color: entry.style?.textColor || '#1A1F2C',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Avatar>
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{entry.userId}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(entry.date), "MMMM d, yyyy")}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h1 
              className="text-3xl md:text-4xl mb-4"
              style={{
                fontFamily: entry.style?.fontFamily === 'serif' ? 'Playfair Display, serif' : 'Inter, sans-serif',
              }}
            >
              {entry.title}
            </h1>
          </div>
          
          <div className="prose max-w-none">
            <p
              style={{
                fontFamily: entry.style?.fontFamily === 'serif' ? 'Playfair Display, serif' : 'Inter, sans-serif',
                whiteSpace: 'pre-line',
              }}
            >
              {entry.content}
            </p>
          </div>
          
          {entry.images.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-4">
              {entry.images.map((img, i) => (
                <div key={i} className="rounded-md overflow-hidden">
                  <img 
                    src={img} 
                    alt={`Journal image ${i + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t flex justify-between">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Like</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Comment</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm">Share</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublishedEntry;
