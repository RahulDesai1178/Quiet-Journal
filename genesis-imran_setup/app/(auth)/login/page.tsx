import { loginAction } from "@/app/actions";
import { AuthForm } from "@/components/auth/auth-form";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthForm
      action={loginAction}
      alternateHref="/signup"
      alternateLabel="Create an account"
      alternateText="Need an account?"
      description="Log in to view your dashboard, capture a new entry, and review your writing."
      message={params.message}
      next={params.next}
      submitLabel="Log in"
      title="Welcome back"
    />
  );
}
