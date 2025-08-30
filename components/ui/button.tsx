import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 hover:from-rose-500 hover:via-orange-500 hover:to-yellow-500 text-white shadow-lg hover:shadow-xl border-0",
        destructive:
          "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl border-0",
        outline:
          "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md",
        secondary:
          "bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow-md border-0",
        ghost:
          "hover:bg-white/50 text-gray-700 border-0",
        link: 
          "text-rose-500 hover:text-rose-600 underline-offset-4 hover:underline border-0 shadow-none",
        premium:
          "bg-white/60 hover:bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm hover:shadow-md border border-gray-200/50",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants }
