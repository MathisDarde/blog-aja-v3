// modal : fiche d'une méthode ouverte par-dessus l'article (routes interceptées @modal/(...)…)
export default function ArticleLayout({
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
