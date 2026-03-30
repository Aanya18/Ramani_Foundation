import { Button } from "../ui/Button";

export function MobileDonateBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-trust-100 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(17,27,31,0.08)] lg:hidden">
      <Button className="w-full" to="/donate" variant="donate">
        Donate Now
      </Button>
    </div>
  );
}
