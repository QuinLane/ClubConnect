// import { useState } from 'react';
// import { Search, Filter, ChevronLeft, ChevronRight, Calendar, Users, Tag, MapPin } from 'lucide-react';

// export default function ExplorePage() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentFilter, setCurrentFilter] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);

//   // Mock data for listings
//   const listings = [
//     { id: 1, name: 'Photography Club', description: 'Weekly meetups to practice photography skills', categories: ['Arts', 'Media'], mutualConnections: 4, joined: false },
//     { id: 2, name: 'Coding Bootcamp', description: 'Intensive weekend coding sessions for all levels', categories: ['Technology', 'Education'], mutualConnections: 2, joined: true },
//     { id: 3, name: 'Chess Tournament', description: 'Monthly campus chess competition', categories: ['Games', 'Competition'], mutualConnections: 0, joined: false },
//     { id: 4, name: 'Debate Society', description: 'Practice public speaking and argumentation', categories: ['Communication', 'Leadership'], mutualConnections: 7, joined: false },
//     { id: 5, name: 'Environmental Club', description: 'Working together for campus sustainability', categories: ['Environment', 'Activism'], mutualConnections: 3, joined: false },
//     { id: 6, name: 'Basketball Practice', description: 'Open court practice sessions twice a week', categories: ['Sports', 'Fitness'], mutualConnections: 5, joined: false },
//     { id: 7, name: 'Creative Writing', description: 'Express yourself through poetry and prose', categories: ['Arts', 'Education'], mutualConnections: 1, joined: true },
//     { id: 8, name: 'Robotics Team', description: 'Building robots for upcoming competitions', categories: ['Technology', 'Engineering'], mutualConnections: 0, joined: false },
//     { id: 9, name: 'Yoga Class', description: 'Beginner friendly yoga sessions every morning', categories: ['Fitness', 'Wellness'], mutualConnections: 2, joined: false },
//     { id: 10, name: 'Film Club', description: 'Watch and discuss classic and contemporary cinema', categories: ['Arts', 'Media'], mutualConnections: 6, joined: false }
//   ];

//   // Mock data for events
//   const events = [
//     { id: 101, name: 'Campus Hackathon', description: '24-hour coding challenge with amazing prizes', date: 'May 2, 2025', location: 'Tech Building', attendees: 45 },
//     { id: 102, name: 'Spring Concert', description: 'Annual music festival featuring student bands', date: 'May 15, 2025', location: 'Main Quad', attendees: 230 },
//     { id: 103, name: 'Career Fair', description: 'Connect with potential employers from various industries', date: 'May 20, 2025', location: 'Student Center', attendees: 120 }
//   ];

//   const filterOptions = ['All', 'Clubs', 'Events', 'Study Groups', 'Sports'];

//   const handleJoinToggle = (id) => {
//     // In a real application, this would connect to your backend
//     console.log(`Toggle join status for item ${id}`);
//   };

//   const handleJoinEvent = (id) => {
//     // In a real application, this would register for the event
//     console.log(`Joining event ${id}`);
//   };

//   const handlePrevPage = () => {
//     setCurrentPage(prev => Math.max(prev - 1, 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage(prev => prev + 1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-12">
//       {/* Header Section */}
//       <div className="bg-white shadow-sm">
//         <div className="container mx-auto px-4 py-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Explore</h1>
//         </div>
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="container mx-auto px-4 py-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-grow relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search size={18} className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Search clubs, events, and more..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="w-full md:w-48">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Filter size={18} className="text-gray-400" />
//               </div>
//               <select
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-indigo-500 focus:border-indigo-500"
//                 value={currentFilter}
//                 onChange={(e) => setCurrentFilter(e.target.value)}
//               >
//                 {filterOptions.map(option => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                 <ChevronLeft size={18} className="text-gray-400" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Results Section */}
//       <div className="container mx-auto px-4 pb-8">
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           {/* Table Headers - Hidden on Mobile */}
//           <div className="hidden md:grid md:grid-cols-12 bg-gray-50 py-3 px-4 border-b border-gray-200">
//             <div className="md:col-span-3 font-medium text-gray-500 text-sm">Name</div>
//             <div className="md:col-span-4 font-medium text-gray-500 text-sm">Description</div>
//             <div className="md:col-span-2 font-medium text-gray-500 text-sm">Categories</div>
//             <div className="md:col-span-2 font-medium text-gray-500 text-sm text-center">Mutual Connections</div>
//             <div className="md:col-span-1 font-medium text-gray-500 text-sm"></div>
//           </div>

