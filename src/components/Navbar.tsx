
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { UserButton, useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Book, Home, Plus, Settings } from "lucide-react";

export function Navbar() {
  const { user } = useUser();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            <span className="text-lg font-serif font-semibold">HeartfeltInk</span>
          </Link>
        </div>
        <nav className="flex items-center gap-2">
          <SignedIn>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/journal/new">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserButton afterSignOutUrl="/" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button variant="default" size="sm">
                Get Started
              </Button>
            </Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
