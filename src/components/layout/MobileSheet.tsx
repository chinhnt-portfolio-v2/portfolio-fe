import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface NavLink {
  href: string
  label: string
}

interface MobileSheetProps {
  isOpen: boolean
  onClose: () => void
  navLinks: NavLink[]
}

export function MobileSheet({ isOpen, onClose, navLinks }: MobileSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" id="mobile-nav">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation links
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile navigation">
          <ul className="flex flex-col gap-4 mt-6" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={onClose}
                  className="text-lg font-medium text-foreground hover:text-brand transition-colors focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