//           {/* Results List */}
//           {listings.map(item => (
//             <div key={item.id} className="border-b border-gray-200 last:border-0">
//               <div className="md:grid md:grid-cols-12 p-4 hover:bg-gray-50">
//                 {/* Mobile View */}
//                 <div className="md:hidden mb-3">
//                   <div className="font-medium text-indigo-600">{item.name}</div>
//                   <div className="text-sm text-gray-500 mt-1">{item.description}</div>
//                   <div className="flex flex-wrap gap-1 mt-2">
//                     {item.categories.map(cat => (
//                       <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                         {cat}
//                       </span>
//                     ))}
//                   </div>
//                   <div className="flex justify-between items-center mt-3">
//                     <div className="text-sm text-gray-500">
//                       <Users size={14} className="inline mr-1" />
//                       {item.mutualConnections} mutual
//                     </div>
//                     <button
//                       className={`px-3 py-1 rounded-md text-sm font-medium ${
//                         item.joined ? 'bg-gray-100 text-gray-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                       }`}
//                       onClick={() => handleJoinToggle(item.id)}
//                     >
//                       {item.joined ? 'Joined' : 'Join'}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Desktop View */}
//                 <div className="hidden md:block md:col-span-3 my-auto font-medium text-indigo-600">
//                   {item.name}
//                 </div>
//                 <div className="hidden md:block md:col-span-4 my-auto text-sm text-gray-500">
//                   {item.description}
//                 </div>
//                 <div className="hidden md:block md:col-span-2 my-auto">
//                   <div className="flex flex-wrap gap-1">
//                     {item.categories.map(cat => (
//                       <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                         {cat}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="hidden md:flex md:col-span-2 my-auto justify-center">
//                   <span className="text-sm text-gray-500 flex items-center">
//                     <Users size={14} className="mr-1" />
//                     {item.mutualConnections}
//                   </span>
//                 </div>
//                 <div className="hidden md:flex md:col-span-1 my-auto justify-end">
//                   <button
//                     className={`px-3 py-1 rounded-md text-sm font-medium ${
//                       item.joined ? 'bg-gray-100 text-gray-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                     }`}
//                     onClick={() => handleJoinToggle(item.id)}
//                   >
//                     {item.joined ? 'Joined' : 'Join'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-6">
//           <div className="text-sm text-gray-500">
//             Showing <span className="font-medium">10</span> of <span className="font-medium">42</span> results
//           </div>
//           <div className="flex space-x-2">
//             <button
//               className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
//               onClick={handlePrevPage}
//               disabled={currentPage === 1}
//             >
//               <ChevronLeft size={16} className={currentPage === 1 ? "text-gray-300" : "text-gray-600"} />
//             </button>
//             <div className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-white">
//               {currentPage}
//             </div>
//             <button
//               className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
//               onClick={handleNextPage}
//             >
//               <ChevronRight size={16} className="text-gray-600" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Suggested Events Section */}
//       <div className="container mx-auto px-4 py-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Suggested Events</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {events.map(event => (
//             <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
//               <div className="p-5">
//                 <h3 className="font-bold text-lg text-gray-800">{event.name}</h3>
//                 <p className="text-gray-600 mt-1 text-sm">{event.description}</p>

//                 <div className="mt-4 space-y-2">
//                   <div className="flex items-center text-sm text-gray-500">
//                     <Calendar size={16} className="mr-2" />
//                     {event.date}
//                   </div>
//                   <div className="flex items-center text-sm text-gray-500">
//                     <MapPin size={16} className="mr-2" />
//                     {event.location}
//                   </div>
//                   <div className="flex items-center text-sm text-gray-500">
//                     <Users size={16} className="mr-2" />
//                     {event.attendees} attending
//                   </div>
//                 </div>

//                 <button
//                   className="mt-5 w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
//                   onClick={() => handleJoinEvent(event.id)}
//                 >
//                   Register
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



//2nd Portal

