import { LandingHeader } from "@/components/ui/landingHeader";
import { StrapiRenderer } from "@/components/ui/strapiRenderer";
import { BlocksContent } from "@strapi/blocks-react-renderer";

export const PolicyPageTemplate = ({ title, content }: { title: string, content: BlocksContent }) => {
  return (
    <>
      <LandingHeader title={title} />
      <div className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-blue prose-lg text-gray-700">
          <StrapiRenderer content={content} />
        </div>
      </div>
    </>
  );
};
