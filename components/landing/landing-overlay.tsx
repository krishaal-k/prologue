export function LandingOverlay() {
  return (
    <>
      <p className="absolute top-6 left-6 font-sans text-xs uppercase tracking-[0.32em] text-paper pointer-events-none">
        My Prologue
      </p>
      <p className="absolute bottom-6 right-6 font-sans text-[11px] uppercase tracking-[0.22em] text-muted pointer-events-none">
        click anywhere to enter →
      </p>
    </>
  );
}
