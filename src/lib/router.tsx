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

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to === path) return;
    window.history.pushState({}, '', to);
    setPath(to);
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
  const isActive = path === to || (to !== '/' && path.startsWith(to));

  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return; // Allow opening in new tab
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
