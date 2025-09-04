import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaEdit, FaEllipsisH, FaPaperPlane, FaCircle } from 'react-icons/fa';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    // Mock conversations
    setConversations([
      {
        id: 1,
        user: {
          name: 'Sarah Coder',
          username: 'coder123',
          profilePic: 'https://via.placeholder.com/40x40/17A2B8/FFFFFF?text=S',
          online: true
        },
        lastMessage: 'Thanks for the help with React!',
        time: '2m ago',
        unread: 2
      },
      {
        id: 2,
        user: {
          name: 'Tech Developer',
          username: 'techdev',
          profilePic: 'https://via.placeholder.com/40x40/1DA1F2/FFFFFF?text=T',
          online: false
        },
        lastMessage: 'The new features look great!',
        time: '1h ago',
        unread: 0
      },
      {
        id: 3,
        user: {
          name: 'John Learner',
          username: 'learner',
          profilePic: 'https://via.placeholder.com/40x40/28A745/FFFFFF?text=J',
          online: true
        },
        lastMessage: 'Can you help me with Node.js?',
        time: '3h ago',
        unread: 1
      }
    ]);
  }, []);

  // Filter conversations by search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c =>
      c.user.name.toLowerCase().includes(q) ||
      c.user.username.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, query]);

  // Simulate typing indicator for the open conversation
  useEffect(() => {
    if (!selectedConversation) return;
    const id = setInterval(() => {
      // randomly toggle typing
      setTyping(Math.random() > 0.7);
    }, 2000);
    return () => clearInterval(id);
  }, [selectedConversation]);

  const openConversation = (c) => {
    setSelectedConversation({
      ...c,
      messages: c.messages || [
        { id: 'm1', fromMe: false, text: c.lastMessage },
      ]
    });
    setDraft('');
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !selectedConversation) return;
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...(prev.messages || []), { id: String(Date.now()), fromMe: true, text }]
    }));
    setDraft('');
    // reflect in list preview
    setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, lastMessage: text, time: 'now', unread: 0 } : c));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Messages</h1>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <FaEdit className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for people and groups"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Conversations + Chat Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800 min-h-[70vh] bg-black">
        {/* Left: conversations list */}
        <div className="divide-y divide-gray-800">
        {filtered.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => openConversation(conversation)}
            className="p-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={conversation.user.profilePic}
                  alt={conversation.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-black rounded-full" title="Online"></div>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white truncate">
                    {conversation.user.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">{conversation.time}</span>
                    <button className="p-1 rounded-full hover:bg-gray-800 transition-colors">
                      <FaEllipsisH className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 truncate flex-1">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
          <p className="text-gray-400">When you start conversations, they'll show up here.</p>
        </div>
        )}
        </div>

        {/* Right: active chat */}
        <div className="hidden md:flex flex-col min-h-[70vh] bg-black">
          {!selectedConversation ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <img src={selectedConversation.user.profilePic} alt={selectedConversation.user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-white font-semibold">{selectedConversation.user.name}</div>
                    <div className="text-xs text-gray-400 flex items-center space-x-1">
                      {selectedConversation.user.online ? (
                        <><FaCircle className="text-green-400 w-2 h-2" /><span>Online</span></>
                      ) : (
                        <span>Last seen {selectedConversation.time}</span>
                      )}
                      {typing && <span className="ml-2 italic text-blue-400">typing…</span>}
                    </div>
                  </div>
                </div>
                <button className="p-1 rounded-full hover:bg-gray-800 transition-colors"><FaEllipsisH className="w-4 h-4 text-gray-400"/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(selectedConversation.messages || []).map(m => (
                  <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-2xl ${m.fromMe ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-800 text-gray-100'}`}>
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-gray-800 flex items-center space-x-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Write a message"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 disabled:opacity-50" disabled={!draft.trim()}>
                  <FaPaperPlane className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;















