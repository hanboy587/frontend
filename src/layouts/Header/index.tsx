import React, { ChangeEvent, useRef, useState, KeyboardEvent, useEffect } from 'react'
import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { useLoginuserStore, userBoardStore } from 'stores';
import { fileUploadReqeust, patchBoardRequest, postBoardRequest } from 'apis';
import { PatchBoardRequestDto, PostBoardRequestDto } from 'apis/request/board';
import { PatchBoardResponseDto, PostBoardResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';

// component: Header 레이아웃 //
export default function Header() {

  // state: 로그인 유저 상태 //
  const { loginUser, setLoginUser, resetLoginUser } = useLoginuserStore();

  // state: path 상태 //
  const { pathname } = useLocation();

  // state: cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // state: 로그인 상태 //
  const [isLogin, setLogin] = useState<boolean>(false);

  // state: auth 페이지 상태 //
  const [isAuthPage, setAuthPage] = useState<boolean>(false);
  // state: main 페이지 상태 //
  const [isMainPage, setMainPage] = useState<boolean>(false);
  // state: search 페이지 상태 //
  const [isSearchPage, setSearchPage] = useState<boolean>(false);
  // state: board_detail 페이지 상태 //
  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
  // state: board_write 페이지 상태 //
  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
  // state: board_update 페이지 상태 //
  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
  // state: user 페이지 상태 //
  const [isUserPage, setUserPage] = useState<boolean>(false);
  

  

  // function: nevigate 함수 //
  const navigator = useNavigate();

  // event handler: 로고 클릭 이벤트 처리 //
  const onLogoClickHandler = () => {
    navigator(MAIN_PATH());
}

// component: 검색 버튼 컴포넌트 //
const SearchButton = () => {

  // state: 검색 버튼 참조 상태 //
  const searchButtonRef = useRef<HTMLInputElement | null>(null);
  

  // state: 검색 버튼 상태 //
  const [status, setStatus] = useState<boolean>(false);
  
  // state: 검색어 상태 //
  const [word, sethWord] = useState<string>('');
  
  // state: 검색 path 상태 //
  const { searchWord } = useParams();



  // event handler: 검색어 변경 이벤트 처리 //
  const onSearchButtonClickHandler = () => {
    if(!status) {
      setStatus(!status);
      return;
    }
    navigator(SEARCH_PATH(word));
  }

  // event handler: 검색어 키 이벤트 처리 //
  const onSearchWordKeyDownhandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!searchButtonRef.current) return;
    searchButtonRef.current.click();
  }


  // event handler: search icon 클릭 이벤트 처리 //
  const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    sethWord(value);
  }

  // effect: 검색어 path  //
  useEffect(() => {
    if(searchWord) {
      sethWord(searchWord);
      setStatus(true);
    } 
  }, [searchWord]);



  // render: 검색 버튼 렌더링(false) //
  if (!status) return (
    <div className='icon-button' onClick={onSearchButtonClickHandler}>
    <div className='icon search-light-icon'></div></div>
  )
  
  // render: 검색 버튼 렌더링(true) //
  return (
    <div className='header-search-input-box'>
      <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownhandler} />
      <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
        <div className='icon search-light-icon'></div>
      </div>
    </div>  
  )
  
  
}

// component: 마이페이지 버튼 컴포넌트 //
const MyPageButton = () => {

  // state: userEmail path variable 상태 //
  const { userEmail } = useParams();

  // event handler: 마이페이지 버튼 클릭 이벤트 처리 //
  const onMyPageButtonClickHandler = () => {
    if (!loginUser) return;
    const { email } = loginUser;
    navigator(USER_PATH(email));
  };
  
  // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
  const onSignOutClickHandler = () => {
    resetLoginUser();
    // 로그아웃 시 token 초기화
    setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
    navigator(MAIN_PATH());
  };

  // event handler: 로그인 버튼 클릭 이벤트 처리 //
  const onSignInButtonClickHandler = () => {
    navigator(AUTH_PATH());
  }

  // render: 로그아웃 버튼 컴포넌트 렌더링 //
  if (isLogin && userEmail === loginUser?.email)
  return <div className='white-button' onClick={onSignOutClickHandler}>{'로그아웃'}</div>;

  if (isLogin)
  // render: 마이페이지 버튼 컴포넌트 렌더링 //
  return <div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>;

  // render: 로그인 버튼 컴포넌트 렌더링 //
  return <div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>;
}

