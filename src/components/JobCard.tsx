import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, User, Users } from "lucide-react";
import { useState } from "react";
import JobApplicationModal from "./JobApplicationModal";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const isFull = positionsFilled >= positionsAvailable;
  const positionsRemaining = positionsAvailable - positionsFilled;

  const handleSaveJob = () => {
    toast({
      title: "Job Saved!",
      description: `${title} at ${company} has been saved to your favorites.`,
    });
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
          title="Save Job"
        >
          <DollarSign className="w-4 h-4" />
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