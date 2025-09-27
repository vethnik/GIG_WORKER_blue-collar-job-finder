import { useState } from "react";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WorkerCard from "@/components/WorkerCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Workers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Workers");
  const [displayedWorkers, setDisplayedWorkers] = useState(6); // Initially show 6 workers

  // Define filter categories
  const categories = [
    "All Workers",
    "Carpenters", 
    "Electricians",
    "Masons",
    "HVAC",
    "Plumbers",
    "Tile Installers"
  ];

  // Mock worker data
  const workers = [
    {
      name: "Mike Johnson",
      trade: "Master Carpenter",
      location: "Brooklyn, NY",
      rating: 4.9,
      reviewCount: 27,
      skills: ["Framing", "Custom Cabinets", "Finish Work", "Blueprint Reading"],
      yearsExperience: 12,
      phone: "(555) 123-4567",
      email: "mike@example.com"
    },
    {
      name: "Sarah Chen",
      trade: "Licensed Electrician",
      location: "Manhattan, NY",
      rating: 4.8,
      reviewCount: 34,
      skills: ["Commercial Wiring", "Residential", "Code Compliance", "Troubleshooting"],
      yearsExperience: 8,
      phone: "(555) 234-5678",
      email: "sarah@example.com"
    },
    {
      name: "Carlos Rodriguez",
      trade: "Stone Mason",
      location: "Queens, NY",
      rating: 5.0,
      reviewCount: 19,
      skills: ["Natural Stone", "Brick Work", "Restoration", "Custom Design"],
      yearsExperience: 15,
      phone: "(555) 345-6789",
      email: "carlos@example.com"
    },
    {
      name: "David Kim",
      trade: "HVAC Specialist",
      location: "Bronx, NY",
      rating: 4.7,
      reviewCount: 22,
      skills: ["Installation", "Maintenance", "Commercial Systems", "EPA Certified"],
      yearsExperience: 10,
      phone: "(555) 456-7890",
      email: "david@example.com"
    },
    {
      name: "Amanda Thompson",
      trade: "Master Plumber",
      location: "Staten Island, NY",
      rating: 4.9,
      reviewCount: 31,
      skills: ["Residential Plumbing", "Emergency Repair", "Pipe Installation", "Water Heaters"],
      yearsExperience: 14,
      phone: "(555) 567-8901",
      email: "amanda@example.com"
    },
    {
      name: "Robert Wilson",
      trade: "Tile Installer",
      location: "Long Island, NY",
      rating: 4.6,
      reviewCount: 16,
      skills: ["Ceramic Tile", "Natural Stone", "Bathroom Remodel", "Commercial"],
      yearsExperience: 9,
      phone: "(555) 678-9012",
      email: "robert@example.com"
    }
  ];

  // Filter workers based on selected category and search term
  const filteredWorkers = workers.filter(worker => {
    const matchesCategory = selectedCategory === "All Workers" || 
      worker.trade.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, -1)) || // Remove 's' from plural
      (selectedCategory === "Carpenters" && worker.trade.toLowerCase().includes("carpenter")) ||
      (selectedCategory === "Electricians" && worker.trade.toLowerCase().includes("electrician")) ||
      (selectedCategory === "Masons" && worker.trade.toLowerCase().includes("mason")) ||
      (selectedCategory === "HVAC" && worker.trade.toLowerCase().includes("hvac")) ||
      (selectedCategory === "Plumbers" && worker.trade.toLowerCase().includes("plumber")) ||
      (selectedCategory === "Tile Installers" && worker.trade.toLowerCase().includes("tile"));
    
    const matchesSearch = searchTerm === "" || 
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === "" ||
      worker.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesCategory && matchesSearch && matchesLocation;
  });

  // Get workers to display based on current limit
  const workersToShow = filteredWorkers.slice(0, displayedWorkers);
  const hasMoreWorkers = filteredWorkers.length > displayedWorkers;

  const loadMoreWorkers = () => {
    setDisplayedWorkers(prev => Math.min(prev + 6, filteredWorkers.length));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Find Skilled Workers</h1>
          <p className="text-xl text-muted-foreground">Connect with qualified professionals in your area</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search workers (e.g., carpenter, electrician)"
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
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {filteredWorkers.length} skilled workers found
            {selectedCategory !== "All Workers" && (
              <span className="ml-2 text-primary">
                • Filtered by {selectedCategory}
              </span>
            )}
          </p>
          <select className="bg-background border border-border rounded-md px-3 py-2 text-sm">
            <option>Highest Rated</option>
            <option>Most Experience</option>
            <option>Most Reviews</option>
            <option>Closest Distance</option>
          </select>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkers.length > 0 ? (
            workersToShow.map((worker, index) => (
              <WorkerCard key={index} {...worker} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No workers found matching your criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("All Workers");
                  setSearchTerm("");
                  setLocationFilter("");
                  setDisplayedWorkers(6);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMoreWorkers && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={loadMoreWorkers}>
              Load More Workers ({filteredWorkers.length - displayedWorkers} remaining)
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Workers;