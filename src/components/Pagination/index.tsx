import React, { Dispatch, SetStateAction, useEffect } from 'react'
import './style.css';

// interface: pagination Propertis //
interface Props {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentSection: number;
  setCurrentSection: Dispatch<SetStateAction<number>>;
  viewPageList: number[];
  totalSection: number;
}

// component: pagination 컴포넌트 //
export default function pagination(props: Props) {

  // state: Properties //
  const { currentPage, currentSection, viewPageList, totalSection } = props;
  const { setCurrentPage, setCurrentSection } = props;

  // console.log('pagination currentPage : ', currentPage)
  // console.log('pagination viewPageList : ', viewPageList)

  // event handler: pageNumber click event //
  const onPageNumberClickHandler = (page: number) => {
    setCurrentPage(page);
  }

  // event handler: 페이지 이전 버튼 클릭 이벤트 //
  const onPreviousClickHandler = () => {
    if (currentSection === 1) return;
    setCurrentPage((currentSection - 1) * 10);
    setCurrentSection(currentSection - 1);
  }

  // event handler: 페이지 다음 버튼 클릭 이벤트 //
  const onNextClickHandler = () => {
    if (currentSection === totalSection) return;
    setCurrentPage(currentSection * 10 + 1);
    setCurrentSection(currentSection + 1);
  }


// render: pagination 컴포넌트 렌더링 //
  return (
    <div id='pagination-wrapper'>
      <div className='pagination-change-link-box'>
        <div className='icon-box-small'>
          <div className='icon expand-left-icon'></div>
        </div>
        <div className='pagination-change-link-text' onClick={onPreviousClickHandler}>{'이전'}</div>
      </div>
      <div className='pagination-divider'>{'\|'}</div>

      {viewPageList.map(page => 
        page === currentPage ? 
        <div className='pagination-text-active'>{page}</div>
        :
        <div className='pagination-text' onClick={() => onPageNumberClickHandler(page)}>{page}</div>
      )}

      <div className='pagination-divider'>{'\|'}</div>
      <div className='pagination-change-link-box'>
      <div className='pagination-change-link-text' onClick={onNextClickHandler}>{'다음'}</div>
        <div className='icon-box-small'>
          <div className='icon expand-right-icon'></div>
        </div>
      </div>
    </div>
  )
}
