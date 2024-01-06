import { AUTH_PATH } from 'constant';
import Header from 'layouts/Header'
import Footer from 'layouts/footer'
import path from 'path';
import { Outlet, useLocation } from 'react-router-dom'

// component: 레이아웃 //
export default function Container() {

  // state: 현재 페이지 path name //
  const { pathname } = useLocation();
  console.log('현재 페이지 path name : ', pathname);

  // render: 레이아웃 렌더링 //
  return (
    <>
      <Header />
      <Outlet />
      {pathname !== AUTH_PATH() && <Footer />}
    </>
  )
}
