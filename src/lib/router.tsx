import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  params: {},
});

export const useRouter = () => useContext(RouterContext);

// Normalize path: clean query params, hashes, and remove trailing slash (except root '/')
export const normalizePath = (rawPath: string): string => {
  if (!rawPath) return '/';
  const clean = rawPath.split('?')[0].split('#')[0];
  const trimmed = clean.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPath = (): string => {
    if (typeof window === 'undefined') return '/';
    // Support hash fallback (e.g. /#/admin) if host doesn't support SPA rewrite
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
      return normalizePath(hash.slice(1));
    }
    return normalizePath(window.location.pathname);
  };

  const [path, setPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#/')) {
        setPath(normalizePath(hash.slice(1)));
      } else {
        setPath(normalizePath(window.location.pathname));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    const normalizedTo = normalizePath(to);
    if (normalizedTo === path) return;
    window.history.pushState({}, '', normalizedTo);
    setPath(normalizedTo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to extract route parameters
  const getParams = (): Record<string, string> => {
    // Check /work/:slug
    const workMatch = path.match(/^\/work\/([a-zA-Z0-9_-]+)$/);
    if (workMatch) {
      return { slug: workMatch[1] };
    }
    // Check /admin/projects/:id
    const adminProjMatch = path.match(/^\/admin\/projects\/([a-zA-Z0-9_-]+)$/);
    if (adminProjMatch && adminProjMatch[1] !== 'new') {
      return { id: adminProjMatch[1] };
    }
    return {};
  };

  return (
    <RouterContext.Provider value={{ path, navigate, params: getParams() }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Link: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
  [key: string]: any;
}> = ({ to, children, className = '', activeClassName = '', onClick, ...props }) => {
  const { path, navigate } = useRouter();
  const normalizedTo = normalizePath(to);
  const isActive = path === normalizedTo || (normalizedTo !== '/' && path.startsWith(normalizedTo));

  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // Allow opening in new tab
    e.preventDefault();
    if (onClick) onClick();
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`}
      {...props}
    >
      {children}
    </a>
  );
};
