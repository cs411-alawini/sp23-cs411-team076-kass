import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';

function NavBar() {
  return (
    <MDBNavbar expand='lg' light bgColor='light' className='nav-font'>
      <MDBContainer fluid>
        <MDBCollapse navbar show='false'>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0 nav-custom'>
              <img
                src='https://colorlib.com/wp-content/uploads/sites/2/2014/02/Olympic-logo.png'
                height='50'
                alt=''
                loading='lazy'
              />
          <div className='nav-custom-links'>
            <MDBNavbarItem>
                <Link to="/atheletes" className='nav-item-decor'>Atheletes</Link>
            </MDBNavbarItem>

            <MDBNavbarItem>
                <Link to="/medals" className='nav-item-decor'>Medals</Link>
            </MDBNavbarItem>

            <MDBNavbarItem>
                <Link to="/schedule" className='nav-item-decor'>Schedule</Link>
            </MDBNavbarItem>

          </div>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default NavBar;