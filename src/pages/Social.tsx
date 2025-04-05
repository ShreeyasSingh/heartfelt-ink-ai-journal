
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { Calendar, Heart, MessageSquare, User, UserPlus, Users } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { 
  getFeedEntries, 
  getDiscoverEntries, 
  getFollowing, 
  getFollowers,
  followUser
} from "@/lib/journal-service";
import { format } from "date-fns";

const Social = () => {
  const { user } = useUser();
  const [feedEntries, setFeedEntries] = useState<JournalEntry[]>([]);
  const [discoverEntries, setDiscoverEntries] = useState<JournalEntry[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingDiscover, setLoadingDiscover] = useState(true);
  const [loadingNetwork, setLoadingNetwork] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    
    // Load feed
    setLoadingFeed(true);
    try {
      const entries = await getFeedEntries(user.id);
      setFeedEntries(entries);
    } catch (error) {
      console.error("Error loading feed:", error);
      toast.error("Failed to load your feed");
    } finally {
      setLoadingFeed(false);
    }
    
    // Load discover
    setLoadingDiscover(true);
    try {
      const entries = await getDiscoverEntries();
      setDiscoverEntries(entries);
    } catch (error) {
      console.error("Error loading discover:", error);
      toast.error("Failed to load discover feed");
    } finally {
      setLoadingDiscover(false);
    }
    
    // Load network
    setLoadingNetwork(true);
    try {
      const [followingUsers, followerUsers] = await Promise.all([
        getFollowing(user.id),
        getFollowers(user.id)
      ]);
      setFollowing(followingUsers);
      setFollowers(followerUsers);
    } catch (error) {
      console.error("Error loading network:", error);
      toast.error("Failed to load your network");
    } finally {
      setLoadingNetwork(false);
    }
  };
  
  const handleFollow = async (userId: string) => {
    if (!user?.id) return;
    
    try {
      await followUser(user.id, userId);
      // Update following list
      setFollowing([...following, userId]);
      toast.success("User followed successfully");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow user");
    }
  };

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  function truncateText(text: string, maxLength: number = 150) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  const renderEntryCard = (entry: JournalEntry) => {
    const userInitials = entry.userId.slice(0, 2).toUpperCase();
    
    return (
      <Card key={entry.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-2" style={{
          backgroundColor: entry.style?.backgroundColor || '#ffffff',
          color: entry.style?.textColor || '#1A1F2C',
        }}>
          <div className="flex items-center gap-3 mb-2">
            <Avatar>
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{entry.userId}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(entry.date), "MMM d, yyyy")}
              </div>
            </div>
          </div>
          <CardTitle className={`font-${entry.style?.fontFamily || 'serif'}`}>
            {entry.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className={`text-sm font-${entry.style?.fontFamily || 'serif'}`}>
            {truncateText(entry.content)}
          </p>
          {entry.images && entry.images.length > 0 && (
            <div className="mt-3 flex gap-1 overflow-hidden">
              {entry.images.slice(0, 1).map((img, i) => (
                <div key={i} className="w-full h-48 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                  <img 
                    src={img} 
                    alt="Journal entry" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 pb-3">
          <Link to={`/entry/${entry.publishId}`}>
            <Button variant="ghost" size="sm">
              Read More
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold">Social Feed</h1>
          <p className="text-muted-foreground">Connect with friends and discover new journals</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs defaultValue="feed">
              <TabsList className="mb-6">
                <TabsTrigger value="feed">My Feed</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
              </TabsList>
              
              <TabsContent value="feed">
                {loadingFeed ? (
                  <div className="flex justify-center items-center py-20">
                    <Spinner size="lg" />
                  </div>
                ) : feedEntries.length === 0 ? (
                  <div className="text-center py-20 bg-secondary/30 rounded-lg">
                    <h2 className="text-2xl font-serif font-semibold mb-4">Your Feed is Empty</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Follow other users to see their journal entries in your feed.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {feedEntries.map(renderEntryCard)}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="discover">
                {loadingDiscover ? (
                  <div className="flex justify-center items-center py-20">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {discoverEntries.map(renderEntryCard)}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-medium mb-4">Find People</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Search for users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Your Network
              </h3>
              
              {loadingNetwork ? (
                <div className="flex justify-center py-4">
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Following ({following.length})</p>
                    {following.length === 0 ? (
                      <p className="text-sm">You're not following anyone yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {following.map(userId => (
                          <div key={userId} className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{userId.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{userId}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Followers ({followers.length})</p>
                    {followers.length === 0 ? (
                      <p className="text-sm">You don't have any followers yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {followers.map(userId => (
                          <div key={userId} className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{userId.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{userId}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Social;
