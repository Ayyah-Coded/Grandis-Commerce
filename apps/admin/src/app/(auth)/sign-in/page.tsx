
import { Show, SignInButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <Show when="signed-out">
      <SignInButton />
    </Show>     
  );
};

