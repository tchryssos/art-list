import { ListeningTo } from '@prisma/client';

interface ListeningToCardProps {
  listeningTo?: Pick<
    ListeningTo,
    'imageUrl' | 'trackName' | 'artistName' | 'albumName'
  >;
  size?: 'sm' | 'md';
}

export function ListeningToCard({
  listeningTo,
  size = 'md',
}: ListeningToCardProps) {
  if (!listeningTo) {
    return null;
  }

  const { imageUrl, trackName, artistName, albumName } = listeningTo;

  const dimension = size === 'sm' ? 60 : 100;
  return (
    <div className="flex gap-4 mt-4 items-center">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={trackName || 'Now Playing'}
          height={dimension}
          src={imageUrl}
          width={dimension}
        />
      )}
      <div className="flex flex-col">
        <p className={size === 'sm' ? 'text-sm' : 'text-base'}>{trackName}</p>
        <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{artistName}</p>
        <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{albumName}</p>
      </div>
    </div>
  );
}
