import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import defaultProfileImage from 'assets/image/default-profile-image.png'
import { useNavigate, useParams } from 'react-router-dom';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { useLoginuserStore } from 'stores';
import { fileUploadReqeust, getUserBoardListRequest, getUserRequest, patchNicknameRequest, patchProfileImageRequest } from 'apis';
import { GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from 'apis/request/user';
import { useCookies } from 'react-cookie';
import { eventNames } from 'process';
import { usePagination } from 'hooks';
import { GetUserBoardListResponseDto } from 'apis/response/board';
import Pagination from 'components/Pagination';

// component: 유저 컴포넌트 //
export default function User() {

  // state: userEmail path variable //
  const { userEmail } = useParams();
  // state: 마이페이지 확인 //
  const [isMypage, setMypage] = useState<boolean>(false);
  // state: loginUser 상태 //
  const { loginUser } = useLoginuserStore();

  // function: navigator //
  const navigator = useNavigate();

  // component: 유저 상단 화면 //
  const UserTop = () => {

    // state: 이미지 파일 참조 상태 //
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    // state: 프로필 이미지 상태 //
    const [profileImage, setProfileImage] = useState<string | null>(null);
    // state: cookie 상태 //
    const [cookies, setCookies] = useCookies();
    // state: 닉네임 상태 //
    const [nickname, setNickname] = useState<string>('');
    // state: 변경 닉네임 상태 //
    const [changeNickname, setChangeNickname] = useState<string>('');
    // state: 닉네임 변경 여부 //
    const [isNicknameChange, setIsNicknameChange] = useState<boolean>(false);

    // function: getUserResponse //
    const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'DBE') alert('데이터 베이스 에러입니다.');
      if (code !== 'SU'){
        navigator(MAIN_PATH());
        return;
      }
      // console.log('getUserResponse 동작1 :', responseBody);

      const { email, nickname, profileImage } = responseBody as GetUserResponseDto;
      setNickname(nickname);
      setProfileImage(profileImage);
      const isMypage = email === loginUser?.email;
      setMypage(isMypage);
      // console.log('getUserResponse 동작2 :', responseBody);
    }

    // function: fileUploadResponse //
    const fileUploadResponse = (profileImage: string | null) => {
      if (!profileImage) return;
      // console.log('fileUploadResponse profile image 있음')
      if (!cookies.accessToken) return;
      // console.log('fileUploadResponse token 있음')

      const requestBody: PatchProfileImageRequestDto = { profileImage };
      patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse);
      alert('프로필 이미지가 변경 되었습니다.');
    }

    // function: patchProfileImageResponse //
    const patchProfileImageResponse = (responseBody: PatchProfileImageResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      console.log('patchProfileImageResponse 동작 : ', responseBody);
      const { code } = responseBody;
      if (code === 'VF') alert('잘못된 접근입니다.');
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'DBE') alert('데이터 베이스 에러입니다.');
      if (code !== 'SU') return;

      // console.log('userEmail : ', userEmail);

      if (!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
    }

    // function: patchNicknameResponse //
    const patchNicknameResponse = (responseBody: PatchNicknameResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      console.log('patchNicknameResponse 동작 : ', responseBody);
      const { code } = responseBody;
      if (code === 'VF') alert('닉네임은 필수입니다.');
      if (code === 'DN') alert('중복되는 닉네임입니다.');
      if (code === 'DBE') alert('데이터 베이스 에러입니다.');
      if (code !== 'SU') return;

      if (!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
      setIsNicknameChange(false);

      alert('닉네임이 변경 되었습니다.');
    }

    // event handler: nicknameEditButtonClickHandler //
    const onNicknameEditButtonClickHandler = () => {
      if (!isNicknameChange) {
        setChangeNickname(nickname);
        setIsNicknameChange(!isNicknameChange);
        return;
      }
      
      if (!cookies.accessToken) return;
      const requestBody: PatchNicknameRequestDto = {
        nickname: changeNickname
      };
      patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse);
    }

    //  event handler: profileBoxClickHandler //
    const onProfileBoxClickHandler = () => {
      if (!isMypage) return;
      if (!imageInputRef.current) return;
      // console.log('프로필 이미지 박스 클릭 이벤트 : ', isMypage);
      imageInputRef.current.click();
    }

    // event handler: onProfileImageChangeHandler //
    const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      // console.log('onProfileChange 동작 : ', event.target.files);
      if (!event.target.files || !event.target.files.length) return;
      
      // console.log('변경 핸들러 : ', event.target.files);
      const file = event.target.files[0];
      // console.log('onProfileChange 동작2 : ', file);
      const data = new FormData();
      data.append('file', file);
      // console.log('변경 핸들러 : ', data);

      fileUploadReqeust(data).then(fileUploadResponse);
    }

    // event handler: onNicknameChangeHandler //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setChangeNickname(value);
    }

    


    // effect: user email path variable 변경 시 //
    useEffect(() => {
      if (!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
      // console.log('profileImage : ', profileImage);
    }, [userEmail])


    // render: 유저 상단 화면 렌더링 //
    return(
      <div id='user-top-wrapper'>
        <div className='user-top-container'>
          {isMypage ? 
            <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
              {profileImage !== null ?
                <div className='user-top-profile-iamge' style={{ backgroundImage: `url(${profileImage})` }}></div> :
                <div className='icon-box-large'>
                  <div className='icon image-box-white-icon'></div>
                </div>
              }
              <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onProfileImageChangeHandler} />
            </div> :
            <div className='user-top-profile-image-box' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
          }
          
          <div className='user-top-info-box'>
            <div className='user-top-info-nickname-box'>
              {isMypage ? 
                <>
                  {isNicknameChange ?
                    <input className='user-top-info-nickname-input' type='text' size={changeNickname.length + 2} value={changeNickname} onChange={onNicknameChangeHandler} /> :
                    <div className='user-top-info-nickname'>{nickname}</div>
                  }
                  <div className='icon-button' onClick={onNicknameEditButtonClickHandler}>
                    <div className='icon edit-icon'></div>
                  </div>
                </> :
                <div className='user-top-info-nickname'>{nickname}</div>
              }
              
            </div>
            <div className='user-top-info-email'>{'email3@email.com'}</div>
          </div>
        </div>
      </div>
    )
  }

  // component: 유저 하단 화면 //
  const UserBottom = () => {

    // state: 게시물 갯수 상태 //
    const [count, setCount] = useState<number>(2);
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

    // function: getUserBoardListResponse //
    const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'NU') {
        alert('존재하지 않는 유저입니다.');
        navigator(MAIN_PATH());
        return;
      }
      if (code === 'DBE') alert('데이터 베이스 오류입니다.');
      if (code !== 'SU') return;

      const { userBoardList } = responseBody as GetUserBoardListResponseDto;
      setTotalList(userBoardList);
      setCount(userBoardList.length);
    }

    // event handler: sideCardClickHandler //
    const onSideCardClickHanlder = () => {
      if (isMypage) navigator(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
      else if (loginUser) navigator(USER_PATH(loginUser.email));
    }

    // effect: userEmail path variable 변경 시 //
    useEffect(() => {
      if (!userEmail) return;
      getUserBoardListRequest(userEmail).then(getUserBoardListResponse);
    }, [userEmail])

    // render: 유저 하단 화면 렌더링 //
    return(
      <div id='user-bottom-wrapper'>
        <div className='user-bottom-container'>
          <div className='user-bottom-title'>{isMypage ? '내 게시물' : '게시물 '}<span className='emphasis'>{count}</span></div>
          <div className='user-bottom-contents-box'>
            {count === 0 ?
              <div className='user-bottom-contents-nothing'>{'게시물이 없습니다.'}</div> :
              <div className='user-bottom-contents'>
                {viewList.map(item => <BoardItem boardListItem={item} />)}
              </div>
            }
            <div className='user-bottom-side-box'>
              <div className='user-bottom-side-card' onClick={onSideCardClickHanlder}>
                <div className='user-bottom-side-container'>
                  {isMypage ? 
                    <>
                      <div className='icon-box'>
                        <div className='icon edit-icon'></div>
                      </div>
                      <div className='user-bottom-side-text'>{'글쓰기'}</div>
                    </> :
                    <>
                      <div className='user-bottom-side-text'>{'내 게시물로 가기'}</div>
                      <div className='icon-box'>
                        <div className='icon arrow-right-icon'></div>
                      </div>
                    </>
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

  // render: 유저 컴포넌트 렌더링 //
  return (
    <>
      <UserTop />
      <UserBottom />
    </>
  )
}
