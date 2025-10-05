import { Button } from "@/components/ui/button";
import { MapPin, Clock, User, Users, Bookmark, BookmarkCheck } from "lucide-react";
import { useState, useEffect } from "react";
import JobApplicationModal from "./JobApplicationModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface JobCardProps {
  jobId: string;
  title: string;
  company: string;
  location: string;
  wage: string;
  type: string;
  description: string;
  skills: string[];
  postedTime: string;
  positionsAvailable: number;
  positionsFilled: number;
}

const JobCard = ({ jobId, title, company, location, wage, type, description, skills, postedTime, positionsAvailable, positionsFilled }: JobCardProps) => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const isFull = positionsFilled >= positionsAvailable;
  const positionsRemaining = positionsAvailable - positionsFilled;

  useEffect(() => {
    checkIfSaved();
  }, [jobId, user]);

  const checkIfSaved = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("job_id", jobId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setIsSaved(!!data);
    } catch (error) {
      console.error("Error checking if job is saved:", error);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save jobs.",
        variant: "destructive"
      });
      return;
    }

    setSaveLoading(true);
    try {
      if (isSaved) {
        // Unsave the job
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("job_id", jobId)
          .eq("user_id", user.id);

        if (error) throw error;

        setIsSaved(false);
        toast({
          title: "Job Removed",
          description: `${title} has been removed from your saved jobs.`,
        });
      } else {
        // Save the job
        const { error } = await supabase
          .from("saved_jobs")
          .insert({
            job_id: jobId,
            user_id: user.id
          });

        if (error) throw error;

        setIsSaved(true);
        toast({
          title: "Job Saved!",
          description: `${title} has been saved to your favorites.`,
        });
      }
    } catch (error: any) {
      console.error("Error saving job:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };
  return (
    <div className={`bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 ${isFull ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-card-foreground mb-1">{title}</h3>
          <div className="flex items-center text-muted-foreground mb-2">
            <User className="w-4 h-4 mr-1" />
            <span className="text-sm">{company}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">{wage}</div>
          <div className="text-sm text-muted-foreground">{type}</div>
        </div>
      </div>
      
      <div className="flex items-center text-muted-foreground mb-3 flex-wrap gap-y-1">
        <MapPin className="w-4 h-4 mr-1" />
        <span className="text-sm">{location}</span>
        <Clock className="w-4 h-4 ml-4 mr-1" />
        <span className="text-sm">{postedTime}</span>
        <Users className="w-4 h-4 ml-4 mr-1" />
        <span className={`text-sm font-medium ${isFull ? 'text-destructive' : 'text-primary'}`}>
          {isFull ? 'Positions Filled' : `${positionsRemaining} position${positionsRemaining !== 1 ? 's' : ''} available`}
        </span>
      </div>
      
      <p className="text-card-foreground mb-4 text-sm leading-relaxed">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex gap-3">
        <Button 
          variant="default" 
          className="flex-1"
          onClick={() => setIsApplicationModalOpen(true)}
          disabled={isFull}
        >
          {isFull ? 'Positions Filled' : 'Apply Now'}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleSaveJob}
          disabled={saveLoading}
          title={isSaved ? "Unsave Job" : "Save Job"}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </Button>
      </div>

      <JobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        jobId={jobId}
        jobTitle={title}
        company={company}
      />
    </div>
  );
};

export default JobCard;