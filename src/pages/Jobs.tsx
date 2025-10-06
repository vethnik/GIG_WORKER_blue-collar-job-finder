import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, MapPin, Plus, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobCard from "@/components/JobCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostJobModal from "@/components/PostJobModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance } from "@/lib/distance";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Jobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Jobs");
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'pay' | 'distance'>('recent');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
  const [showLocationBanner, setShowLocationBanner] = useState(false);
  const [radiusFilter, setRadiusFilter] = useState<number | null>(null);

  // Define filter categories
  const categories = [
    "All Jobs",
    "🏗️ Construction-Related Work",
    "🚛 Loading & Unloading",
    "🏠 Household Work",
    "🌱 Outdoor & Agricultural Work",
    "🏢 Small Contract Work",
  ];

  useEffect(() => {
    fetchJobs();
    requestUserLocation();
  }, []);

  const requestUserLocation = () => {
    const locationPref = localStorage.getItem('locationPermission');
    
    if (locationPref === 'denied') {
      setLocationPermission('denied');
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationPermission('granted');
          localStorage.setItem('locationPermission', 'granted');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission('denied');
          setShowLocationBanner(true);
        }
      );
    } else {
      setLocationPermission('denied');
    }
  };

  const handleEnableLocation = () => {
    localStorage.removeItem('locationPermission');
    setShowLocationBanner(false);
    requestUserLocation();
  };

  const handleDismissBanner = () => {
    setShowLocationBanner(false);
    localStorage.setItem('locationPermission', 'denied');
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobPosted = () => {
    fetchJobs();
  };

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .map((job) => ({
        ...job,
        distance:
          userLocation && job.latitude && job.longitude
            ? calculateDistance(userLocation.lat, userLocation.lng, job.latitude, job.longitude)
            : null,
      }))
      .filter((job) => {
        const matchesCategory =
          selectedCategory === "All Jobs" ||
          job.category === selectedCategory ||
          job.title.toLowerCase().includes(selectedCategory.toLowerCase());

        const matchesSearch =
          searchTerm === "" ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.skills &&
            job.skills.some((skill: string) =>
              skill.toLowerCase().includes(searchTerm.toLowerCase())
            ));

        const matchesLocation =
          locationFilter === "" ||
          job.location.toLowerCase().includes(locationFilter.toLowerCase());

        const matchesRadius =
          !radiusFilter || !job.distance || job.distance <= radiusFilter;

        return matchesCategory && matchesSearch && matchesLocation && matchesRadius;
      })
      .sort((a, b) => {
        if (sortBy === 'distance' && a.distance && b.distance) {
          return a.distance - b.distance;
        }
        if (sortBy === 'recent') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'pay') {
          // Best effort wage parsing
          const getWageNum = (wage: string) => {
            const match = wage.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getWageNum(b.wage) - getWageNum(a.wage);
        }
        return 0;
      });
  }, [jobs, selectedCategory, searchTerm, locationFilter, radiusFilter, sortBy, userLocation]);

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Find Your Next Job
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover opportunities with top employers in your area
              </p>
            </div>
            {user && (
              <Button
                size="lg"
                onClick={() => setIsPostJobModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Post a Job
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Banner */}
        {showLocationBanner && (
          <Alert className="mb-6 bg-primary/5 border-primary/20">
            <Navigation className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                📍 Enable location to see jobs closest to you and sort by distance
              </span>
              <div className="flex gap-2 ml-4">
                <Button size="sm" onClick={handleEnableLocation}>
                  Enable Location
                </Button>
                <Button size="sm" variant="outline" onClick={handleDismissBanner}>
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search jobs (e.g., carpenter, electrician)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative md:w-64">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="default" className="md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Distance Filter */}
          {userLocation && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Distance from you:</span>
              {[5, 10, 25, null].map((radius) => (
                <Button
                  key={radius || 'all'}
                  variant={radiusFilter === radius ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRadiusFilter(radius)}
                >
                  {radius ? `Within ${radius}km` : 'Any distance'}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredJobs.length} jobs
            {radiusFilter && ` within ${radiusFilter}km`}
            {selectedCategory !== "All Jobs" && (
              <span className="ml-2 text-primary">
                • Filtered by {selectedCategory}
              </span>
            )}
          </p>
          <select 
            className="bg-background border border-border rounded-md px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'pay' | 'distance')}
          >
            <option value="recent">Most Recent</option>
            <option value="pay">Highest Pay</option>
            <option value="distance" disabled={!userLocation}>
              Closest Distance {!userLocation && '(Enable location)'}
            </option>
          </select>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">Loading jobs...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                jobId={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                wage={job.wage}
                type={job.type}
                description={job.description}
                skills={job.skills || []}
                postedTime={getTimeAgo(job.created_at)}
                positionsAvailable={job.positions_available || 1}
                positionsFilled={job.positions_filled || 0}
                distance={job.distance}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No jobs found matching your criteria
                {radiusFilter && ` within ${radiusFilter}km`}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("All Jobs");
                  setSearchTerm("");
                  setLocationFilter("");
                  setRadiusFilter(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      </div>

      <Footer />
      
      <PostJobModal
        open={isPostJobModalOpen}
        onOpenChange={setIsPostJobModalOpen}
        onJobPosted={handleJobPosted}
      />
    </div>
  );
};

export default Jobs;