//

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Tag,
  MapPin,
  AlertCircle,
  Loader,
} from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);
  const [events, setEvents] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage] = useState(6);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const filterOptions = ['All', 'Clubs', 'Events', 'Study Groups', 'Sports'];

  // const mockListings = [/* same as yours */];
  // const mockEvents = [/* same as yours */];
  //   // Mock data for listings
  const mockListings = [
    { id: 1, name: 'Photography Club', description: 'Weekly meetups to practice photography skills', categories: ['Arts', 'Media'], mutualConnections: 4, joined: false },
    { id: 2, name: 'Coding Bootcamp', description: 'Intensive weekend coding sessions for all levels', categories: ['Technology', 'Education'], mutualConnections: 2, joined: true },
    { id: 3, name: 'Chess Tournament', description: 'Monthly campus chess competition', categories: ['Games', 'Competition'], mutualConnections: 0, joined: false },
    { id: 4, name: 'Debate Society', description: 'Practice public speaking and argumentation', categories: ['Communication', 'Leadership'], mutualConnections: 7, joined: false },
    { id: 5, name: 'Environmental Club', description: 'Working together for campus sustainability', categories: ['Environment', 'Activism'], mutualConnections: 3, joined: false },
    { id: 6, name: 'Basketball Practice', description: 'Open court practice sessions twice a week', categories: ['Sports', 'Fitness'], mutualConnections: 5, joined: false },
    { id: 7, name: 'Creative Writing', description: 'Express yourself through poetry and prose', categories: ['Arts', 'Education'], mutualConnections: 1, joined: true },
    { id: 8, name: 'Robotics Team', description: 'Building robots for upcoming competitions', categories: ['Technology', 'Engineering'], mutualConnections: 0, joined: false },
    { id: 9, name: 'Yoga Class', description: 'Beginner friendly yoga sessions every morning', categories: ['Fitness', 'Wellness'], mutualConnections: 2, joined: false },
    { id: 10, name: 'Film Club', description: 'Watch and discuss classic and contemporary cinema', categories: ['Arts', 'Media'], mutualConnections: 6, joined: false }
  ];

  // Mock data for events
  const mockEvents = [
    { id: 101, name: 'Campus Hackathon', description: '24-hour coding challenge with amazing prizes', date: 'May 2, 2025', location: 'Tech Building', attendees: 45 },
    { id: 102, name: 'Spring Concert', description: 'Annual music festival featuring student bands', date: 'May 15, 2025', location: 'Main Quad', attendees: 230 },
    { id: 103, name: 'Career Fair', description: 'Connect with potential employers from various industries', date: 'May 20, 2025', location: 'Student Center', attendees: 120 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((r) => setTimeout(r, 500));

        const filtered = mockListings.filter((item) => {
          const matchesSearch =
            debouncedSearchQuery === '' ||
            item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            item.categories.some((cat) => cat.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

          const matchesFilter =
            currentFilter === 'All' ||
            (currentFilter === 'Clubs' && ['Arts', 'Technology', 'Environment'].some((cat) => item.categories.includes(cat))) ||
            (currentFilter === 'Sports' && ['Sports', 'Fitness'].some((cat) => item.categories.includes(cat))) ||
            (currentFilter === 'Study Groups' && ['Education', 'Technology'].some((cat) => item.categories.includes(cat)));

          return matchesSearch && matchesFilter;
        });

        const start = (currentPage - 1) * resultsPerPage;
        const end = start + resultsPerPage;

        setTotalResults(filtered.length);
        setListings(filtered.slice(start, end));
        setEvents(mockEvents);
      } catch (err) {
        setError('Something went wrong.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchQuery, currentPage, currentFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleJoinToggle = (id) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, joined: !item.joined } : item
      )
    );
  };

  const handleJoinEvent = (id) => {
    alert(`You've registered for event #${id}`);
  };

  const renderListings = () => {
    if (isLoading)
      return (
        <div className="flex justify-center py-16">
          <Loader className="animate-spin text-indigo-600" />
        </div>
      );

    if (error)
      return (
        <div className="flex justify-center py-16 text-red-500">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      );

    if (listings.length === 0)
      return (
        <div className="text-center py-16 text-gray-500">
          <AlertCircle className="mx-auto mb-2" size={28} />
          <p className="font-semibold">No results found.</p>
        </div>
      );

    return listings.map((item) => (
      <div
        key={item.id}
        className="bg-white border rounded-lg shadow-sm p-5 mb-4 transition hover:shadow-md"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-indigo-700">{item.name}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <div className="flex flex-wrap mt-2 gap-1">
              {item.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <p className="text-sm text-gray-500 flex items-center">
              <Users size={14} className="mr-1" />
              {item.mutualConnections} mutual
            </p>
            <button
              onClick={() => handleJoinToggle(item.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                item.joined
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {item.joined ? 'Joined' : 'Join'}
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const maxPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700">Explore</h1>
          <p className="text-sm text-gray-600">Clubs • Events • Groups</p>
        </header>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search by name, tag, or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/3 relative">
            <select
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              value={currentFilter}
              onChange={(e) => {
                setCurrentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {filterOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* Results */}
        <section>{renderListings()}</section>

        {/* Pagination */}
        {totalResults > resultsPerPage && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <span className="text-sm font-medium text-gray-600">
              Page {currentPage} of {maxPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, maxPages))}
              disabled={currentPage === maxPages}
              className="flex items-center px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Suggested Events */}
        <div>
          <h2 className="text-xl font-bold text-indigo-800 mb-4">Suggested Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border rounded-lg shadow-sm p-5 hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg text-gray-800">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <p className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {event.date}
                  </p>
                  <p className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {event.location}
                  </p>
                  <p className="flex items-center">
                    <Users size={16} className="mr-2" />
                    {event.attendees} attending
                  </p>
                </div>

                <button
                  onClick={() => handleJoinEvent(event.id)}
                  className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
