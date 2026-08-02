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
    <section className="relative lg:h-140  rounded-lg py-12 px-10  rounded-b-lg overflow-hidden ">
      {image ? (
        <Image
          src={image}
          alt="Hero Background"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 960px, 1300px"
          priority
        />
      ) : null}
      {/* <div className="absolute top-0 right-0 bg-black/50 rounded-s-lg p-2 z-10 flex flex-col gap-1"></div> */}
      {floatingContent}

      <div className="relative mx-auto   flex flex-col lg:grid  lg:grid-cols-2 gap-4 lg:gap-10  h-full">
        <div className="w-full flex flex-col gap-4">{leftContent}</div>
        <div className="w-full flex flex-col gap-4 ">{rightContent}</div>
      </div>
    </section>
  );
};
