import SideBar from './Menu';
import Mainwindow from './Mainwindow';
import { CSSProperties } from 'react';

export default function Layout() {
  const style: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center', 
    width: '100%',            
    height: '95vh',           
    margin: '0 auto',     
    gap:'20px',
    
  };

  return (
    <div style={style}>
      <SideBar />
      <Mainwindow />
    </div>
  );
}
