import * as React from "react"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => onOpenChange?.(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center">
            {children}
          </div>
        </div>
      )}
    </>
  )
}

interface DialogContentProps {
  className?: string
  children: React.ReactNode
}

export function DialogContent({ children, className = "" }: DialogContentProps) {
  return (
    <div className={`bg-black relative rounded-lg ${className}`}>
      {children}
    </div>
  )
} 