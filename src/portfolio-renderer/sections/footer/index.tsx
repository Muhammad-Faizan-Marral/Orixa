import { FooterDetailed } from "./FooterDetailed";
import { FooterMinimal } from "./FooterMinimal";

export function FooterSection({
  variant,
  name,
  username,
}: {
  variant?: string;
  name?: string;
  username: string;
}) {
  switch (variant) {
    case "detailed":
      return (
        <FooterDetailed
          name={name}
          username={username}
        />
      );

    case "minimal":
    default:
      return (
        <FooterMinimal
          name={name}
          username={username}
        />
      );
  }
}