import { LandingHeader } from "@/components/ui/landingHeader";
import { StrapiRenderer } from "@/components/ui/strapiRenderer";
import { BlocksContent } from "@strapi/blocks-react-renderer";

export const PolicyPageTemplate = ({ title, content }: { title: string, content: BlocksContent }) => {
  return (
    <>
      <LandingHeader title={title} />
      <div className="bg-white px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <StrapiRenderer content={content} />
        </div>
      </div>
    </>
  );
};
