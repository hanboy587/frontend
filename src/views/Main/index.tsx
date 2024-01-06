import React, { useEffect, useState } from 'react'
import './style.css'
import Top3Item from 'components/Top3Item'
import { BoardListItem } from 'types/interface'
import { latestBoardListMock, top3BoardListMock } from 'mocks'
import BoardItem from 'components/BoardItem'
import { useNavigate } from 'react-router-dom'
import { SEARCH_PATH } from 'constant'
import { getLatestBoardListRequest, getPopularListRequest, getTop3BoardListRequest } from 'apis'
import { GetLatestBoardListResponseDto, GetTop3BoardListResponseDto } from 'apis/response/board'
import { ResponseDto } from 'apis/response'
import { usePagination } from 'hooks'
import Pagination from 'components/Pagination'
import { GetPopularListResponseDto } from 'apis/response/search'

// component: 메인 컴포넌트 //
export default function Main() {
  // function: navigator //
  const navigator = useNavigate();

  // component: main 상단 컴포넌트 //
  const MainTop = () => {


    // state: 주간 top 3 게시물 리스트 //
    const [top3List, setTop3List] = useState<BoardListItem[]>([]);

    // function: getTop3BoardListResponse //
    const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { top3List } = responseBody as GetTop3BoardListResponseDto;
      setTop3List(top3List);
    }

    // effect: 첫 마운트 시 실행 //
    useEffect(() => {
      getTop3BoardListRequest().then(getTop3BoardListResponse);
    }, [])
    
    // render: main 상단 렌더링 //
    return (
      <div id='main-top-wrapper'>
        <div className='main-top-container'>
          <div className='main-top-title'>{'환영합니다.\n함께 이야기를 나눠봅시다.'}</div>
          <div className='main-top-contents-box'>
            <div className='main-top-contents-title'>{'주간 TOP 3 게시글'}</div>
            <div className='main-top-contents'>
              {top3List.map(top3ListItem => <Top3Item top3ListItem={top3ListItem} />)}
              
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // component: main 하단 컴포넌트 //
  const MainBottom = () => {

    // const [currentBoardList, setCurrentBoardList] = useState<BoardListItem[]>();
    // state: 페이지네이션 상태 //
    const { 
      currentPage,
      setCurrentPage,
      currentSection,
      setCurrentSection,
      viewList,
      viewPageList,
      totalSection,
      setTotalList 
    } = usePagination<BoardListItem>(5);

    console.log('main 하단 viewList : ', viewList);

    // function: getLatestBoardListResponse //
    const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { latestList } = responseBody as GetLatestBoardListResponseDto;
      setTotalList(latestList);
    }

    // function: getPopularListReponse //
    const getPopularListReponse = (responseBody: GetPopularListResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { popularWordList } = responseBody as GetPopularListResponseDto;
      setPopularWordList(popularWordList);
    }

    // state: 인기 검색어 //
    const [popularWordList, setPopularWordList] = useState<string[]>([]);

    // event handler: 인기 검색어 클릭 이벤트 //
    const onPopularWordClickHandler = (word: string) => {
      navigator(SEARCH_PATH(word));
    }

    // effect: 각 리스트 불러오기 //
    useEffect(() => {
      // setCurrentBoardList(latestBoardListMock);
      getLatestBoardListRequest().then(getLatestBoardListResponse);
      // setPopularWordList(['안녕', '반가워', '고마워']);
      getPopularListRequest().then(getPopularListReponse);
    }, [])
    
    // render: main 하단 렌더링 //
    return (
      <div id='main-bottom-wrapper'>
        <div className='main-bottom-container'>
          <div className='main-bottom-title'>{'최신 게시물'}</div>
          <div className='main-bottom-contents-box'>
            <div className='main-bottom-current-contents'>
              {viewList?.map(boardListItem => <BoardItem boardListItem={boardListItem} />)}
            </div>
            <div className='main-bottom-popular-box'>
              <div className='main-bottom-popular-card'>
                <div className='main-bottom-popular-card-container'>
                  <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                  <div className='main-bottom-popular-card-contents'>
                    {popularWordList.map(word => <div className='word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='main-bottom-pagination-box'>
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              viewPageList={viewPageList}
              totalSection={totalSection}
            />
          </div>
        </div>
      </div>
    )
  }



  // component: main 하단 컴포넌트 //
  // render: 메인 컴포넌트 렌더링 //
  return (
    <div>
      <MainTop />
      <MainBottom />
    </div>
  )
}
