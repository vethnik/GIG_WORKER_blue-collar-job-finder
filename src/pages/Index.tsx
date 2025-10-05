import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Briefcase, Shield, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose Gig Worker?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The most trusted platform for connecting skilled workers with quality employers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg border border-border bg-card shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Verified Professionals</h3>
              <p className="text-muted-foreground">
                All workers are background-checked and skill-verified for your peace of mind
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg border border-border bg-card shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Secure Payments</h3>
              <p className="text-muted-foreground">
                Protected payment system ensures safe transactions for both parties
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg border border-border bg-card shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Quick Matching</h3>
              <p className="text-muted-foreground">
                Advanced algorithms match you with the perfect workers or jobs instantly
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who trust Gig Worker for their career and hiring needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" asChild>
              <a href="/jobs">
                Find Jobs
                <ArrowRight className="ml-2" />
              </a>
            </Button>
            <Button variant="professional" size="lg" className="text-lg px-8 py-4" asChild>
              <a href="/workers">
                Hire Workers
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
