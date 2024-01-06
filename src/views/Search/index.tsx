import React, { useEffect, useState } from 'react'
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import { BoardListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { SEARCH_PATH } from 'constant';
import Pagination from 'components/Pagination';
import { getRelationListRequest, getSearchBoardListRequest } from 'apis';
import { GetSearchBoardListResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { usePagination } from 'hooks';
import { GetRealationListResponseDto } from 'apis/response/search';

// component: 검색 컴포넌트 //
export default function Search() {

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

  // state: searchWord 상태 //
  const { searchWord } = useParams();
  // state: 이전 검색어 상태 //
  const [preSearchWord, setPreSearchWord] = useState<string | null>(null);
  // state: 검색 게시물 리스트 상태 (임시) //
  const [searchBoardList, setSearchBoardList] = useState<BoardListItem[]>([]);
  // state: 검색 게시물 리스트 갯수 상태 //
  const [count, setCount] = useState<number>(2);
  // state: 관련 검색어 리스트 상태 //
  const [relativeWordList, setRelationWordList] = useState<string[]>([]);

  // function: navigator //
  const navigator = useNavigate();

  // function: getSearchBoardListResponse //
  const getSearchBoardListResponse = (responseBody: GetSearchBoardListResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code !== 'SU') return;

    if (!searchWord) return;
    const { searchList }= responseBody as GetSearchBoardListResponseDto;
    setTotalList(searchList);
    setCount(searchList.length);
    setPreSearchWord(searchWord);
  }

  // function: getRealtionListResponse //
  const getRealtionListResponse = (responseBody: GetRealationListResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code !== 'SU') return;

    if (!searchWord) return;
    const { relativeWordList }= responseBody as GetRealationListResponseDto;
    setRelationWordList(relativeWordList);
  }

  // event handler: onRelationWordClickHandler //
  const onRelationWordClickHandler = (word: string) => {
    navigator(SEARCH_PATH(word));
  }

  // effect: searWord 변경 시 마다 //
  useEffect(() => {
    if (!searchWord) return;
    getSearchBoardListRequest(searchWord, preSearchWord).then(getSearchBoardListResponse);
    getRelationListRequest(searchWord).then(getRealtionListResponse);
  }, [searchWord])


  // render: 검색 컴포넌트 렌더링 //
  if (!searchWord) return (<></>) 
  return (
    <div id='search-wrapper'>
      <div className='search-container'>
        <div className='search-title-box'>
          <div className='search-title'><span className='emphasis'>{searchWord}</span>{'에 대한 검색결과 입니다.'}</div>
          <div className='search-count'>{count}</div>
        </div>
        <div className='search-contents-box'>
          {count === 0 ?
          <div className='search-contents-nothing'>{'검색 결과가 없습니다.'}</div> :
          <div className='search-contents'>
            {viewList.map(item => <BoardItem boardListItem={item} />)}
          </div>
          }
          <div className='search-relation-box'>
            <div className='search-relation-card'>
              <div className='search-relation-card-container'>
                <div className='search-relation-card-title'>{'연관 검색어'}</div>
                {relativeWordList.length === 0 ?
                  <div className='search-relation-card-contents-nothing'></div> :
                  <div className='search-realtion-card-contents'>
                    {relativeWordList.map(word => <div className='word-badge' onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className='search-pagination-box'>
          {count !== 0 &&
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
              viewPageList={viewPageList}
              totalSection={totalSection}
            />
          }
        </div>
      </div>
    </div>
  )
}
