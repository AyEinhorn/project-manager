"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  maxCount?: number;
}

export function AvatarGroup({
  maxCount = 4,
  className,
  ...props
}: AvatarGroupProps) {
  // Mock data - in a real app, you would pass these as props
  const members = [
    { id: "1", name: "John Doe", image: "/avatars/01.png", initials: "JD" },
    { id: "2", name: "Jane Smith", image: "/avatars/02.png", initials: "JS" },
    { id: "3", name: "Bob Johnson", image: "/avatars/03.png", initials: "BJ" },
    { id: "4", name: "Alice Williams", image: "/avatars/04.png", initials: "AW" },
    { id: "5", name: "Mike Brown", image: "/avatars/05.png", initials: "MB" },
    { id: "6", name: "Sarah Miller", image: "/avatars/06.png", initials: "SM" },
  ];

  const displayMembers = members.slice(0, maxCount);
  const remainingCount = members.length - maxCount;

  return (
    <div
      className={cn("flex items-center -space-x-2", className)}
      {...props}
    >
      {displayMembers.map((member) => (
        <Avatar
          key={member.id}
          className="border-2 border-background h-8 w-8"
        >
          <AvatarImage src={member.image} alt={member.name} />
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <Avatar className="border-2 border-background h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            +{remainingCount}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 