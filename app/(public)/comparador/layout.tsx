export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <section className="container-custom mx-auto min-h-screen">
      {children}
    </section>
  );
}