// component: 업로드 버튼 컴포넌트 //
const UploadButton = () => {

  // state: boardNumber 가져오기 //
  const { boardNumber } = useParams();

  // state: 게시물 상태 //
  const { title, content, boardImagesFileList, resetBoard } = userBoardStore();

  // function: post board response //
  const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;

    if (code === 'AF' || code === 'NU') navigator(AUTH_PATH());
    if (code === 'VF') alert('제목과 내용은 필수입니다.');
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code !== 'SU') return;
    
    // 작성 완료 후 초기화 //
    resetBoard();
    if (!loginUser) return;
    // 로그인 정보가 있으면 작성 후 마이페이지로 이동 //
    const { email } = loginUser;
    navigator(USER_PATH(email));
  }

  // function: patchBoardResponse //
  const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;

    if (code === 'AF' || code === 'NU' || code === 'NB' || code === 'NP') navigator(AUTH_PATH());
    if (code === 'VF') alert('제목과 내용은 필수입니다.');
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code !== 'SU') return;

    if (!boardNumber) return;
    alert('게시물 수정이 완료 되었습니다.');
    navigator(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
  }

  // event handler: 업로드 버튼 클릭 이벤트 //
  const onUploadButtonClickHandler = async () => {
    // 토큰 확인 //
    const accessToken = cookies.accessToken;
    if (!accessToken) return;
    
    const boardImageList: string[] = [];

    for (const file of boardImagesFileList) {
      const data = new FormData();
      data.append('file', file);

      const url = await fileUploadReqeust(data);
      if (url) boardImageList.push(url);
    }

    const isWritePage = pathname === BOARD_PATH() + '/' + BOARD_WRITE_PATH();
    if (isWritePage) {
      const requestBody: PostBoardRequestDto = {
        title, content, boardImageList
      }
      // console.log('게시물 작성 동작');
      postBoardRequest(requestBody, accessToken).then(postBoardResponse);
      alert('게시물이 작성 되었습니다.');
    } else {
      if (!boardNumber) return;
      const requestBody: PatchBoardRequestDto = {
        title, content, boardImageList
      }
      // console.log('게시물 수정 동작');
      patchBoardRequest(boardNumber, requestBody, accessToken).then(patchBoardResponse);
      alert('게시물이 수정 되었습니다.');
    }

    const requestBody: PostBoardRequestDto = {
      title, content, boardImageList
    }

    // postBoardRequest(requestBody, accessToken).then(postBoardResponse);
  }


  // render: 업로드 버튼 컴포넌트 렌더링 //
  if (title && content)
  return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>;
  // render: 업로드 불가 버튼 컴포넌트 렌더링 //
  return <div className='disable-button'>{'업로드'}</div>;
}

// effect: path가 변경 될 때 마다 //
useEffect(() => {
  const isAuthPage = pathname.startsWith(AUTH_PATH());
  setAuthPage(isAuthPage);
  const isMainPage = pathname === MAIN_PATH();
  setMainPage(isMainPage);
  const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
  setSearchPage(isSearchPage);
  const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
  setBoardDetailPage(isBoardDetailPage);
  const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
  setBoardWritePage(isBoardWritePage);
  const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
  setBoardUpdatePage(isBoardUpdatePage);
  const isUserPage = pathname.startsWith(USER_PATH(''));
  setUserPage(isUserPage);
}, [pathname]);

// effect: login user 변경 될 때 마다 //
useEffect(() => {
  setLogin(loginUser !== null);
},[loginUser])

// render: Header 레이아웃 렌더링 //
  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            {/* <div className='icon logo-dark-icon'></div> */}
          </div>
          <div className='header-logo'>{'Juns Board'}</div>
        </div>
        <div className='header-right-box'>
          {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton />}
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && <MyPageButton />}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
        </div>
      </div>
    </div>
  )
}
