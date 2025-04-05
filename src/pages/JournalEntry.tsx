
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Image, Save, Send, Share, Sparkles, Palette } from "lucide-react";
import { JournalEntry, JournalStyle, AIResponse } from "@/types/journal";
import {
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  publishJournalEntry,
  unpublishJournalEntry,
} from "@/lib/journal-service";
import { getAIResponse } from "@/lib/ai-service";
import { toast } from "@/components/ui/sonner";

const JournalEntryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [styleDialogOpen, setStyleDialogOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<AIResponse>({
    answer: "",
    isLoading: false,
    error: null,
  });

  const [entry, setEntry] = useState<JournalEntry>({
    id: "",
    title: "",
    content: "",
    date: new Date().toISOString(),
    userId: user?.id || "",
    isPublished: false,
    images: [],
    tags: [],
    style: {
      fontFamily: "serif",
      backgroundColor: "#ffffff",
      textColor: "#1A1F2C",
      borderColor: "#e2e8f0",
    },
  });

  useEffect(() => {
    if (id && user?.id) {
      loadEntry();
    }
  }, [id, user?.id]);

  const loadEntry = async () => {
    if (!id || !user?.id) return;
    
    setLoading(true);
    try {
      const journalEntry = await getJournalEntry(id, user.id);
      if (journalEntry) {
        setEntry(journalEntry);
      } else {
        toast.error("Journal entry not found");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error loading entry:", error);
      toast.error("Failed to load journal entry");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    if (!entry.title.trim()) {
      toast.error("Please add a title to your journal entry");
      return;
    }
    
    setSaving(true);
    try {
      if (id) {
        await updateJournalEntry(id, user.id, entry);
        toast.success("Journal entry updated");
      } else {
        const newEntry = await createJournalEntry({
          ...entry,
          userId: user.id,
        });
        navigate(`/journal/${newEntry.id}`);
        toast.success("Journal entry created");
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save journal entry");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!id || !user?.id) return;
    
    setPublishing(true);
    try {
      if (entry.isPublished) {
        const updated = await unpublishJournalEntry(id, user.id);
        if (updated) {
          setEntry(updated);
          toast.success("Journal entry unpublished");
        }
      } else {
        const updated = await publishJournalEntry(id, user.id);
        if (updated) {
          setEntry(updated);
          toast.success("Journal entry published");
        }
      }
    } catch (error) {
      console.error("Error publishing/unpublishing entry:", error);
      toast.error("Failed to update publication status");
    } finally {
      setPublishing(false);
    }
  };

  const handleAskAI = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question for the AI");
      return;
    }
    
    setAiResponse({
      answer: "",
      isLoading: true,
      error: null,
    });
    
    try {
      const response = await getAIResponse(entry.content, question);
      setAiResponse({
        answer: response,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAiResponse({
        answer: "",
        isLoading: false,
        error: "Failed to get AI response. Please try again.",
      });
    }
  };

  const handleStyleChange = (field: keyof JournalStyle, value: string) => {
    setEntry({
      ...entry,
      style: {
        ...entry.style,
        [field]: value,
      },
    });
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-serif font-bold">
              {id ? "Edit Journal Entry" : "New Journal Entry"}
            </h1>
          </div>
          <div className="flex gap-2">
            {id && (
              <Button
                variant="outline"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <Share className="mr-2 h-4 w-4" />
                )}
                {entry.isPublished ? "Unpublish" : "Publish"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setStyleDialogOpen(true)}
            >
              <Palette className="mr-2 h-4 w-4" />
              Style
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                className="text-xl font-serif"
              />
              
              <Textarea
                placeholder="Write your thoughts here..."
                value={entry.content}
                onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                className="journal-editor min-h-[50vh]"
                style={{
                  fontFamily: entry.style?.fontFamily === 'serif' ? 'Playfair Display, serif' : 'Inter, sans-serif',
                  backgroundColor: entry.style?.backgroundColor || '#ffffff',
                  color: entry.style?.textColor || '#1A1F2C',
                  border: `1px solid ${entry.style?.borderColor || '#e2e8f0'}`,
                }}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-4">
              <Tabs defaultValue="images">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="ai">AI Helper</TabsTrigger>
                </TabsList>
                
                <TabsContent value="images">
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Image className="mr-2 h-4 w-4" />
                      Add Images
                    </Button>
                    
                    {entry.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {entry.images.map((img, i) => (
                          <div key={i} className="aspect-square bg-muted rounded-md"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No images added yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="ai">
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setAiDialogOpen(true)}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Ask AI About Your Entry
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Use AI to gain insights about your journal entry or answer questions based on your writing.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* AI Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ask AI About Your Journal</DialogTitle>
            <DialogDescription>
              Get insights or ask questions about your journal entry
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask something about your journal..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Button size="icon" onClick={handleAskAI} disabled={aiResponse.isLoading}>
                {aiResponse.isLoading ? <Spinner size="sm" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            
            {aiResponse.answer && (
              <div className="p-4 bg-accent/40 rounded-lg">
                <p className="text-sm">{aiResponse.answer}</p>
              </div>
            )}
            
            {aiResponse.error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                <p className="text-sm">{aiResponse.error}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAiDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Style Dialog */}
      <Dialog open={styleDialogOpen} onOpenChange={setStyleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Your Journal</DialogTitle>
            <DialogDescription>
              Change the appearance of your journal entry
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label>Font Style</Label>
              <Select
                value={entry.style.fontFamily}
                onValueChange={(value) => handleStyleChange("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="sans">Sans-serif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {["#ffffff", "#FEF7CD", "#FFDEE2", "#D3E4FD", "#E5DEFF"].map((color) => (
                  <div
                    key={color}
                    className={`h-8 rounded-md cursor-pointer ${
                      entry.style.backgroundColor === color ? "ring-2 ring-primary" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleStyleChange("backgroundColor", color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {["#1A1F2C", "#4A5568", "#805AD5", "#3182CE", "#38A169"].map((color) => (
                  <div
                    key={color}
                    className={`h-8 rounded-md cursor-pointer ${
                      entry.style.textColor === color ? "ring-2 ring-primary" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleStyleChange("textColor", color)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStyleDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JournalEntryPage;
