import React, { useState, KeyboardEvent, useRef, ChangeEvent, useEffect } from 'react'
import './style.css'
import InputBox from 'components/inputBox';
import { SignInRequestDto, SignUpRequestDto } from 'apis/request/auth';
import { signInRequest, signUpRequest } from 'apis';
import { SignInResponseDto } from 'apis/response/auth';
import { ResponseDto } from 'apis/response';
import { useCookies } from 'react-cookie';
import { MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';

// component: 인증 컴포넌트 //
export default function Authentication() {
  // state: sign 상태 //
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

  // state: cookie 상태 //
  const [cookies, setCookies] = useCookies();

  // function: navigate //
  const navigator = useNavigate();
  
  // component: sign in card 컴포넌트 //
  const SignInCard = () => {

    // state: email 요소 참조 상태 //
    const emailRef = useRef<HTMLInputElement | null>(null);

    // state: password 요소 참조 상태 //
    const passwordRef = useRef<HTMLInputElement | null>(null);

    // state: email 상태 //
    const [email, setEmail] = useState<string>('');

    // state: password 상태 //
    const [password, setPassword] = useState<string>('');

    // state: password type 상태 //
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

    // state: password button icon 상태 //
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon')
    
    // state: error 상태 //
    const [error, setError] = useState<boolean>(false);

    // event handler: password button 클릭 이벤트 처리 //
    const onPasswordButtonClickHandler = () => {
      if (passwordType === 'text') {
        setPasswordType('password');
        setPasswordButtonIcon('eye-light-off-icon');
      } else {
        setPasswordType('text');
        setPasswordButtonIcon('eye-light-on-icon');
        
      }
    }
    
    // event handler: email input keyDown 이벤트 처리 //
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    }

    // function: sign in response 처리 //
    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
      if (!responseBody) {
        // back이 안 켜져 있거나 도메인이 틀렸을 때
        alert('네트워크 상태를 확인 해주세요.')
        return;
      }
      const { code } = responseBody;
      if (code === "DBE") alert('데이터 베이스 오류입니다.');
      if (code === "SF" || code === "VF") setError(true);
      if (code !== "SU") return;

      // 성공 일 시 2개 인자 호출
      const { token, expirationTime } = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      // 현재 시간 + 3600s
      const expires = new Date(now + expirationTime * 1000);

      // expires 시간 후 메인 화면으로
      setCookies('accessToken', token, { expires, path: MAIN_PATH() });
      navigator(MAIN_PATH());
    }

    // event handler: email onChange 이벤트 처리 //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setEmail(value);
    }

    // event handler: password onChange 이벤트 처리 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setPassword(value);
    }
    
    // event handler: login button 클릭 이벤트 처리 //
    const onSignInButtonClickHandler = () => {
      const requestBody: SignInRequestDto = { email, password };
      signInRequest(requestBody)
        .then(signInResponse);
    }
    
    // event handler: 회원 가입 링크 클릭 이벤트 처리 //
    const onSignUpLinkClickHandler = () => {
      setView('sign-up');
    }
    // event handler: password keyDown 이벤트 처리 //
    const passwordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onSignInButtonClickHandler();
    }

    // render: sign in card 컴포넌트  렌더링//
    return (
      <div className='auth-card'>
        <div className='auth-card-box'>
          <div className='auth-card-top'>
            <div className='auth-card-title-box'>
              <div className='auth-card-title'>{'로그인'}</div>
            </div>
            <InputBox ref={emailRef} label='이메일 주소' type='text' placeholder='이메일 주소를 입력해주세요.' error={error} value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler} />
            <InputBox ref={passwordRef} label='비밀번호' type={passwordType} placeholder='비밀번호를 입력해주세요.' error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={passwordKeyDownHandler} />
          </div>
          <div className='auth-card-bottom'>
            {error && 
            <div className='auth-sign-in-error-box'>
              <div className='auth-sign-in-error-message'>
                {'이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.'}
              </div>
            </div>
            
            }
            <div className='black-large-full-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
            <div className='auth-description-box'>{'신규 사용자이신가요?'}&nbsp;<span className='auth-description-link' onClick={onSignUpLinkClickHandler}>{' 회원가입'}</span></div>
          </div>
        </div>
      </div>
    );
  };
  
  // component: sign up card 컴포넌트 //
  const SignUpCard = () => {

    // state: email 요소 참조 상태 //
    const emailRef = useRef<HTMLInputElement | null>(null);
    // state: password 요소 참조 상태 //
    const passwordRef = useRef<HTMLInputElement | null>(null);
    // state: password check 요소 참조 상태 //
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);
    // state: nickname 요소 참조 상태 //
    const nicknameRef = useRef<HTMLInputElement | null>(null);
    // state: tellNumber 요소 참조 상태 //
    const tellNumberRef = useRef<HTMLInputElement | null>(null);
    // state: address 요소 참조 상태 //
    const addressRef = useRef<HTMLInputElement | null>(null);
    // state: address detail 요소 참조 상태 //
    const addressDetailRef = useRef<HTMLInputElement | null>(null);

    // state: page 번호 상태 //
    const [page, setPage] = useState<1 | 2>(1);
    // state: email 상태 //
    const [email, setEmail] = useState<string>('');
    // state: password 상태 //
    const [password, setPassword] = useState<string>('');
    // state: password check 상태 //
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    // state: password type 상태 //
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
    // state: password check type 상태 //
    const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

    // state: nickname type 상태 //
    const [nickname, setNickname] = useState<string>('');
    // state: tellNumber type 상태 //
    const [tellNumber, setTellNumber] = useState<string>('');
    // state: address type 상태 //
    const [address, setAddress] = useState<string>('');
    // state: address detail type 상태 //
    const [addressDetail, setAddressDetail] = useState<string>('');
    // state: agreed 상태 //
    const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);
    
    // state: email error 상태 //
    const [isEmailError, setIsEmailError] = useState<boolean>(false);
    // state: password error 상태 //
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    // state: password check error 상태 //
    const [isPasswordCheckError, setIsPasswordCheckError] = useState<boolean>(false);

    // state: email error message 상태 //
    const [emailErrorMsg, setEmailErrorMsg] = useState<string>('');
    // state: password error message 상태 //
    const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>('');
    // state: passwordcheck error message 상태 //
    const [passwordCheckErrorMsg, setPasswordCheckErrorMsg] = useState<string>('');
    
    
    // state: nickname error 상태 //
    const [isNicknameError, setIsNicknameError] = useState<boolean>(false);
    // state: tellNumber error 상태 //
    const [isTellNumberError, setIsTellNumberError] = useState<boolean>(false); 
    // state: address error 상태 //
    const [isAddressError, setIsAddressError] = useState<boolean>(false);
    // state: agreed error 상태 //
    const [isAgreedPersonalError, setIsAgreedPersonalError] = useState<boolean>(false);

    // state: nickname error message 상태 //
    const [nicknameErrorMsg, setNicknameErrorMsg] = useState<string>('');
    // state: tellNumber error message 상태 //
    const [tellNumberErrorMsg, setTellNumberErrorMsg] = useState<string>('');
    // state: address error message 상태 //
    const [addressErrorMsg, setAddressErrorMsg] = useState<string>('');
    
    // state: password button icon 상태 //
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon')
    
    // state: password check button icon 상태 //
    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon')

    // function: 다음 주소 검색 팝업 오픈 //
    const open = useDaumPostcodePopup();

    // function: sign up response 처리 함수 //
    const signUpResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
      if (!responseBody) {
        alert('네트워크 상태를 확인해주세요.')
        return;
      }

      const { code } = responseBody;
      if (code === 'DE') {
        setIsEmailError(true);
        setEmailErrorMsg('중복되는 이메일 주소입니다.');
      }
      if (code === 'DN') {
        setIsNicknameError(true);
        setNicknameErrorMsg('중복되는 닉네임입니다.');
      }
      if (code === 'DT'){
        setIsTellNumberError(true);
        setTellNumberErrorMsg('중복되는 휴대폰 번호입니다.');
      }
      if (code === 'VF') alert('모든 값을 입력해주세요.');
      if (code=== 'DBE') alert('데이터베이스 오류입니다.');

      if (code !== 'SU') return;

      setView('sign-in');
    }

    // event handler: email 변경 이벤트 처리 //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setEmail(value);
      setIsEmailError(false);
      setEmailErrorMsg('');
    } 
    
    // event handler: password 변경 이벤트 처리 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPassword(value);
      setIsPasswordError(false);
      setPasswordErrorMsg('');
    } 
    
    // event handler: password check 변경 이벤트 처리 //
    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPasswordCheck(value);
      setIsPasswordCheckError(false);
      setPasswordCheckErrorMsg('');
    } 

    // event handler: nickname change 이벤트 처리 //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setNickname(value);
      setIsNicknameError(false);
      setNicknameErrorMsg('');
    }
    // event handler: tellNumber change 이벤트 처리 //
    const onTellNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setTellNumber(value);
      setIsTellNumberError(false);
      setTellNumberErrorMsg('');
    }
    // event handler: address change 이벤트 처리 //
    const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setAddress(value);
      setIsAddressError(false);
      setAddressErrorMsg('');
    }
    // event handler: addres detail change 이벤트 처리 //
    const onAddressDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setAddressDetail(value);
    }


    // event handler: password button click 이벤트 처리 //
    const onPasswordButtonClickHandler = () => {
      if (passwordButtonIcon === 'eye-light-off-icon') {
        setPasswordButtonIcon('eye-light-on-icon');
        setPasswordType('text');
      } else {
        setPasswordButtonIcon('eye-light-off-icon');
        setPasswordType('password');
        
      }
    }
    
    // event handler: agreed checkbox click 이벤트 처리 //
    const onAgreedPersonalClickHandler = () => {
      setAgreedPersonal(!agreedPersonal);
      setIsAgreedPersonalError(false);
    }
    
    // event handler: password check button click 이벤트 처리 //
    const onPasswordCheckButtonClickHandler = () => {
      if (passwordCheckButtonIcon === 'eye-light-off-icon') {
        setPasswordCheckButtonIcon('eye-light-on-icon');
        setPasswordCheckType('text');
      } else {
        setPasswordCheckButtonIcon('eye-light-off-icon');
        setPasswordCheckType('password');
      }
    }

    // event handler: address button click 이벤트 처리 //
    const onAddressButtonClickHandler = () => {
      // opne에 객체로 전달
      open({ onComplete });
    }

    // event handler: 다음 단계로 button click 이벤트 처리 //
    // input 값 검증 로직 //
    const onNextButtonClickHandler = () => {
      const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setIsEmailError(true);
        setEmailErrorMsg('이메일 주소 포맷이 맞지 않습니다.');
      }
      const isCheckedPassword = password.trim().length > 7;
      if (!isCheckedPassword) {
        setIsPasswordError(true);
        setPasswordErrorMsg('비밀번호를 8자 이상 입력해주세요.');
      }
      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setIsPasswordCheckError(true);
        setPasswordCheckErrorMsg('비밀번호가 일치하지 않습니다.');
      }
      if (!isEmailPattern || !isCheckedPassword || !isEqualPassword) return;

      setPage(2);
    }

    // event handler: sign up button click 이벤트 처리 //
    const onSignUpButtonClickHandler = () => {
      const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setIsEmailError(true);
        setEmailErrorMsg('이메일 주소 포맷이 맞지 않습니다.');
      }
      const isCheckedPassword = password.trim().length > 7;
      if (!isCheckedPassword) {
        setIsPasswordError(true);
        setPasswordErrorMsg('비밀번호를 8자 이상 입력해주세요.');
      }
      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setIsPasswordCheckError(true);
        setPasswordCheckErrorMsg('비밀번호가 일치하지 않습니다.');
      }
      if (!isEmailPattern || !isCheckedPassword || !isEqualPassword) {
        setPage(1);
        return;
      }

      const hasNickname = nickname.trim().length !== 0;
      if (!hasNickname) {
        setIsNicknameError(true);
        setNicknameErrorMsg('닉네임을 입력해주세요.');
      }

      const tellNumberPattern = /^[0-9]{11,13}$/;
      const isTellNumberPattern = tellNumberPattern.test(tellNumber);
      if (!isTellNumberPattern) {
        setIsTellNumberError(true);
        setTellNumberErrorMsg('숫자만 입력해주세요.');
      }

      const hasAddress = address.trim().length > 0;
      if (!hasAddress) {
        setIsAddressError(true);
        setAddressErrorMsg('주소를 입력해주세요.');
      }

      if (!agreedPersonal) {
        setIsAgreedPersonalError(true);
        alert('개인정보 제공에 동의하지 않았습니다.');
      }

      // 최종 data 검증
      if (!hasNickname || !isTellNumberPattern || !agreedPersonal) return;

      const requestBody: SignUpRequestDto = {
        email, password, nickname, tellNumber, address, addressDetail, agreedPersonal
      };

      // axios 컴포넌트로 body 전달
      signUpRequest(requestBody).then(signUpResponse);

      alert('가입을 축하합니다!');

    }


    // event handler: email keyDown 이벤트 처리 //
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    }

    // event handler: password keyDown 이벤트 처리 //
    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!passwordCheckRef.current) return;
      passwordCheckRef.current.focus();
    }
    
    // event handler: password Check keyDown 이벤트 처리 //
    const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!nicknameRef.current) return;
      onNextButtonClickHandler();
      nicknameRef.current.focus();
    }

    // event handler: nickname keyDown 이벤트 처리 //
    const onNicknameCKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!tellNumberRef.current) return;
      tellNumberRef.current.focus();
    }
    // event handler: tellNumber keyDown 이벤트 처리 //
    const onTellNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onAddressButtonClickHandler();
    }
    // event handler: address keyDown 이벤트 처리 //
    const onAddressKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    }
    // event handler: address detail keyDown 이벤트 처리 //
    const onAddressDetailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onSignUpButtonClickHandler();
    }

    // event handler: 다음 주소 검색 완료 이벤트 처리 //
    const onComplete = (data: Address) => {
      const { address } = data;
      setAddress(address);
      setIsAddressError(false);
      setAddressErrorMsg('');
      if (!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    }

    
    // event handler: login link click 이벤트 처리 //
    const onSignInLinkClickHandler = () => {
      setView('sign-in');
    }

    useEffect(() => {
      // onKeyDown 기능을 위한 useEffect
      if (page === 2) {
        if (!nicknameRef.current) return;
        nicknameRef.current.focus();
      }
    },[page])
    


    // render: sign up card 컴포넌트  렌더링//
    return (
      <div className='auth-card'>
        <div className='auth-card-box'>
          <div className='auth-card-top'>
            <div className='auth-card-title-box'>
              <div className='auth-card-title'>{'회원가입'}</div>
              <div className='auth-card-page'>{`${page}/2`}</div>
            </div>
            {page === 1 && (
              <>
                <InputBox ref={emailRef} label='이메일 주소*' type='text' placeholder='이메일 주소를 입력해주세요.' 
                  value={email} onChange={onEmailChangeHandler} error={isEmailError} message={emailErrorMsg} onKeyDown={onEmailKeyDownHandler} 
                />
                <InputBox ref={passwordRef} label='비밀번호*' type={passwordType} placeholder='비밀번호를 입력해주세요.' 
                  value={password} onChange={onPasswordChangeHandler} error={isPasswordError} message={passwordErrorMsg} 
                  icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler} 
                />
                <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType} placeholder='비밀번호를 다시 입력해주세요.' 
                  value={passwordCheck} onChange={onPasswordCheckChangeHandler} error={isPasswordCheckError} message={passwordCheckErrorMsg} 
                  icon={passwordCheckButtonIcon} onButtonClick={onPasswordCheckButtonClickHandler} onKeyDown={onPasswordCheckKeyDownHandler }
                />
              </>
            )}
            {page === 2 && (
              <>
                <InputBox ref={nicknameRef} label='닉네임*' type='text' placeholder='닉네임을 입력해주세요.' value={nickname} onChange={onNicknameChangeHandler} error={isNicknameError} message={nicknameErrorMsg} onKeyDown={onNicknameCKeyDownHandler}/>
                <InputBox ref={tellNumberRef} label='휴대폰 번호*' type='text' placeholder='휴대폰 번호(숫자만)를 입력해주세요.' value={tellNumber} onChange={onTellNumberChangeHandler} error={isTellNumberError} message={tellNumberErrorMsg} onKeyDown={onTellNumberKeyDownHandler} />
                <InputBox ref={addressRef} label='주소*' type='text' placeholder='우편번호 찾기' value={address} onChange={onAddressChangeHandler} error={isAddressError} message={addressErrorMsg} icon='expand-right-light-icon' onButtonClick={onAddressButtonClickHandler} onKeyDown={onAddressKeyDownHandler} />
                <InputBox ref={addressDetailRef} label='상세 주소' type='text' placeholder='상세 주소를 입력해주세요.' value={addressDetail} onChange={onAddressDetailChangeHandler} error={false} onKeyDown={onAddressDetailKeyDownHandler} />
              </>
            )}
          </div>
          <div className='auth-card-bottom'>
          {page === 1 && (
            <div className='black-large-full-button' onClick={onNextButtonClickHandler}>{'다음 단계'}</div>
          )}
          {page === 2 && (
            <>
              <div className='auth-consent-box'>
                <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                    <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}`}></div>
                </div>
                <div className={isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title'}>{'개인정보동의'}</div>
                <div className='auth-consent-link'>{'더보기 >'}</div>
              </div>
              <div className='black-large-full-button' onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
            </>
          )}
          <div className='auth-description-box'>{'이미 계정이 있으신가요?'}&nbsp;<span className='auth-description-link' onClick={onSignInLinkClickHandler}>{'로그인'}</span></div>
          </div>
        </div>
      </div>
    );
  };

  // render: 인증 컴포넌트 렌더링 //
  return (
    <div id='auth-wrapper'>
      <div className='auth-container'>
        <div className='auth-jumbotron-box'>
          <div className='auth-jumbotron-content'>
            {/* <div className='auth-logo-icon'></div> */}
            <div className='auth-jumbotron-text-box'>
              <div className='auth-jumbotron-text'>{'환영합니다.'}</div>
              <div className='auth-jumbotron-text'>{'Juns Board 입니다.'}</div>
            </div>
          </div>
        </div>
        {view === 'sign-in' && <SignInCard />}
        {view === 'sign-up' && <SignUpCard />}
      </div>
      
    </div>
  )
}
