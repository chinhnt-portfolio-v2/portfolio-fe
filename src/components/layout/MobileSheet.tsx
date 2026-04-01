import { useTranslation } from 'react-i18next'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface NavItem {
  sectionId: string
  label: string
}

interface MobileSheetProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  onNavClick: (sectionId: string) => void
}

export function MobileSheet({ isOpen, onClose, navItems, onNavClick }: MobileSheetProps) {
  const { t } = useTranslation()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" id="mobile-nav">
        <SheetHeader>
          <SheetTitle>{t('mobileSheet.title')}</SheetTitle>
          <SheetDescription className="sr-only">
            {t('mobileSheet.description')}
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile navigation">
          <ul className="flex flex-col gap-4 mt-6" role="list">
            {navItems.map((item) => (
              <li key={item.sectionId}>
                <button
                  type="button"
                  onClick={() => onNavClick(item.sectionId)}
                  className="text-lg font-medium text-foreground hover:text-brand transition-colors focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm bg-transparent border-none p-0 cursor-pointer text-left w-full"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
