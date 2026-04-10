import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

const RightSidebar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchCommunity, setSearchCommunity] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [eventForm, setEventForm] = useState({
    date: '',
    day: '',
    title: '',
    time: '',
    location: '',
    color: 'blue',
    notify: false
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [upcomingEvents, setUpcomingEvents] = useState([
    { date: '10', day: 'Tue', title: 'Google job interview', time: '09:00 - 10:00', location: 'Zoom Meeting', color: 'blue' },
    { date: '11', day: 'Thu', title: 'Meeting with client', time: '20:00 - End', location: 'Starbucks', color: 'blue' },
    { date: '14', day: 'Fri', title: 'Landing page creation date', time: '09:00 - 10:00', location: 'Zoom Meeting', color: 'yellow' }
  ]);

  const handleAddEvent = () => {
    setEventForm({
      date: '',
      day: '',
      title: '',
      time: '',
      location: '',
      color: 'blue',
      notify: false
    });
    setEditingEventIndex(null);
    setShowAddEventModal(true);
  };

  const handleEditEvent = (index) => {
    setEventForm(upcomingEvents[index]);
    setEditingEventIndex(index);
    setShowAddEventModal(true);
  };

  const handleDeleteEvent = (index) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setUpcomingEvents(upcomingEvents.filter((_, i) => i !== index));
    }
  };

  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.time) {
      alert('Please fill in Title and Time fields');
      return;
    }

    if (editingEventIndex !== null) {
      const updated = [...upcomingEvents];
      updated[editingEventIndex] = eventForm;
      setUpcomingEvents(updated);
    } else {
      setUpcomingEvents([...upcomingEvents, eventForm]);
    }

    setShowAddEventModal(false);
    setEventForm({
      date: '',
      day: '',
      title: '',
      time: '',
      location: '',
      color: 'blue',
      notify: false
    });
    setEditingEventIndex(null);
  };

  const communities = [
    { name: 'UI/UX designer community', members: 28, gradient: 'from-purple-400 to-blue-400' },
    { name: 'Fullstack website developper', members: 19, gradient: 'from-pink-400 to-purple-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Calendar Widget */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isToday = day === 9;
            const hasEvent = [10, 11, 13, 14, 15, 16].includes(day);
            const isSelected = selectedDate === day;
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                  isToday
                    ? 'bg-blue-600 text-white font-bold'
                    : isSelected
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : hasEvent
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {day}
                {hasEvent && !isToday && !isSelected && (
                  <div className="flex space-x-0.5 mt-0.5">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Upcoming schedule</h3>
          <button 
            onClick={handleAddEvent}
            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
            title="Add new event"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div 
              key={index} 
              className="group relative flex items-start space-x-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
            >
              <div className="text-center">
                <p className="text-xs text-gray-500">{event.day}</p>
                <p className="text-lg font-bold text-gray-900">{event.date}</p>
              </div>
              <div className={`flex-1 border-l-4 pl-3 py-1 text-left ${
                event.color === 'blue' ? 'border-blue-500' :
                event.color === 'green' ? 'border-green-500' :
                event.color === 'yellow' ? 'border-yellow-500' :
                event.color === 'red' ? 'border-red-500' :
                event.color === 'purple' ? 'border-purple-500' :
                'border-pink-500'
              }`}>
                <h4 className="font-semibold text-gray-900 text-sm">{event.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {event.time} • {event.location}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                {event.notify && (
                  <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600" title="Notifications enabled">
                    <BellIcon className="w-4 h-4" />
                  </div>
                )}
                <button
                  onClick={() => handleEditEvent(index)}
                  className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                  title="Edit event"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(index)}
                  className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                  title="Delete event"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {upcomingEvents.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">No upcoming events</p>
          )}
        </div>

        <button 
          onClick={() => alert('View all schedule clicked!')}
          className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-1 hover:bg-blue-50 py-2 rounded-lg transition-colors"
        >
          <span>View all schedule</span>
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* My Community */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">My community</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Search communities"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => alert('Create new community feature coming soon!')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Add community"
            >
              <PlusIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {showSearchInput && (
          <div className="mb-4">
            <input
              type="text"
              value={searchCommunity}
              onChange={(e) => setSearchCommunity(e.target.value)}
              placeholder="Search communities..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        )}

        <div className="space-y-3">
          {communities
            .filter(community => 
              community.name.toLowerCase().includes(searchCommunity.toLowerCase())
            )
            .map((community, index) => (
            <button 
              key={index} 
              onClick={() => alert(`Joined ${community.name}!`)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-left"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${community.gradient} rounded-lg flex-shrink-0`}></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{community.name}</h4>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                  {community.members} members are currently active
                </p>
              </div>
            </button>
          ))}
          {communities.filter(community => 
            community.name.toLowerCase().includes(searchCommunity.toLowerCase())
          ).length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">No communities found</p>
          )}
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={() => setShowAddEventModal(false)}>
          <div className="glass-effect rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold gradient-text">
                {editingEventIndex !== null ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input
                    type="text"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="10"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                  <input
                    type="text"
                    value={eventForm.day}
                    onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
                    placeholder="Tue"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Google job interview"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time *</label>
                <input
                  type="text"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  placeholder="09:00 - 10:00"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Zoom Meeting"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEventForm({ ...eventForm, color: 'blue' })}
                    className={`w-10 h-10 rounded-xl bg-blue-500 hover:scale-110 transition-all ${
                      eventForm.color === 'blue' ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setEventForm({ ...eventForm, color: 'green' })}
                    className={`w-10 h-10 rounded-xl bg-green-500 hover:scale-110 transition-all ${
                      eventForm.color === 'green' ? 'ring-4 ring-offset-2 ring-green-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setEventForm({ ...eventForm, color: 'yellow' })}
                    className={`w-10 h-10 rounded-xl bg-yellow-500 hover:scale-110 transition-all ${
                      eventForm.color === 'yellow' ? 'ring-4 ring-offset-2 ring-yellow-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setEventForm({ ...eventForm, color: 'red' })}
                    className={`w-10 h-10 rounded-xl bg-red-500 hover:scale-110 transition-all ${
                      eventForm.color === 'red' ? 'ring-4 ring-offset-2 ring-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setEventForm({ ...eventForm, color: 'purple' })}
                    className={`w-10 h-10 rounded-xl bg-purple-500 hover:scale-110 transition-all ${
                      eventForm.color === 'purple' ? 'ring-4 ring-offset-2 ring-purple-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setEventForm({ ...eventForm, color: 'pink' })}
                    className={`w-10 h-10 rounded-xl bg-pink-500 hover:scale-110 transition-all ${
                      eventForm.color === 'pink' ? 'ring-4 ring-offset-2 ring-pink-500' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <input
                  type="checkbox"
                  id="notify-checkbox"
                  checked={eventForm.notify}
                  onChange={(e) => setEventForm({ ...eventForm, notify: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="notify-checkbox" className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                  <BellIcon className="w-5 h-5 text-blue-600" />
                  <span>Enable notifications for this event</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg transition-all transform hover:scale-105"
              >
                {editingEventIndex !== null ? 'Update' : 'Add'} Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
