import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, User } from "lucide-react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  wage: string;
  type: string;
  description: string;
  skills: string[];
  postedTime: string;
}

const JobCard = ({ title, company, location, wage, type, description, skills, postedTime }: JobCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
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
      
      <div className="flex items-center text-muted-foreground mb-3">
        <MapPin className="w-4 h-4 mr-1" />
        <span className="text-sm">{location}</span>
        <Clock className="w-4 h-4 ml-4 mr-1" />
        <span className="text-sm">{postedTime}</span>
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
        <Button variant="default" className="flex-1">
          Apply Now
        </Button>
        <Button variant="outline" size="icon">
          <DollarSign className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default JobCard;