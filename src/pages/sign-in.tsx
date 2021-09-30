import SignIn from "@/components/signIn";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { FC } from "react";
import Layout from "src/components/layout";
import SEO from "src/components/seo";

const SignInPage: FC = () => (
  <Layout>
    <SEO
      keywords={"syndicate crypto invest fund social ethereum".split(" ")}
      title="Sign In"
    />

    <SignIn />
  </Layout>
);

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
})(SignInPage);
