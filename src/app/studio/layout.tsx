export const metadata = {
  title: 'Onkimia CMS',
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}