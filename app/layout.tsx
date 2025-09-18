export const metadata = {
  title: "Nexus — College→Career OS",
  description: "AI-native advising and workflow automation platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}