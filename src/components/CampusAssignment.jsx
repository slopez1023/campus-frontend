import React, { useState, useEffect } from 'react';

const CampusAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    ubicacion: '',
    ubicacionDetalle: '',
    aula1: '',
    aula2: '',
    solicitud: '',
    tipoAulas: {
      auditorio: false,
      laboratorio: false,
      teorica: false
    }
  });
  const [campusList, setCampusList] = useState([]);
  const [showSidePanel, setShowSidePanel] = useState(true);

  // Estilos inline
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: 'linear-gradient(135deg, #4c1d95 0%, #3730a3 100%)',
      color: 'white',
      padding: '0.75rem 2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      height: '70px',
      display: 'flex',
      alignItems: 'center'
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    },
    backBtn: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: 'none',
      color: 'white',
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '1.125rem',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    },
    title: {
      fontSize: '1.375rem',
      fontWeight: '600',
      margin: '0',
      letterSpacing: '-0.025em'
    },
    detailsBtn: {
      background: '#6366f1',
      border: 'none',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      fontWeight: '500',
      fontSize: '0.75rem',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    main: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
      gap: '1.5rem',
      padding: '1.5rem',
      minHeight: 'calc(100vh - 100px)'
    },
    formPanel: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    calendarSection: {
      background: '#4c1d95',
      padding: '1.25rem',
      margin: '0',
      color: 'white'
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    calendarNavBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      color: 'white',
      width: '28px',
      height: '28px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600'
    },
    calendarTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      margin: '0',
      textAlign: 'center'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '2px',
      marginTop: '0.5rem'
    },
    weekday: {
      textAlign: 'center',
      fontSize: '0.6875rem',
      fontWeight: '500',
      padding: '0.375rem 0.25rem',
      color: 'rgba(255, 255, 255, 0.9)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    calendarDay: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: '4px'
    },
    form: {
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    },
    input: {
      padding: '0.6875rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '0.8125rem',
      background: 'white',
      color: '#111827'
    },
    label: {
      fontWeight: '500',
      color: '#374151',
      fontSize: '0.8125rem',
      marginBottom: '0.25rem'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem'
    },
    classroomTypes: {
      background: '#4c1d95',
      padding: '1.25rem',
      color: 'white',
      margin: '0 -1.5rem'
    },
    typeItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      padding: '0.375rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.8125rem'
    },
    checkbox: {
      width: '14px',
      height: '14px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      borderRadius: '2px',
      background: 'transparent',
      cursor: 'pointer',
      marginRight: '0.625rem'
    },
    submitBtn: {
      background: '#4c1d95',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0 0 12px 12px',
      fontWeight: '500',
      fontSize: '0.8125rem',
      cursor: 'pointer',
      margin: '0 -1.5rem -1.5rem -1.5rem'
    },
    sidePanel: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      height: 'fit-content',
      position: 'sticky',
      top: '1.5rem',
      border: '1px solid #e5e7eb'
    },
    sidePanelTitle: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: 'white',
      margin: '0',
      textAlign: 'center',
      background: '#6366f1',
      padding: '0.75rem',
      borderRadius: '12px 12px 0 0',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  };

  // Cargar sedes disponibles
  useEffect(() => {
    loadCampuses();
  }, []);

  const loadCampuses = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/campuses');
      if (response.ok) {
        const data = await response.json();
        setCampusList(data.filter(campus => campus.active));
      }
    } catch (error) {
      console.error('Error cargando sedes:', error);
    }
  };

  // Generar calendario
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Días vacíos del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  const handlePrevMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    if (day) {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('tipo_')) {
      const tipoName = name.replace('tipo_', '');
      setFormData(prev => ({
        ...prev,
        tipoAulas: {
          ...prev.tipoAulas,
          [tipoName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const assignmentData = {
      ...formData,
      fecha: selectedDate.toISOString().split('T')[0],
      tiposSeleccionados: Object.keys(formData.tipoAulas).filter(
        tipo => formData.tipoAulas[tipo]
      )
    };

    console.log('Asignación creada:', assignmentData);
    
    // Reset form
    setFormData({
      ubicacion: '',
      ubicacionDetalle: '',
      aula1: '',
      aula2: '',
      solicitud: '',
      tipoAulas: {
        auditorio: false,
        laboratorio: false,
        teorica: false
      }
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           selectedDate.getMonth() === today.getMonth() && 
           selectedDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === selectedDate.getDate();
  };

  const handleBackToSedes = () => {
    window.dispatchEvent(new CustomEvent('navigateToSedes'));
  };

  return (
    <div style={styles.container}>
      {/* Header con navegación consistente */}
      <header style={{
        background: 'linear-gradient(135deg, #3730a3 0%, #4c1d95 100%)',
        color: 'white',
        padding: '0.75rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: '70px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
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
            }}>
              <img src="/logoU.png" alt="Logo Universidad" style={{
                width: '150%',
                height: '150%',
                objectFit: 'contain'
              }} />
            </div>
          </div>

          {/* Navegación */}
          <nav>
            <div style={{
              display: 'flex',
              gap: '2rem',
              listStyle: 'none',
              height: '100%',
              alignItems: 'center'
            }}>
              <button 
                style={{
                  background: 'none',
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
                }}
                onClick={() => window.dispatchEvent(new CustomEvent('navigateToHome'))}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                Home
              </button>
              <button 
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
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
                }}
              >
                Asignaciones
              </button>
              <button 
                style={{
                  background: 'none',
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
                }}
                onClick={() => window.dispatchEvent(new CustomEvent('navigateToCreate'))}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                Crear
              </button>
              <button 
                style={{
                  background: 'none',
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
                }}
                onClick={() => window.dispatchEvent(new CustomEvent('navigateToEdit'))}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                Editar
              </button>
              <button 
                style={{
                  background: 'none',
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
                }}
                onClick={() => window.dispatchEvent(new CustomEvent('navigateToSedes'))}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                Sedes
              </button>
            </div>
          </nav>

          {/* Usuario */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            flexShrink: '0'
          }}>
            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Santiago</div>
              <div style={{ fontSize: '0.75rem', opacity: '0.8' }}>Administrador</div>
            </div>
          </div>
        </div>
      </header>

      {/* Título de la sección */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '2rem',
        paddingTop: '3.5rem',
        marginBottom: '0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e40af',
            margin: '0',
            textAlign: 'center'
          }}>
            Asignación de sedes
          </h1>
          
          <button 
            style={{
              background: '#6366f1',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: '500',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            onClick={() => setShowSidePanel(!showSidePanel)}
          >
            DETALLES DE SEDES
          </button>
        </div>
      </div>

      <div style={styles.main}>
        {/* Panel principal con formulario */}
        <div style={styles.formPanel}>
          {/* Calendario */}
          <div style={styles.calendarSection}>
            <div style={styles.calendarHeader}>
              <button 
                style={styles.calendarNavBtn}
                onClick={handlePrevMonth}
              >
                ←
              </button>
              <h3 style={styles.calendarTitle}>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h3>
              <button 
                style={styles.calendarNavBtn}
                onClick={handleNextMonth}
              >
                →
              </button>
            </div>
            
            <div style={styles.calendarGrid}>
              {weekDays.map(day => (
                <div key={day} style={styles.weekday}>
                  {day}
                </div>
              ))}
              
              {generateCalendar().map((day, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.calendarDay,
                    opacity: day ? 1 : 0,
                    background: day && isToday(day) ? '#3b82f6' : 
                               day && isSelected(day) ? 'rgba(255, 255, 255, 0.2)' : 
                               'rgba(255, 255, 255, 0.1)',
                    fontWeight: day && (isToday(day) || isSelected(day)) ? '600' : '500'
                  }}
                  onClick={() => handleDateSelect(day)}
                  disabled={!day}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.375rem'}}>
              <label style={styles.label}>Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Ubicación principal"
              />
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '0.375rem'}}>
              <label style={styles.label}>Aulas o salones</label>
              <input
                type="text"
                name="ubicacionDetalle"
                value={formData.ubicacionDetalle}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Detalles de ubicación"
              />
            </div>

            <div style={styles.formRow}>
              <div>
                <input
                  type="text"
                  name="aula1"
                  value={formData.aula1}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Aula 1"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="aula2"
                  value={formData.aula2}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Aula 2"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                name="solicitud"
                value={formData.solicitud}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Número de solicitud"
              />
            </div>
          </form>

          {/* Tipo de aulas */}
          <div style={styles.classroomTypes}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <span style={{fontWeight: '500', fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.9)'}}>Tipo de aulas</span>
              <span style={{fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '400'}}>
                Vitas: {Object.values(formData.tipoAulas).filter(Boolean).length}
              </span>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem'}}>
              <label style={styles.typeItem}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.625rem', flex: '1'}}>
                  <input
                    type="checkbox"
                    name="tipo_auditorio"
                    checked={formData.tipoAulas.auditorio}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  <span style={{fontSize: '0.8125rem', fontWeight: '400', color: 'rgba(255, 255, 255, 0.95)'}}>Auditorio</span>
                </div>
                <span style={{fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', background: 'rgba(255, 255, 255, 0.1)', padding: '0.125rem 0.375rem', borderRadius: '2px', minWidth: '24px', textAlign: 'center', fontWeight: '500'}}>145</span>
              </label>
              
              <label style={styles.typeItem}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.625rem', flex: '1'}}>
                  <input
                    type="checkbox"
                    name="tipo_laboratorio"
                    checked={formData.tipoAulas.laboratorio}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  <span style={{fontSize: '0.8125rem', fontWeight: '400', color: 'rgba(255, 255, 255, 0.95)'}}>Laboratorio</span>
                </div>
                <span style={{fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', background: 'rgba(255, 255, 255, 0.1)', padding: '0.125rem 0.375rem', borderRadius: '2px', minWidth: '24px', textAlign: 'center', fontWeight: '500'}}>40</span>
              </label>
              
              <label style={styles.typeItem}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.625rem', flex: '1'}}>
                  <input
                    type="checkbox"
                    name="tipo_teorica"
                    checked={formData.tipoAulas.teorica}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  <span style={{fontSize: '0.8125rem', fontWeight: '400', color: 'rgba(255, 255, 255, 0.95)'}}>Teórica</span>
                </div>
                <span style={{fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', background: 'rgba(255, 255, 255, 0.1)', padding: '0.125rem 0.375rem', borderRadius: '2px', minWidth: '24px', textAlign: 'center', fontWeight: '500'}}>30</span>
              </label>
            </div>
            
            <button type="button" style={{background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.9)', padding: '0.375rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '400'}}>
              Add Item
            </button>
          </div>

          <button type="submit" style={styles.submitBtn} onClick={handleSubmit}>
            Asignar nuevo aula
          </button>
        </div>

        {/* Panel lateral de detalles */}
        {showSidePanel && (
          <div style={styles.sidePanel}>
            <div>
              <h3 style={styles.sidePanelTitle}>DETALLES DE SEDES</h3>
              
              <div style={{padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                {campusList.slice(0, 3).map((campus, index) => (
                  <div key={campus.id} style={{border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.75rem', background: '#fafbfc'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                      <span style={{fontWeight: '500', color: '#111827', fontSize: '0.8125rem', lineHeight: '1.2'}}>{campus.name}</span>
                      <div style={{display: 'flex', gap: '0.125rem', flexShrink: '0', marginLeft: '0.5rem'}}>
                        <button style={{background: 'none', border: 'none', padding: '0.125rem', borderRadius: '2px', cursor: 'pointer', fontSize: '0.75rem', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>📝</button>
                        <button style={{background: 'none', border: 'none', padding: '0.125rem', borderRadius: '2px', cursor: 'pointer', fontSize: '0.75rem', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>📋</button>
                        <button style={{background: 'none', border: 'none', padding: '0.125rem', borderRadius: '2px', cursor: 'pointer', fontSize: '0.75rem', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✕</button>
                      </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{fontSize: '0.6875rem', color: '#6b7280', lineHeight: '1.3', fontWeight: '400'}}>Sede Principal</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{fontSize: '0.6875rem', color: '#6b7280', lineHeight: '1.3', fontWeight: '400'}}>ID: {campus.id}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{fontSize: '0.6875rem', color: '#6b7280', lineHeight: '1.3', fontWeight: '400'}}>Auditorio - Laboratorio - Teórica</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusAssignment;