import { useState, useEffect } from 'react';
import Head from 'next/head';
import { format, addDays, parseISO, startOfWeek, addWeeks, isSameDay } from 'date-fns';
import Layout from '@/components/Layout';
import styles from '@/styles/Calendar.module.css';
import { loadData, saveData } from '@/utils/storage';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDuration, setEventDuration] = useState('60');
  const [eventColor, setEventColor] = useState('#7646f4');
  const [currentView, setCurrentView] = useState('week');
  
  useEffect(() => {
    async function loadEvents() {
      const data = await loadData('calendar-events', []);
      setEvents(data);
    }
    
    loadEvents();
  }, []);
  
  const handleAddEvent = (e) => {
    e.preventDefault();
    
    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      duration: parseInt(eventDuration),
      color: eventColor
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveData('calendar-events', updatedEvents);
    
    // Reset form
    setEventTitle('');
    setEventTime('');
    setEventDuration('60');
    setShowEventModal(false);
  };
  
  const handleDeleteEvent = (id) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    saveData('calendar-events', updatedEvents);
  };
  
  const openAddEventModal = (date) => {
    setEventDate(format(date, 'yyyy-MM-dd'));
    setShowEventModal(true);
  };
  
  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const prevWeek = () => {
    setCurrentDate(addWeeks(currentDate, -1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    return (
      <div className={styles.weekView}>
        <div className={styles.daysHeader}>
          <div className={styles.timeColumn}></div>
          {weekDays.map((day, idx) => (
            <div key={idx} className={styles.dayColumn}>
              <div className={styles.dayName}>{format(day, 'EEE')}</div>
              <div className={styles.dayDate}>{format(day, 'd')}</div>
            </div>
          ))}
        </div>
        
        <div className={styles.timeGrid}>
          <div className={styles.timeLabels}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className={styles.timeLabel}>
                {(i + 8) % 12 || 12}{i + 8 >= 12 ? 'pm' : 'am'}
              </div>
            ))}
          </div>
          
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} className={styles.dayEvents}>
              {Array.from({ length: 12 }, (_, hourIdx) => (
                <div 
                  key={hourIdx} 
                  className={styles.hourCell}
                  onClick={() => {
                    const clickedDate = new Date(day);
                    clickedDate.setHours(hourIdx + 8);
                    openAddEventModal(clickedDate);
                  }}
                ></div>
              ))}
              
              {events
                .filter(event => {
                  const eventDate = parseISO(event.date);
                  return isSameDay(eventDate, day);
                })
                .map(event => {
                  const [hours, minutes] = event.time.split(':').map(Number);
                  const topPosition = (hours - 8) * 60 + minutes;
                  const height = event.duration;
                  
                  return (
                    <div 
                      key={event.id} 
                      className={styles.eventItem}
                      style={{
                        top: `${topPosition}px`,
                        height: `${height}px`,
                        backgroundColor: event.color
                      }}
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <div className={styles.eventTitle}>{event.title}</div>
                      <div className={styles.eventTime}>{event.time}</div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      <Head>
        <title>Calendar - Tempus Productivity</title>
      </Head>
      
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <div className={styles.headerTitle}>
            <h2>Calendar</h2>
            <p>Schedule and manage your events</p>
          </div>
          
          <div className={styles.headerControls}>
            <div className={styles.viewToggle}>
              <button 
                className={`${styles.viewBtn} ${currentView === 'day' ? styles.active : ''}`}
                onClick={() => setCurrentView('day')}
              >
                Day
              </button>
              <button 
                className={`${styles.viewBtn} ${currentView === 'week' ? styles.active : ''}`}
                onClick={() => setCurrentView('week')}
              >
                Week
              </button>
              <button 
                className={`${styles.viewBtn} ${currentView === 'month' ? styles.active : ''}`}
                onClick={() => setCurrentView('month')}
              >
                Month
              </button>
            </div>
            
            <div className={styles.dateNavigation}>
              <button className={styles.navBtn} onClick={prevWeek}>
                <span className="material-icons">chevron_left</span>
              </button>
              <button className={styles.todayBtn} onClick={goToToday}>
                Today
              </button>
              <button className={styles.navBtn} onClick={nextWeek}>
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
            
            <button 
              className={styles.addEventBtn}
              onClick={() => {
                setEventDate(format(new Date(), 'yyyy-MM-dd'));
                setEventTime('09:00');
                setShowEventModal(true);
              }}
            >
              <span className="material-icons">add</span>
              Add Event
            </button>
          </div>
        </div>
        
        <div className={styles.calendarContent}>
          {currentView === 'week' && renderWeekView()}
        </div>
      </div>
      
      {/* Add Event Modal */}
      {showEventModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add Event</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowEventModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddEvent}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label htmlFor="eventTitle">Event Title</label>
                  <input 
                    type="text" 
                    id="eventTitle" 
                    className={styles.formInput}
                    placeholder="e.g., Team Meeting"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="eventDate">Date</label>
                  <input 
                    type="date" 
                    id="eventDate" 
                    className={styles.formInput}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="eventTime">Start Time</label>
                  <input 
                    type="time" 
                    id="eventTime" 
                    className={styles.formInput}
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="eventDuration">Duration (minutes)</label>
                  <select 
                    id="eventDuration" 
                    className={styles.formInput}
                    value={eventDuration}
                    onChange={(e) => setEventDuration(e.target.value)}
                    required
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="eventColor">Color</label>
                  <div className={styles.colorPicker}>
                    <input 
                      type="color" 
                      id="eventColor" 
                      value={eventColor}
                      onChange={(e) => setEventColor(e.target.value)}
                    />
                    <span className={styles.selectedColor}>{eventColor}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
} 