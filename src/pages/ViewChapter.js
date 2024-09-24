import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backgroundImage from '../assets/ChapterCreatorBackground.png';
import { useUser } from '../hooks/useUser.js';
import { endpoints } from '../config.js';
import axiosInstance from '../api/axiosInstance.js';

export const ViewChapter = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [bookCreated, setBookCreated] = useState({});
  const { id } = useParams();
  const { userId } = useUser();
  const [authorGroups, setAuthorGroups] = useState([]);
  const [chapterName, setChapterName] = useState("");

  const handleChapterNameChange = (e) => {
    setChapterName(e.target.value);
  };

  useEffect(() => {
    const fetchAuthorGroup = async () => {
      if (userId) {
        try {
          const response = await axiosInstance.get(`${endpoints.authorGroup}/account/${userId}`);
          setAuthorGroups(response.data.data.authorGroups);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchAuthorGroup();
  }, [userId]);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axiosInstance.get(`${endpoints.getBooks}/${id}/chapters`);
        setChapters(response.data.data.chapter);
      } catch (err) {
        console.log(err);
      }
    };

    fetchChapter();
  }, [id]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axiosInstance.get(`${endpoints.getBooks}/${id}`);
        setBookCreated(response.data.data.book);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookDetails();
  }, [id]);

  const canStartWriting = authorGroups.some(group => group.author_group_id === bookCreated.author_group_id);
  const authorGroup = authorGroups.find(group => group.author_group_id === bookCreated.author_group_id);
  const authorGroupName = authorGroup ? authorGroup.author_group_name : "";

  const startWriting = (chapter, index) => {
    navigate('/bookeditor', { state: { bookCreated, chapter, index, authorGroupName } });
  };

  const startViewing = (chapter, index) => {
    navigate(`/chapters/${chapter.chapter_id}`, { state: { bookCreated, chapter } });
  };

  const addNewChapter = () => {
    if (chapterName && chapterName.trim()) {
      const newChapter = {
        chapter_name: chapterName,
        chapter_sequence: chapters.length + 1,
        chapter_content: "",
        book_id: bookCreated.book_id
      };

      setChapters([...chapters, newChapter]);
    } else {
      alert("Chapter name cannot be empty.");
    }
  };

  const viewAllBooks = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div
      className="chaptercreator p-8 min-h-screen flex flex-col items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-4xl font-bold mb-4 mt-14 text-white animate-fadeIn">View chapter list of {bookCreated.book_name}</h1>
      <div className="w-full max-w-2xl bg-white/[.75] p-6 rounded-lg shadow-md animate-slideIn">
        <ul className="list-decimal list-inside">
          {chapters.map((chapter, index) => (
            <li key={index} className="flex justify-between items-center mb-2 animate-fadeIn">
              <span>{index + 1}. {chapter.chapter_name}</span>
              <div className="flex space-x-2">
                {canStartWriting && (
                  <button
                    type="button"
                    className="py-2 px-4 text-md font-medium text-white bg-green-600 hover:bg-green-800 rounded-md focus:outline-none focus:ring-4 focus:ring-green-300"
                    onClick={() => startWriting(chapter, index)}
                  >
                    ✍️ Start Writing
                  </button>
                )}
                <button
                  type="button"
                  className="py-1 px-3 text-md font-medium text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-md focus:outline-none focus:ring-4 focus:ring-blue-300"
                  onClick={() => startViewing(chapter, index)}
                >
                  📖 View Chapter
                </button>
              </div>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={chapterName}
          onChange={handleChapterNameChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="New chapter name"
        />
        {canStartWriting && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={addNewChapter}
              className="py-2 px-5 text-md font-medium text-white bg-purple-600 hover:bg-purple-800 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              ➕ Add New Chapter
            </button>
          </div>
        )}
        {/* New Button for Viewing All Books */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={viewAllBooks}
            className="py-2 px-5 text-md font-medium text-white bg-indigo-600 hover:bg-indigo-800 rounded-md focus:outline-none focus:ring-4 focus:ring-indigo-300 flex items-center"
          >
            📚 Explore My Library
          </button>
        </div>
      </div>
    </div>
  );
};
