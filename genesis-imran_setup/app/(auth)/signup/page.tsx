import { signupAction } from "@/app/actions";
import { AuthForm } from "@/components/auth/auth-form";

type SignupPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <AuthForm
      action={signupAction}
      alternateHref="/login"
      alternateLabel="Log in instead"
      alternateText="Already have an account?"
      description="Create your account to start storing private journal entries with Supabase Auth."
      message={params.message}
      submitLabel="Create account"
      title="Start your journal"
    />
  );
}
