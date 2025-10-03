import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  Edit3, 
  Briefcase, 
  Eye, 
  BookOpen, 
  Settings,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  FileText,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    location: "",
    bio: "",
    skills: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchApplications();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setEditForm({
          fullName: data.full_name || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          skills: data.skills ? data.skills.join(", ") : ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          id,
          created_at,
          job_id,
          jobs (
            title,
            company
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Mock data - in real app this would come from backend
  const profileStats = {
    applicationsSubmitted: applications.length,
    profileViews: 156,
    savedJobs: 8,
    completedProjects: 12
  };

  const savedJobs = [
    { id: 1, title: "🏗️ Masonry Work (Mistri)", company: "Metro Construction", location: "Industrial Area", salary: "₹500-700/day" },
    { id: 2, title: "🏗️ Carpentry Helper", company: "WoodCraft Associates", location: "Workshop District", salary: "₹450-600/day" },
    { id: 3, title: "🚛 Truck Loading Helper", company: "Quick Transport", location: "Transport Hub", salary: "₹400-550/day" },
    { id: 4, title: "🏗️ Painting Work", company: "Color Masters", location: "Residential Areas", salary: "₹500-650/day" },
    { id: 5, title: "🏠 Household Shifting", company: "EasyMove Services", location: "City Wide", salary: "₹600-800/day" },
    { id: 6, title: "🌱 Farm Labor Assistant", company: "AgriWork Co-op", location: "Rural Areas", salary: "₹350-500/day" },
    { id: 7, title: "🏢 Event Setup Helper", company: "Event Solutions", location: "Various Venues", salary: "₹450-600/day" },
    { id: 8, title: "🏗️ Concrete Mixing Helper", company: "Strong Build Ltd", location: "Construction Sites", salary: "₹400-550/day" },
  ];

  const handleEditSubmit = async () => {
    try {
      const skillsArray = editForm.skills
        ? editForm.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user?.id,
          full_name: editForm.fullName,
          phone: editForm.phone,
          location: editForm.location,
          bio: editForm.bio,
          skills: skillsArray
        });

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved."
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Interview": return "bg-blue-100 text-blue-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Accepted": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Please log in to view your profile</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile and track your job applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-xl">{editForm.fullName || user.email}</CardTitle>
                <CardDescription className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editForm.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {editForm.location}
                  </div>
                )}
                {editForm.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    {editForm.phone}
                  </div>
                )}
                {editForm.bio && (
                  <div className="text-sm text-muted-foreground">
                    <p>{editForm.bio}</p>
                  </div>
                )}
                
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="skills">Skills (comma-separated)</Label>
                        <Input
                          id="skills"
                          value={editForm.skills}
                          onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleEditSubmit} className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profile Views</span>
                  <Badge variant="secondary">{profileStats.profileViews}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <Badge variant="secondary">{profileStats.applicationsSubmitted}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Saved Jobs</span>
                  <Badge variant="secondary">{profileStats.savedJobs}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed Projects</span>
                  <Badge variant="secondary">{profileStats.completedProjects}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Job Applications ({profileStats.applicationsSubmitted})
                    </CardTitle>
                    <CardDescription>
                      Track your job applications and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No applications yet. Start applying to jobs!
                        </p>
                      ) : (
                        applications.map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div>
                              <h4 className="font-semibold text-foreground">{app.jobs?.title || "Job Title"}</h4>
                              <p className="text-sm text-muted-foreground">{app.jobs?.company || "Company"}</p>
                              <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                Applied on {new Date(app.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              Applied
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Saved Jobs ({profileStats.savedJobs})
                    </CardTitle>
                    <CardDescription>
                      Jobs you've saved for later application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savedJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-semibold text-foreground">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.location}
                              </span>
                              <span className="text-xs text-primary font-medium">{job.salary}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Apply Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your recent platform activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-primary bg-muted/50 rounded">
                        <Eye className="w-4 h-4 mt-1 text-primary" />
                        <div>
                          <p className="text-sm text-foreground">Profile viewed by 5 employers</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-blue-500 bg-muted/50 rounded">
                        <FileText className="w-4 h-4 mt-1 text-blue-500" />
                        <div>
                          <p className="text-sm text-foreground">Applied to Frontend Developer at Tech Corp</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-green-500 bg-muted/50 rounded">
                        <Star className="w-4 h-4 mt-1 text-green-500" />
                        <div>
                          <p className="text-sm text-foreground">Received a 5-star rating from previous client</p>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Email Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-muted-foreground">Job recommendations</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-muted-foreground">Application updates</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-muted-foreground">Weekly job digest</span>
                        </label>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Privacy Settings</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-muted-foreground">Make profile visible to employers</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-muted-foreground">Allow contact from recruiters</span>
                        </label>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Reset Password</Button>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;