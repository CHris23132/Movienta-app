import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Voice Agent Widget",
  description: "AI Voice Agent Widget",
};

export default function WidgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
        }
        html {
          background: transparent !important;
        }
        /* Hide Next.js dev indicators */
        #__next-build-watcher,
        [data-nextjs-dialog],
        [data-nextjs-toast],
        nextjs-portal {
          display: none !important;
        }
      `}} />
      {children}
    </>
  );
}

