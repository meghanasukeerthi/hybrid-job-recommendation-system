import { CardTitle, CardDescription } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface JobHeaderProps {
  title: string;
  company: string;
}

export const JobHeader = ({ title, company }: JobHeaderProps) => (
  <div className="mini-hover">
    <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    <CardDescription className="flex items-center mt-1">
      <Building2 className="w-4 h-4 mr-1" />
      {company}
    </CardDescription>
  </div>
);