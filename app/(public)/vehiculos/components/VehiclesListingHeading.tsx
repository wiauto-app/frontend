interface VehiclesListingHeadingProps {
  h1: string;
  total?: number;
}

export const VehiclesListingHeading = ({
  h1,
  total,
}: VehiclesListingHeadingProps) => {
  return (
    <header className="mb-4">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {h1}
      </h1>
      {total !== undefined ? (
        <p className="mt-1 text-sm font-medium text-slate-600">
          {total} resultados
        </p>
      ) : null}
    </header>
  );
};
