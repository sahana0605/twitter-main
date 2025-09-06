import React, { useState, useEffect } from 'react';
import { FaList, FaPlus, FaUsers, FaLock } from 'react-icons/fa';

const Lists = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    // Mock lists
    setLists([
      {
        id: 1,
        name: 'Tech Influencers',
        description: 'People who share amazing tech content',
        memberCount: 156,
        isPrivate: false,
        createdBy: 'Demo User',
        coverImage: 'https://via.placeholder.com/400x200/1DA1F2/FFFFFF?text=Tech+Influencers'
      },
      {
        id: 2,
        name: 'React Developers',
        description: 'React community and developers',
        memberCount: 89,
        isPrivate: false,
        createdBy: 'Demo User',
        coverImage: 'https://via.placeholder.com/400x200/17A2B8/FFFFFF?text=React+Developers'
      },
      {
        id: 3,
        name: 'Personal Friends',
        description: 'Close friends and family',
        memberCount: 23,
        isPrivate: true,
        createdBy: 'Demo User',
        coverImage: 'https://via.placeholder.com/400x200/28A745/FFFFFF?text=Personal+Friends'
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Lists</h1>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <FaPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lists Grid */}
      <div className="p-4">
        {lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => (
              <div
                key={list.id}
                className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {/* Cover Image */}
                <div className="h-32 bg-gray-700 relative">
                  <img
                    src={list.coverImage}
                    alt={list.name}
                    className="w-full h-full object-cover"
                  />
                  {list.isPrivate && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white p-1 rounded-full">
                      <FaLock className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* List Info */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg mb-1">{list.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{list.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <FaUsers className="w-4 h-4" />
                      <span>{list.memberCount} members</span>
                    </div>
                    <span className="text-gray-400">by {list.createdBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FaList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No lists yet</h3>
            <p className="text-gray-400">When you create lists, they'll show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lists;




















