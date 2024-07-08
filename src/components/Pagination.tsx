import { times } from 'lodash';

import { Body } from '~/components/typography/Body';
import { PAGE_QUERY_PARAM } from '~/constants/queryParams';
import { ART_LIST_ROUTE } from '~/constants/routing';
import { PAGE_SIZE } from '~/logic/api/art';

import { Link } from './Link';

interface PaginationProps {
  count: number;
  currentPage: number;
}

interface PaginationLinkProps {
  page: number;
  currentPage: number;
}

function PaginationLink({ page, currentPage }: PaginationLinkProps) {
  return (
    <Link
      className="min-w-10 min-h-10 text-center"
      href={`${ART_LIST_ROUTE}?${PAGE_QUERY_PARAM}=${page}`}
    >
      <Body className={currentPage === page ? 'underline' : ''}>{page}</Body>
    </Link>
  );
}

const MAX_MIDDLE_LINKS = 3;

interface MiddleLinkProps {
  index: number;
  currentPage: number;
  pages: number;
  lastPage: number;
}

function MiddleLink({ index, currentPage, pages, lastPage }: MiddleLinkProps) {
  let showDots: null | 'start' | 'end' = null;

  if (index === 0 && currentPage > 4) {
    showDots = 'start';
  }

  if (index === MAX_MIDDLE_LINKS - 1 && currentPage <= pages - 4) {
    showDots = 'end';
  }

  const page = currentPage + index + 1;

  if (page >= lastPage) {
    return null;
  }

  return (
    <>
      {showDots === 'start' && <Body>...</Body>}
      <PaginationLink currentPage={currentPage} page={page} />
      {showDots === 'end' && <Body>...</Body>}
    </>
  );
}

export function Pagination({ count, currentPage }: PaginationProps) {
  const pages = count / PAGE_SIZE;
  const lastPage = Math.ceil(pages);

  return (
    <div className="flex gap-2 mt-4 w-full justify-center">
      <PaginationLink currentPage={currentPage} page={1} />
      {times(MAX_MIDDLE_LINKS, (i) => (
        <MiddleLink
          currentPage={currentPage}
          index={i}
          key={i}
          lastPage={lastPage}
          pages={pages}
        />
      ))}
      <PaginationLink currentPage={currentPage} page={lastPage} />
    </div>
  );
}
