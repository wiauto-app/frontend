import { SectionHeading } from "../home/SectionHeading";

export const PageSectionTitle = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="flex flex-col gap-1 items-center justify-center">
      <p className="text-primary text-lg font-semibold text-center">
        {description}
      </p>
      <SectionHeading className="text-2xl text-center" lead={title} />
      <div className="h-2 bg-primary w-20 rounded-full"/>

    </div>
  );
};
