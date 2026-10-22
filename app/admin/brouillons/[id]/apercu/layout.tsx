// modal : fiche d'une méthode ouverte par-dessus l'aperçu (routes interceptées @modal/(...)…)
export default function ApercuLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
