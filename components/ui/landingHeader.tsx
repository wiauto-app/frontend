export const LandingHeader = ({ title, description }: { title: string, description?: string }) => {
  const parts = title.split(" ");
  const lastPart = parts[parts.length - 1];
  parts.pop();
  return (
    <div className="w-full bg-[#DBE6F8] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold ">
          {parts.join(" ")} <span className="text-blue-700">{lastPart}</span>
        </h1>
        {description && <p className="text-gray-600">{description}</p>}
        <div className="w-35 h-1 bg-blue-700 rounded-full mt-4"></div>
      </div>
    </div>
  );
};
