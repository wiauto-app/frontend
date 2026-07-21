export const HeroBackdrop = () => {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        bg-linear-to-b
        lg:bg-linear-to-r
        from-[#0a193c]/100
        via-[#0a193c]/10
        to-[#0a193c]/0
      "
      aria-hidden
    />
  );
};