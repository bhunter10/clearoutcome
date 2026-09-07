import "./globals.css";

export const metadata = {
  title: "ClearOutcome",
  description: "ClearOutcome beta opt-in for divorce negotiation preparation.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
