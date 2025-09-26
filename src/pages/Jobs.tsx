import { useState } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobCard from "@/components/JobCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Mock job data
  const jobs = [
    {
      title: "Experienced Carpenter",
      company: "BuildCorp Construction",
      location: "New York, NY",
      wage: "$35/hour",
      type: "Full-time",
      description: "Looking for an experienced carpenter for residential construction projects. Must have 5+ years experience with framing, finishing, and custom woodwork.",
      skills: ["Framing", "Finish Carpentry", "Blueprint Reading"],
      postedTime: "2 hours ago"
    },
    {
      title: "Licensed Electrician",
      company: "PowerTech Solutions",
      location: "Brooklyn, NY",
      wage: "$40-45/hour",
      type: "Contract",
      description: "Commercial electrician needed for large office building project. Must be licensed and have experience with commercial electrical systems.",
      skills: ["Commercial Wiring", "Electrical Code", "Troubleshooting"],
      postedTime: "4 hours ago"
    },
    {
      title: "Masonry Specialist",
      company: "Stone & Brick Masters",
      location: "Queens, NY",
      wage: "$38/hour",
      type: "Full-time",
      description: "Skilled mason needed for high-end residential projects. Experience with natural stone, brick, and decorative masonry required.",
      skills: ["Stone Work", "Brick Laying", "Restoration"],
      postedTime: "1 day ago"
    },
    {
      title: "HVAC Technician",
      company: "Cool Air Systems",
      location: "Manhattan, NY",
      wage: "$42/hour",
      type: "Full-time",
      description: "HVAC technician for installation and maintenance of commercial systems. EPA certification required.",
      skills: ["HVAC Installation", "System Maintenance", "EPA Certified"],
      postedTime: "2 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Next Job</h1>
          <p className="text-xl text-muted-foreground">Discover opportunities with top employers in your area</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <Button variant="outline" size="sm">All Jobs</Button>
            <Button variant="outline" size="sm">Carpentry</Button>
            <Button variant="outline" size="sm">Electrical</Button>
            <Button variant="outline" size="sm">Masonry</Button>
            <Button variant="outline" size="sm">HVAC</Button>
            <Button variant="outline" size="sm">Plumbing</Button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {jobs.length} jobs in your area
          </p>
          <select className="bg-background border border-border rounded-md px-3 py-2 text-sm">
            <option>Most Recent</option>
            <option>Highest Pay</option>
            <option>Closest Distance</option>
          </select>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;