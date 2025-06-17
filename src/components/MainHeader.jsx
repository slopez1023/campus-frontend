import React from 'react';

const MainHeader = ({ currentView, onNavigate }) => {
  const headerStyle = {
    background: 'linear-gradient(135deg, #3730a3 0%, #4c1d95 100%)',
    color: 'white',
    padding: '0.75rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: '70px',
    display: 'flex',
    alignItems: 'center'
  };

  const headerContentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  };

  const logoSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const logoStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    width: '140px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    position: 'relative',
    top: '25px',
    border: '3px solid rgba(255,255,255,0.1)'
  };

  const logoImgStyle = {
    width: '150%',
    height: '150%',
    objectFit: 'contain'
  };

  const navMenuStyle = {
    display: 'flex',
    gap: '2rem',
    listStyle: 'none',
    height: '100%',
    alignItems: 'center'
  };

  const getNavItemStyle = (isActive) => ({
    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'none',
    border: 'none',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    fontSize: 'inherit',
    fontFamily: 'inherit'
  });

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '25px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    flexShrink: '0'
  };

  const userIconStyle = {
    width: '32px',
    height: '32px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '50%'
  };

  const userNameStyle = {
    fontSize: '0.875rem',
    fontWeight: '600'
  };

  const userRoleStyle = {
    fontSize: '0.75rem',
    opacity: '0.8'
  };

  const handleNavClick = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const handleMouseOver = (e, isActive) => {
    if (!isActive) {
      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
    }
  };

  const handleMouseOut = (e, isActive) => {
    if (!isActive) {
      e.target.style.background = 'none';
    }
  };

  return (
    <header style={headerStyle}>
      <div style={headerContentStyle}>
        {/* Logo */}
        <div style={logoSectionStyle}>
          <div style={logoStyle}>
            <img src="/logoU.png" alt="Logo Universidad" style={logoImgStyle} />
          </div>
        </div>

        {/* Navegación */}
        <nav>
          <div style={navMenuStyle}>
            <button 
              style={getNavItemStyle(currentView === 'home')}
              onClick={() => handleNavClick('home')}
              onMouseOver={(e) => handleMouseOver(e, currentView === 'home')}
              onMouseOut={(e) => handleMouseOut(e, currentView === 'home')}
            >
              Home
            </button>
            <button 
              style={getNavItemStyle(currentView === 'assignment')}
              onClick={() => handleNavClick('assignment')}
              onMouseOver={(e) => handleMouseOver(e, currentView === 'assignment')}
              onMouseOut={(e) => handleMouseOut(e, currentView === 'assignment')}
            >
              Asignaciones
            </button>
            <button 
              style={getNavItemStyle(currentView === 'create')}
              onClick={() => handleNavClick('create')}
              onMouseOver={(e) => handleMouseOver(e, currentView === 'create')}
              onMouseOut={(e) => handleMouseOut(e, currentView === 'create')}
            >
              Crear
            </button>
            <button 
              style={getNavItemStyle(currentView === 'edit')}
              onClick={() => handleNavClick('edit')}
              onMouseOver={(e) => handleMouseOver(e, currentView === 'edit')}
              onMouseOut={(e) => handleMouseOut(e, currentView === 'edit')}
            >
              Editar
            </button>
            <button 
              style={getNavItemStyle(currentView === 'campus')}
              onClick={() => handleNavClick('campus')}
              onMouseOver={(e) => handleMouseOver(e, currentView === 'campus')}
              onMouseOut={(e) => handleMouseOut(e, currentView === 'campus')}
            >
              Sedes
            </button>
          </div>
        </nav>

        {/* Usuario */}
        <div style={userSectionStyle}>
          <div style={userIconStyle}></div>
          <div>
            <div style={userNameStyle}>Santiago</div>
            <div style={userRoleStyle}>Administrador</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;