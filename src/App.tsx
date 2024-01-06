import React, { useEffect, useState } from 'react';
import './App.css';
import { commentListMock, favoriteListMock, latestBoardListMock, top3BoardListMock } from 'mocks';
import Top3Item from 'components/Top3Item';
import CommentItem from 'components/commentItem';
import FavoriteItem from 'components/favoriteItem';
import InputBox from 'components/inputBox';
import Footer from 'layouts/footer';
import { Route, Routes } from 'react-router-dom';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import Search from 'views/Search';
import UserV from 'views/User';
import BoardDetail from 'views/Board/Detail';
import BoardWrite from 'views/Board/Write';
import BoardUpdate from 'views/Board/Update';
import Container from 'layouts/Container';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import BoardItem from 'components/BoardItem';
import { useCookies } from 'react-cookie';
import { useLoginuserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';


// component: Application 컴포넌트 //
function App() {

// state: login user 상태 //
const { setLoginUser, resetLoginUser } = useLoginuserStore();

// state: cookie 상태 //
const [cookies, setCookie] = useCookies();

// function: get sign in user response 처리 함수 //
const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
  if (!responseBody) return;

  const { code } = responseBody;

  // 에러 상태일 때 reset
  if (code === 'AF' || code === 'NU' || code == 'DBE') {
    resetLoginUser();
    return;
  }

  const loginUser: User = { ...(responseBody as GetSignInUserResponseDto) };
  setLoginUser(loginUser);

}
  
// effect: accessToken cookie 값 변경 될 때 마다 //
useEffect(() => {
  // 토큰이 없으면 reset 후 return
  if(!cookies.accessToken){
    resetLoginUser();
    return;
  }
  getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse)
},[cookies.accessToken])

// render: Application 컴포넌트 렌더링 //
// description: 메인 : '/' -Main //
// description: 로그인, 회원가입 : '/auth' - Authentication //
// description: 검색 : '/search/:searchWord' - Search //
// description: 유저 : 'user/:userEmail' - User //
//
// description: 게시물 상세보기 : '/board/detail/:boardNumber' - BoardDetail //
// description: 게시물 작성하기 : '/board/write' - BoardWrite //
// description: 게시물 수정하기 : '/board/update/:boardNumber' - BoardUpdate //
//
return (
    <>
      {/* 게시물 리스트 */}
      {/* {latestBoardListMock.map(boardListItem => <BoardItem boardListItem={boardListItem} />)} */}

      {/* 탑 3 리스트 */}
      {/* <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
        {top3BoardListMock.map(top3ListItem => <Top3Item top3ListItem={top3ListItem} />)}
      </div> */}

      {/* 댓글 리스트 */}
      {/* <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {commentListMock.map(commentListItem => <CommentItem commentListItem={commentListItem} />)}
      </div> */}

      {/* 좋아요 리스트 */}
      {/* <div style={{ display: 'flex', columnGap: '30px', rowGap: '20px' }}>
        {favoriteListMock.map(favoriteListItem => <FavoriteItem favoriteListItem={favoriteListItem} />)}
      </div> */}

      {/* 입력폼 */}
      {/* <InputBox label='이메일' type='text' placeholder='이메일 주소를 입력해주세요' value={value} error={true} setValue={setValue} message='aaa' /> */}

      {/* Footer */}
      {/* <Footer /> */}

      <Routes>
        <Route element={<Container />}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={AUTH_PATH()} element={<Authentication />} />
          <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
          <Route path={USER_PATH(':userEmail')} element={<UserV />} />
          <Route path={BOARD_PATH()}>
            <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
            <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail />} />
            <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />} />
          </Route>
          <Route path='*' element={<h1>404 NOT FOUND</h1>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
