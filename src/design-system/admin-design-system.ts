// Design System Tokens
export const designSystem = {
  colors: {
    primary: {
      main: '#ED2024',
      hover: '#C91A1A',
      light: '#F26666',
      veryLight: '#FFF0F0',
      dark: '#A01414',
      black: '#000000',
    },
    status: {
      active: {
        bg: '#E6F7F0',
        text: '#0A6B47',
      },
      pending: {
        bg: '#FFEFC2',
        text: '#8C5A00',
      },
      blocked: {
        bg: 'rgb(254, 226, 226)',
        text: 'rgb(153, 27, 27)',
      },
    },
    role: {
      student: {
        bg: '#E3F6FB',
        text: '#0E5E7A',
      },
      admin: {
        bg: 'rgb(243, 232, 255)',
        text: 'rgb(107, 33, 168)',
      },
      superadmin: {
        bg: 'rgb(224, 231, 255)',
        text: 'rgb(55, 48, 163)',
      },
    },
  },
  typography: {
    fontSize: {
      xs: '0.65rem', // 10.4px
      sm: '0.8rem', // 12.8px
      md: '0.9rem', // 14.4px
      lg: '1rem', // 16px
      xl: '1.1rem', // 17.6px
      '2xl': '1.2rem', // 19.2px
      '3xl': '1.5rem', // 24px
      '4xl': '1.6rem', // 25.6px
      '5xl': '1.75rem', // 28px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    padding: {
      xs: '0.45rem', // 7.2px
      sm: '0.5rem', // 8px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      card: '1.5rem', // 24px
    },
    margin: {
      xs: '0.5rem', // 8px
      sm: '1rem', // 16px
      section: '1.5rem', // 24px
    },
    gap: {
      xs: '0.5rem', // 8px
      sm: '1rem', // 16px
      md: '1.25rem', // 20px
      lg: '1.5rem', // 24px
    },
  },
  borders: {
    radius: {
      base: '0.25rem', // 4px
      badge: '3.15rem', // 50.4px
    },
    color: {
      default: 'rgba(0,0,0,0.125)',
    },
  },
  sidebar: {
    width: {
      open: '16rem', // 256px
      closed: '3rem', // 48px
    },
    headerHeight: '50px',
  },
};

// Tailwind Classes Reference
export const tailwindClasses = {
  common: {
    card: 'rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white',
    cardHeader: 'border-b border-[rgba(0,0,0,0.125)] px-6 py-4',
    cardContent: 'p-6',
    sectionTitle: 'text-[1.1rem] font-semibold text-primary-black md:text-[1.2rem]',
    container: 'p-2',
  },
};

// Utility Functions
export function getStatusBadgeClasses(status: string): string {
  const statusMap: Record<string, string> = {
    ACTIVE: 'inline-flex rounded-[3.15rem] px-[0.5rem] py-[0.45rem] text-[0.65rem] font-medium whitespace-nowrap bg-[#E6F7F0] text-[#0A6B47]',
    PENDING: 'inline-flex rounded-[3.15rem] px-[0.5rem] py-[0.45rem] text-[0.65rem] font-medium whitespace-nowrap bg-[#FFEFC2] text-[#8C5A00]',
    BLOCKED: 'inline-flex rounded-[3.15rem] px-[0.5rem] py-[0.45rem] text-[0.65rem] font-medium whitespace-nowrap bg-[rgb(254,226,226)] text-[rgb(153,27,27)]',
  };

  return statusMap[status] || statusMap.PENDING;
}

export function getRoleBadgeClasses(role: string): { classes: string; displayText: string } {
  const roleMap: Record<string, { classes: string; display: string }> = {
    student: {
      classes: 'inline-flex rounded-[3.15rem] px-[0.5rem] py-[0.45rem] text-[0.65rem] font-medium whitespace-nowrap bg-[#E3F6FB] text-[#0E5E7A]',
      display: 'Student',
    },
    admin: {
      classes: 'inline-flex rounded-[3.15rem] px-[0.5rem] py-[0.45rem] text-[0.65rem] font-medium whitespace-nowrap bg-[rgb(243,232,255)] text-[rgb(107,33,168)]',
      display: 'Admin',
    },
    superadmin: {
      classes: 'inline-flex rounded-[3.15rem] px-[0.5rem] py-[0.45rem] text-[0.65rem] font-medium whitespace-nowrap bg-[rgb(224,231,255)] text-[rgb(55,48,163)]',
      display: 'Super Admin',
    },
  };

  const roleData = roleMap[role.toLowerCase()] || roleMap.student;
  return {
    classes: roleData.classes,
    displayText: roleData.display,
  };
}

export function getButtonClasses(variant: 'primary' | 'secondary' | 'danger', disabled: boolean): string {
  const baseClasses = 'flex items-center gap-2 rounded-[0.25rem] border px-4 py-2 text-[0.9rem] font-medium transition-colors cursor-pointer';

  if (disabled) {
    return `${baseClasses} bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200`;
  }

  switch (variant) {
    case 'primary':
      return `${baseClasses} bg-[#ED2024] text-white hover:bg-[#C91A1A] border-[#ED2024]`;
    case 'secondary':
      return `${baseClasses} bg-white text-primary-black hover:bg-[rgba(0,0,0,0.02)] border-[rgba(0,0,0,0.125)] hover:border-[#ED2024]`;
    case 'danger':
      return `${baseClasses} bg-red-600 text-white hover:bg-red-700 border-red-600`;
    default:
      return baseClasses;
  }
}

export function getCardClasses(withShadow: boolean): string {
  const baseClasses = 'rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white';
  return withShadow ? `${baseClasses} shadow-lg` : baseClasses;
}

export function getInputClasses(hasError: boolean): string {
  const baseClasses = 'w-full rounded-[0.25rem] border bg-white px-4 py-2.5 text-[0.9rem] text-primary-black placeholder:text-[#999] focus:outline-none focus:ring-2';
  if (hasError) {
    return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500/20`;
  }
  return `${baseClasses} border-[rgba(0,0,0,0.125)] focus:border-[#ED2024] focus:ring-[#ED2024]/20`;
}

