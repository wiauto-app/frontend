import Image from "next/image";
export const Hero = ({
  image,
  rightContent,
  leftContent,
  floatingContent,
}: {
  image?: string;
  rightContent: React.ReactNode;
  leftContent: React.ReactNode;
  floatingContent?: React.ReactNode;
}) => {
  return (
    <section className="relative h-140  rounded-lg py-12  rounded-b-lg overflow-hidden ">
      {image ? (
        <Image
          src={image}
          alt="Hero Background"
          fill
          className="object-cover"
          sizes="100vw 600px"
          priority
        />
      ) : null}
      {/* <div className="absolute top-0 right-0 bg-black/50 rounded-s-lg p-2 z-10 flex flex-col gap-1"></div> */}
      {floatingContent}

      <div className="relative mx-auto  container-custom grid grid-cols-1 lg:grid-cols-2 gap-10  h-full">
        {leftContent}
        {rightContent}
      </div>
    </section>
  );
};
