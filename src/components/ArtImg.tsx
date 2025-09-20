/* eslint-disable react/jsx-props-no-spreading */
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { Image } from './Image';

interface ArtImgProps extends ComponentProps<typeof Image> {}

export function ArtImg(props: ArtImgProps) {
  const { className, ...rest } = props;
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      className={twMerge(
        'w-full min-h-80 relative block mb-2 md:min-h-[400]',
        className
      )}
    />
  );
}
