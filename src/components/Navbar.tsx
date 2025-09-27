import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-foreground hover:text-primary transition-colors">
              Find Jobs
            </Link>
            <Link to="/workers" className="text-foreground hover:text-primary transition-colors">
              Find Workers
            </Link>
            <a href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.user_metadata?.full_name || user.email}
                </span>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-border animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/jobs"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                Find Jobs
              </Link>
              <Link
                to="/workers"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                Find Workers
              </Link>
              <a
                href="/about"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                About
              </a>
              <div className="pt-4 pb-2 space-y-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Welcome, {user.user_metadata?.full_name || user.email}
                    </div>
                    <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button variant="hero" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;