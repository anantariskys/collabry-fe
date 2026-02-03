import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 sm:p-8">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <div className="w-full max-w-md space-y-6">
        {children}
      </div>
    </div>
  );
}
