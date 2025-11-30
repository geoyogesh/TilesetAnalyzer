import { BreadcrumbGroup } from '@cloudscape-design/components';
import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CustomBreadcrumb: FC = () => {
  const location = useLocation();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentComponent = () => {
      try {
        const urlParts = location.pathname.split('/');
        let urlPart = urlParts[urlParts.length - 1];
        if (urlPart !== '') {
          const parts = urlPart.split('-');
          let result = '';
          for (const part of parts) {
            result += part.charAt(0).toUpperCase() + part.slice(1) + ' ';
          }
          setActive(result);
        }
      } catch (error) {}
    };

    getCurrentComponent();
  }, [location.pathname]);

  return (
    <div style={{ margin: '16px 0' }}>
      <BreadcrumbGroup
        items={[{ text: 'Home', href: '/' }, ...(active ? [{ text: active!, href: '' }] : [])]}
        ariaLabel="Breadcrumbs"
      />
    </div>
  );
};

export default CustomBreadcrumb;
