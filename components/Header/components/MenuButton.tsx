import { Button } from '@chakra-ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface MenuButtonProps {
  title: string;
  link?: string;
}

const MenuButton: React.SFC<MenuButtonProps> = ({ title, link }) => {
  const router = useRouter();

  const isActive = () => {
    const parsedURL = router.pathname.split('/')[1];
    if (link && link === router.pathname) return true;
    if (title === parsedURL) return true;
    return false;
  };

  return (
    <Link href={link ? link : `/${title}`} passHref>
      <Button
        mr="3"
        textTransform="capitalize"
        variant={isActive() ? 'solid' : 'ghost'}
        colorScheme={isActive() ? 'yellow' : 'gray'}
        size="sm"
      >
        {title}
      </Button>
    </Link>
  );
};

export default MenuButton;
