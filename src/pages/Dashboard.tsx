import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Calendar, Edit, Share, Trash } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { getUserEntries, deleteJournalEntry } from "@/lib/journal-service";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user } = useUser();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchEntries();
    }
  }, [user?.id]);

  const fetchEntries = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const userEntries = await getUserEntries(user.id);
      setEntries(userEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast.error("Failed to load your journal entries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !user?.id) return;
    
    try {
      await deleteJournalEntry(deleteId, user.id);
      setEntries(entries.filter(entry => entry.id !== deleteId));
      toast.success("Journal entry deleted");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete journal entry");
    } finally {
      setDeleteId(null);
      setOpenDeleteDialog(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  function truncateText(text: string, maxLength: number = 100) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">My Journal</h1>
          <Link to="/journal/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 bg-secondary/30 rounded-lg">
            <h2 className="text-2xl font-serif font-semibold mb-4">Start Your Journal Journey</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Begin capturing your thoughts, feelings, and experiences with your first entry.
            </p>
            <Link to="/journal/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Entry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2" style={{
                  backgroundColor: entry.style?.backgroundColor || '#ffffff',
                  color: entry.style?.textColor || '#1A1F2C',
                  borderBottom: `1px solid ${entry.style?.borderColor || '#e2e8f0'}`
                }}>
                  <CardTitle className={`font-${entry.style?.fontFamily || 'serif'}`}>
                    {entry.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(entry.date), "MMM d, yyyy")}
                    {entry.isPublished && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                        Published
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className={`text-sm line-clamp-3 font-${entry.style?.fontFamily || 'serif'}`}>
                    {truncateText(entry.content)}
                  </p>
                  {entry.images && entry.images.length > 0 && (
                    <div className="mt-3 flex gap-1 overflow-x-auto">
                      {entry.images.slice(0, 3).map((img, i) => (
                        <div key={i} className="w-16 h-16 rounded-md bg-muted flex-shrink-0"></div>
                      ))}
                      {entry.images.length > 3 && (
                        <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 flex items-center justify-center text-sm">
                          +{entry.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4 pb-3">
                  <Link to={`/journal/${entry.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <div className="flex gap-1">
                    {entry.isPublished && (
                      <Link to={`/entry/${entry.publishId}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmDelete(entry.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this journal entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
