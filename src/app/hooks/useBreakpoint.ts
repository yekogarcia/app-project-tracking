import { useBreakpointValue } from "@chakra-ui/react";
import { useMemo } from "react";
import type { BreakpointContext } from "../types";

export function useBreakpoint(): BreakpointContext {
  const currentBreakpoint = useBreakpointValue({
    base: 'base',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl'
  }) as 'base' | 'sm' | 'md' | 'lg' | 'xl';

  return useMemo(() => ({
    isMobile: currentBreakpoint === 'base' || currentBreakpoint === 'sm',
    isTablet: currentBreakpoint === 'md',
    isDesktop: currentBreakpoint === 'lg' || currentBreakpoint === 'xl',
    currentBreakpoint: currentBreakpoint || 'base'
  }), [currentBreakpoint]);
}