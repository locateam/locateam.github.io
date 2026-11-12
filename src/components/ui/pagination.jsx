import React from 'react';
import {CaretLeft,CaretRight,DotsThree} from '@phosphor-icons/react';
export function Pagination(props){return <nav role="navigation" aria-label="Страницы блога" className="pagination" {...props}/>}
export function PaginationContent(props){return <ul className="pagination-content" {...props}/>}
export function PaginationItem(props){return <li {...props}/>}
export function PaginationLink({isActive,disabled,children,...props}){return <a className="pagination-link" aria-current={isActive?'page':undefined} aria-disabled={disabled||undefined} tabIndex={disabled?-1:undefined} {...props}>{children}</a>}
export function PaginationPrevious({text="Назад",...props}){return <PaginationLink aria-label="Предыдущая страница" {...props}><CaretLeft size={18}/><span>{text}</span></PaginationLink>}
export function PaginationNext({text="Далее",...props}){return <PaginationLink aria-label="Следующая страница" {...props}><span>{text}</span><CaretRight size={18}/></PaginationLink>}
export function PaginationEllipsis({text="Другие страницы"}){return <span className="pagination-ellipsis"><DotsThree aria-hidden="true" size={20}/><span className="sr-only">{text}</span></span>}
