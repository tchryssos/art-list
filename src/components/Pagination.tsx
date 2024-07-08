import usePagination from '@mui/material/usePagination';

import { Body } from '~/components/typography/Body';
import { PAGE_QUERY_PARAM } from '~/constants/queryParams';
import { HOME_ROUTE } from '~/constants/routing';

import { Link } from './Link';

interface PaginationProps {
  count: number;
  currentPage: number;
  pageSize: number;
}

interface PaginationLinkProps {
  page: number;
  currentPage: number;
}

const linkClassName = 'min-w-8 min-h-8 flex items-center justify-center';

function PaginationLink({ page, currentPage }: PaginationLinkProps) {
  return (
    <Link
      className={linkClassName}
      href={`${HOME_ROUTE}?${PAGE_QUERY_PARAM}=${page}`}
    >
      <Body className={currentPage === page ? 'underline' : ''}>{page}</Body>
    </Link>
  );
}

function Dots() {
  return (
    <div className={linkClassName}>
      <Body>...</Body>
    </div>
  );
}

export function Pagination({ count, currentPage, pageSize }: PaginationProps) {
  const pages = count / pageSize;

  const { items } = usePagination({
    boundaryCount: 1,
    count: Math.ceil(pages),
    page: currentPage,
  });

  return (
    <div className="flex gap-2 mt-4 w-full justify-center">
      {items.map((item) => {
        if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
          return <Dots key={item.type} />;
        }

        if (item.type === 'page') {
          return (
            <PaginationLink
              currentPage={currentPage}
              key={item.page}
              page={item.page || 1}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
