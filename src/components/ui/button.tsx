import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    let variantClasses = 'btn-primary';
    if (variant === 'outline') variantClasses = 'btn-outline';
    if (variant === 'ghost') variantClasses = 'btn-outline';
    if (variant === 'destructive') variantClasses = 'bg-red-500 text-white';
    
    let sizeClasses = 'h-10 py-2 px-4';
    if (size === 'sm') sizeClasses = 'btn-sm';
    if (size === 'lg') sizeClasses = 'btn-lg';
    
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          variantClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }