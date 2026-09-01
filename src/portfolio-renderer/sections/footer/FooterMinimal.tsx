export function FooterMinimal({
  name,
  username,
}: {
  name?: string;
  username: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
      <p>
        © {year} {name || username}
      </p>
      <p className="mt-1 text-xs">
        Built with{" "}
        <a href="https://orixa.ai" className="underline-offset-2 hover:underline">
          Orixa AI
        </a>
      </p>
    </footer>
  );
}